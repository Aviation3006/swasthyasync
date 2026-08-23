import { MedicalRecord, RecordType } from '../types/records';
import { mockMedicalRecords } from '../data/records';
import { StorageStore } from '../utils/storage';

const recordStore = new StorageStore<MedicalRecord[]>('medical_records', mockMedicalRecords);

export const recordService = {
  getAllRecords(): MedicalRecord[] {
    return recordStore.get();
  },

  getRecordsByPatient(patientId: string, filterType?: RecordType | 'All'): MedicalRecord[] {
    const list = recordStore.get().filter((r) => r.patientId === patientId);
    if (!filterType || filterType === 'All') return list;
    return list.filter((r) => r.recordType === filterType);
  },

  getRecordById(id: string): MedicalRecord | undefined {
    return recordStore.get().find((r) => r.id === id);
  },

  addRecord(record: Omit<MedicalRecord, 'id' | 'digitalSignatureHash' | 'isVerified'>): MedicalRecord {
    const newRecord: MedicalRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      digitalSignatureHash: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      isVerified: true
    };
    recordStore.set((prev) => [newRecord, ...prev]);
    return newRecord;
  },

  subscribe(listener: (records: MedicalRecord[]) => void): () => void {
    return recordStore.subscribe(listener);
  }
};
