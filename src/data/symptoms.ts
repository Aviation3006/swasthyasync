import { SymptomEntry } from '../types/symptoms';

export const initialSymptoms: SymptomEntry[] = [
  {
    id: 'symp-001',
    patientId: 'pat-mh-001',
    bodyArea: 'Muscles & Joints',
    symptomName: 'Right knee stiffness & dull ache',
    severity: 'Mild',
    duration: '4 days',
    startDate: '2026-08-19',
    triggersOrNotes: 'Noticeable after working for 2 hours in the agricultural field. Improves with warm compress and resting.',
    associatedSymptoms: ['Mild swelling in evening'],
    loggedAt: '2026-08-20T19:30:00',
    status: 'Active'
  },
  {
    id: 'symp-002',
    patientId: 'pat-mh-001',
    bodyArea: 'General & Whole Body',
    symptomName: 'Afternoon tiredness and dry mouth',
    severity: 'Moderate',
    duration: '1 week',
    startDate: '2026-08-14',
    triggersOrNotes: 'Occurs around 3:00 PM. Checked blood sugar with glucometer (168 mg/dL post lunch).',
    associatedSymptoms: ['Increased thirst', 'Frequent urination'],
    loggedAt: '2026-08-17T16:15:00',
    status: 'Active'
  },
  {
    id: 'symp-003',
    patientId: 'pat-mh-001',
    bodyArea: 'Head & Neck',
    symptomName: 'Mild throbbing headache at forehead',
    severity: 'Mild',
    duration: '1 day',
    startDate: '2026-07-28',
    triggersOrNotes: 'After driving in hot sun on Pune-Nagar highway. Resolved after drinking ORS and resting.',
    associatedSymptoms: ['Eye strain'],
    loggedAt: '2026-07-28T21:00:00',
    status: 'Resolved'
  }
];
