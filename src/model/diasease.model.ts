        import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDisease extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    patients: mongoose.Types.ObjectId[];
    medicines: mongoose.Types.ObjectId[];
}

const diseaseSchema: Schema<IDisease> = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    patients: [{ type: Schema.Types.ObjectId, ref: 'Patients' }],
    medicines: [{ type: Schema.Types.ObjectId, ref: 'Medicines' }]
});

const Disease: Model<IDisease> = mongoose.model<IDisease>('Diseases', diseaseSchema);

export default Disease;
