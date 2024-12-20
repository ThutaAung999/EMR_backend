// src/routes/emrImages.route.ts

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let date = new Date();
    let imageFileName = date.getTime() + '_' + file.originalname;
    cb(null, imageFileName);
  },
});

const upload = multer({ storage }).any();

const router = express.Router();

// POST route to handle file uploads
router.post('/uploads', upload, (req: Request, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ msg: 'No file selected!' });
  } else {
    const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
      image: `uploads/${file.filename}`,
    }));

    return res.status(200).json({
      msg: 'Files uploaded!',
      images: uploadedFiles,
    });
  }
});

export default router;
