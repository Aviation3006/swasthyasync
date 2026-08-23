import { MedicalRecord } from '../types/records';

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec-001',
    patientId: 'pat-mh-001',
    recordType: 'Lab Report',
    title: 'Complete Comprehensive Metabolic & Glycemic Panel',
    date: '2026-08-20',
    hospitalId: 'hosp-pune-01',
    hospitalName: 'Aundh District Hospital',
    department: 'Central Pathology Laboratory',
    doctorName: 'Dr. Anjali Deshmukh',
    doctorRegistrationNo: 'MMC-2004/08/3120',
    summary: 'Glycemic markers stable. Fasting blood sugar 118 mg/dL, HbA1c 6.7%. Renal function within normal limits. Mild elevation in Triglycerides.',
    diagnosis: 'Type 2 Diabetes Mellitus - Moderately Well Controlled',
    vitalSignsRecorded: {
      bp: '128/84',
      pulse: 74,
      spO2: 98,
      temp: 98.4,
      weight: 71.5
    },
    biomarkers: [
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        nameMarathi: 'एचबीए१सी (३ महिन्यांची सरासरी साखर)',
        value: 6.7,
        unit: '%',
        referenceRange: '< 5.7 (Normal), 5.7 - 6.4 (Pre-diabetic), >= 6.5 (Diabetic)',
        status: 'High',
        plainExplanation: 'Your 3-month blood sugar average is 6.7%, which is within your personal target range (< 7.0%) for managed diabetes.',
        plainExplanationMarathi: 'तुमची ३ महिन्यांची रक्तातील सरासरी साखर ६.७% आहे, जी मधुमेहाच्या नियंत्रणासाठी समाधानकारक आहे.'
      },
      {
        name: 'Fasting Blood Glucose',
        nameMarathi: 'उपाशीपोटी रक्तातील साखर',
        value: 118,
        unit: 'mg/dL',
        referenceRange: '70 - 99 mg/dL',
        status: 'High',
        plainExplanation: 'Slightly higher than the standard non-diabetic range, but consistent with steady morning glucose management.',
        plainExplanationMarathi: 'उपाशीपोटी साखरेचे प्रमाण सामान्य मर्यादेपेक्षा थोडे जास्त आहे, पण तुमच्या औषधांनुसार नियंत्रणात आहे.'
      },
      {
        name: 'Serum Creatinine',
        nameMarathi: 'सिरम क्रिएटीनिन (किडनी कार्यक्षमता)',
        value: 0.95,
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3 mg/dL',
        status: 'Normal',
        plainExplanation: 'Your kidney filtration is healthy and functioning properly.',
        plainExplanationMarathi: 'तुमची किडनी पूर्णपणे निरोगी आणि व्यवस्थित काम करत आहे.'
      },
      {
        name: 'eGFR (Glomerular Filtration Rate)',
        nameMarathi: 'ई-जीएफआर (किडनी फिल्टर दर)',
        value: 92,
        unit: 'mL/min/1.73m²',
        referenceRange: '> 90 mL/min/1.73m²',
        status: 'Normal',
        plainExplanation: 'Excellent kidney filtering capacity.',
        plainExplanationMarathi: 'किडनीचे फिल्टरिंग अतिशय उत्तम आहे.'
      },
      {
        name: 'Total Cholesterol',
        nameMarathi: 'एकूण कोलेस्टेरॉल',
        value: 194,
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        status: 'Normal',
        plainExplanation: 'Overall cholesterol is within the desirable healthy zone.',
        plainExplanationMarathi: 'रक्तातील एकूण चरबीचे प्रमाण सुरक्षित मर्यादेत आहे.'
      },
      {
        name: 'Triglycerides',
        nameMarathi: 'ट्रायग्लिसराइड्स',
        value: 172,
        unit: 'mg/dL',
        referenceRange: '< 150 mg/dL',
        status: 'High',
        plainExplanation: 'Slightly elevated fat level in blood. Advised to reduce deep fried snacks and sugar intake.',
        plainExplanationMarathi: 'रक्तातील फॅटचे प्रमाण थोडे जास्त आहे. तळलेले पदार्थ आणि गोड खाणे कमी करण्याचा सल्ला.'
      }
    ],
    attachments: [
      {
        name: 'Aundh_Lab_Report_Glycemic_Panel_Aug2026.pdf',
        type: 'pdf',
        size: '1.4 MB'
      }
    ],
    digitalSignatureHash: 'SHA256:8f3c7b2190ee01b2a95c808819ab23e59002bbaf9418b76c8c909a319f39001b',
    isVerified: true
  },
  {
    id: 'rec-002',
    patientId: 'pat-mh-001',
    recordType: 'Medical Visit',
    title: 'Outpatient Clinical Consultation - General Medicine',
    date: '2026-05-18',
    hospitalId: 'hosp-pune-01',
    hospitalName: 'Aundh District Hospital',
    department: 'General Medicine (Room 104)',
    doctorName: 'Dr. Anjali Deshmukh',
    doctorRegistrationNo: 'MMC-2004/08/3120',
    summary: 'Quarterly review for T2DM and Hypertension. Patient reports good compliance with morning walks. No chest discomfort, orthopnea, or pedal edema.',
    diagnosis: '1. Type 2 Diabetes Mellitus 2. Primary Hypertension',
    chiefComplaints: ['Routine follow-up', 'Medication refill'],
    findings: 'Chest clear bilaterally (B/L). Heart sounds S1 S2 heard, no murmurs. Abdomen soft, non-tender. Bilateral pedal pulses palpable.',
    doctorNotes: 'Maintain Telmisartan 40mg once daily in morning. Continue Metformin 500mg twice daily with meals. Repeat HbA1c and lipid panel after 3 months.',
    vitalSignsRecorded: {
      bp: '126/82',
      pulse: 72,
      spO2: 99,
      temp: 98.2,
      weight: 72.0
    },
    attachments: [
      {
        name: 'OPD_Case_Paper_18May2026.pdf',
        type: 'pdf',
        size: '840 KB'
      }
    ],
    digitalSignatureHash: 'SHA256:7c4a112009ff8271038bb19488a00291eef5502a819bce39a819c928812903fe',
    isVerified: true
  },
  {
    id: 'rec-003',
    patientId: 'pat-mh-001',
    recordType: 'Prescription',
    title: 'Digital Prescription - Chronic Disease Maintenance Regimen',
    date: '2026-05-18',
    hospitalId: 'hosp-pune-01',
    hospitalName: 'Aundh District Hospital',
    department: 'General Medicine',
    doctorName: 'Dr. Anjali Deshmukh',
    doctorRegistrationNo: 'MMC-2004/08/3120',
    summary: 'Prescription valid for 90 days across all Maharashtra Govt Fair Price Generic Pharmacies (Jan Aushadhi / MJPJAY counters).',
    diagnosis: 'T2DM + Hypertension',
    doctorNotes: 'Take Metformin strictly after breakfast and dinner. Take Telmisartan in the morning with water.',
    attachments: [
      {
        name: 'Prescription_Rx_MH_4402_May2026.pdf',
        type: 'pdf',
        size: '520 KB'
      }
    ],
    digitalSignatureHash: 'SHA256:91bc740118ea002a90184491bcfe39011984bbcd89a8123ef001928374829102',
    isVerified: true
  },
  {
    id: 'rec-004',
    patientId: 'pat-mh-001',
    recordType: 'Radiology / Scan',
    title: 'Digital X-Ray Right Knee (AP & Lateral Views)',
    date: '2026-04-02',
    hospitalId: 'hosp-pune-01',
    hospitalName: 'Aundh District Hospital',
    department: 'Department of Radiodiagnosis',
    doctorName: 'Dr. Santosh Pawar (Consultant Radiologist: Dr. K. Mehta)',
    doctorRegistrationNo: 'MMC-2009/02/0912',
    summary: 'Mild narrowing of medial joint space noted in right knee. No fracture, cortical breach, or osteolytic lesion. Subchondral sclerosis minimal.',
    diagnosis: 'Early Primary Osteoarthritis Grade 1 (Kellgren-Lawrence)',
    findings: 'No joint effusion. Soft tissue shadows unremarkable.',
    doctorNotes: 'Avoid prolonged cross-legged sitting. Prescribed Paracetamol 650mg SOS for pain and daily quadriceps strengthening exercises.',
    attachments: [
      {
        name: 'Right_Knee_XRay_AP_LAT.pdf',
        type: 'pdf',
        size: '3.8 MB'
      }
    ],
    digitalSignatureHash: 'SHA256:123a4901827bce0182739102938475a89012bbde89011243ef01928347162940',
    isVerified: true
  },
  {
    id: 'rec-005',
    patientId: 'pat-mh-001',
    recordType: 'Immunization',
    title: 'Adult Immunization & Influenza Vaccination Record',
    date: '2025-10-14',
    hospitalId: 'hosp-pune-01',
    hospitalName: 'Aundh District Hospital',
    department: 'Preventive & Social Medicine (PSM)',
    doctorName: 'Dr. Rohini Gaikwad',
    doctorRegistrationNo: 'MMC-2012/04/1899',
    summary: 'Administered Quadrivalent Inactivated Influenza Vaccine 0.5ml IM right deltoid. Batch #INF-MH-9921. No immediate adverse events.',
    diagnosis: 'Routine Prophylactic Immunization for Diabetic Adults',
    attachments: [
      {
        name: 'Vaccination_Certificate_Adult_Flu.pdf',
        type: 'pdf',
        size: '410 KB'
      }
    ],
    digitalSignatureHash: 'SHA256:aabbcc1122334455667788990011223344556677889900112233445566778899',
    isVerified: true
  }
];
