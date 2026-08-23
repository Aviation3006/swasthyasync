import { Language } from './common';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  altPhone?: string;
}

export interface PatientVitals {
  bloodPressure: string; // e.g. "124/82 mmHg"
  heartRate: number; // bpm
  bloodSugarFasting: number; // mg/dL
  bloodSugarPostPrandial?: number; // mg/dL
  spO2: number; // %
  temperature: number; // °F
  weight: number; // kg
  height: number; // cm
  bmi: number;
  lastUpdated: string;
}

export interface ChronicCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'Controlled' | 'Active' | 'Monitoring';
  treatingDoctor: string;
  hospital: string;
  notes?: string;
}

export interface Allergy {
  id: string;
  substance: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-threatening';
  reaction: string;
}

export interface ConsentSettings {
  allowEmergencyAccess: boolean;
  shareRecordsWithEmpaneledHospitals: boolean;
  shareAllergyAlerts: boolean;
  sharePastRecords30Days: boolean;
  notifyOnAccess: boolean;
}

export interface Patient {
  id: string;
  careSetuId?: string; // e.g. "CSU-IND-PUN-00018427"
  careSetuStatus?: 'Active' | 'Suspended' | 'Pending';
  careSetuIssueDate?: string;
  abhaId: string; // e.g. "91-4402-9821-3320" (optional external identifier)
  abhaAddress: string; // e.g. "rameshwar.jadhav@abdm"
  name: string;
  nameMarathi?: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  aadhaarMasked: string; // e.g. "XXXX-XXXX-4812"
  address: {
    village: string;
    taluka: string;
    district: string;
    state: string;
    pincode: string;
  };
  preferredLanguage?: Language;
  emergencyContact: EmergencyContact;
  vitals: PatientVitals;
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  consent: ConsentSettings;
  activeScheme: string; // e.g. "Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY) / AB-PMJAY"
  registeredHospital: string;
}
