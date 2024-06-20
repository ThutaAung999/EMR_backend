import express, {Router} from 'express';

import {getAllMedicines,newMedicine,getMedicineById,updateMedicine,deleteMedicine} from '../controllers/MedicineController'


const router: Router = express.Router();

router.get("/", getAllMedicines);
router.get("/:medicineId",getMedicineById)
router.post("/",newMedicine);
router.patch("/:medicineId",updateMedicine)
router.delete('/:medicineId',deleteMedicine);

export default router;