import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
  id: string;
  name: string;
  skills: string[];
  location: { lat: number; lng: number };
  status: 'Available' | 'Deployed' | 'Resting';
  assignedTask?: string;
}

const VolunteerSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  skills: [{ type: String }],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, required: true, enum: ['Available', 'Deployed', 'Resting'] },
  assignedTask: { type: String }
});

export const Volunteer = mongoose.models.Volunteer || mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
