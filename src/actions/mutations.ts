'use server';

import connectToDatabase from '@/lib/mongodb';
import { Donation } from '@/models/Donation';
import { IncidentReport } from '@/models/IncidentReport';

export async function processDonationAction(donationData: any) {
  try {
    await connectToDatabase();
    
    const newDonation = new Donation({
      ...donationData,
      id: crypto.randomUUID(), // Guarantee standard ID regardless of MongoDB _id
      status: 'Completed'
    });
    
    await newDonation.save();
    
    const { _id, __v, ...rest } = newDonation.toObject();
    return { success: true, data: rest };
  } catch (error) {
    console.error("Donation processing failed:", error);
    return { success: false, error: "Database error during donation processing" };
  }
}

export async function submitIncidentReportAction(reportData: any) {
  try {
    await connectToDatabase();
    
    const newReport = new IncidentReport({
      ...reportData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    });
    
    await newReport.save();
    
    const { _id, __v, ...rest } = newReport.toObject();
    return { success: true, data: rest };
  } catch (error) {
    console.error("Incident reporting failed:", error);
    return { success: false, error: "Database error during incident reporting" };
  }
}
