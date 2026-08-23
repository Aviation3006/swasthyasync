export type FacilityType = 
  | 'District Hospital' 
  | 'Sub-District Hospital' 
  | 'Rural Hospital' 
  | 'Community Health Centre (CHC)' 
  | 'Primary Health Centre (PHC)'
  | 'Teaching & Multispecialty Hospital'
  | 'Specialty Hospital'
  | 'Apex National Institute'
  | 'General Hospital';

export type OperationalStatus = 'Normal' | 'High Occupancy' | 'Critical Load' | 'Maintenance';

export interface Department {
  id: string;
  name: string;
  code: string;
  headDoctor: string;
  activeDoctors: number;
  availableBeds: number;
  totalBeds: number;
  waitingQueueCount: number;
}

export interface Doctor {
  id: string;
  name: string;
  qualification?: string;
  specialization: string;
  departmentId: string;
  departmentName: string;
  opdTimings?: string;
  consultationHours?: string;
  availableDays: string[];
  roomNumber: string;
  hospitalId?: string;
  avatar?: string;
  status: 'On Duty' | 'In OPD' | 'On Leave' | 'Emergency';
  currentQueueCount?: number;
  averageConsultationTimeMin?: number;
  rating?: number;
  totalConsultationsToday?: number;
}

export interface BedCapacity {
  generalTotal: number;
  generalOccupied: number;
  icuTotal: number;
  icuOccupied: number;
  oxygenTotal: number;
  oxygenOccupied: number;
  maternityTotal: number;
  maternityOccupied: number;
  pediatricTotal: number;
  pediatricOccupied: number;
}

export interface Hospital {
  id: string;
  name: string;
  facilityType: FacilityType;
  district: string;
  taluka: string;
  pincode: string;
  contactNumber: string;
  emergencyHelpline: string;
  address: string;
  beds: BedCapacity;
  operationalStatus: OperationalStatus;
  departments: Department[];
  doctors: Doctor[];
  ambulanceAvailable: number;
  bloodBankUnitsAvailable: number;
  lastSyncTime: string;
  distanceKm?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type QueueStatus = 'Waiting' | 'In Consultation' | 'Completed' | 'Urgent' | 'Transferred';

export interface QueueItem {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  checkInTime: string;
  status: QueueStatus;
  priority: 'Normal' | 'Senior Citizen' | 'Emergency' | 'Maternal' | 'Urgent';
  chiefComplaint: string;
  vitalsSnapshot?: {
    bp: string;
    pulse: number;
    spO2: number;
    temp: number;
  };
}
