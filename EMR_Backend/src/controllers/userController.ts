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
  user?: IUser;
}

const multerStorage: StorageEngine = multer.memoryStorage();

const multerFilter: FileFilterCallback = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req: MulterRequest, res: Response, next: NextFunction) => {
  if (!req.file || !req.user) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req: MulterRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    req.params.id = req.user.id;
  }
  next();
};

export const updateMe = catchAsync(async (req: MulterRequest, res: Response, next: NextFunction) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user!.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req: MulterRequest, res: Response, next: NextFunction) => {
  await User.findByIdAndUpdate(req.user!.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'Error',
    message: 'This resource is not yet defined',
  });
};

export const getUser = factory.getOne(User as Model<IUser>);
export const getAllUsers = factory.getAll(User as Model<IUser>);
export const updateUser = factory.updateOne(User as Model<IUser>);
export const deleteUser = factory.deleteOne(User as Model<IUser>);
