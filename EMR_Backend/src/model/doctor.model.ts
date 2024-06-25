import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPatient } from '../model/patient.model';

export interface IDoctor extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    specialty: string;
    patients: mongoose.Types.ObjectId[] | IPatient;
}

const doctorSchema: Schema<IDoctor> = new Schema({
    name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    patients: [{ type: Schema.Types.ObjectId, ref: 'Patients' }]
});

const DoctorModel: Model<IDoctor> = mongoose.model<IDoctor>('Doctors', doctorSchema);

export default DoctorModel;
