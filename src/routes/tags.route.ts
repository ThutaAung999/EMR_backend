import express, { Router } from 'express';
import {
  deleteTag,
  getAllTagsWithPagination,
  getTagById,
  newTag,
  updateTag,
} from '../controllers/tag.controller';

const router: Router = express.Router();

//router.get("/", getAllTags);
router.get('/', getAllTagsWithPagination);
router.get('/:tagId', getTagById);
router.post('/', newTag);
router.patch('/:tagId', updateTag);
router.delete('/:tagId', deleteTag);

export default router;
