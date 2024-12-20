import express, { Router } from 'express';
import {
  deleteEMR,
  getAllEMRs,
  getAllEmrWithPagination,
  getEMRById,
  newEMR,
  updateEMR,
} from '../controllers/emr.controller';

const router: Router = express.Router();

//router.get("/", getAllEMRs);

router.get('/', getAllEmrWithPagination);

router.get('/:emrId', getEMRById);
router.post('/', newEMR);
router.patch('/:emrId', updateEMR);
router.delete('/:emrId', deleteEMR);

export default router;
