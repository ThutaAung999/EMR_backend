import mongoose, { Schema, Document, Model } from 'mongoose';

// Define interfaces for type checking
export interface IEMR extends Document {
    _id: mongoose.Types.ObjectId;
    patients: mongoose.Types.ObjectId[];
    doctors: mongoose.Types.ObjectId[];
    diseases: mongoose.Types.ObjectId[];
    medicines: mongoose.Types.ObjectId[];
    emrImages: mongoose.Types.ObjectId[];

    notes?: string;
}

const emrSchema: Schema<IEMR> = new Schema({
    patients: [{ type: Schema.Types.ObjectId, ref: 'Patients' }],
    doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctors' }],
    diseases: [{ type: Schema.Types.ObjectId, ref: 'Diseases' }],
    medicines: [{ type: Schema.Types.ObjectId, ref: 'Medicines' }],
    emrImages: [{ type: Schema.Types.ObjectId, ref:'EMRImages'}],
    notes: { type: String }
});

const EmrModel: Model<IEMR> = mongoose.model<IEMR>('EMRs', emrSchema);

export default EmrModel;
