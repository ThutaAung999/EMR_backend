import express from 'express';
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITag extends Document {
  name: string;
}

const TagSchema: Schema = new Schema({
  name: { type: String, required: true },
});

const TagService: Model<ITag> = mongoose.model<ITag>('Tags', TagSchema);

export default TagService;
