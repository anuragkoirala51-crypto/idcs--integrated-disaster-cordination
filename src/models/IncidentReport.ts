import mongoose, { Schema, Document } from 'mongoose';

export interface IIncidentReport extends Document {
  id: string;
  reporterName: string;
  type: 'Medical' | 'Food' | 'Infrastructure' | 'Water' | 'Other';
  description: string;
  location: { lat: number; lng: number };
  intensity: number; // 0 to 1
  timestamp: string;
}

const IncidentReportSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  reporterName: { type: String, required: true },
  type: { type: String, required: true, enum: ['Medical', 'Food', 'Infrastructure', 'Water', 'Other'] },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  intensity: { type: Number, required: true, min: 0, max: 1 },
  timestamp: { type: String, required: true }
});

export const IncidentReport = mongoose.models.IncidentReport || mongoose.model<IIncidentReport>('IncidentReport', IncidentReportSchema);
