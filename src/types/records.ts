export type RecordType = 
  | 'Medical Visit' 
  | 'Lab Report' 
  | 'Prescription' 
  | 'Radiology / Scan' 
  | 'Discharge Summary' 
  | 'Immunization';

export interface BiomarkerResult {
  name: string;
  nameMarathi?: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  plainExplanation: string;
  plainExplanationMarathi?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  recordType: RecordType;
  title: string;
  date: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  doctorName: string;
  doctorRegistrationNo: string;
  summary: string;
  diagnosis?: string;
  chiefComplaints?: string[];
  findings?: string;
  doctorNotes?: string;
  vitalSignsRecorded?: {
    bp?: string;
    pulse?: number;
    spO2?: number;
    temp?: number;
    weight?: number;
  };
  attachments?: {
    name: string;
    type: 'pdf' | 'image' | 'dicom';
    size: string;
    url?: string;
  }[];
  biomarkers?: BiomarkerResult[];
  digitalSignatureHash: string;
  isVerified: boolean;
}

export interface SimplifiedReport {
  id: string;
  recordId?: string;
  title: string;
  testCategory: string;
  reportDate: string;
  overallSummary: string;
  overallSummaryHindi?: string;
  overallSummaryMarathi: string;
  keyFindings: {
    title: string;
    status: 'Good' | 'Attention' | 'Urgent';
    explanation: string;
    explanationMarathi: string;
  }[];
  biomarkers: BiomarkerResult[];
  recommendedDoctorQuestions: string[];
  disclaimer: string;
}
