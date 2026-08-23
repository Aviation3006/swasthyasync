import { SymptomEntry } from '../types/symptoms';
import { initialSymptoms } from '../data/symptoms';
import { StorageStore } from '../utils/storage';

const symptomStore = new StorageStore<SymptomEntry[]>('symptoms', initialSymptoms);

export const symptomService = {
  getSymptomsByPatient(patientId: string): SymptomEntry[] {
    return symptomStore.get().filter((s) => s.patientId === patientId);
  },

  logSymptom(entry: Omit<SymptomEntry, 'id' | 'loggedAt'>): SymptomEntry {
    const newEntry: SymptomEntry = {
      ...entry,
      id: `symp-${Date.now()}`,
      loggedAt: new Date().toISOString()
    };
    symptomStore.set((prev) => [newEntry, ...prev]);
    return newEntry;
  },

  updateSymptomStatus(id: string, status: 'Active' | 'Improving' | 'Resolved'): SymptomEntry {
    let updated: SymptomEntry | undefined;
    symptomStore.set((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          updated = { ...s, status };
          return updated;
        }
        return s;
      })
    );
    if (!updated) throw new Error('Symptom entry not found');
    return updated;
  },

  deleteSymptom(id: string): void {
    symptomStore.set((prev) => prev.filter((s) => s.id !== id));
  },

  subscribe(listener: (symptoms: SymptomEntry[]) => void): () => void {
    return symptomStore.subscribe(listener);
  }
};
