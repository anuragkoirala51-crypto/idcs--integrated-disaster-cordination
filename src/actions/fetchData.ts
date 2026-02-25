'use server';

import connectToDatabase from '@/lib/mongodb';
import { Camp } from '@/models/Camp';
import { Resource } from '@/models/Resource';
import { Volunteer } from '@/models/Volunteer';
import { Donation } from '@/models/Donation';
import { IncidentReport } from '@/models/IncidentReport';

/**
 * Fetch all essential initial state to hydrate the Zustand store on load.
 * We return plain objects for Zustand.
 */
export async function fetchInitialState() {
  try {
    await connectToDatabase();

    const [camps, resources, volunteers, donations, incidentReports] = await Promise.all([
      Camp.find({}).lean(),
      Resource.find({}).lean(),
      Volunteer.find({}).lean(),
      Donation.find({}).lean(),
      IncidentReport.find({}).lean(),
    ]);

    // Format plain objects securely by removing strict MongoDB properties like _id and __v
    const serializeDocs = (docs: any[]) => docs.map((doc) => {
      const { _id, __v, ...rest } = doc;
      return rest;
    });

    return {
      success: true,
      data: {
        camps: serializeDocs(camps),
        resources: serializeDocs(resources),
        volunteers: serializeDocs(volunteers),
        donations: serializeDocs(donations),
        incidentReports: serializeDocs(incidentReports)
      }
    };
  } catch (error) {
    console.warn("MongoDB connection failed, using fallback mock data.", error);

    // Fallback Mock Data with real North East India locations
    return {
      success: true,
      data: {
        camps: [
          {
            id: 'camp-ne-1',
            name: 'Sarusajai Regional Relief Hub',
            location: { lat: 26.1132, lng: 91.7582 },
            address: 'Sarusajai Sports Complex, Guwahati, Assam',
            purpose: 'Secondary Hub for Urban Floods',
            helpInfo: 'Provides mass shelter, logistics base for NDRF, and centralized medical triage for the Kamrup region.',
            disasterType: 'Floods',
            capacity: 2000,
            currentOccupancy: 1850,
            status: 'Operating',
            supplies: { water: 5000, food: 8000, medical: 2000 },
            contactPhone: '0361-222-1111',
            criticalNeeds: ['Medical', 'Water']
          },
          {
            id: 'camp-ne-2',
            name: 'Majuli Riverine Shelter',
            location: { lat: 26.9606, lng: 94.1843 },
            address: 'Jengraimukh, Majuli Island, Assam',
            purpose: 'Flood & Soil Erosion Mitigation',
            helpInfo: 'Raised platform shelter for river-displaced families. Equipped with water purifiers and boat rescue docks.',
            disasterType: 'Riverine Floods',
            capacity: 800,
            currentOccupancy: 780,
            status: 'Over Capacity',
            supplies: { water: 200, food: 600, medical: 100 },
            contactPhone: '03775-222-222',
            criticalNeeds: ['Fuel', 'Equipment']
          },
          {
            id: 'camp-ne-3',
            name: 'Kohora Wildlife-Human Relief Point',
            location: { lat: 26.5861, lng: 93.4072 },
            address: 'Kohora Range, Kaziranga, Assam',
            purpose: 'Disaster Relief for Buffer Zones',
            helpInfo: 'Dual-purpose center for protecting fringe village inhabitants and coordinating animal rescue during high floods.',
            disasterType: 'Annual Monsoon Floods',
            capacity: 400,
            currentOccupancy: 320,
            status: 'Operating',
            supplies: { water: 1000, food: 1500, medical: 800 },
            contactPhone: '03776-222-333',
            criticalNeeds: ['Medical']
          },
          {
            id: 'camp-ne-4',
            name: 'Silchar NIT Rescue Base',
            location: { lat: 24.7577, lng: 92.7923 },
            address: 'Cachar District, Silchar, Assam',
            purpose: 'Extreme Urban Flood Management',
            helpInfo: 'High-elevation campus utilized for air-dropping relief materials and housing 5000+ evacuees during valley flooding.',
            disasterType: 'Flash Floods',
            capacity: 5000,
            currentOccupancy: 4900,
            status: 'Critical',
            supplies: { water: 500, food: 1000, medical: 500 },
            contactPhone: '03842-222-444',
            criticalNeeds: ['Food', 'Medical']
          },
          {
            id: 'camp-ne-5',
            name: 'Gangtok Himalayan Safety Centre',
            location: { lat: 27.3314, lng: 88.6138 },
            address: 'Paljor Ground, Gangtok, Sikkim',
            purpose: 'Earthquake & GLOF Shelter',
            helpInfo: 'Reinforced staging area for mountain rescue operations and temporary housing for hill-slide survivors.',
            disasterType: 'Earthquake / Landslides',
            capacity: 1200,
            currentOccupancy: 450,
            status: 'Operating',
            supplies: { water: 3000, food: 5000, medical: 1200 },
            contactPhone: '03592-222-555',
            criticalNeeds: []
          },
          {
            id: 'camp-ne-6',
            name: 'Aizawl Slope Protection Hub',
            location: { lat: 23.7271, lng: 92.7176 },
            address: 'AR Ground, Aizawl, Mizoram',
            purpose: 'Landslide Relief Coordination',
            helpInfo: 'Specialized unit for managing vertical displacement and providing temporary cabin shelters for families.',
            disasterType: 'Massive Landslides',
            capacity: 600,
            currentOccupancy: 580,
            status: 'Operating',
            supplies: { water: 800, food: 1200, medical: 400 },
            contactPhone: '0389-222-666',
            criticalNeeds: ['Equipment']
          },
          {
            id: 'camp-ne-7',
            name: 'Itanagar Cloudburst Relief Base',
            location: { lat: 27.102, lng: 93.692 },
            address: 'IG Park, Itanagar, Arunachal Pradesh',
            purpose: 'Cloudburst & Flash Flood Shelter',
            helpInfo: 'Open-air coordination and shelter site for survivors of flash floods in hilly terrains.',
            disasterType: 'Cloudbursts',
            capacity: 1500,
            currentOccupancy: 200,
            status: 'Operating',
            supplies: { water: 2000, food: 4000, medical: 1000 },
            contactPhone: '0360-222-777',
            criticalNeeds: []
          },
          {
            id: 'camp-ne-8',
            name: 'Kohima Naga Heritage Refuge',
            location: { lat: 25.6747, lng: 94.1103 },
            address: 'Kohima Local Ground, Nagaland',
            purpose: 'Community-led Disaster Recovery',
            helpInfo: 'Utilizes tribal community networks for distribution of traditional food and shelter materials during crises.',
            disasterType: 'Earthquake',
            capacity: 1000,
            currentOccupancy: 150,
            status: 'Operating',
            supplies: { water: 1500, food: 2500, medical: 600 },
            contactPhone: '0370-222-888',
            criticalNeeds: []
          },
          {
            id: 'camp-ne-9',
            name: 'Shillong Pine Relief Centre',
            location: { lat: 25.5788, lng: 91.8931 },
            address: 'Polo Ground, Shillong, Meghalaya',
            purpose: 'Heavy Rainfall & Landslide Shelter',
            helpInfo: 'Located in the wettest region, provides waterproof transit housing and distribution of high-energy rations.',
            disasterType: 'Incessant Rain / Landslides',
            capacity: 900,
            currentOccupancy: 400,
            status: 'Operating',
            supplies: { water: 2000, food: 3000, medical: 800 },
            contactPhone: '0364-222-999',
            criticalNeeds: []
          },
          {
            id: 'camp-ne-10',
            name: 'Imphal Valley Relief Hub',
            location: { lat: 24.817, lng: 93.9368 },
            address: 'Khuman Lampak, Imphal, Manipur',
            purpose: 'Disaster Evacuation & Medical Hub',
            helpInfo: 'Large scale stadium converted for multi-hazard relief and intensive medical support.',
            disasterType: 'Floods / Earthquake',
            capacity: 2500,
            currentOccupancy: 1200,
            status: 'Operating',
            supplies: { water: 6000, food: 9000, medical: 3000 },
            contactPhone: '0385-222-000',
            criticalNeeds: []
          }
        ],
        resources: [
          { id: 'res-1', campId: 'camp-ne-1', category: 'Medical', name: 'First Aid Kits', quantity: 50, unit: 'units', isCriticalShortage: true },
          { id: 'res-4', campId: 'camp-ne-4', category: 'Food', name: 'Rice Bags', quantity: 20, unit: 'bags', isCriticalShortage: true }
        ],
        volunteers: [
          { id: 'vol-2', name: 'Rohan Sharma', skills: ['Logistics'], location: { lat: 26.1500, lng: 91.6650 }, status: 'Deployed', assignedCampId: 'camp-ne-1' }
        ],
        donations: [],
        incidentReports: [
          { id: 'repo-1', reporterName: 'Rahul Gogoi', type: 'Infrastructure', description: 'Power lines down.', location: { lat: 26.1395, lng: 91.6610 }, timestamp: new Date().toISOString(), status: 'Pending', intensity: 0.8 }
        ]
      }
    };
  }
}
