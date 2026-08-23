import { StorageStore } from '../utils/storage';
import {
  PatientDoctorRating,
  DoctorAuditMetric,
  HospitalAuditMetric,
  DistrictAuditSummary,
  QualityWarning
} from '../types/rating';

export type DoctorSeedTuple = [string, string, string, string, string, string, string, number, number, number, string, number];

export const SEEDED_DOCTORS: DoctorSeedTuple[] = [
  [
    "doc-1",
    "Dr. Anjali Deshmukh",
    "General Medicine",
    "hosp-aundh",
    "Aundh District Hospital",
    "Pune",
    "Maharashtra",
    12,
    142,
    4.8,
    "up",
    0.3
  ],
  [
    "doc-2",
    "Dr. Rajesh Shinde",
    "Cardiology",
    "hosp-surya-sahyadri",
    "Surya Sahyadri Hospital",
    "Pune",
    "Maharashtra",
    15,
    189,
    4.6,
    "stable",
    0.0
  ],
  [
    "doc-3",
    "Dr. Priya Kulkarni",
    "Pediatrics",
    "hosp-aundh",
    "Aundh District Hospital",
    "Pune",
    "Maharashtra",
    9,
    210,
    4.95,
    "up",
    0.4
  ],
  [
    "doc-4",
    "Dr. Amit Joshi",
    "Orthopedics",
    "hosp-sancheti",
    "Sancheti Hospital for Orthopedics",
    "Pune",
    "Maharashtra",
    14,
    165,
    4.7,
    "stable",
    0.1
  ],
  [
    "doc-5",
    "Dr. Sunita Patil",
    "Gynecology & Obstetrics",
    "hosp-pune-district",
    "Pune District Civil Hospital",
    "Pune",
    "Maharashtra",
    11,
    195,
    4.5,
    "stable",
    0.0
  ],
  [
    "doc-6",
    "Dr. Rohan Kadam",
    "General Surgery",
    "hosp-pune-district",
    "Pune District Civil Hospital",
    "Pune",
    "Maharashtra",
    8,
    110,
    3.4,
    "down",
    -0.5
  ],
  [
    "doc-7",
    "Dr. Meera Deshpande",
    "Dermatology",
    "hosp-surya-sahyadri",
    "Surya Sahyadri Hospital",
    "Pune",
    "Maharashtra",
    7,
    98,
    4.6,
    "up",
    0.2
  ],
  [
    "doc-8",
    "Dr. Sachin More",
    "ENT & Head Neck",
    "hosp-aundh",
    "Aundh District Hospital",
    "Pune",
    "Maharashtra",
    10,
    130,
    4.3,
    "stable",
    0.0
  ],
  [
    "doc-9",
    "Dr. Deepa Sawant",
    "Ophthalmology",
    "hosp-sancheti",
    "Sancheti Hospital for Orthopedics",
    "Pune",
    "Maharashtra",
    13,
    145,
    4.8,
    "up",
    0.2
  ],
  [
    "doc-10",
    "Dr. Nitin Gaikwad",
    "Pulmonology",
    "hosp-pune-district",
    "Pune District Civil Hospital",
    "Pune",
    "Maharashtra",
    16,
    175,
    4.4,
    "stable",
    0.1
  ],
  [
    "doc-11",
    "Dr. Snehal Bhosale",
    "Nephrology",
    "hosp-surya-sahyadri",
    "Surya Sahyadri Hospital",
    "Pune",
    "Maharashtra",
    10,
    115,
    4.7,
    "up",
    0.3
  ],
  [
    "doc-12",
    "Dr. Vivek Rane",
    "Neurology",
    "hosp-sancheti",
    "Sancheti Hospital for Orthopedics",
    "Pune",
    "Maharashtra",
    18,
    220,
    4.9,
    "up",
    0.3
  ],
  [
    "doc-13",
    "Dr. Pooja Chitnis",
    "Psychiatry & Mental Health",
    "hosp-aundh",
    "Aundh District Hospital",
    "Pune",
    "Maharashtra",
    6,
    85,
    4.2,
    "stable",
    0.0
  ],
  [
    "doc-14",
    "Dr. Vikram Ghorpade",
    "Emergency & Critical Care",
    "hosp-pune-district",
    "Pune District Civil Hospital",
    "Pune",
    "Maharashtra",
    12,
    190,
    4.5,
    "stable",
    0.1
  ],
  [
    "doc-15",
    "Dr. Kavita Shirodkar",
    "Endocrinology & Diabetology",
    "hosp-surya-sahyadri",
    "Surya Sahyadri Hospital",
    "Pune",
    "Maharashtra",
    11,
    140,
    4.8,
    "up",
    0.2
  ],
  [
    "doc-16",
    "Dr. Rajiv Malhotra",
    "Cardiology",
    "hosp-ddu-delhi",
    "Deen Dayal Upadhyay Hospital",
    "West Delhi",
    "Delhi",
    16,
    230,
    4.7,
    "up",
    0.2
  ],
  [
    "doc-17",
    "Dr. Shalini Verma",
    "General Medicine",
    "hosp-ddu-delhi",
    "Deen Dayal Upadhyay Hospital",
    "West Delhi",
    "Delhi",
    10,
    160,
    4.5,
    "stable",
    0.1
  ],
  [
    "doc-18",
    "Dr. Harish Khanna",
    "Orthopedics",
    "hosp-ddu-delhi",
    "Deen Dayal Upadhyay Hospital",
    "West Delhi",
    "Delhi",
    13,
    175,
    4.6,
    "stable",
    0.0
  ],
  [
    "doc-19",
    "Dr. Suresh Kumar",
    "General Medicine",
    "hosp-victoria-bengaluru",
    "Victoria Hospital",
    "Bengaluru Urban",
    "Karnataka",
    15,
    240,
    4.8,
    "up",
    0.3
  ],
  [
    "doc-20",
    "Dr. Lakshmi Rao",
    "Pediatrics",
    "hosp-victoria-bengaluru",
    "Victoria Hospital",
    "Bengaluru Urban",
    "Karnataka",
    12,
    210,
    4.9,
    "up",
    0.4
  ]
];

const INITIAL_RATINGS: PatientDoctorRating[] = [
  {
    "id": "rate-seed-1001",
    "appointmentId": "appt-seed-1001",
    "patientId": "pat-1101",
    "patientName": "Patient #1101",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1002",
    "appointmentId": "appt-seed-1002",
    "patientId": "pat-1102",
    "patientName": "Patient #1102",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1003",
    "appointmentId": "appt-seed-1003",
    "patientId": "pat-1103",
    "patientName": "Patient #1103",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1004",
    "appointmentId": "appt-seed-1004",
    "patientId": "pat-1104",
    "patientName": "Patient #1104",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1005",
    "appointmentId": "appt-seed-1005",
    "patientId": "pat-1105",
    "patientName": "Patient #1105",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1006",
    "appointmentId": "appt-seed-1006",
    "patientId": "pat-1106",
    "patientName": "Patient #1106",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1007",
    "appointmentId": "appt-seed-1007",
    "patientId": "pat-1107",
    "patientName": "Patient #1107",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1008",
    "appointmentId": "appt-seed-1008",
    "patientId": "pat-1108",
    "patientName": "Patient #1108",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Anjali Deshmukh explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1009",
    "appointmentId": "appt-seed-1009",
    "patientId": "pat-1109",
    "patientName": "Patient #1109",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1010",
    "appointmentId": "appt-seed-1010",
    "patientId": "pat-1110",
    "patientName": "Patient #1110",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1011",
    "appointmentId": "appt-seed-1011",
    "patientId": "pat-1111",
    "patientName": "Patient #1111",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-21",
    "tokenNumber": "OPD-110",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Anjali Deshmukh explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-21T11:20:00Z"
  },
  {
    "id": "rate-seed-1012",
    "appointmentId": "appt-seed-1012",
    "patientId": "pat-1112",
    "patientName": "Patient #1112",
    "doctorId": "doc-1",
    "doctorName": "Dr. Anjali Deshmukh",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-23",
    "tokenNumber": "OPD-111",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 5,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Anjali Deshmukh addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-23T11:21:00Z"
  },
  {
    "id": "rate-seed-1013",
    "appointmentId": "appt-seed-1013",
    "patientId": "pat-1113",
    "patientName": "Patient #1113",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 3,
      "communication": 3,
      "professionalism": 3,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 3
    },
    "feedback": "The doctor was competent, but explanation of the medicines could have been more detailed.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1014",
    "appointmentId": "appt-seed-1014",
    "patientId": "pat-1114",
    "patientName": "Patient #1114",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 4,
      "communication": 5,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Rajesh Shinde addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1015",
    "appointmentId": "appt-seed-1015",
    "patientId": "pat-1115",
    "patientName": "Patient #1115",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1016",
    "appointmentId": "appt-seed-1016",
    "patientId": "pat-1116",
    "patientName": "Patient #1116",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1017",
    "appointmentId": "appt-seed-1017",
    "patientId": "pat-1117",
    "patientName": "Patient #1117",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1018",
    "appointmentId": "appt-seed-1018",
    "patientId": "pat-1118",
    "patientName": "Patient #1118",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1019",
    "appointmentId": "appt-seed-1019",
    "patientId": "pat-1119",
    "patientName": "Patient #1119",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1020",
    "appointmentId": "appt-seed-1020",
    "patientId": "pat-1120",
    "patientName": "Patient #1120",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1021",
    "appointmentId": "appt-seed-1021",
    "patientId": "pat-1121",
    "patientName": "Patient #1121",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Rajesh Shinde explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1022",
    "appointmentId": "appt-seed-1022",
    "patientId": "pat-1122",
    "patientName": "Patient #1122",
    "doctorId": "doc-2",
    "doctorName": "Dr. Rajesh Shinde",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 4,
      "communication": 5,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1023",
    "appointmentId": "appt-seed-1023",
    "patientId": "pat-1123",
    "patientName": "Patient #1123",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1024",
    "appointmentId": "appt-seed-1024",
    "patientId": "pat-1124",
    "patientName": "Patient #1124",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1025",
    "appointmentId": "appt-seed-1025",
    "patientId": "pat-1125",
    "patientName": "Patient #1125",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Priya Kulkarni explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1026",
    "appointmentId": "appt-seed-1026",
    "patientId": "pat-1126",
    "patientName": "Patient #1126",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1027",
    "appointmentId": "appt-seed-1027",
    "patientId": "pat-1127",
    "patientName": "Patient #1127",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1028",
    "appointmentId": "appt-seed-1028",
    "patientId": "pat-1128",
    "patientName": "Patient #1128",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1029",
    "appointmentId": "appt-seed-1029",
    "patientId": "pat-1129",
    "patientName": "Patient #1129",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1030",
    "appointmentId": "appt-seed-1030",
    "patientId": "pat-1130",
    "patientName": "Patient #1130",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Priya Kulkarni explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1031",
    "appointmentId": "appt-seed-1031",
    "patientId": "pat-1131",
    "patientName": "Patient #1131",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1032",
    "appointmentId": "appt-seed-1032",
    "patientId": "pat-1132",
    "patientName": "Patient #1132",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1033",
    "appointmentId": "appt-seed-1033",
    "patientId": "pat-1133",
    "patientName": "Patient #1133",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-21",
    "tokenNumber": "OPD-110",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 5,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-21T11:20:00Z"
  },
  {
    "id": "rate-seed-1034",
    "appointmentId": "appt-seed-1034",
    "patientId": "pat-1134",
    "patientName": "Patient #1134",
    "doctorId": "doc-3",
    "doctorName": "Dr. Priya Kulkarni",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-23",
    "tokenNumber": "OPD-111",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-23T11:21:00Z"
  },
  {
    "id": "rate-seed-1035",
    "appointmentId": "appt-seed-1035",
    "patientId": "pat-1135",
    "patientName": "Patient #1135",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1036",
    "appointmentId": "appt-seed-1036",
    "patientId": "pat-1136",
    "patientName": "Patient #1136",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1037",
    "appointmentId": "appt-seed-1037",
    "patientId": "pat-1137",
    "patientName": "Patient #1137",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1038",
    "appointmentId": "appt-seed-1038",
    "patientId": "pat-1138",
    "patientName": "Patient #1138",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1039",
    "appointmentId": "appt-seed-1039",
    "patientId": "pat-1139",
    "patientName": "Patient #1139",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 3,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "Routine checkup completed. OPD waiting area was crowded.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1040",
    "appointmentId": "appt-seed-1040",
    "patientId": "pat-1140",
    "patientName": "Patient #1140",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 3,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "Average consultation experience. Consultation was brief due to heavy OPD queue load.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1041",
    "appointmentId": "appt-seed-1041",
    "patientId": "pat-1141",
    "patientName": "Patient #1141",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1042",
    "appointmentId": "appt-seed-1042",
    "patientId": "pat-1142",
    "patientName": "Patient #1142",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1043",
    "appointmentId": "appt-seed-1043",
    "patientId": "pat-1143",
    "patientName": "Patient #1143",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1044",
    "appointmentId": "appt-seed-1044",
    "patientId": "pat-1144",
    "patientName": "Patient #1144",
    "doctorId": "doc-4",
    "doctorName": "Dr. Amit Joshi",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Amit Joshi explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1045",
    "appointmentId": "appt-seed-1045",
    "patientId": "pat-1145",
    "patientName": "Patient #1145",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1046",
    "appointmentId": "appt-seed-1046",
    "patientId": "pat-1146",
    "patientName": "Patient #1146",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Sunita Patil explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1047",
    "appointmentId": "appt-seed-1047",
    "patientId": "pat-1147",
    "patientName": "Patient #1147",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1048",
    "appointmentId": "appt-seed-1048",
    "patientId": "pat-1148",
    "patientName": "Patient #1148",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1049",
    "appointmentId": "appt-seed-1049",
    "patientId": "pat-1149",
    "patientName": "Patient #1149",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1050",
    "appointmentId": "appt-seed-1050",
    "patientId": "pat-1150",
    "patientName": "Patient #1150",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1051",
    "appointmentId": "appt-seed-1051",
    "patientId": "pat-1151",
    "patientName": "Patient #1151",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1052",
    "appointmentId": "appt-seed-1052",
    "patientId": "pat-1152",
    "patientName": "Patient #1152",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1053",
    "appointmentId": "appt-seed-1053",
    "patientId": "pat-1153",
    "patientName": "Patient #1153",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 3,
      "communication": 3,
      "professionalism": 3,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "Routine checkup completed. OPD waiting area was crowded.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1054",
    "appointmentId": "appt-seed-1054",
    "patientId": "pat-1154",
    "patientName": "Patient #1154",
    "doctorId": "doc-5",
    "doctorName": "Dr. Sunita Patil",
    "specialization": "Gynecology & Obstetrics",
    "department": "Gynecology & Obstetrics",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1055",
    "appointmentId": "appt-seed-1055",
    "patientId": "pat-1155",
    "patientName": "Patient #1155",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 2,
      "communication": 3,
      "professionalism": 2,
      "explanationClarity": 1
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 2
    },
    "feedback": "Consultation felt rushed. The doctor barely spent two minutes discussing symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1056",
    "appointmentId": "appt-seed-1056",
    "patientId": "pat-1156",
    "patientName": "Patient #1156",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 2,
      "communication": 2,
      "professionalism": 2,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 2
    },
    "feedback": "Consultation felt rushed. The doctor barely spent two minutes discussing symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1057",
    "appointmentId": "appt-seed-1057",
    "patientId": "pat-1157",
    "patientName": "Patient #1157",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1058",
    "appointmentId": "appt-seed-1058",
    "patientId": "pat-1158",
    "patientName": "Patient #1158",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1059",
    "appointmentId": "appt-seed-1059",
    "patientId": "pat-1159",
    "patientName": "Patient #1159",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 3,
      "communication": 2,
      "professionalism": 3,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "The doctor was competent, but explanation of the medicines could have been more detailed.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1060",
    "appointmentId": "appt-seed-1060",
    "patientId": "pat-1160",
    "patientName": "Patient #1160",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 2,
      "communication": 1,
      "professionalism": 2,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 2
    },
    "feedback": "Consultation felt rushed. The doctor barely spent two minutes discussing symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1061",
    "appointmentId": "appt-seed-1061",
    "patientId": "pat-1161",
    "patientName": "Patient #1161",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 2,
      "communication": 2,
      "professionalism": 2,
      "explanationClarity": 1
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 2
    },
    "feedback": "Consultation felt rushed. The doctor barely spent two minutes discussing symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1062",
    "appointmentId": "appt-seed-1062",
    "patientId": "pat-1162",
    "patientName": "Patient #1162",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 1,
      "communication": 2,
      "professionalism": 2,
      "explanationClarity": 1
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 1
    },
    "feedback": "Poor consultation experience. Doctor was dismissive of symptoms and explanation was unclear.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1063",
    "appointmentId": "appt-seed-1063",
    "patientId": "pat-1163",
    "patientName": "Patient #1163",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 2,
      "communication": 2,
      "professionalism": 2,
      "explanationClarity": 1
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 2
    },
    "feedback": "Doctor seemed in a hurry. Did not explain why additional tests were ordered.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1064",
    "appointmentId": "appt-seed-1064",
    "patientId": "pat-1164",
    "patientName": "Patient #1164",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 5,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Rohan Kadam addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1065",
    "appointmentId": "appt-seed-1065",
    "patientId": "pat-1165",
    "patientName": "Patient #1165",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-21",
    "tokenNumber": "OPD-110",
    "consultationRating": {
      "overallRating": 3,
      "communication": 2,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "Routine checkup completed. OPD waiting area was crowded.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-21T11:20:00Z"
  },
  {
    "id": "rate-seed-1066",
    "appointmentId": "appt-seed-1066",
    "patientId": "pat-1166",
    "patientName": "Patient #1166",
    "doctorId": "doc-6",
    "doctorName": "Dr. Rohan Kadam",
    "specialization": "General Surgery",
    "department": "General Surgery",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-23",
    "tokenNumber": "OPD-111",
    "consultationRating": {
      "overallRating": 3,
      "communication": 2,
      "professionalism": 3,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "The doctor was competent, but explanation of the medicines could have been more detailed.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-23T11:21:00Z"
  },
  {
    "id": "rate-seed-1067",
    "appointmentId": "appt-seed-1067",
    "patientId": "pat-1167",
    "patientName": "Patient #1167",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1068",
    "appointmentId": "appt-seed-1068",
    "patientId": "pat-1168",
    "patientName": "Patient #1168",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1069",
    "appointmentId": "appt-seed-1069",
    "patientId": "pat-1169",
    "patientName": "Patient #1169",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Meera Deshpande explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1070",
    "appointmentId": "appt-seed-1070",
    "patientId": "pat-1170",
    "patientName": "Patient #1170",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Meera Deshpande explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1071",
    "appointmentId": "appt-seed-1071",
    "patientId": "pat-1171",
    "patientName": "Patient #1171",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1072",
    "appointmentId": "appt-seed-1072",
    "patientId": "pat-1172",
    "patientName": "Patient #1172",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Meera Deshpande explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1073",
    "appointmentId": "appt-seed-1073",
    "patientId": "pat-1173",
    "patientName": "Patient #1173",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Meera Deshpande explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1074",
    "appointmentId": "appt-seed-1074",
    "patientId": "pat-1174",
    "patientName": "Patient #1174",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1075",
    "appointmentId": "appt-seed-1075",
    "patientId": "pat-1175",
    "patientName": "Patient #1175",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1076",
    "appointmentId": "appt-seed-1076",
    "patientId": "pat-1176",
    "patientName": "Patient #1176",
    "doctorId": "doc-7",
    "doctorName": "Dr. Meera Deshpande",
    "specialization": "Dermatology",
    "department": "Dermatology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1077",
    "appointmentId": "appt-seed-1077",
    "patientId": "pat-1177",
    "patientName": "Patient #1177",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 3,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 3
    },
    "feedback": "Routine checkup completed. OPD waiting area was crowded.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1078",
    "appointmentId": "appt-seed-1078",
    "patientId": "pat-1178",
    "patientName": "Patient #1178",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1079",
    "appointmentId": "appt-seed-1079",
    "patientId": "pat-1179",
    "patientName": "Patient #1179",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1080",
    "appointmentId": "appt-seed-1080",
    "patientId": "pat-1180",
    "patientName": "Patient #1180",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1081",
    "appointmentId": "appt-seed-1081",
    "patientId": "pat-1181",
    "patientName": "Patient #1181",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1082",
    "appointmentId": "appt-seed-1082",
    "patientId": "pat-1182",
    "patientName": "Patient #1182",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Sachin More addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1083",
    "appointmentId": "appt-seed-1083",
    "patientId": "pat-1183",
    "patientName": "Patient #1183",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 3,
      "communication": 2,
      "professionalism": 3,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 3
    },
    "feedback": "The doctor was competent, but explanation of the medicines could have been more detailed.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1084",
    "appointmentId": "appt-seed-1084",
    "patientId": "pat-1184",
    "patientName": "Patient #1184",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 3,
      "communication": 4,
      "professionalism": 3,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 3
    },
    "feedback": "Routine checkup completed. OPD waiting area was crowded.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1085",
    "appointmentId": "appt-seed-1085",
    "patientId": "pat-1185",
    "patientName": "Patient #1185",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1086",
    "appointmentId": "appt-seed-1086",
    "patientId": "pat-1186",
    "patientName": "Patient #1186",
    "doctorId": "doc-8",
    "doctorName": "Dr. Sachin More",
    "specialization": "ENT & Head Neck",
    "department": "ENT & Head Neck",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1087",
    "appointmentId": "appt-seed-1087",
    "patientId": "pat-1187",
    "patientName": "Patient #1187",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1088",
    "appointmentId": "appt-seed-1088",
    "patientId": "pat-1188",
    "patientName": "Patient #1188",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1089",
    "appointmentId": "appt-seed-1089",
    "patientId": "pat-1189",
    "patientName": "Patient #1189",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1090",
    "appointmentId": "appt-seed-1090",
    "patientId": "pat-1190",
    "patientName": "Patient #1190",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1091",
    "appointmentId": "appt-seed-1091",
    "patientId": "pat-1191",
    "patientName": "Patient #1191",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Deepa Sawant explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1092",
    "appointmentId": "appt-seed-1092",
    "patientId": "pat-1192",
    "patientName": "Patient #1192",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1093",
    "appointmentId": "appt-seed-1093",
    "patientId": "pat-1193",
    "patientName": "Patient #1193",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1094",
    "appointmentId": "appt-seed-1094",
    "patientId": "pat-1194",
    "patientName": "Patient #1194",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Deepa Sawant explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1095",
    "appointmentId": "appt-seed-1095",
    "patientId": "pat-1195",
    "patientName": "Patient #1195",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1096",
    "appointmentId": "appt-seed-1096",
    "patientId": "pat-1196",
    "patientName": "Patient #1196",
    "doctorId": "doc-9",
    "doctorName": "Dr. Deepa Sawant",
    "specialization": "Ophthalmology",
    "department": "Ophthalmology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 3,
      "communication": 4,
      "professionalism": 3,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "The doctor was competent, but explanation of the medicines could have been more detailed.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1097",
    "appointmentId": "appt-seed-1097",
    "patientId": "pat-1197",
    "patientName": "Patient #1197",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 4,
      "communication": 5,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Nitin Gaikwad addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1098",
    "appointmentId": "appt-seed-1098",
    "patientId": "pat-1198",
    "patientName": "Patient #1198",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1099",
    "appointmentId": "appt-seed-1099",
    "patientId": "pat-1199",
    "patientName": "Patient #1199",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1100",
    "appointmentId": "appt-seed-1100",
    "patientId": "pat-1200",
    "patientName": "Patient #1200",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1101",
    "appointmentId": "appt-seed-1101",
    "patientId": "pat-1201",
    "patientName": "Patient #1201",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 3,
      "communication": 4,
      "professionalism": 3,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "Average consultation experience. Consultation was brief due to heavy OPD queue load.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1102",
    "appointmentId": "appt-seed-1102",
    "patientId": "pat-1202",
    "patientName": "Patient #1202",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Nitin Gaikwad explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1103",
    "appointmentId": "appt-seed-1103",
    "patientId": "pat-1203",
    "patientName": "Patient #1203",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Nitin Gaikwad explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1104",
    "appointmentId": "appt-seed-1104",
    "patientId": "pat-1204",
    "patientName": "Patient #1204",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 3,
      "communication": 2,
      "professionalism": 3,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "Routine checkup completed. OPD waiting area was crowded.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1105",
    "appointmentId": "appt-seed-1105",
    "patientId": "pat-1205",
    "patientName": "Patient #1205",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1106",
    "appointmentId": "appt-seed-1106",
    "patientId": "pat-1206",
    "patientName": "Patient #1206",
    "doctorId": "doc-10",
    "doctorName": "Dr. Nitin Gaikwad",
    "specialization": "Pulmonology",
    "department": "Pulmonology",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1107",
    "appointmentId": "appt-seed-1107",
    "patientId": "pat-1207",
    "patientName": "Patient #1207",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1108",
    "appointmentId": "appt-seed-1108",
    "patientId": "pat-1208",
    "patientName": "Patient #1208",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1109",
    "appointmentId": "appt-seed-1109",
    "patientId": "pat-1209",
    "patientName": "Patient #1209",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 3,
      "communication": 3,
      "professionalism": 3,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 3
    },
    "feedback": "Average consultation experience. Consultation was brief due to heavy OPD queue load.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1110",
    "appointmentId": "appt-seed-1110",
    "patientId": "pat-1210",
    "patientName": "Patient #1210",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1111",
    "appointmentId": "appt-seed-1111",
    "patientId": "pat-1211",
    "patientName": "Patient #1211",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1112",
    "appointmentId": "appt-seed-1112",
    "patientId": "pat-1212",
    "patientName": "Patient #1212",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1113",
    "appointmentId": "appt-seed-1113",
    "patientId": "pat-1213",
    "patientName": "Patient #1213",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Snehal Bhosale explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1114",
    "appointmentId": "appt-seed-1114",
    "patientId": "pat-1214",
    "patientName": "Patient #1214",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 3,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 3
    },
    "feedback": "Routine checkup completed. OPD waiting area was crowded.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1115",
    "appointmentId": "appt-seed-1115",
    "patientId": "pat-1215",
    "patientName": "Patient #1215",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1116",
    "appointmentId": "appt-seed-1116",
    "patientId": "pat-1216",
    "patientName": "Patient #1216",
    "doctorId": "doc-11",
    "doctorName": "Dr. Snehal Bhosale",
    "specialization": "Nephrology",
    "department": "Nephrology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1117",
    "appointmentId": "appt-seed-1117",
    "patientId": "pat-1217",
    "patientName": "Patient #1217",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1118",
    "appointmentId": "appt-seed-1118",
    "patientId": "pat-1218",
    "patientName": "Patient #1218",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1119",
    "appointmentId": "appt-seed-1119",
    "patientId": "pat-1219",
    "patientName": "Patient #1219",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1120",
    "appointmentId": "appt-seed-1120",
    "patientId": "pat-1220",
    "patientName": "Patient #1220",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Vivek Rane explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1121",
    "appointmentId": "appt-seed-1121",
    "patientId": "pat-1221",
    "patientName": "Patient #1221",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Vivek Rane explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1122",
    "appointmentId": "appt-seed-1122",
    "patientId": "pat-1222",
    "patientName": "Patient #1222",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1123",
    "appointmentId": "appt-seed-1123",
    "patientId": "pat-1223",
    "patientName": "Patient #1223",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 5,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1124",
    "appointmentId": "appt-seed-1124",
    "patientId": "pat-1224",
    "patientName": "Patient #1224",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1125",
    "appointmentId": "appt-seed-1125",
    "patientId": "pat-1225",
    "patientName": "Patient #1225",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1126",
    "appointmentId": "appt-seed-1126",
    "patientId": "pat-1226",
    "patientName": "Patient #1226",
    "doctorId": "doc-12",
    "doctorName": "Dr. Vivek Rane",
    "specialization": "Neurology",
    "department": "Neurology",
    "facilityId": "hosp-sancheti",
    "facilityName": "Sancheti Hospital for Orthopedics",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Vivek Rane explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1127",
    "appointmentId": "appt-seed-1127",
    "patientId": "pat-1227",
    "patientName": "Patient #1227",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 5,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1128",
    "appointmentId": "appt-seed-1128",
    "patientId": "pat-1228",
    "patientName": "Patient #1228",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1129",
    "appointmentId": "appt-seed-1129",
    "patientId": "pat-1229",
    "patientName": "Patient #1229",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 4,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1130",
    "appointmentId": "appt-seed-1130",
    "patientId": "pat-1230",
    "patientName": "Patient #1230",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Pooja Chitnis addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1131",
    "appointmentId": "appt-seed-1131",
    "patientId": "pat-1231",
    "patientName": "Patient #1231",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1132",
    "appointmentId": "appt-seed-1132",
    "patientId": "pat-1232",
    "patientName": "Patient #1232",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 4,
      "communication": 5,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Pooja Chitnis addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1133",
    "appointmentId": "appt-seed-1133",
    "patientId": "pat-1233",
    "patientName": "Patient #1233",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 5,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1134",
    "appointmentId": "appt-seed-1134",
    "patientId": "pat-1234",
    "patientName": "Patient #1234",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1135",
    "appointmentId": "appt-seed-1135",
    "patientId": "pat-1235",
    "patientName": "Patient #1235",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1136",
    "appointmentId": "appt-seed-1136",
    "patientId": "pat-1236",
    "patientName": "Patient #1236",
    "doctorId": "doc-13",
    "doctorName": "Dr. Pooja Chitnis",
    "specialization": "Psychiatry & Mental Health",
    "department": "Psychiatry & Mental Health",
    "facilityId": "hosp-aundh",
    "facilityName": "Aundh District Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 2,
      "communication": 2,
      "professionalism": 2,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 4,
      "facilityExperience": 4,
      "waitingQueueExperience": 3,
      "overallHospitalExperience": 2
    },
    "feedback": "Consultation felt rushed. The doctor barely spent two minutes discussing symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1137",
    "appointmentId": "appt-seed-1137",
    "patientId": "pat-1237",
    "patientName": "Patient #1237",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1138",
    "appointmentId": "appt-seed-1138",
    "patientId": "pat-1238",
    "patientName": "Patient #1238",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Vikram Ghorpade explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1139",
    "appointmentId": "appt-seed-1139",
    "patientId": "pat-1239",
    "patientName": "Patient #1239",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1140",
    "appointmentId": "appt-seed-1140",
    "patientId": "pat-1240",
    "patientName": "Patient #1240",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1141",
    "appointmentId": "appt-seed-1141",
    "patientId": "pat-1241",
    "patientName": "Patient #1241",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1142",
    "appointmentId": "appt-seed-1142",
    "patientId": "pat-1242",
    "patientName": "Patient #1242",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1143",
    "appointmentId": "appt-seed-1143",
    "patientId": "pat-1243",
    "patientName": "Patient #1243",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1144",
    "appointmentId": "appt-seed-1144",
    "patientId": "pat-1244",
    "patientName": "Patient #1244",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1145",
    "appointmentId": "appt-seed-1145",
    "patientId": "pat-1245",
    "patientName": "Patient #1245",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1146",
    "appointmentId": "appt-seed-1146",
    "patientId": "pat-1246",
    "patientName": "Patient #1246",
    "doctorId": "doc-14",
    "doctorName": "Dr. Vikram Ghorpade",
    "specialization": "Emergency & Critical Care",
    "department": "Emergency & Critical Care",
    "facilityId": "hosp-pune-district",
    "facilityName": "Pune District Civil Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 3,
      "staffProfessionalism": 3
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Vikram Ghorpade explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1147",
    "appointmentId": "appt-seed-1147",
    "patientId": "pat-1247",
    "patientName": "Patient #1247",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1148",
    "appointmentId": "appt-seed-1148",
    "patientId": "pat-1248",
    "patientName": "Patient #1248",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1149",
    "appointmentId": "appt-seed-1149",
    "patientId": "pat-1249",
    "patientName": "Patient #1249",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1150",
    "appointmentId": "appt-seed-1150",
    "patientId": "pat-1250",
    "patientName": "Patient #1250",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1151",
    "appointmentId": "appt-seed-1151",
    "patientId": "pat-1251",
    "patientName": "Patient #1251",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1152",
    "appointmentId": "appt-seed-1152",
    "patientId": "pat-1252",
    "patientName": "Patient #1252",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1153",
    "appointmentId": "appt-seed-1153",
    "patientId": "pat-1253",
    "patientName": "Patient #1253",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1154",
    "appointmentId": "appt-seed-1154",
    "patientId": "pat-1254",
    "patientName": "Patient #1254",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Kavita Shirodkar explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1155",
    "appointmentId": "appt-seed-1155",
    "patientId": "pat-1255",
    "patientName": "Patient #1255",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1156",
    "appointmentId": "appt-seed-1156",
    "patientId": "pat-1256",
    "patientName": "Patient #1256",
    "doctorId": "doc-15",
    "doctorName": "Dr. Kavita Shirodkar",
    "specialization": "Endocrinology & Diabetology",
    "department": "Endocrinology & Diabetology",
    "facilityId": "hosp-surya-sahyadri",
    "facilityName": "Surya Sahyadri Hospital",
    "district": "Pune",
    "state": "Maharashtra",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 5,
      "facilityExperience": 5,
      "waitingQueueExperience": 4,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1157",
    "appointmentId": "appt-seed-1157",
    "patientId": "pat-1257",
    "patientName": "Patient #1257",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1158",
    "appointmentId": "appt-seed-1158",
    "patientId": "pat-1258",
    "patientName": "Patient #1258",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Rajiv Malhotra explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1159",
    "appointmentId": "appt-seed-1159",
    "patientId": "pat-1259",
    "patientName": "Patient #1259",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1160",
    "appointmentId": "appt-seed-1160",
    "patientId": "pat-1260",
    "patientName": "Patient #1260",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1161",
    "appointmentId": "appt-seed-1161",
    "patientId": "pat-1261",
    "patientName": "Patient #1261",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 3,
      "communication": 3,
      "professionalism": 3,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "The doctor was competent, but explanation of the medicines could have been more detailed.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1162",
    "appointmentId": "appt-seed-1162",
    "patientId": "pat-1262",
    "patientName": "Patient #1262",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1163",
    "appointmentId": "appt-seed-1163",
    "patientId": "pat-1263",
    "patientName": "Patient #1263",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1164",
    "appointmentId": "appt-seed-1164",
    "patientId": "pat-1264",
    "patientName": "Patient #1264",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1165",
    "appointmentId": "appt-seed-1165",
    "patientId": "pat-1265",
    "patientName": "Patient #1265",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 4,
      "communication": 5,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Rajiv Malhotra addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1166",
    "appointmentId": "appt-seed-1166",
    "patientId": "pat-1266",
    "patientName": "Patient #1266",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1167",
    "appointmentId": "appt-seed-1167",
    "patientId": "pat-1267",
    "patientName": "Patient #1267",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-21",
    "tokenNumber": "OPD-110",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-21T11:20:00Z"
  },
  {
    "id": "rate-seed-1168",
    "appointmentId": "appt-seed-1168",
    "patientId": "pat-1268",
    "patientName": "Patient #1268",
    "doctorId": "doc-16",
    "doctorName": "Dr. Rajiv Malhotra",
    "specialization": "Cardiology",
    "department": "Cardiology",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-23",
    "tokenNumber": "OPD-111",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-23T11:21:00Z"
  },
  {
    "id": "rate-seed-1169",
    "appointmentId": "appt-seed-1169",
    "patientId": "pat-1269",
    "patientName": "Patient #1269",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1170",
    "appointmentId": "appt-seed-1170",
    "patientId": "pat-1270",
    "patientName": "Patient #1270",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1171",
    "appointmentId": "appt-seed-1171",
    "patientId": "pat-1271",
    "patientName": "Patient #1271",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1172",
    "appointmentId": "appt-seed-1172",
    "patientId": "pat-1272",
    "patientName": "Patient #1272",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1173",
    "appointmentId": "appt-seed-1173",
    "patientId": "pat-1273",
    "patientName": "Patient #1273",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1174",
    "appointmentId": "appt-seed-1174",
    "patientId": "pat-1274",
    "patientName": "Patient #1274",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 2,
      "communication": 2,
      "professionalism": 2,
      "explanationClarity": 2
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 2
    },
    "feedback": "Doctor seemed in a hurry. Did not explain why additional tests were ordered.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1175",
    "appointmentId": "appt-seed-1175",
    "patientId": "pat-1275",
    "patientName": "Patient #1275",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 5,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1176",
    "appointmentId": "appt-seed-1176",
    "patientId": "pat-1276",
    "patientName": "Patient #1276",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1177",
    "appointmentId": "appt-seed-1177",
    "patientId": "pat-1277",
    "patientName": "Patient #1277",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1178",
    "appointmentId": "appt-seed-1178",
    "patientId": "pat-1278",
    "patientName": "Patient #1278",
    "doctorId": "doc-17",
    "doctorName": "Dr. Shalini Verma",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 3,
      "communication": 3,
      "professionalism": 3,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "The doctor was competent, but explanation of the medicines could have been more detailed.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1179",
    "appointmentId": "appt-seed-1179",
    "patientId": "pat-1279",
    "patientName": "Patient #1279",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1180",
    "appointmentId": "appt-seed-1180",
    "patientId": "pat-1280",
    "patientName": "Patient #1280",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 4,
      "communication": 3,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Professional consultation and clear clinical diagnosis. Satisfied with the care provided.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1181",
    "appointmentId": "appt-seed-1181",
    "patientId": "pat-1281",
    "patientName": "Patient #1281",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 4,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Attentive physician. Explained the lab report findings and next review date well.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1182",
    "appointmentId": "appt-seed-1182",
    "patientId": "pat-1282",
    "patientName": "Patient #1282",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1183",
    "appointmentId": "appt-seed-1183",
    "patientId": "pat-1283",
    "patientName": "Patient #1283",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1184",
    "appointmentId": "appt-seed-1184",
    "patientId": "pat-1284",
    "patientName": "Patient #1284",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 3,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 3
    },
    "feedback": "The doctor was competent, but explanation of the medicines could have been more detailed.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1185",
    "appointmentId": "appt-seed-1185",
    "patientId": "pat-1285",
    "patientName": "Patient #1285",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1186",
    "appointmentId": "appt-seed-1186",
    "patientId": "pat-1286",
    "patientName": "Patient #1286",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1187",
    "appointmentId": "appt-seed-1187",
    "patientId": "pat-1287",
    "patientName": "Patient #1287",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 2,
      "communication": 2,
      "professionalism": 3,
      "explanationClarity": 1
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 2
    },
    "feedback": "Doctor seemed in a hurry. Did not explain why additional tests were ordered.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1188",
    "appointmentId": "appt-seed-1188",
    "patientId": "pat-1288",
    "patientName": "Patient #1288",
    "doctorId": "doc-18",
    "doctorName": "Dr. Harish Khanna",
    "specialization": "Orthopedics",
    "department": "Orthopedics",
    "facilityId": "hosp-ddu-delhi",
    "facilityName": "Deen Dayal Upadhyay Hospital",
    "district": "West Delhi",
    "state": "Delhi",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Harish Khanna explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1189",
    "appointmentId": "appt-seed-1189",
    "patientId": "pat-1289",
    "patientName": "Patient #1289",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1190",
    "appointmentId": "appt-seed-1190",
    "patientId": "pat-1290",
    "patientName": "Patient #1290",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1191",
    "appointmentId": "appt-seed-1191",
    "patientId": "pat-1291",
    "patientName": "Patient #1291",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1192",
    "appointmentId": "appt-seed-1192",
    "patientId": "pat-1292",
    "patientName": "Patient #1292",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 3
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Helpful and knowledgeable doctor. Prescribed effective medications with clear instructions.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1193",
    "appointmentId": "appt-seed-1193",
    "patientId": "pat-1293",
    "patientName": "Patient #1293",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Suresh Kumar addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1194",
    "appointmentId": "appt-seed-1194",
    "patientId": "pat-1294",
    "patientName": "Patient #1294",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Suresh Kumar explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1195",
    "appointmentId": "appt-seed-1195",
    "patientId": "pat-1295",
    "patientName": "Patient #1295",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1196",
    "appointmentId": "appt-seed-1196",
    "patientId": "pat-1296",
    "patientName": "Patient #1296",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1197",
    "appointmentId": "appt-seed-1197",
    "patientId": "pat-1297",
    "patientName": "Patient #1297",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 4,
      "communication": 5,
      "professionalism": 4,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Suresh Kumar addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1198",
    "appointmentId": "appt-seed-1198",
    "patientId": "pat-1298",
    "patientName": "Patient #1298",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 4,
      "communication": 4,
      "professionalism": 5,
      "explanationClarity": 4
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 4
    },
    "feedback": "Good consultation. Dr. Dr. Suresh Kumar addressed my health issue well, though waiting time at OPD was slightly long.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  },
  {
    "id": "rate-seed-1199",
    "appointmentId": "appt-seed-1199",
    "patientId": "pat-1299",
    "patientName": "Patient #1299",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-21",
    "tokenNumber": "OPD-110",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-21T11:20:00Z"
  },
  {
    "id": "rate-seed-1200",
    "appointmentId": "appt-seed-1200",
    "patientId": "pat-1000",
    "patientName": "Patient #1000",
    "doctorId": "doc-19",
    "doctorName": "Dr. Suresh Kumar",
    "specialization": "General Medicine",
    "department": "General Medicine",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-23",
    "tokenNumber": "OPD-111",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very reassuring consultation. Thorough physical examination and accurate prescription.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-23T11:21:00Z"
  },
  {
    "id": "rate-seed-1201",
    "appointmentId": "appt-seed-1201",
    "patientId": "pat-1001",
    "patientName": "Patient #1001",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-01",
    "tokenNumber": "OPD-100",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-01T11:10:00Z"
  },
  {
    "id": "rate-seed-1202",
    "appointmentId": "appt-seed-1202",
    "patientId": "pat-1002",
    "patientName": "Patient #1002",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-03",
    "tokenNumber": "OPD-101",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-03T11:11:00Z"
  },
  {
    "id": "rate-seed-1203",
    "appointmentId": "appt-seed-1203",
    "patientId": "pat-1003",
    "patientName": "Patient #1003",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-05",
    "tokenNumber": "OPD-102",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Outstanding bedside manner and empathy. Took time to address all my health concerns patiently.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-05T11:12:00Z"
  },
  {
    "id": "rate-seed-1204",
    "appointmentId": "appt-seed-1204",
    "patientId": "pat-1004",
    "patientName": "Patient #1004",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-07",
    "tokenNumber": "OPD-103",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-07T11:13:00Z"
  },
  {
    "id": "rate-seed-1205",
    "appointmentId": "appt-seed-1205",
    "patientId": "pat-1005",
    "patientName": "Patient #1005",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-09",
    "tokenNumber": "OPD-104",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Lakshmi Rao explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-09T11:14:00Z"
  },
  {
    "id": "rate-seed-1206",
    "appointmentId": "appt-seed-1206",
    "patientId": "pat-1006",
    "patientName": "Patient #1006",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-11",
    "tokenNumber": "OPD-105",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-11T11:15:00Z"
  },
  {
    "id": "rate-seed-1207",
    "appointmentId": "appt-seed-1207",
    "patientId": "pat-1007",
    "patientName": "Patient #1007",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-13",
    "tokenNumber": "OPD-106",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Lakshmi Rao explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-13T11:16:00Z"
  },
  {
    "id": "rate-seed-1208",
    "appointmentId": "appt-seed-1208",
    "patientId": "pat-1008",
    "patientName": "Patient #1008",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-15",
    "tokenNumber": "OPD-107",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Dr. Dr. Lakshmi Rao explained the treatment plan with exceptional clarity. Extremely polite and attentive to symptoms.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-15T11:17:00Z"
  },
  {
    "id": "rate-seed-1209",
    "appointmentId": "appt-seed-1209",
    "patientId": "pat-1009",
    "patientName": "Patient #1009",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-17",
    "tokenNumber": "OPD-108",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Very kind doctor. Answered all family questions regarding the diagnostic tests calmly.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-17T11:18:00Z"
  },
  {
    "id": "rate-seed-1210",
    "appointmentId": "appt-seed-1210",
    "patientId": "pat-1010",
    "patientName": "Patient #1010",
    "doctorId": "doc-20",
    "doctorName": "Dr. Lakshmi Rao",
    "specialization": "Pediatrics",
    "department": "Pediatrics",
    "facilityId": "hosp-victoria-bengaluru",
    "facilityName": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "visitDate": "2026-08-19",
    "tokenNumber": "OPD-109",
    "consultationRating": {
      "overallRating": 5,
      "communication": 5,
      "professionalism": 5,
      "explanationClarity": 5
    },
    "staffRating": {
      "staffHelpfulness": 4,
      "staffProfessionalism": 4
    },
    "facilityRating": {
      "cleanliness": 3,
      "facilityExperience": 3,
      "waitingQueueExperience": 2,
      "overallHospitalExperience": 5
    },
    "feedback": "Highly professional doctor. Medication dosage was explained clearly with lifestyle advice.",
    "isVerifiedVisit": true,
    "createdAt": "2026-08-19T11:19:00Z"
  }
];

class RatingService {
  private store = new StorageStore<PatientDoctorRating[]>('patient_doctor_ratings', INITIAL_RATINGS);

  public subscribe(listener: (data: PatientDoctorRating[]) => void): () => void {
    return this.store.subscribe(listener);
  }

  public getAllRatings(): PatientDoctorRating[] {
    return this.store.get();
  }

  public getRatingByAppointmentId(appointmentId: string): PatientDoctorRating | undefined {
    return this.store.get().find((r) => r.appointmentId === appointmentId);
  }

  public getRatingForAppointment(appointmentId: string): PatientDoctorRating | undefined {
    return this.getRatingByAppointmentId(appointmentId);
  }

  public getDoctorReviews(doctorId: string): PatientDoctorRating[] {
    return this.store.get().filter((r) => r.doctorId === doctorId);
  }

  public submitRating(ratingData: Omit<PatientDoctorRating, 'id' | 'createdAt'> & { appointmentStatus?: string }): PatientDoctorRating {
    // Validate that review cannot be submitted if appt.status !== 'Completed'
    if (ratingData.appointmentStatus && ratingData.appointmentStatus !== 'Completed') {
      throw new Error('Ratings can only be submitted for completed consultations.');
    }
    const existing = this.getRatingByAppointmentId(ratingData.appointmentId);
    if (existing) {
      return this.updateRating(existing.id, ratingData);
    }

    const newRating: PatientDoctorRating = {
      ...ratingData,
      id: `rating-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      isVerifiedVisit: true
    };

    this.store.set((prev) => [newRating, ...prev]);
    return newRating;
  }

  public updateRating(id: string, updateData: Partial<PatientDoctorRating>): PatientDoctorRating {
    let updatedRating: PatientDoctorRating | undefined;

    this.store.set((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedRating = {
            ...item,
            ...updateData,
            isEdited: true,
            updatedAt: new Date().toISOString()
          };
          return updatedRating;
        }
        return item;
      })
    );

    if (!updatedRating) {
      throw new Error(`Rating with ID ${id} not found.`);
    }
    return updatedRating;
  }

  public getAllDoctorProfiles(district?: string): DoctorAuditMetric[] {
    const allRatings = this.store.get();
    const docMap = new Map<string, DoctorSeedTuple>();
    
    SEEDED_DOCTORS.forEach((d) => {
      docMap.set(d[0], d);
    });

    // Include any new doctor IDs found in ratings
    allRatings.forEach((r) => {
      if (!docMap.has(r.doctorId)) {
        docMap.set(r.doctorId, [
          r.doctorId,
          r.doctorName,
          r.specialization || r.department,
          r.facilityId,
          r.facilityName,
          r.district,
          r.state,
          10,
          100,
          4.5,
          'stable',
          0.0
        ]);
      }
    });

    const metrics: DoctorAuditMetric[] = [];

    docMap.forEach(([docId, docName, spec, hospId, hospName, docDist, state, exp, visits, fallbackRating, trend, delta]) => {
      if (district && docDist.toLowerCase() !== district.toLowerCase() && district.toLowerCase() !== 'all') {
        return;
      }

      const docRatings = allRatings.filter((r) => r.doctorId === docId);
      const totalRatings = docRatings.length;

      let avgOverall = fallbackRating;
      let avgComm = fallbackRating;
      let avgProf = fallbackRating;
      let avgExpl = fallbackRating;
      let staffHelp = 4.2;
      let staffProf = 4.3;
      let cleanAvg = 4.4;
      let queueAvg = 3.8;

      const distCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      if (totalRatings > 0) {
        let sumOverall = 0;
        let sumComm = 0;
        let sumProf = 0;
        let sumExpl = 0;
        let sumStaffHelp = 0;
        let sumStaffProf = 0;
        let sumClean = 0;
        let sumQueue = 0;

        docRatings.forEach((r) => {
          const score = Math.round(r.consultationRating.overallRating);
          if (score >= 1 && score <= 5) {
            distCount[score as keyof typeof distCount]++;
          }
          sumOverall += r.consultationRating.overallRating;
          sumComm += r.consultationRating.communication;
          sumProf += r.consultationRating.professionalism;
          sumExpl += r.consultationRating.explanationClarity;

          sumStaffHelp += r.staffRating.staffHelpfulness;
          sumStaffProf += r.staffRating.staffProfessionalism;
          sumClean += r.facilityRating.cleanliness;
          sumQueue += r.facilityRating.waitingQueueExperience;
        });

        avgOverall = Number((sumOverall / totalRatings).toFixed(2));
        avgComm = Number((sumComm / totalRatings).toFixed(2));
        avgProf = Number((sumProf / totalRatings).toFixed(2));
        avgExpl = Number((sumExpl / totalRatings).toFixed(2));
        staffHelp = Number((sumStaffHelp / totalRatings).toFixed(2));
        staffProf = Number((sumStaffProf / totalRatings).toFixed(2));
        cleanAvg = Number((sumClean / totalRatings).toFixed(2));
        queueAvg = Number((sumQueue / totalRatings).toFixed(2));
      } else {
        distCount[5] = 4;
        distCount[4] = 2;
      }

      let perfStatus: 'benchmark_exceeded' | 'satisfactory' | 'attention_required' = 'satisfactory';
      if (avgOverall >= 4.7) {
        perfStatus = 'benchmark_exceeded';
      } else if (avgOverall < 3.8) {
        perfStatus = 'attention_required';
      }

      const recentFeedbacks = docRatings.map((r) => ({
        id: r.id,
        patientId: r.patientId,
        patientAlias: r.patientName || `Patient #${r.patientId.slice(-4)}`,
        date: r.visitDate || r.createdAt.split('T')[0],
        rating: r.consultationRating.overallRating,
        communication: r.consultationRating.communication,
        professionalism: r.consultationRating.professionalism,
        explanation: r.consultationRating.explanationClarity,
        feedback: r.feedback || 'Consultation verified by patient.',
        isVerifiedVisit: r.isVerifiedVisit ?? true
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      metrics.push({
        doctorId: docId,
        doctorName: docName,
        avatar: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80`,
        specialization: spec,
        department: spec,
        facilityId: hospId,
        facilityName: hospName,
        district: docDist,
        state: state,
        experienceYears: exp,
        totalCompletedVisits: visits + totalRatings,
        totalRatings: totalRatings,
        averageOverall: avgOverall,
        averageCommunication: avgComm,
        averageProfessionalism: avgProf,
        averageExplanation: avgExpl,
        staffHelpfulnessAvg: staffHelp,
        staffProfessionalismAvg: staffProf,
        cleanlinessAvg: cleanAvg,
        waitingQueueAvg: queueAvg,
        satisfactionTrend: trend as 'up' | 'down' | 'stable',
        trendDelta: delta,
        performanceStatus: perfStatus,
        ratingDistribution: distCount,
        isLimitedSampleSize: totalRatings < 5,
        trendPercentage: Math.round(delta * 10),
        recentFeedbacks: recentFeedbacks
      });
    });

    return metrics.sort((a, b) => b.averageOverall - a.averageOverall);
  }

  public getDoctorProfileById(doctorId: string): DoctorAuditMetric | null {
    const profiles = this.getAllDoctorProfiles();
    return profiles.find((p) => p.doctorId === doctorId) || null;
  }

  public getBestPerformingDoctor(district?: string): DoctorAuditMetric | null {
    const profiles = this.getAllDoctorProfiles(district).filter((p) => p.totalRatings >= 3);
    if (profiles.length === 0) return null;
    return profiles.reduce((best, curr) => (curr.averageOverall > best.averageOverall ? curr : best), profiles[0]);
  }

  public getLowestPerformingDoctor(district?: string): DoctorAuditMetric | null {
    const profiles = this.getAllDoctorProfiles(district).filter((p) => p.totalRatings >= 3);
    if (profiles.length === 0) return null;
    return profiles.reduce((worst, curr) => (curr.averageOverall < worst.averageOverall ? curr : worst), profiles[0]);
  }

  public getHospitalPerformanceProfiles(district?: string): HospitalAuditMetric[] {
    const allDoctors = this.getAllDoctorProfiles(district);
    const hospMap = new Map<string, DoctorAuditMetric[]>();

    allDoctors.forEach((doc) => {
      const list = hospMap.get(doc.facilityId) || [];
      list.push(doc);
      hospMap.set(doc.facilityId, list);
    });

    const hospitalMetrics: HospitalAuditMetric[] = [];

    hospMap.forEach((doctors, facilityId) => {
      const firstDoc = doctors[0];
      const totalRatings = doctors.reduce((acc, d) => acc + d.totalRatings, 0);
      const totalVisits = doctors.reduce((acc, d) => acc + d.totalCompletedVisits, 0);

      const avgDocCare = totalRatings > 0
        ? Number((doctors.reduce((acc, d) => acc + d.averageOverall * d.totalRatings, 0) / totalRatings).toFixed(2))
        : 4.5;
      const avgStaff = totalRatings > 0
        ? Number((doctors.reduce((acc, d) => acc + d.staffHelpfulnessAvg * d.totalRatings, 0) / totalRatings).toFixed(2))
        : 4.2;
      const avgClean = totalRatings > 0
        ? Number((doctors.reduce((acc, d) => acc + d.cleanlinessAvg * d.totalRatings, 0) / totalRatings).toFixed(2))
        : 4.3;
      const avgQueue = totalRatings > 0
        ? Number((doctors.reduce((acc, d) => acc + d.waitingQueueAvg * d.totalRatings, 0) / totalRatings).toFixed(2))
        : 3.6;

      const overall = Number(((avgDocCare * 0.4) + (avgStaff * 0.2) + (avgClean * 0.2) + (avgQueue * 0.2)).toFixed(2));

      const warnings: QualityWarning[] = [];
      if (avgClean < 3.8) {
        warnings.push({
          id: `warn-clean-${facilityId}`,
          facilityId,
          facilityName: firstDoc.facilityName,
          category: 'Cleanliness',
          currentScore: avgClean,
          benchmarkScore: 3.8,
          severity: avgClean < 3.0 ? 'critical' : 'warning',
          message: `Cleanliness score (${avgClean}/5.0) is below district target (3.8).`
        });
      }
      if (avgQueue < 3.8) {
        warnings.push({
          id: `warn-queue-${facilityId}`,
          facilityId,
          facilityName: firstDoc.facilityName,
          category: 'Waiting Queue',
          currentScore: avgQueue,
          benchmarkScore: 3.8,
          severity: avgQueue < 3.0 ? 'critical' : 'warning',
          message: `OPD Queue satisfaction (${avgQueue}/5.0) indicates significant waiting bottleneck.`
        });
      }

      hospitalMetrics.push({
        facilityId,
        facilityName: firstDoc.facilityName,
        district: firstDoc.district,
        state: firstDoc.state,
        totalCompletedVisits: totalVisits,
        totalRatings: totalRatings,
        participationRate: totalVisits > 0 ? Math.round((totalRatings / totalVisits) * 100) : 15,
        overallHospitalRating: overall,
        doctorExperienceAverage: avgDocCare,
        staffAverage: avgStaff,
        cleanlinessAverage: avgClean,
        waitingExperienceAverage: avgQueue,
        doctorCount: doctors.length,
        doctorMetrics: doctors,
        qualityWarnings: warnings
      });
    });

    return hospitalMetrics.sort((a, b) => b.overallHospitalRating - a.overallHospitalRating);
  }

  public getHospitalAudit(facilityId: string, facilityName?: string): HospitalAuditMetric | null {
    const allHospitals = this.getHospitalPerformanceProfiles();
    const found = allHospitals.find((h) => h.facilityId === facilityId);
    if (found) return found;

    return {
      facilityId,
      facilityName: facilityName || 'Hospital Facility',
      district: 'Pune',
      state: 'Maharashtra',
      totalCompletedVisits: 150,
      totalRatings: 18,
      participationRate: 12,
      overallHospitalRating: 4.5,
      doctorExperienceAverage: 4.6,
      staffAverage: 4.3,
      cleanlinessAverage: 4.4,
      waitingExperienceAverage: 3.9,
      doctorCount: 4,
      doctorMetrics: this.getAllDoctorProfiles().filter((d) => d.facilityId === facilityId),
      qualityWarnings: []
    };
  }

  public getQualityWarnings(district: string = 'Pune'): QualityWarning[] {
    return this.getHospitalPerformanceProfiles(district).flatMap((h) => h.qualityWarnings);
  }

  public getDistrictAudit(district: string = 'Pune', state: string = 'Maharashtra'): DistrictAuditSummary {
    return this.getDistrictAuditSummary(district, state);
  }

  public getDistrictAuditSummary(district: string = 'Pune', state: string = 'Maharashtra'): DistrictAuditSummary {
    const hospitalAudits = this.getHospitalPerformanceProfiles(district);
    const topDoctors = this.getAllDoctorProfiles(district);

    const totalRatings = topDoctors.reduce((acc, d) => acc + d.totalRatings, 0);
    const totalVisits = topDoctors.reduce((acc, d) => acc + d.totalCompletedVisits, 0);

    const docAvg = totalRatings > 0
      ? Number((topDoctors.reduce((acc, d) => acc + d.averageOverall * d.totalRatings, 0) / totalRatings).toFixed(2))
      : 4.6;
    const staffAvg = totalRatings > 0
      ? Number((topDoctors.reduce((acc, d) => acc + d.staffHelpfulnessAvg * d.totalRatings, 0) / totalRatings).toFixed(2))
      : 4.2;
    const cleanAvg = totalRatings > 0
      ? Number((topDoctors.reduce((acc, d) => acc + d.cleanlinessAvg * d.totalRatings, 0) / totalRatings).toFixed(2))
      : 4.3;
    const waitAvg = totalRatings > 0
      ? Number((topDoctors.reduce((acc, d) => acc + d.waitingQueueAvg * d.totalRatings, 0) / totalRatings).toFixed(2))
      : 3.7;

    const overallDist = Number(((docAvg * 0.4) + (staffAvg * 0.2) + (cleanAvg * 0.2) + (waitAvg * 0.2)).toFixed(2));

    const allFeedbacks: DistrictAuditSummary['recentFeedbacks'] = [];
    topDoctors.forEach((doc) => {
      doc.recentFeedbacks.forEach((fb) => {
        allFeedbacks.push({
          id: fb.id,
          doctorName: doc.doctorName,
          department: doc.department,
          facilityName: doc.facilityName,
          date: fb.date,
          rating: fb.rating,
          feedback: fb.feedback
        });
      });
    });
    allFeedbacks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const allWarnings = hospitalAudits.flatMap((h) => h.qualityWarnings);

    return {
      district,
      state,
      totalDistrictRatings: totalRatings,
      totalCompletedVisits: totalVisits,
      overallDistrictRating: overallDist,
      doctorExperienceAverage: docAvg,
      staffAverage: staffAvg,
      cleanlinessAverage: cleanAvg,
      waitingExperienceAverage: waitAvg,
      hospitalAudits,
      topDoctors,
      bestDoctor: this.getBestPerformingDoctor(district),
      lowestDoctor: this.getLowestPerformingDoctor(district),
      recentFeedbacks: allFeedbacks.slice(0, 20),
      qualityWarnings: allWarnings
    };
  }
}

export const ratingService = new RatingService();
