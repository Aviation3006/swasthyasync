import { Prescription } from '../types/prescriptions';
import { initialPrescriptions } from '../data/prescriptions';
import { StorageStore } from '../utils/storage';
import { notificationService } from './notificationService';

const prescriptionStore = new StorageStore<Prescription[]>('prescriptions', initialPrescriptions);

export const prescriptionService = {
  getAllPrescriptions(): Prescription[] {
    return prescriptionStore.get();
  },

  getPrescriptionsByPatient(patientId: string): Prescription[] {
    return prescriptionStore.get().filter((p) => p.patientId === patientId);
  },

  getPrescriptionsByHospital(hospitalId: string): Prescription[] {
    return prescriptionStore.get().filter((p) => p.hospitalId === hospitalId);
  },

  getPrescriptionById(id: string): Prescription | undefined {
    return prescriptionStore.get().find((p) => p.id === id);
  },

  createPrescription(data: Omit<Prescription, 'id' | 'prescriptionNumber' | 'digitalSignatureHash'>): Prescription {
    const rxNumber = `RX-MH-PUNE-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRx: Prescription = {
      ...data,
      id: `rx-${Date.now()}`,
      prescriptionNumber: rxNumber,
      digitalSignatureHash: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`
    };

    prescriptionStore.set((prev) => [newRx, ...prev]);

    // Send notification to patient
    notificationService.sendNotification({
      recipientId: data.patientId,
      title: 'New Digital Prescription Issued',
      titleMarathi: 'नवीन डिजिटल औषधोपचार चिठ्ठी जारी',
      message: `Dr. ${data.doctorName} (${data.department}) has issued prescription #${rxNumber} with ${data.medications.length} medication(s). Available at generic pharmacy counters.`,
      messageMarathi: `डॉ. ${data.doctorName} यांनी नवीन औषधोपचार चिठ्ठी #${rxNumber} जारी केली आहे.`,
      category: 'Prescription',
      priority: 'high',
      actionUrl: '/patient/records'
    });

    return newRx;
  },

  updateDispenseStatus(id: string, status: 'Pending' | 'Dispensed' | 'Partially Dispensed'): Prescription {
    let updated: Prescription | undefined;
    prescriptionStore.set((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updated = { ...p, dispensingStatus: status };
          return updated;
        }
        return p;
      })
    );
    if (!updated) throw new Error('Prescription not found');
    return updated;
  },

  subscribe(listener: (prescriptions: Prescription[]) => void): () => void {
    return prescriptionStore.subscribe(listener);
  }
};
