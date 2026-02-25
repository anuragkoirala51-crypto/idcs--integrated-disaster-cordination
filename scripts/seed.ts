import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load ENV since this runs outside Next.js process usually
config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pyro_relief';

const CampSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, required: true },
  status: { type: String, required: true },
  supplies: { water: { type: Number, required: true }, food: { type: Number, required: true }, medical: { type: Number, required: true } }
});

const VolunteerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  skills: [{ type: String }],
  location: { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  status: { type: String, required: true },
  assignedCampId: { type: String }
});

const ResourceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  campId: { type: String, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  isCriticalShortage: { type: Boolean, required: true }
});

const DonationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  date: { type: String, required: true },
  purpose: { type: String, required: true },
  allocatedToCampId: { type: String }
});

const IncidentReportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  reporterName: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  timestamp: { type: String, required: true },
  status: { type: String, required: true },
  intensity: { type: Number, required: true }
});

const Camp = mongoose.models.Camp || mongoose.model('Camp', CampSchema);
const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);
const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
const IncidentReport = mongoose.models.IncidentReport || mongoose.model('IncidentReport', IncidentReportSchema);

const initialCamps = [
  { id: 'camp-1', name: 'AEC Campus Main Shelter', location: { lat: 26.1388, lng: 91.6625 }, capacity: 500, currentOccupancy: 480, status: 'Over Capacity', supplies: { water: 50, food: 200, medical: 10 } },
  { id: 'camp-2', name: 'Jalukbari Community Center', location: { lat: 26.1550, lng: 91.6680 }, capacity: 300, currentOccupancy: 150, status: 'Operating', supplies: { water: 300, food: 500, medical: 50 } },
  { id: 'camp-3', name: 'Guwahati University Hub', location: { lat: 26.1530, lng: 91.6620 }, capacity: 150, currentOccupancy: 145, status: 'Operating', supplies: { water: 100, food: 150, medical: 20 } },
];

const initialVolunteers = [
  { id: 'vol-1', name: 'Ankita Das', skills: ['Medical', 'Search & Rescue'], location: { lat: 26.1400, lng: 91.6600 }, status: 'Available' },
  { id: 'vol-2', name: 'Rohan Sharma', skills: ['Logistics', 'Communication'], location: { lat: 26.1500, lng: 91.6650 }, status: 'Deployed', assignedCampId: 'camp-2' },
  { id: 'vol-3', name: 'Dr. Bishnu Borah', skills: ['Medical'], location: { lat: 26.1530, lng: 91.6620 }, status: 'Deployed', assignedCampId: 'camp-3' },
  { id: 'vol-4', name: 'Jiten Kalita', skills: ['Construction'], location: { lat: 26.1450, lng: 91.6700 }, status: 'Available' },
];

const initialResources = [
  { id: 'res-1', campId: 'camp-1', category: 'Water', name: 'Bottled Water (Litres)', quantity: 50, unit: 'litres', isCriticalShortage: true },
  { id: 'res-2', campId: 'camp-1', category: 'Medical', name: 'First Aid Kits', quantity: 5, unit: 'kits', isCriticalShortage: true },
  { id: 'res-3', campId: 'camp-2', category: 'Food', name: 'MREs', quantity: 500, unit: 'meals', isCriticalShortage: false },
  { id: 'res-4', campId: 'camp-3', category: 'Fuel', name: 'Diesel Generator Fuel', quantity: 20, unit: 'litres', isCriticalShortage: true },
];

const initialDonations = [
  { id: 'don-1', donorName: 'North East Relief Fund', amount: 500000, currency: 'INR', date: '2026-02-24T10:00:00Z', purpose: 'Medical Supplies Procurement' },
  { id: 'don-2', donorName: 'Guwahati Tech Expo', amount: 45000, currency: 'INR', date: '2026-02-25T08:30:00Z', allocatedToCampId: 'camp-1', purpose: 'Shelter Materials' },
];

const initialIncidentReports = [
  { id: 'repo-1', reporterName: 'Rahul Gogoi', type: 'Infrastructure', description: 'Power lines down near AEC Hostel 4.', location: { lat: 26.1395, lng: 91.6610 }, timestamp: new Date().toISOString(), status: 'Pending', intensity: 0.8 },
  { id: 'repo-2', reporterName: 'Simi Dutta', type: 'Medical', description: 'Urgent medical kit shortage in AEC Block A.', location: { lat: 26.1385, lng: 91.6620 }, timestamp: new Date().toISOString(), status: 'Pending', intensity: 0.6 },
  { id: 'repo-3', reporterName: 'Police Dept', type: 'Infrastructure', description: 'Road blockage at Jalukbari Circle.', location: { lat: 26.1550, lng: 91.6680 }, timestamp: new Date().toISOString(), status: 'Verified', intensity: 0.9 },
  { id: 'repo-4', reporterName: 'Civil Guard', type: 'Food', description: 'Ration delivery delayed near GU Campus.', location: { lat: 26.1530, lng: 91.6620 }, timestamp: new Date().toISOString(), status: 'Pending', intensity: 0.4 },
];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log('Connected.');

    console.log('Clearing existing records...');
    await Promise.all([
      Camp.deleteMany({}),
      Volunteer.deleteMany({}),
      Resource.deleteMany({}),
      Donation.deleteMany({}),
      IncidentReport.deleteMany({}),
    ]);

    console.log('Seeding data...');
    await Camp.insertMany(initialCamps);
    await Volunteer.insertMany(initialVolunteers);
    await Resource.insertMany(initialResources);
    await Donation.insertMany(initialDonations);
    await IncidentReport.insertMany(initialIncidentReports);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
