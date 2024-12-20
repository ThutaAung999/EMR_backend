import express from 'express';
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEMR_Image extends Document {
  _id: mongoose.Types.ObjectId;
  image: string;
  tags: mongoose.Types.ObjectId[];
}

const EMRImageSchema: Schema = new Schema({
  image: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tags' }],
});

const EMRImage: Model<IEMR_Image> = mongoose.model<IEMR_Image>(
  'EMRImages',
  EMRImageSchema,
);

export default EMRImage;
