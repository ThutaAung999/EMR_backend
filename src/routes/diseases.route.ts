import express, {Router} from 'express';

import {getAllDiseasesWithPagination, getDiseaseById, 
    newDisease,updateDisease,deleteDisease} from "../controllers/disease.controller";

const router: Router = express.Router()

//router.get("/", getAllDiseases);
router.get("/", getAllDiseasesWithPagination);
router.get("/:diseaseId", getDiseaseById);
router.post("/", newDisease);
router.patch("/:diseaseId",updateDisease)
router.delete("/:diseaseId",deleteDisease)

export default router;