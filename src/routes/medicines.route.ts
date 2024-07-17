import express, {Router} from 'express';

import { getAllMedicines, newMedicine, getMedicineById, updateMedicine, deleteMedicine, getAllMedicinesWithPagination } from '../controllers/medicine.controller';


const router: Router = express.Router();

//router.get("/", getAllMedicines);

router.get("/", getAllMedicinesWithPagination);
router.get("/:medicineId",getMedicineById)
router.post("/",newMedicine);
router.patch("/:medicineId",updateMedicine)
router.delete('/:medicineId',deleteMedicine);

export default router;