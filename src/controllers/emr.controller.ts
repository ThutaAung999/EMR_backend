import { IRequest, IResponse } from '../types/types';
import { NextFunction } from 'express';

import * as emrService from '../services/emr.service';

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

//before updating
export const getAllEMRHandler = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  try {
    const emrs = await emrService.getAllEMR();

    if (!emrs) {
      throw new Error('No emrs');
    }
    res.status(200).json(emrs);
  } catch (err) {
    next(err);
  }
};

export const getAllEMRs = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  await handle(getAllEMRHandler, 400)(req, res, next);
};

//==============
//After updating

export const getAllEmrHandlerWithPagination = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  console.log('backend  :  req.query', req.query);
  try {
    const { page = 1, limit = 5, search = '', sortBy, sortOrder } = req.query;

    const query = {
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const { data, total } = await emrService.getAllEmrsWithPagination(query);

    res.status(200).json({
      data,
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getAllEmrWithPagination = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  await handle(getAllEmrHandlerWithPagination, 400)(req, res, next);
};

//===============

export const getEMRByIdHandler = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let emrId = req.params['emrId'];

  const emr = await emrService.getEMRById(emrId);

  if (!emr) throw Error('No emr found you search by id :' + emr);
  await res.status(200).json(emr);
};

export const getEMRById = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  await handle(getEMRByIdHandler, 404)(req, res, next);
};

export const newEMR = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  console.log('new EmrModel in EMRController ', req.body);
  try {
    // Validation
    //const { error, data } = validateEMR(req.body);
    const { error, data } = req.body;
    if (error) {
      console.log('new EmrModel validation fail');
      return res.status(400).json(error);
    }

    const emr = await emrService.newEMR(req.body);

    if (!emr) {
      throw new Error('Cannot save emr');
    }

    res.status(201).json(emr);
  } catch (err) {
    console.log(err);
    res.status(400).json();
  }
};

export const updateEMR = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let emrId = req.params['emrId'];

  // Validation
  //const { error, data } = validateEMR(req.body);

  let emr = req.body;
  console.log(`new emr : ${emrId} `, req.body);
  try {
    const updateEMR = await emrService.updateEMR(emrId, emr);

    if (!updateEMR) throw Error('Cannot update EmrModel');
    await res.status(200).json(updateEMR);
  } catch (err) {
    await res.status(400).json({ message: err });
  }
};

export const deleteEMR = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let emrId = req.params['emrId'];

  try {
    const deletedEMR = await emrService.deleteEMR(emrId);

    if (!deletedEMR) throw Error('Cannot delete EmrModel');
    await res.status(200).json(deletedEMR);
  } catch (err) {
    await res.status(400).json({ message: err });
  }
};
