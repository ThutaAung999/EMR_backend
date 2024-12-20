import { IRequest, IResponse } from '../types/types';
import * as patientService from '../services/patient.service';
import { IPatient } from '../model/patient.model';
import {
  zodPatientSchema,
  zodPatientUpdateSchema,
} from '../schema/patient.schema';
/*import { validatePatient } from './validators'; */
import { NextFunction } from 'express';
import { Request, Response } from 'express';

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
export const getAllPatientHandler = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  try {
    const patients = await patientService.getAllPatient();
    if (!patients) {
      throw new Error('No patients');
    }
    res.status(200).json(patients);
  } catch (err) {
    next(err);
  }
};

export const getAllPatients = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  await handle(getAllPatientHandler, 400)(req, res, next);
};

//------------------------------------------------------------------------------------------------
//after updating

/* export const getAllPatientHandlerWithPagination = async (req: IRequest, res: IResponse, next: NextFunction) => {
    console.log('backend  :  req.query',req.query)
    try {
        const { page = 1, limit = 5, search = "", sortBy,sortOrder } = req.query;

        const query = {
            page: Number(page),
            limit: Number(limit),
            search: search as string,
            sortBy: sortBy as string,
            sortOrder: sortOrder as 'asc' | 'desc',
          };

        const { data, total } = await patientService.getAllPatientsWithPagination(query);


        res.status(200).json({ data, total, page: query.page, totalPages: Math.ceil(total / query.limit) });
  } catch (err) {
    next(err);
  }
};


export const getAllPatientsWithPagination =
    async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getAllPatientHandlerWithPagination, 500)(req, res, next);
  };

 */

export const getAllPatientHandlerWithPagination = async (
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

    const { data, total } =
      await patientService.getAllPatientsWithPagination(query);

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

export const getAllPatientsWithPaginationHandler = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  await handle(getAllPatientHandlerWithPagination, 500)(req, res, next);
};

//------------------------------------------------------------------------------------------------

export const getPatientByIdHandler = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let patientId = req.params['patientId'];
  console.log('Req patient Id ', patientId);

  const patient = await patientService.getPatientById(patientId);
  if (!patient) throw Error('No patient found');
  await res.status(200).json(patient);
};

export const getPatientById = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  await handle(getPatientByIdHandler, 404)(req, res, next);
};

/*******/
export const findPatientByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const name = req.params['name'];
  console.log('Patient Name:', name);

  try {
    const patients = await patientService.searchPatientByName(name);
    console.log('Found patients:', patients);
    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }
    res.status(200).json(patients);
  } catch (err) {
    console.error('Error finding patients:', err);
    res.status(500).json({ message: 'Failed to search for patients' });
  }
};
/*******/

export const newPatient = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  console.log('new patient in PatientController ', req.body);
  try {
    // Validation
    //const { error, data } = validatePatient(req.body);
    const { error, data } = zodPatientSchema.safeParse(req.body);
    //const {error, data} = req.body;
    if (error) {
      console.log('new patient validation fail');
      console.log(error);
      return res.status(400).json({ message: error.errors[0].message });
      //return res.status(400).json(error);
    }

    //const patient = await patientService.newPatient(req.body);
    const patient = await patientService.newPatient(data as any);
    console.log('Patient :', patient);

    if (!patient) {
      throw new Error('Cannot save patient');
    }

    res.status(201).json(patient);
  } catch (err) {
    console.log('ERROR :', err);
    res.status(400).json({ err });
  }
};

export const updatePatient = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let patientId = req.params['patientId'];
  let patient = req.body;
  console.log(`new patient ${patientId} `, req.body);
  try {
    const updatePatient = await patientService.updatePatient(
      patientId,
      patient,
    );

    if (!updatePatient) throw Error('Cannot update patient');
    await res.status(200).json(updatePatient);
  } catch (err) {
    await res.status(400).json({ message: err });
  }
};

export const deletePatient = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction,
) => {
  let patientId = req.params['patientId'];
  try {
    const deletedPatient = await patientService.deletePatient(patientId);

    if (!deletedPatient) throw Error('Cannot delete patient');
    await res.status(200).json(deletedPatient);
  } catch (err) {
    await res.status(400).json({ message: err });
  }
};

export default {
  getAllPatients,
  newPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
