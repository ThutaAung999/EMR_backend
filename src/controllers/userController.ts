import multer, { StorageEngine, FileFilterCallback } from 'multer';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import User, { IUser } from './../model/user.model';
import catchAsync from '../utils/catch-async';
import AppError from '../utils/appError';
import * as factory from './handlerFactory';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user: IUser;
}

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Not an image! Please upload only images.',
        400,
      ) as unknown as null,
      false,
    );
  }
};

// Setup multer storage and upload middleware
const multerStorage: StorageEngine = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('userImage');
//export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqMulter = req as MulterRequest;
    if (!reqMulter.file || !reqMulter.user) return next();

    reqMulter.file.filename = `user-${reqMulter.user.id}-${Date.now()}.jpeg`;

    await sharp(reqMulter.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${reqMulter.file.filename}`);

    next();
  },
);

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  const reqMulter = req as MulterRequest;
  if (reqMulter.user) {
    req.params.id = reqMulter.user.id;
  }
  next();
};

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqMulter = req as MulterRequest;
    if (reqMulter.body.password || reqMulter.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400,
        ),
      );
    }

    const filteredBody = filterObj(reqMulter.body, 'name', 'email');
    if (reqMulter.file) filteredBody.photo = reqMulter.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
      reqMulter.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  },
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqMulter = req as MulterRequest;
    await User.findByIdAndUpdate(reqMulter.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);

//This is OK
export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'Error',
    message: 'This resource is not yet defined',
  });
};

export const getUser = factory.getOne(User as Model<IUser>);

//This is OK
export const getAllUsers = factory.getAll(User as Model<IUser>);

export const updateUser = factory.updateOne(User as Model<IUser>);
export const deleteUser = factory.deleteOne(User as Model<IUser>);
