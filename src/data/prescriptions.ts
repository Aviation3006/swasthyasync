import { Prescription } from '../types/prescriptions';

export const initialPrescriptions: Prescription[] = [
  {
    id: 'rx-001',
    prescriptionNumber: 'RX-MH-PUNE-2026-44029',
    patientId: 'pat-mh-001',
    patientName: 'Rameshwar B. Jadhav',
    patientAge: 48,
    patientGender: 'Male',
    doctorId: 'doc-01',
    doctorName: 'Dr. Anjali Deshmukh',
    doctorRegistrationNo: 'MMC-2004/08/3120',
    hospitalId: 'hosp-pune-01',
    hospitalName: 'Aundh District Hospital',
    department: 'General Medicine',
    date: '2026-05-18',
    diagnosis: 'Type 2 Diabetes Mellitus & Primary Hypertension',
    chiefComplaint: 'Quarterly routine refill and blood pressure check',
    dispensingStatus: 'Dispensed',
    digitalSignatureHash: 'SHA256:4d8e901a88bce201991823abce88910023bfaf01928374659102837465192837',
    generalAdvice: 'Low glycemic index diet (avoid polished white rice, sugary tea). 45 minutes brisk walking every morning. Drink 3 litres of water daily.',
    followUpDate: '2026-08-25',
    medications: [
      {
        id: 'med-01',
        medicineName: 'Metformin Sustained Release',
        genericName: 'Metformin Hydrochloride IP',
        dosage: '500 mg',
        form: 'Tablet',
        frequency: '1-0-1 (Morning & Night)',
        timing: 'After Food',
        durationDays: 90,
        instructions: 'Take immediately after breakfast and dinner. Do not crush tablet.'
      },
      {
        id: 'med-02',
        medicineName: 'Telmisartan',
        genericName: 'Telmisartan IP',
        dosage: '40 mg',
        form: 'Tablet',
        frequency: '1-0-0 (Morning)',
        timing: 'Before Food',
        durationDays: 90,
        instructions: 'Take at fixed time in the morning with plain water.'
      },
      {
        id: 'med-03',
        medicineName: 'Atorvastatin',
        genericName: 'Atorvastatin Calcium IP',
        dosage: '10 mg',
        form: 'Tablet',
        frequency: '0-0-1 (Night)',
        timing: 'After Food',
        durationDays: 90,
        instructions: 'Take at bedtime for lipid control.'
      }
    ]
  },
  {
    id: 'rx-002',
    prescriptionNumber: 'RX-MH-PUNE-2026-38190',
    patientId: 'pat-mh-001',
    patientName: 'Rameshwar B. Jadhav',
    patientAge: 48,
    patientGender: 'Male',
    doctorId: 'doc-05',
    doctorName: 'Dr. Santosh Pawar',
    doctorRegistrationNo: 'MMC-2009/02/0912',
    hospitalId: 'hosp-pune-01',
    hospitalName: 'Aundh District Hospital',
    department: 'Orthopedics & Trauma',
    date: '2026-04-02',
    diagnosis: 'Early Grade 1 Knee Osteoarthritis',
    chiefComplaint: 'Right knee stiffness on climbing stairs',
    dispensingStatus: 'Dispensed',
    digitalSignatureHash: 'SHA256:3901bce44910283746591028374651928374d8e901a88bce201991823abce889',
    generalAdvice: 'Avoid sitting on floor or squatting. Do quadriceps isometric exercises 3 times daily.',
    followUpDate: 'SOS (As needed)',
    medications: [
      {
        id: 'med-04',
        medicineName: 'Paracetamol',
        genericName: 'Paracetamol IP',
        dosage: '650 mg',
        form: 'Tablet',
        frequency: 'SOS (When pain is severe)',
        timing: 'After Food',
        durationDays: 10,
        instructions: 'Maximum 2 tablets in 24 hours. Take only when pain persists.'
      },
      {
        id: 'med-05',
        medicineName: 'Calcium Carbonate + Vitamin D3',
        genericName: 'Calcium 500mg + Cholecalciferol 250 IU',
        dosage: '500 mg',
        form: 'Tablet',
        frequency: '0-1-0 (After Lunch)',
        timing: 'After Food',
        durationDays: 30,
        instructions: 'Take with water after lunch.'
      }
    ]
  },
  {
    id: 'rx-003',
    prescriptionNumber: 'RX-MH-PUNE-2026-51094',
    patientId: 'pat-mh-002',
    patientName: 'Priya Sachin Shinde',
    patientAge: 32,
    patientGender: 'Female',
    doctorId: 'doc-04',
    doctorName: 'Dr. Smita Kulkarni',
    doctorRegistrationNo: 'MMC-2011/05/2144',
    hospitalId: 'hosp-pune-01',
    hospitalName: 'Aundh District Hospital',
    department: 'Obstetrics & Gynecology',
    date: '2026-08-23',
    diagnosis: 'Antenatal Care - 32 Weeks Gestation + Hypothyroidism',
    chiefComplaint: 'Routine 3rd trimester pregnancy checkup',
    dispensingStatus: 'Pending',
    digitalSignatureHash: 'SHA256:7788990011223344556677889900112233445566778899001122334455667788',
    generalAdvice: 'High protein diet, iron rich vegetables (spinach, jaggery), monitor fetal kick counts daily.',
    followUpDate: '2026-09-06',
    medications: [
      {
        id: 'med-06',
        medicineName: 'Levothyroxine Sodium',
        genericName: 'Thyroxine Sodium IP',
        dosage: '50 mcg',
        form: 'Tablet',
        frequency: '1-0-0 (Early Morning)',
        timing: 'Empty Stomach',
        durationDays: 30,
        instructions: 'Take first thing in the morning with water. Do not eat for 45 minutes.'
      },
      {
        id: 'med-07',
        medicineName: 'Ferrous Ascorbate + Folic Acid',
        genericName: 'Iron 100mg + Folic Acid 1.5mg',
        dosage: '100 mg',
        form: 'Tablet',
        frequency: '0-0-1 (Night)',
        timing: 'After Food',
        durationDays: 30,
        instructions: 'Take at night after dinner with lime water or plain water. Avoid taking with milk.'
      }
    ]
  }
];
