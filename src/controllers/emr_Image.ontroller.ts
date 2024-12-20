import { IRequest, IResponse } from '../types/types';
import { NextFunction } from 'express';

import * as emrImageService from '../services/emr.Image.service';

const handle = (func: Function, httpErrorCode: number) => {
  return async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err) {
      console.log('Error is ', err);
      await res.status(httpErrorCode).json({ message: err });
    }
  };
};

export const getAllEmrImageHandler = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  try {
    const emrImages = await emrImageService.getAllEMRImage();

    if (!emrImages) {
      throw new Error('No EmrModel Image');
    }
    res.status(200).json(emrImages);
  } catch (err) {
    next(err);
  }
};

export const getAllEmrImages = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  await handle(getAllEmrImageHandler, 400)(req, res, next);
};

export const getemrImageByIdHandler = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let emrImageId = req.params['emrImageId'];

  const emrImage = await emrImageService.getEMRImageById(emrImageId);

  if (!emrImage) throw Error('No emrImage found you search by id :' + emrImage);
  await res.status(200).json(emrImage);
};

export const getemrImageById = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  await handle(getemrImageByIdHandler, 404)(req, res, next);
};

export const newEmrImage = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  console.log('new EmrModel Image in TagController ', req.body);
  try {
    // Validation
    //const { error, data } = validateEmrImage(req.body);
    const { error, data } = req.body;
    if (error) {
      console.log('new emrImage validation fail');
      return res.status(400).json(error);
    }

    const emrImage = await emrImageService.newEMRImage(req.body);

    if (!emrImage) {
      throw new Error('Cannot save emrImage');
    }

    res.status(201).json(emrImage);
  } catch (err) {
    console.log(err);
    res.status(400).json();
  }
};

export const updateEmrImage = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let emrImageId = req.params['emrImageId'];

  // Validation
  //const { error, data } = validateEmrImage(req.body);

  let emrImage = req.body;
  console.log(`new emr  Image : ${emrImageId} `, req.body);
  try {
    const updateEmrImage = await emrImageService.updateEMRImage(
      emrImageId,
      emrImage,
    );

    if (!updateEmrImage) throw Error('Cannot update EmrModel Image');
    await res.status(200).json(updateEmrImage);
  } catch (err) {
    await res.status(400).json({ message: err });
  }
};

export const deleteEmrImage = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let emrImageId = req.params['emrImageId'];

  try {
    const deletedEmrImage = await emrImageService.deleteEMRImage(emrImageId);

    if (!deletedEmrImage) throw Error('Cannot delete Emr Image');
    await res.status(200).json(deletedEmrImage);
  } catch (err) {
    await res.status(400).json({ message: err });
  }
};
