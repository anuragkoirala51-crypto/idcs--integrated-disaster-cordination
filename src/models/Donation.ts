import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Processing';
}

const DonationSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true, enum: ['Completed', 'Processing'] },
});

export const Donation = mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema);
