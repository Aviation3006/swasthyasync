import { Hospital, QueueItem, QueueStatus } from '../types/hospital';
import { mockHospitals } from '../data/hospitals';
import { StorageStore } from '../utils/storage';

const initialQueueItems: QueueItem[] = [
  {
    id: 'q-01',
    tokenNumber: 'P-104-01',
    patientId: 'pat-mh-002',
    patientName: 'Priya Sachin Shinde',
    patientAge: 32,
    patientGender: 'Female',
    patientPhone: '+91 97651 88201',
    departmentId: 'dept-obgyn',
    departmentName: 'Obstetrics & Gynecology',
    doctorId: 'doc-04',
    doctorName: 'Dr. Smita Kulkarni',
    checkInTime: '08:45 AM',
    status: 'In Consultation',
    priority: 'Maternal',
    chiefComplaint: 'ANC 3rd Trimester ultrasound report and thyroid test review',
    vitalsSnapshot: {
      bp: '116/76',
      pulse: 80,
      spO2: 99,
      temp: 98.6
    }
  },
  {
    id: 'q-02',
    tokenNumber: 'P-108-02',
    patientId: 'pat-mh-004',
    patientName: 'Aarav Rahul More (Child)',
    patientAge: 5,
    patientGender: 'Male',
    patientPhone: '+91 98811 44520',
    departmentId: 'dept-pediatrics',
    departmentName: 'Pediatrics & Neonatology',
    doctorId: 'doc-03',
    doctorName: 'Dr. Rohini Gaikwad',
    checkInTime: '09:05 AM',
    status: 'Waiting',
    priority: 'Urgent',
    chiefComplaint: 'High fever 100.4 F and wheezing cough past 2 days',
    vitalsSnapshot: {
      bp: '98/64',
      pulse: 98,
      spO2: 99,
      temp: 100.4
    }
  },
  {
    id: 'q-03',
    tokenNumber: 'P-104-08',
    patientId: 'pat-mh-001',
    patientName: 'Rameshwar B. Jadhav',
    patientAge: 48,
    patientGender: 'Male',
    patientPhone: '+91 98224 51902',
    departmentId: 'dept-gen-med',
    departmentName: 'General Medicine',
    doctorId: 'doc-01',
    doctorName: 'Dr. Anjali Deshmukh',
    checkInTime: '09:15 AM',
    status: 'Waiting',
    priority: 'Normal',
    chiefComplaint: 'Quarterly routine review for Diabetes and Hypertension',
    vitalsSnapshot: {
      bp: '128/84',
      pulse: 74,
      spO2: 98,
      temp: 98.4
    }
  },
  {
    id: 'q-04',
    tokenNumber: 'P-104-12',
    patientId: 'pat-mh-003',
    patientName: 'Vitthal Tukaram Kale',
    patientAge: 66,
    patientGender: 'Male',
    patientPhone: '+91 94230 19482',
    departmentId: 'dept-gen-med',
    departmentName: 'General Medicine',
    doctorId: 'doc-01',
    doctorName: 'Dr. Anjali Deshmukh',
    checkInTime: '09:30 AM',
    status: 'Waiting',
    priority: 'Senior Citizen',
    chiefComplaint: 'COPD exacerbation with shortness of breath while walking',
    vitalsSnapshot: {
      bp: '144/92',
      pulse: 82,
      spO2: 96,
      temp: 99.1
    }
  },
  {
    id: 'q-05',
    tokenNumber: 'P-202-01',
    patientId: 'pat-mh-005',
    patientName: 'Shantabai S. Patil',
    patientAge: 71,
    patientGender: 'Female',
    patientPhone: '+91 98900 11223',
    departmentId: 'dept-cardio',
    departmentName: 'Cardiology',
    doctorId: 'doc-02',
    doctorName: 'Dr. Rajesh Shinde',
    checkInTime: '08:15 AM',
    status: 'Completed',
    priority: 'Senior Citizen',
    chiefComplaint: 'Post-angioplasty 6-month routine review',
    vitalsSnapshot: {
      bp: '130/80',
      pulse: 68,
      spO2: 98,
      temp: 98.2
    }
  }
];

const hospitalStore = new StorageStore<Hospital[]>('hospitals', mockHospitals);
const queueStore = new StorageStore<QueueItem[]>('hospital_queue', initialQueueItems);

export const hospitalService = {
  getAllHospitals(): Hospital[] {
    return hospitalStore.get();
  },

  getHospitalById(id: string): Hospital | undefined {
    return hospitalStore.get().find((h) => h.id === id);
  },

  getDefaultHospital(): Hospital {
    return hospitalStore.get()[0] || mockHospitals[0];
  },

  getQueue(hospitalId?: string): QueueItem[] {
    return queueStore.get();
  },

  updateQueueItemStatus(itemId: string, newStatus: QueueStatus): QueueItem {
    let updated: QueueItem | undefined;
    queueStore.set((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          updated = { ...item, status: newStatus };
          return updated;
        }
        return item;
      })
    );
    if (!updated) throw new Error('Queue item not found');
    return updated;
  },

  addToQueue(item: Omit<QueueItem, 'id'>): QueueItem {
    const newItem: QueueItem = {
      ...item,
      id: `q-${Date.now()}`
    };
    queueStore.set((prev) => [newItem, ...prev]);
    return newItem;
  },

  subscribeQueue(listener: (queue: QueueItem[]) => void): () => void {
    return queueStore.subscribe(listener);
  },

  subscribeHospitals(listener: (hospitals: Hospital[]) => void): () => void {
    return hospitalStore.subscribe(listener);
  }
};
