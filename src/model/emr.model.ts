import mongoose, { Schema, Document, Model } from 'mongoose';

interface EmrImage {
  image: string;
  tags: mongoose.Types.ObjectId[];
}

// Define interfaces for type checking
export interface IEMR extends Document {
  _id: mongoose.Types.ObjectId;
  patients: mongoose.Types.ObjectId[];
  //doctors: mongoose.Types.ObjectId[];
  diseases: mongoose.Types.ObjectId[];
  medicines: mongoose.Types.ObjectId[];
  emrImages?: EmrImage[];
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const EmrImageSchema: Schema = new Schema({
  image: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tags' }],
});

const emrSchema: Schema<IEMR> = new Schema(
  {
    patients: [{ type: Schema.Types.ObjectId, ref: 'Patients' }],
    //doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctors' }],
    diseases: [{ type: Schema.Types.ObjectId, ref: 'Diseases' }],
    medicines: [{ type: Schema.Types.ObjectId, ref: 'Medicines' }],
    //emrImages: [{ type: Schema.Types.ObjectId, ref:'EMRImages'}],
    emrImages: [EmrImageSchema],
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

const EmrModel: Model<IEMR> = mongoose.model<IEMR>('EMRs', emrSchema);

export default EmrModel;
