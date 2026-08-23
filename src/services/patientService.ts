import { Patient, ConsentSettings } from '../types/patient';
import { mockPatientDirectory, mockPrimaryPatient } from '../data/patients';
import { StorageStore } from '../utils/storage';
import { User } from '../types/common';

const patientStore = new StorageStore<Patient[]>('patients', mockPatientDirectory);

export const patientService = {
  /**
   * Get or dynamically construct the patient profile for the authenticated user
   */
  getPatientForUser(user: User | null): Patient {
    if (!user) {
      return {
        id: 'anonymous',
        careSetuId: 'CSU-IND-PUN-00000001',
        careSetuStatus: 'Active',
        careSetuIssueDate: '2026-08-23',
        abhaId: '',
        abhaAddress: '',
        name: 'Guest User',
        dob: '',
        age: 0,
        gender: 'Male',
        bloodGroup: '' as any,
        phone: '',
        email: '',
        aadhaarMasked: '',
        address: {
          village: '',
          taluka: '',
          district: '',
          state: '', pincode: ''
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        },
        registeredHospital: '',
        activeScheme: '',
        preferredLanguage: 'en',
        allergies: [],
        chronicConditions: [],
        vitals: null as any,
        consent: {
          allowEmergencyAccess: false,
          shareRecordsWithEmpaneledHospitals: false,
          shareAllergyAlerts: false,
          sharePastRecords30Days: false,
          notifyOnAccess: true
        }
      };
    }

    // Dedicated Test Patient account uses rich sample test data ONLY
    if (user.email === 'patient.test@swasthasync.com' || user.id === 'pat-mh-001' || user.id === '11111111-1111-1111-1111-111111111111') {
      return mockPrimaryPatient;
    }

    // Check if a record already exists in the store for this user
    const list = patientStore.get();
    const existing = list.find((p) => p.id === user.id || (user.email && p.email?.toLowerCase() === user.email.toLowerCase()));
    if (existing) {
      return {
        ...existing,
        name: user.name || existing.name,
        email: user.email || existing.email,
        phone: user.phone || existing.phone
      };
    }

    const userDistrict = user.district || user.location?.district || '';
    const userState = user.state || user.location?.state || '';
    const userCity = user.location?.city || '';
    const userLocality = user.location?.locality || '';
    const userPin = user.location?.pinCode || '';

    // Create clean, non-populated patient profile for newly registered user
    const newPatient: Patient = {
      id: user.id,
      careSetuId: `CSU-IND-${(userDistrict || 'IND').slice(0,3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0,8)}`,
      careSetuStatus: 'Active',
      careSetuIssueDate: new Date().toISOString().split('T')[0],
      abhaId: '', // Unlinked until citizen links ABHA
      abhaAddress: '',
      name: user.name || 'Citizen User',
      dob: '',
      age: 0,
      gender: 'Male',
      bloodGroup: '' as any,
      phone: user.phone || '',
      email: user.email,
      aadhaarMasked: '',
      address: {
        village: userLocality || userCity || '',
        taluka: userCity || '',
        district: userDistrict,
        state: userState,
        pincode: userPin
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      },
      registeredHospital: '',
      activeScheme: '',
      preferredLanguage: 'en',
      allergies: [],
      chronicConditions: [],
      vitals: null as any,
      consent: {
        allowEmergencyAccess: false,
        shareRecordsWithEmpaneledHospitals: false,
        shareAllergyAlerts: false,
        sharePastRecords30Days: false,
        notifyOnAccess: true
      }
    };

    patientStore.set((prev) => [newPatient, ...prev]);
    return newPatient;
  },

  getPrimaryPatient(): Patient {
    return mockPrimaryPatient;
  },


  getPatientByCareSetuId(careSetuId: string): Patient | undefined {
    if (!careSetuId) return undefined;
    const cleanId = careSetuId.trim().toUpperCase();
    const list = patientStore.get();
    return list.find((p) => (p.careSetuId && p.careSetuId.toUpperCase() === cleanId) || p.id === careSetuId);
  },

  ensureCareSetuId(patient: Patient): string {
    if (patient.careSetuId) return patient.careSetuId;
    const distCode = (patient.address?.district || 'PUN').slice(0, 3).toUpperCase();
    const serial = Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
    const newId = `CSU-IND-${distCode}-${serial}`;
    patient.careSetuId = newId;
    patient.careSetuStatus = 'Active';
    patient.careSetuIssueDate = new Date().toISOString().split('T')[0];
    this.updatePatient(patient.id, { careSetuId: newId, careSetuStatus: 'Active', careSetuIssueDate: patient.careSetuIssueDate });
    return newId;
  },
  getPatientById(id: string): Patient | undefined {
    return patientStore.get().find((p) => p.id === id);
  },

  getAllPatients(): Patient[] {
    return patientStore.get();
  },

  searchPatients(query: string): Patient[] {
    const q = query.toLowerCase().trim();
    if (!q) return patientStore.get();
    return patientStore.get().filter((p) => 
      p.name.toLowerCase().includes(q) ||
      p.abhaId.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.aadhaarMasked.includes(q)
    );
  },

  updatePatient(id: string, updates: Partial<Patient>): Patient {
    let updatedPatient: Patient | undefined;
    patientStore.set((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedPatient = { ...p, ...updates };
          return updatedPatient;
        }
        return p;
      })
    );
    if (!updatedPatient) {
      const fallback: Patient = {
        ...this.getPatientForUser(null),
        ...updates,
        id
      };
      patientStore.set((prev) => [fallback, ...prev]);
      return fallback;
    }
    return updatedPatient;
  },

  registerPatientProfile(patientData: Partial<Patient>): Patient {
    const list = patientStore.get();
    const existingIndex = list.findIndex(p => p.id === patientData.id || (patientData.email && p.email?.toLowerCase() === patientData.email.toLowerCase()));
    
    const newProfile: Patient = {
      id: patientData.id || `pat-${Date.now()}`,
      careSetuId: patientData.careSetuId || `CSU-IND-${(patientData.address?.district || 'PUN').slice(0,3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0,8)}`,
      careSetuStatus: patientData.careSetuStatus || 'Active',
      careSetuIssueDate: patientData.careSetuIssueDate || new Date().toISOString().split('T')[0],
      abhaId: patientData.abhaId || '',
      abhaAddress: patientData.abhaAddress || '',
      name: patientData.name || 'Citizen User',
      dob: patientData.dob || '',
      age: patientData.age || 0,
      gender: patientData.gender || 'Male',
      bloodGroup: patientData.bloodGroup || ('' as any),
      phone: patientData.phone || '',
      email: patientData.email || '',
      aadhaarMasked: patientData.aadhaarMasked || '',
      address: {
        village: patientData.address?.village || '',
        taluka: patientData.address?.taluka || '',
        district: patientData.address?.district || '',
        state: patientData.address?.state || '',
        pincode: patientData.address?.pincode || ''
      },
      emergencyContact: {
        name: patientData.emergencyContact?.name || '',
        relationship: patientData.emergencyContact?.relationship || '',
        phone: patientData.emergencyContact?.phone || ''
      },
      registeredHospital: patientData.registeredHospital || '',
      activeScheme: patientData.activeScheme || '',
      preferredLanguage: patientData.preferredLanguage || 'en',
      allergies: patientData.allergies || [],
      chronicConditions: patientData.chronicConditions || [],
      vitals: null as any,
      consent: patientData.consent || {
        allowEmergencyAccess: false,
        shareRecordsWithEmpaneledHospitals: false,
        shareAllergyAlerts: false,
        sharePastRecords30Days: false,
        notifyOnAccess: true
      }
    };

    if (existingIndex >= 0) {
      patientStore.set(prev => {
        const next = [...prev];
        next[existingIndex] = newProfile;
        return next;
      });
    } else {
      patientStore.set(prev => [newProfile, ...prev]);
    }

    return newProfile;
  },

  updateConsent(id: string, consent: Partial<ConsentSettings>): Patient {
    const p = this.getPatientById(id);
    if (!p) throw new Error('Patient not found');
    const newConsent = { ...p.consent, ...consent };
    return this.updatePatient(id, { consent: newConsent });
  },

  subscribe(listener: (patients: Patient[]) => void): () => void {
    return patientStore.subscribe(listener);
  }
};
