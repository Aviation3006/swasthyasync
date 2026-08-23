export type BodyArea = 
  | 'Head & Neck'
  | 'Chest & Respiratory'
  | 'Abdomen & Digestion'
  | 'Muscles & Joints'
  | 'Skin & Allergies'
  | 'General & Whole Body';

export type SymptomSeverity = 'Mild' | 'Moderate' | 'Severe' | 'Critical';

export interface SymptomEntry {
  id: string;
  patientId: string;
  bodyArea: BodyArea;
  symptomName: string;
  severity: SymptomSeverity;
  duration: string; // e.g. "3 days", "2 weeks"
  startDate: string;
  triggersOrNotes?: string;
  associatedSymptoms: string[];
  loggedAt: string;
  status: 'Active' | 'Improving' | 'Resolved';
}
