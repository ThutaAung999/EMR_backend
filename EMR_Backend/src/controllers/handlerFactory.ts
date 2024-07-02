import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import catchAsync from '../utils/catch-async';
import AppError from '../utils/appError';
import APIFeatures from '../utils/';

export const deleteOne = (Model: Model<Document>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("error in deleteOne");
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      console.log("error in deleteOne 1");
      return next(new AppError('No document found with that ID', 404));
    }

    await doc.deleteOne();
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

export const updateOne = (Model: Model<Document>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

export const createOne = (Model: Model<Document>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

export const getOne = (Model: Model<Document>, popOptions?: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log('inside getOne');
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

export const getAll = (Model: Model<Document>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // To allow for nested GET reviews on tour (hack)
    let filter: any = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
