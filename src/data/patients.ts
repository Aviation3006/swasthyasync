import { Patient } from '../types/patient';

export const mockPrimaryPatient: Patient = {
  id: 'pat-mh-001',
  careSetuId: 'CSU-IND-PUN-00018427',
  careSetuStatus: 'Active',
  careSetuIssueDate: '2024-04-12',
  abhaId: '91-4402-9821-3320',
  abhaAddress: 'rameshwar.jadhav@abdm',
  name: 'Rameshwar B. Jadhav',
  nameMarathi: 'रामेश्वर बा. जाधव',
  dob: '1976-04-12',
  age: 48,
  gender: 'Male',
  bloodGroup: 'B+',
  phone: '+91 98224 51902',
  email: 'rameshwar.jadhav@swasthasync.com',
  aadhaarMasked: 'XXXX-XXXX-4812',
  address: {
    village: 'Wagholi',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '412207'
  },
  preferredLanguage: 'en',
  emergencyContact: {
    name: 'Sunita R. Jadhav',
    relationship: 'Spouse',
    phone: '+91 98224 51903',
    altPhone: '+91 20 2712 4490'
  },
  vitals: {
    bloodPressure: '128/84 mmHg',
    heartRate: 74,
    bloodSugarFasting: 118, // mg/dL
    bloodSugarPostPrandial: 148, // mg/dL
    spO2: 98,
    temperature: 98.4,
    weight: 71.5,
    height: 172,
    bmi: 24.2,
    lastUpdated: '2026-08-20T10:30:00'
  },
  allergies: [
    {
      id: 'alg-01',
      substance: 'Penicillin / Amoxicillin',
      severity: 'Severe',
      reaction: 'Severe urticaria, bronchospasm and swelling'
    },
    {
      id: 'alg-02',
      substance: 'Sulfa Drugs',
      severity: 'Moderate',
      reaction: 'Skin rash and pruritus'
    }
  ],
  chronicConditions: [
    {
      id: 'cc-01',
      name: 'Type 2 Diabetes Mellitus',
      diagnosedDate: '2021-06-14',
      status: 'Controlled',
      treatingDoctor: 'Dr. Anjali Deshmukh',
      hospital: 'Aundh District Hospital, Pune',
      notes: 'HbA1c last recorded 6.8% in May 2026. On Metformin 500mg BD.'
    },
    {
      id: 'cc-02',
      name: 'Primary Hypertension (Stage 1)',
      diagnosedDate: '2023-01-10',
      status: 'Controlled',
      treatingDoctor: 'Dr. Anjali Deshmukh',
      hospital: 'Aundh District Hospital, Pune',
      notes: 'BP well managed with Telmisartan 40mg OD.'
    }
  ],
  consent: {
    allowEmergencyAccess: true,
    shareRecordsWithEmpaneledHospitals: true,
    shareAllergyAlerts: true,
    sharePastRecords30Days: true,
    notifyOnAccess: true
  },
  activeScheme: 'Comprehensive Health Coverage Plan',
  registeredHospital: 'Aundh District Hospital, Pune'
};

export const mockPatientDirectory: Patient[] = [
  mockPrimaryPatient,
  {
    id: 'pat-mh-002',
    careSetuId: 'CSU-IND-PUN-00024190',
    careSetuStatus: 'Active',
    careSetuIssueDate: '2024-08-19',
    abhaId: '91-5519-3382-7714',
    abhaAddress: 'priya.shinde@abdm',
    name: 'Priya Sachin Shinde',
    nameMarathi: 'प्रिया सचिन शिंदे',
    dob: '1992-08-19',
    age: 32,
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '+91 97651 88201',
    email: 'priya.shinde@swasthasync.com',
    aadhaarMasked: 'XXXX-XXXX-9104',
    address: {
      village: 'Manchar',
      taluka: 'Ambegaon',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '410503'
    },
    preferredLanguage: 'mr',
    emergencyContact: {
      name: 'Sachin Shinde',
      relationship: 'Husband',
      phone: '+91 97651 88202'
    },
    vitals: {
      bloodPressure: '116/76 mmHg',
      heartRate: 80,
      bloodSugarFasting: 92,
      bloodSugarPostPrandial: 120,
      spO2: 99,
      temperature: 98.6,
      weight: 58.0,
      height: 160,
      bmi: 22.6,
      lastUpdated: '2026-08-22T09:15:00'
    },
    allergies: [
      {
        id: 'alg-03',
        substance: 'Diclofenac',
        severity: 'Moderate',
        reaction: 'Gastric irritation and facial rash'
      }
    ],
    chronicConditions: [
      {
        id: 'cc-03',
        name: 'Gestational Hypothyroidism (Ante-Natal Care)',
        diagnosedDate: '2026-02-15',
        status: 'Active',
        treatingDoctor: 'Dr. Smita Kulkarni',
        hospital: 'Aundh District Hospital, Pune',
        notes: '3rd Trimester monitoring. On Thyroxine 50 mcg.'
      }
    ],
    consent: {
      allowEmergencyAccess: true,
      shareRecordsWithEmpaneledHospitals: true,
      shareAllergyAlerts: true,
      sharePastRecords30Days: true,
      notifyOnAccess: true
    },
    activeScheme: 'Janani Suraksha Yojana (JSY) / MJPJAY',
    registeredHospital: 'Aundh District Hospital, Pune'
  },
  {
    id: 'pat-mh-003',
    careSetuId: 'CSU-IND-PUN-00038912',
    careSetuStatus: 'Active',
    careSetuIssueDate: '2024-11-03',
    abhaId: '91-1120-7749-0038',
    abhaAddress: 'vitthal.kale@abdm',
    name: 'Vitthal Tukaram Kale',
    nameMarathi: 'विठ्ठल तुकाराम काळे',
    dob: '1958-11-03',
    age: 66,
    gender: 'Male',
    bloodGroup: 'AB+',
    phone: '+91 94230 19482',
    email: 'vitthal.kale@demo.gov.in',
    aadhaarMasked: 'XXXX-XXXX-3391',
    address: {
      village: 'Khed Shivapur',
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '412205'
    },
    preferredLanguage: 'mr',
    emergencyContact: {
      name: 'Ganesh Kale',
      relationship: 'Son',
      phone: '+91 94230 19483'
    },
    vitals: {
      bloodPressure: '144/92 mmHg',
      heartRate: 82,
      bloodSugarFasting: 142,
      spO2: 96,
      temperature: 99.1,
      weight: 68.0,
      height: 168,
      bmi: 24.1,
      lastUpdated: '2026-08-23T08:00:00'
    },
    allergies: [],
    chronicConditions: [
      {
        id: 'cc-04',
        name: 'Chronic Obstructive Pulmonary Disease (COPD)',
        diagnosedDate: '2022-09-10',
        status: 'Active',
        treatingDoctor: 'Dr. Milind Joshi',
        hospital: 'Sassoon General Hospital, Pune',
        notes: 'Inhaler therapy active.'
      }
    ],
    consent: {
      allowEmergencyAccess: true,
      shareRecordsWithEmpaneledHospitals: true,
      shareAllergyAlerts: true,
      sharePastRecords30Days: false,
      notifyOnAccess: true
    },
    activeScheme: 'National Senior Citizen Care / PMJAY',
    registeredHospital: 'Sassoon General Hospital, Pune'
  },
  {
    id: 'pat-mh-004',
    careSetuId: 'CSU-IND-PUN-00045189',
    careSetuStatus: 'Active',
    careSetuIssueDate: '2024-03-24',
    abhaId: '91-8840-2219-5561',
    abhaAddress: 'aarav.more@abdm',
    name: 'Aarav Rahul More (Child)',
    nameMarathi: 'आरव राहुल मोरे',
    dob: '2021-03-24',
    age: 5,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+91 98811 44520',
    email: 'rahul.more@demo.gov.in',
    aadhaarMasked: 'XXXX-XXXX-6612',
    address: {
      village: 'Chakan',
      taluka: 'Khed',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '410501'
    },
    preferredLanguage: 'mr',
    emergencyContact: {
      name: 'Sunita More',
      relationship: 'Mother',
      phone: '+91 98811 44520'
    },
    vitals: {
      bloodPressure: '98/64 mmHg',
      heartRate: 98,
      bloodSugarFasting: 85,
      spO2: 99,
      temperature: 100.4,
      weight: 18.2,
      height: 108,
      bmi: 15.6,
      lastUpdated: '2026-08-23T08:30:00'
    },
    allergies: [
      {
        id: 'alg-04',
        substance: 'Peanuts',
        severity: 'Severe',
        reaction: 'Facial angioedema'
      }
    ],
    chronicConditions: [
      {
        id: 'cc-05',
        name: 'Pediatric Bronchial Asthma',
        diagnosedDate: '2024-08-11',
        status: 'Monitoring',
        treatingDoctor: 'Dr. Rohini Gaikwad',
        hospital: 'Aundh District Hospital, Pune',
        notes: 'Nebulization required during seasonal transition.'
      }
    ],
    consent: {
      allowEmergencyAccess: true,
      shareRecordsWithEmpaneledHospitals: true,
      shareAllergyAlerts: true,
      sharePastRecords30Days: true,
      notifyOnAccess: false
    },
    activeScheme: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
    registeredHospital: 'Aundh District Hospital, Pune'
  }
];
