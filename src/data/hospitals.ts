import { Hospital } from '../types/hospital';

export const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// Default District Coordinates for Simulation Centers
export const DEFAULT_PUNE_COORDINATES = {
  lat: 18.5580,
  lng: 73.8070
};

export const DEFAULT_DELHI_COORDINATES = {
  lat: 28.6280,
  lng: 77.1060
};

export const DEFAULT_BENGALURU_COORDINATES = {
  lat: 12.9716,
  lng: 77.5946
};

export const mockHospitals: Hospital[] = [
  // 1. Surya Sahyadri Hospital (Pune - 1.2 km)
  {
    id: 'hosp-pune-surya',
    name: 'Surya Sahyadri Hospital',
    facilityType: 'Teaching & Multispecialty Hospital',
    district: 'Pune',
    taluka: 'Haveli',
    pincode: '411030',
    contactNumber: '+91 20 6727 1111',
    emergencyHelpline: '108 / +91 20 6727 1999',
    address: '1317, Sadashiv Peth, Near Alka Talkies, Pune 411030',
    operationalStatus: 'Normal',
    ambulanceAvailable: 4,
    bloodBankUnitsAvailable: 110,
    lastSyncTime: '2026-08-23T08:15:00',
    coordinates: {
      lat: 18.5510,
      lng: 73.8120
    },
    beds: {
      generalTotal: 150,
      generalOccupied: 95,
      icuTotal: 25,
      icuOccupied: 18,
      oxygenTotal: 50,
      oxygenOccupied: 30,
      maternityTotal: 20,
      maternityOccupied: 12,
      pediatricTotal: 15,
      pediatricOccupied: 8
    },
    departments: [
      {
        id: 'dept-surya-gen',
        name: 'General Medicine',
        code: 'GEN-MED',
        headDoctor: 'Dr. Rahul Joshi',
        activeDoctors: 3,
        availableBeds: 15,
        totalBeds: 40,
        waitingQueueCount: 4
      },
      {
        id: 'dept-surya-cardio',
        name: 'Cardiology',
        code: 'CARDIO',
        headDoctor: 'Dr. Vivek Soman',
        activeDoctors: 2,
        availableBeds: 8,
        totalBeds: 20,
        waitingQueueCount: 3
      },
      {
        id: 'dept-surya-emerg',
        name: 'Emergency & Trauma Care',
        code: 'EMERG',
        headDoctor: 'Dr. Meera Iyer',
        activeDoctors: 4,
        availableBeds: 12,
        totalBeds: 25,
        waitingQueueCount: 2
      }
    ],
    doctors: [
      {
        id: 'doc-surya-01',
        name: 'Dr. Rahul Joshi',
        specialization: 'General Medicine & Critical Care',
        departmentId: 'dept-surya-gen',
        departmentName: 'General Medicine',
        roomNumber: 'OPD 101',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        consultationHours: '09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM',
        currentQueueCount: 4,
        averageConsultationTimeMin: 12,
        status: 'On Duty',
        rating: 4.8,
        totalConsultationsToday: 16
      },
      {
        id: 'doc-surya-02',
        name: 'Dr. Vivek Soman',
        specialization: 'Interventional Cardiology',
        departmentId: 'dept-surya-cardio',
        departmentName: 'Cardiology',
        roomNumber: 'OPD 105',
        availableDays: ['Mon', 'Wed', 'Fri'],
        consultationHours: '10:00 AM - 02:00 PM',
        currentQueueCount: 3,
        averageConsultationTimeMin: 15,
        status: 'On Duty',
        rating: 4.9,
        totalConsultationsToday: 11
      }
    ]
  },

  // 2. Aundh District Hospital (Pune - 2.4 km)
  {
    id: 'hosp-pune-01',
    name: 'Aundh District Hospital',
    facilityType: 'District Hospital',
    district: 'Pune',
    taluka: 'Haveli',
    pincode: '411027',
    contactNumber: '+91 20 2728 0122',
    emergencyHelpline: '108 / +91 20 2728 0999',
    address: 'Near Bremen Chowk, Aundh, Pune 411027',
    operationalStatus: 'Normal',
    ambulanceAvailable: 6,
    bloodBankUnitsAvailable: 142,
    lastSyncTime: '2026-08-23T08:15:00',
    coordinates: {
      lat: 18.5583,
      lng: 73.8077
    },
    beds: {
      generalTotal: 300,
      generalOccupied: 228,
      icuTotal: 30,
      icuOccupied: 24,
      oxygenTotal: 80,
      oxygenOccupied: 58,
      maternityTotal: 40,
      maternityOccupied: 32,
      pediatricTotal: 30,
      pediatricOccupied: 19
    },
    departments: [
      {
        id: 'dept-gen-med',
        name: 'General Medicine',
        code: 'GEN-MED',
        headDoctor: 'Dr. Anjali Deshmukh',
        activeDoctors: 4,
        availableBeds: 18,
        totalBeds: 70,
        waitingQueueCount: 8
      },
      {
        id: 'dept-cardio',
        name: 'Cardiology',
        code: 'CARDIO',
        headDoctor: 'Dr. Rajesh Shinde',
        activeDoctors: 2,
        availableBeds: 6,
        totalBeds: 25,
        waitingQueueCount: 4
      },
      {
        id: 'dept-pediatrics',
        name: 'Pediatrics & Neonatology',
        code: 'PED',
        headDoctor: 'Dr. Rohini Gaikwad',
        activeDoctors: 3,
        availableBeds: 11,
        totalBeds: 30,
        waitingQueueCount: 5
      }
    ],
    doctors: [
      {
        id: 'doc-01',
        name: 'Dr. Anjali Deshmukh',
        specialization: 'MD - General Medicine, Diabetology',
        departmentId: 'dept-gen-med',
        departmentName: 'General Medicine',
        roomNumber: 'OPD Room 4',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        consultationHours: '09:00 AM - 01:00 PM, 03:00 PM - 05:00 PM',
        currentQueueCount: 6,
        averageConsultationTimeMin: 10,
        status: 'On Duty',
        rating: 4.8,
        totalConsultationsToday: 24
      },
      {
        id: 'doc-02',
        name: 'Dr. Rajesh Shinde',
        specialization: 'MD, DM - Cardiology',
        departmentId: 'dept-cardio',
        departmentName: 'Cardiology',
        roomNumber: 'OPD Room 8',
        availableDays: ['Mon', 'Wed', 'Fri'],
        consultationHours: '10:00 AM - 02:00 PM',
        currentQueueCount: 4,
        averageConsultationTimeMin: 15,
        status: 'On Duty',
        rating: 4.9,
        totalConsultationsToday: 14
      }
    ]
  },

  // 3. Manish Clinic (Pune - 3.1 km)
  {
    id: 'hosp-pune-manish',
    name: 'Manish Clinic',
    facilityType: 'Community Health Centre (CHC)',
    district: 'Pune',
    taluka: 'Haveli',
    pincode: '411007',
    contactNumber: '+91 20 2565 4321',
    emergencyHelpline: '108',
    address: 'University Road, Ganeshkhind, Pune 411007',
    operationalStatus: 'Normal',
    ambulanceAvailable: 1,
    bloodBankUnitsAvailable: 20,
    lastSyncTime: '2026-08-23T08:15:00',
    coordinates: {
      lat: 18.5420,
      lng: 73.8240
    },
    beds: {
      generalTotal: 30,
      generalOccupied: 12,
      icuTotal: 4,
      icuOccupied: 2,
      oxygenTotal: 10,
      oxygenOccupied: 4,
      maternityTotal: 5,
      maternityOccupied: 2,
      pediatricTotal: 5,
      pediatricOccupied: 1
    },
    departments: [
      {
        id: 'dept-manish-gen',
        name: 'Family Practice & General OPD',
        code: 'FAM-MED',
        headDoctor: 'Dr. Manish Kulkarni',
        activeDoctors: 2,
        availableBeds: 10,
        totalBeds: 20,
        waitingQueueCount: 3
      }
    ],
    doctors: [
      {
        id: 'doc-manish-01',
        name: 'Dr. Manish Kulkarni',
        specialization: 'MBBS, DNB - Family Medicine',
        departmentId: 'dept-manish-gen',
        departmentName: 'Family Practice & General OPD',
        roomNumber: 'Consultation Suite 1',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        consultationHours: '08:30 AM - 01:30 PM, 05:00 PM - 08:30 PM',
        currentQueueCount: 3,
        averageConsultationTimeMin: 8,
        status: 'On Duty',
        rating: 4.7,
        totalConsultationsToday: 18
      }
    ]
  },

  // 4. Sancheti Orthopedic Hospital (Pune - 4.8 km)
  {
    id: 'hosp-pune-sancheti',
    name: 'Sancheti Hospital for Orthopedics',
    facilityType: 'Specialty Hospital',
    district: 'Pune',
    taluka: 'Haveli',
    pincode: '411005',
    contactNumber: '+91 20 2899 9999',
    emergencyHelpline: '108 / +91 20 2899 9108',
    address: '16, Shivajinagar, Pune 411005',
    operationalStatus: 'Normal',
    ambulanceAvailable: 5,
    bloodBankUnitsAvailable: 95,
    lastSyncTime: '2026-08-23T08:15:00',
    coordinates: {
      lat: 18.5312,
      lng: 73.8490
    },
    beds: {
      generalTotal: 180,
      generalOccupied: 140,
      icuTotal: 20,
      icuOccupied: 14,
      oxygenTotal: 40,
      oxygenOccupied: 28,
      maternityTotal: 0,
      maternityOccupied: 0,
      pediatricTotal: 15,
      pediatricOccupied: 10
    },
    departments: [
      {
        id: 'dept-sancheti-ortho',
        name: 'Orthopedics & Joint Replacement',
        code: 'ORTHO',
        headDoctor: 'Dr. Parag Sancheti',
        activeDoctors: 6,
        availableBeds: 24,
        totalBeds: 100,
        waitingQueueCount: 6
      }
    ],
    doctors: [
      {
        id: 'doc-sancheti-01',
        name: 'Dr. Parag Sancheti',
        specialization: 'MS (Ortho), Joint Reconstruction',
        departmentId: 'dept-sancheti-ortho',
        departmentName: 'Orthopedics & Joint Replacement',
        roomNumber: 'Suite 201',
        availableDays: ['Tue', 'Thu', 'Sat'],
        consultationHours: '10:00 AM - 02:00 PM',
        currentQueueCount: 5,
        averageConsultationTimeMin: 15,
        status: 'On Duty',
        rating: 4.9,
        totalConsultationsToday: 20
      }
    ]
  },

  // 5. Deen Dayal Upadhyay Hospital (Delhi - West Delhi)
  {
    id: 'hosp-delhi-01',
    name: 'Deen Dayal Upadhyay Hospital (DDU)',
    facilityType: 'District Hospital',
    district: 'West Delhi',
    taluka: 'Rajouri Garden',
    pincode: '110064',
    contactNumber: '+91 11 2549 4402',
    emergencyHelpline: '108 / +91 11 2549 4400',
    address: 'Clock Tower, Hari Nagar, West Delhi 110064',
    operationalStatus: 'Normal',
    ambulanceAvailable: 7,
    bloodBankUnitsAvailable: 160,
    lastSyncTime: '2026-08-23T08:15:00',
    coordinates: {
      lat: 28.6288,
      lng: 77.1065
    },
    beds: {
      generalTotal: 640,
      generalOccupied: 512,
      icuTotal: 48,
      icuOccupied: 40,
      oxygenTotal: 120,
      oxygenOccupied: 95,
      maternityTotal: 60,
      maternityOccupied: 50,
      pediatricTotal: 50,
      pediatricOccupied: 38
    },
    departments: [
      {
        id: 'dept-ddu-gen',
        name: 'General Medicine',
        code: 'GEN-MED',
        headDoctor: 'Dr. Rajiv Malhotra',
        activeDoctors: 5,
        availableBeds: 28,
        totalBeds: 120,
        waitingQueueCount: 9
      },
      {
        id: 'dept-ddu-ortho',
        name: 'Orthopedics',
        code: 'ORTHO',
        headDoctor: 'Dr. Sunita Verma',
        activeDoctors: 3,
        availableBeds: 14,
        totalBeds: 60,
        waitingQueueCount: 5
      }
    ],
    doctors: [
      {
        id: 'doc-del-01',
        name: 'Dr. Rajiv Malhotra',
        specialization: 'MD - Internal Medicine',
        departmentId: 'dept-ddu-gen',
        departmentName: 'General Medicine',
        roomNumber: 'OPD Room 12',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        consultationHours: '09:00 AM - 02:00 PM',
        currentQueueCount: 7,
        averageConsultationTimeMin: 10,
        status: 'On Duty',
        rating: 4.8,
        totalConsultationsToday: 26
      },
      {
        id: 'doc-del-02',
        name: 'Dr. Sunita Verma',
        specialization: 'MS - Orthopedic Surgery',
        departmentId: 'dept-ddu-ortho',
        departmentName: 'Orthopedics',
        roomNumber: 'OPD Room 16',
        availableDays: ['Mon', 'Wed', 'Fri'],
        consultationHours: '09:30 AM - 01:30 PM',
        currentQueueCount: 5,
        averageConsultationTimeMin: 12,
        status: 'On Duty',
        rating: 4.7,
        totalConsultationsToday: 18
      }
    ]
  },

  // 6. Victoria Hospital & BMCRI (Bengaluru Urban)
  {
    id: 'hosp-ka-01',
    name: 'Victoria Hospital & BMCRI',
    facilityType: 'Teaching & Multispecialty Hospital',
    district: 'Bengaluru Urban',
    taluka: 'Bengaluru South',
    pincode: '560002',
    contactNumber: '+91 80 2670 1150',
    emergencyHelpline: '108 / +91 80 2670 1155',
    address: 'Fort Road, Near City Market, Kalasipalya, Bengaluru 560002',
    operationalStatus: 'Normal',
    ambulanceAvailable: 8,
    bloodBankUnitsAvailable: 190,
    lastSyncTime: '2026-08-23T08:15:00',
    coordinates: {
      lat: 12.9629,
      lng: 77.5753
    },
    beds: {
      generalTotal: 750,
      generalOccupied: 610,
      icuTotal: 60,
      icuOccupied: 52,
      oxygenTotal: 150,
      oxygenOccupied: 120,
      maternityTotal: 70,
      maternityOccupied: 55,
      pediatricTotal: 60,
      pediatricOccupied: 45
    },
    departments: [
      {
        id: 'dept-vic-gen',
        name: 'General Medicine',
        code: 'GEN-MED',
        headDoctor: 'Dr. Suresh Kumar',
        activeDoctors: 6,
        availableBeds: 35,
        totalBeds: 150,
        waitingQueueCount: 10
      },
      {
        id: 'dept-vic-cardio',
        name: 'Cardiology & Emergency',
        code: 'CARDIO',
        headDoctor: 'Dr. Nandini Rao',
        activeDoctors: 4,
        availableBeds: 16,
        totalBeds: 60,
        waitingQueueCount: 6
      }
    ],
    doctors: [
      {
        id: 'doc-ka-01',
        name: 'Dr. Suresh Kumar',
        specialization: 'MD - General Medicine',
        departmentId: 'dept-vic-gen',
        departmentName: 'General Medicine',
        roomNumber: 'Room 5, Main OPD Block',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        consultationHours: '09:00 AM - 01:00 PM',
        currentQueueCount: 8,
        averageConsultationTimeMin: 10,
        status: 'On Duty',
        rating: 4.9,
        totalConsultationsToday: 30
      },
      {
        id: 'doc-ka-02',
        name: 'Dr. Nandini Rao',
        specialization: 'DM - Cardiology',
        departmentId: 'dept-vic-cardio',
        departmentName: 'Cardiology & Emergency',
        roomNumber: 'Room 9, Super Specialty Block',
        availableDays: ['Mon', 'Wed', 'Fri'],
        consultationHours: '10:00 AM - 02:00 PM',
        currentQueueCount: 5,
        averageConsultationTimeMin: 15,
        status: 'On Duty',
        rating: 4.8,
        totalConsultationsToday: 16
      }
    ]
  }
];

export const getHospitalById = (id: string): Hospital | undefined => {
  return mockHospitals.find((h) => h.id === id);
};

export const getHospitalsByDistrict = (district: string): Hospital[] => {
  return mockHospitals.filter((h) => h.district.toLowerCase() === district.toLowerCase());
};
