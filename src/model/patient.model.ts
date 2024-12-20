import mongoose, { Document, Model, Schema } from 'mongoose';
import z from 'zod';
import { IDoctor } from './doctor.model';
import { IDisease } from './diasease.model';

export interface IPatient extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  age: number;
  doctors: mongoose.Types.ObjectId[] | IDoctor;
  diseases: mongoose.Types.ObjectId[] | IDisease;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctors' }],
    diseases: [{ type: Schema.Types.ObjectId, ref: 'Diseases' }],
  },
  {
    timestamps: true,
  },
);

const Patient: Model<IPatient> = mongoose.model<IPatient>(
  'Patients',
  patientSchema,
);

export default Patient;
