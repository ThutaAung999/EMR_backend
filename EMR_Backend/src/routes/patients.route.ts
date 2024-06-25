
import express, { Router } from 'express';
import {
    deletePatient,
    findPatientByName,
    getAllPatients,
    getPatientById,
    newPatient,
    updatePatient
} from '../controllers/patient.controller';

import { validateZodSchema} from '../middleware/validator.middleware'

import { zodPatientSchema, zodPatientUpdateSchema } from '../schema/patient.schema'

const router: Router = express.Router();

router.get('/', getAllPatients);
router.get('/:patientId', getPatientById);
router.get('/name/:name',findPatientByName);//return empty array  ( [] ) ,  why?
router.post('/',validateZodSchema(zodPatientSchema),newPatient);
router.patch('/:patientId',validateZodSchema(zodPatientUpdateSchema),updatePatient);
router.delete('/:patientId',deletePatient);


export default router;
