import express, { Router } from 'express';

//for protecting routes
import * as Auth from '../controllers/authController';

import {
  deletePatient,
  findPatientByName,
  //  getAllPatients,
  //getAllPatientsWithPagination,
  getAllPatientsWithPaginationHandler,
  getPatientById,
  newPatient,
  updatePatient,
} from '../controllers/patient.controller';

import { validateZodSchema } from '../middleware/validator.middleware';

import {
  zodPatientSchema,
  zodPatientUpdateSchema,
} from '../schema/patient.schema';

const router: Router = express.Router();

//router.get('/', getAllPatients);

//router.get('/',getAllPatientsWithPagination)
router.get('/', getAllPatientsWithPaginationHandler);
/* router.route("/").
    get(Auth.protect, getAllPatients);
 */

router.get('/:patientId', getPatientById);
router.get('/name/:name', findPatientByName); //return empty array  ( [] ) ,  why?
router.post('/', validateZodSchema(zodPatientSchema), newPatient);
router.patch(
  '/:patientId',
  validateZodSchema(zodPatientUpdateSchema),
  updatePatient,
);
router.delete('/:patientId', deletePatient);

export default router;
