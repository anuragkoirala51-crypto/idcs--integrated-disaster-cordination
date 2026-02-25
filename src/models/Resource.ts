import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  id: string; // Maintain compat with Zustand UUIDs
  name: string;
  category: 'Medical' | 'Food' | 'Water' | 'Shelter' | 'Equipment';
  quantity: number;
  unit: string;
  location: { lat: number; lng: number };
  status: 'In Transit' | 'Available' | 'Depleted';
  lastUpdated: string;
}

const ResourceSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Medical', 'Food', 'Water', 'Shelter', 'Equipment'] },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, required: true, enum: ['In Transit', 'Available', 'Depleted'] },
  lastUpdated: { type: String, required: true }
});

export const Resource = mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
