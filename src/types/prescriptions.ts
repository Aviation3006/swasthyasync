export interface MedicationItem {
  id: string;
  medicineName: string;
  genericName?: string;
  dosage: string; // e.g. "500 mg", "10 ml"
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops';
  frequency: string; // e.g. "1-0-1 (Morning, Night)" or "1-1-1"
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach';
  durationDays: number;
  instructions?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorRegistrationNo: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  date: string;
  diagnosis: string;
  chiefComplaint: string;
  medications: MedicationItem[];
  generalAdvice?: string;
  followUpDate?: string;
  dispensingStatus: 'Pending' | 'Dispensed' | 'Partially Dispensed';
  digitalSignatureHash: string;
}
