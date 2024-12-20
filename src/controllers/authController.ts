import crypto from 'crypto';
import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catch-async';
import User, { IUser } from '../model/user.model';
import AppError from '../utils/appError';
import { promisify } from 'util';
import Email from '../utils/email';
import util from 'util';

interface JwtPayload {
  id: string;
  iat?: number;
}

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response,
): void => {
  const token = signToken(user._id.toString());

  const cookieOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '0', 10) *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Request Body:', req.body); // Log the body

      // Validate the request body here if needed
      const userData = req.body;
      if (!userData || Object.keys(userData).length === 0) {
        return next(new AppError('Invalid request data', 400));
      }

      const newUser = await User.create(userData);
      console.log('New User:', newUser); // Log the new user

      if (!newUser) {
        return next(new AppError('User creation failed', 500));
      }

      // Uncomment and configure the following lines for sending welcome email
      // let host = req.get("host");
      // if (host === "127.0.0.1:9999") host = "localhost:9999";
      // const url = `${req.protocol}://${host}/me`;
      // await new Email(newUser, url).sendWelcome();
      // console.log('Welcome email sent');

      createSendToken(newUser, 201, res);
      console.log('Token created and sent'); // Log after creating and sending token
    } catch (error) {
      console.error('Error during signup:', error);
      next(error); // Pass the error to the global error handler
    }
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (
      !user ||
      !user.password ||
      !(await user.correctPassword(password, user.password))
    ) {
      return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
  },
);

export const logout = (req: Request, res: Response): void => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    console.log('req.headers.authorization :', req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      console.log('token :', token);
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError(
          'You are not logged in! Please log in to get access.',
          401,
        ),
      );
    }

    const decoded = await (
      promisify(jwt.verify) as unknown as (
        token: string,
        secretOrPublicKey: jwt.Secret,
      ) => Promise<JwtPayload>
    )(token, process.env.JWT_SECRET as string);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401,
        ),
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat!)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401,
        ),
      );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  },
);

//---------------------------

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      const promisify = util.promisify;
      const jwtVerify = promisify(jwt.verify) as (
        token: string,
        secretOrPublicKey: Secret,
      ) => Promise<jwt.JwtPayload>;

      const decoded = await jwtVerify(token, process.env.JWT_SECRET as Secret);

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat!)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user?.role!)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const resetURL = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/users/resetPassword/${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        resetToken,
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500,
        ),
      );
    }
  },
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  },
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.user?.id).select('+password');

    if (
      !user ||
      !(await user.correctPassword(req.body.passwordCurrent, user.password!))
    ) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user?.save();

    createSendToken(user, 200, res);
  },
);
