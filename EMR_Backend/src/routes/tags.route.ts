import express, {Router} from 'express';
import {deleteTag, getAllTags, getTagById, newTag, updateTag} from "../controllers/TagController";


const router: Router = express.Router()

router.get("/", getAllTags);
router.get("/:tagId", getTagById);
router.post("/", newTag);
router.patch("/:tagId",updateTag)
router.delete("/:tagId",deleteTag)

export default router;