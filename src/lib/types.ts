export type Skill = 'Medical' | 'Logistics' | 'Search & Rescue' | 'Communication' | 'Construction' | 'Food Services' | 'Water Rescue' | 'Electrical & Comm';
export type ResourceCategory = 'Water' | 'Food' | 'Medical' | 'Shelter' | 'Fuel' | 'Equipment';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: Skill[];
  location: Location;
  status: 'Available' | 'Deployed' | 'Resting';
  assignedCampId?: string;
}

export interface Camp {
  id: string;
  name: string;
  location: Location;
  capacity: number;
  currentOccupancy: number;
  criticalNeeds: ResourceCategory[];
  status: 'Safe' | 'Over Capacity' | 'Operating' | 'Overcrowded' | 'Critical' | 'Evacuating';
  contactPhone: string;
  address: string;
  purpose: string;
  helpInfo: string;
  disasterType: string;
  supplies: {
    water: number;
    food: number;
    medical: number;
  };
}

export interface Resource {
  id: string;
  campId: string; // which camp this is at, or 'warehouse'
  category: ResourceCategory;
  name: string;
  quantity: number;
  unit: string;
  isCriticalShortage: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkills: Skill[];
  campId: string;
  status: 'Open' | 'In Progress' | 'Completed';
  assignedVolunteerIds: string[];
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  date: string;
  allocatedToCampId?: string;
  purpose: string;
}

export interface Alert {
  id: string;
  type: 'Info' | 'Warning' | 'Critical';
  message: string;
  timestamp: string;
  relatedCampId?: string;
  isRead: boolean;
}

export interface IncidentReport {
  id: string;
  reporterName: string;
  type: 'Medical' | 'Food' | 'Water' | 'Infrastructure' | 'Other';
  description: string;
  location: Location;
  timestamp: string;
  status: 'Pending' | 'Verified' | 'Resolved';
  intensity: number; // 0.1 to 1.0 for heatmap weighting
}

export interface ChatMessage {
  id: string;
  pubkey: string;
  content: string;
  timestamp: number;
  channelId: string;
  alias: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'location' | 'camp' | 'emergency';
  geohash?: string;
  campId?: string;
  description?: string;
}
