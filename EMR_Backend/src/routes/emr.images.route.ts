import express, {Router} from 'express';
import {
    deleteEmrImage,
    getAllEmrImages,
    getemrImageById,
    newEmrImage,
    updateEmrImage
} from '../controllers/emr_Image.ontroller'


const router: Router = express.Router()

router.get("/", getAllEmrImages);
router.get("/:emrImageId", getemrImageById);
router.post("/", newEmrImage);
router.patch("/:emrImageId", updateEmrImage)
router.delete("/:emrImageId", deleteEmrImage)

export default router;