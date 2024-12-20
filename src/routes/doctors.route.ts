import express, { Router } from 'express';
import {
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  newDoctor,
  updateDoctor,
} from '../controllers/doctor.controller';

const router: Router = express.Router();

router.get('/', getAllDoctors);
router.get('/:doctorId', getDoctorById);
router.post('/', newDoctor);
router.patch('/:doctorId', updateDoctor);
router.delete('/:doctorId', deleteDoctor);

export default router;
