// medicine.model.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

// Define interfaces for typescript type checking
export interface IMedicine extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  manufacturer?: string;
  diseases: mongoose.Types.ObjectId[];
}

const medicineSchema: Schema<IMedicine> = new Schema({
  name: { type: String, required: true },
  manufacturer: { type: String },
  diseases: [{ type: Schema.Types.ObjectId, ref: 'Diseases' }],
});

const MedicineModel: Model<IMedicine> = mongoose.model<IMedicine>(
  'Medicines',
  medicineSchema,
);

export default MedicineModel;
