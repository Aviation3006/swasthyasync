import { Patient, ConsentSettings } from '../types/patient';
import { mockPatientDirectory, mockPrimaryPatient } from '../data/patients';
import { StorageStore } from '../utils/storage';
import { User } from '../types/common';

const patientStore = new StorageStore<Patient[]>('patients', mockPatientDirectory);

export const patientService = {
  /**
   * Get all registered and mock patients
   */
  getAllPatients(): Patient[] {
    return patientStore.get();
  },

  /**
   * Subscribe to live reactive patient store changes
   */
  subscribe(listener: (data: Patient[]) => void): () => void {
    return patientStore.subscribe(listener);
  },

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
          state: '',
          pincode: ''
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

    // Check if user has saved health/demographic metadata in localStorage session profile
    let sessionMeta: any = {};
    if (user.email) {
      const savedSessionRaw = localStorage.getItem(`user_profile_${user.email.trim().toLowerCase()}`);
      if (savedSessionRaw) {
        try {
          sessionMeta = JSON.parse(savedSessionRaw);
        } catch (e) {}
      }
    }

    // Check if a record already exists in the store for this user
    const list = patientStore.get();
    const existing = list.find((p) => p.id === user.id || (user.email && p.email?.toLowerCase() === user.email.toLowerCase()));
    if (existing) {
      return {
        ...existing,
        name: user.name || existing.name,
        email: user.email || existing.email,
        phone: user.phone || existing.phone,
        bloodGroup: existing.bloodGroup || sessionMeta.bloodGroup || '',
        address: {
          village: existing.address?.village || user.location?.locality || user.location?.city || sessionMeta.location?.locality || '',
          taluka: existing.address?.taluka || user.location?.city || sessionMeta.location?.city || '',
          district: user.district || existing.address?.district || user.location?.district || sessionMeta.district || '',
          state: user.state || existing.address?.state || user.location?.state || sessionMeta.state || '',
          pincode: existing.address?.pincode || user.location?.pinCode || sessionMeta.location?.pinCode || ''
        }
      };
    }

    const userDistrict = user.district || user.location?.district || sessionMeta.district || '';
    const userState = user.state || user.location?.state || sessionMeta.state || '';
    const userCity = user.location?.city || sessionMeta.location?.city || '';
    const userLocality = user.location?.locality || sessionMeta.location?.locality || '';
    const userPin = user.location?.pinCode || sessionMeta.location?.pinCode || '';
    const userDob = sessionMeta.dob || '';
    const userAge = sessionMeta.age || (userDob ? Math.floor((Date.now() - new Date(userDob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0);
    const userGender = sessionMeta.gender || 'Male';
    const userBloodGroup = sessionMeta.bloodGroup || '';
    const userHeight = sessionMeta.height || 0;
    const userWeight = sessionMeta.weight || 0;

    const userAllergies = (sessionMeta.allergies || []).map((alg: string | any, idx: number) => ({
      id: `alg-new-${idx}`,
      substance: typeof alg === 'string' ? alg : alg.substance,
      severity: 'Moderate' as const,
      reaction: 'Documented at registration'
    }));

    const userConditions = (sessionMeta.chronicConditions || []).map((cond: string | any, idx: number) => ({
      id: `cond-new-${idx}`,
      name: typeof cond === 'string' ? cond : cond.name,
      diagnosedDate: new Date().toISOString().split('T')[0],
      status: 'Controlled' as const,
      treatingDoctor: 'Primary Care Physician',
      hospital: 'Empaneled Facility',
      notes: 'Reported during registration'
    }));

    // Create clean patient profile for newly registered user
    const newPatient: Patient = {
      id: user.id,
      careSetuId: `CSU-IND-${(userDistrict || 'IND').slice(0,3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0,8)}`,
      careSetuStatus: 'Active',
      careSetuIssueDate: new Date().toISOString().split('T')[0],
      abhaId: '', // Unlinked until citizen links ABHA
      abhaAddress: '',
      name: user.name || 'Citizen User',
      dob: userDob,
      age: userAge,
      gender: userGender,
      bloodGroup: userBloodGroup,
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
        name: sessionMeta.emergencyContactName || '',
        relationship: sessionMeta.emergencyContactRelation || 'Next of Kin',
        phone: sessionMeta.emergencyContactPhone || ''
      },
      registeredHospital: '',
      activeScheme: '',
      preferredLanguage: 'en',
      allergies: userAllergies,
      chronicConditions: userConditions,
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        bloodSugarFasting: 95,
        spO2: 98,
        temperature: 98.4,
        weight: userWeight,
        height: userHeight,
        bmi: userHeight > 0 && userWeight > 0 ? parseFloat((userWeight / ((userHeight / 100) ** 2)).toFixed(1)) : 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      },
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
    const districtCode = (patient.address?.district || 'PUN').slice(0, 3).toUpperCase();
    const randomSerial = Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
    const newId = `CSU-IND-${districtCode}-${randomSerial}`;
    patient.careSetuId = newId;
    patient.careSetuStatus = 'Active';
    patient.careSetuIssueDate = new Date().toISOString().split('T')[0];
    this.updatePatient(patient);
    return newId;
  },

  getPatient(id: string): Patient | undefined {
    const list = patientStore.get();
    return list.find((p) => p.id === id);
  },

  getPatientById(id: string): Patient | undefined {
    return this.getPatient(id);
  },

  updatePatient(idOrPatient: string | Patient, maybePatient?: Partial<Patient>): Patient {
    const id = typeof idOrPatient === 'string' ? idOrPatient : idOrPatient.id;
    const patch = typeof idOrPatient === 'string' ? maybePatient || {} : idOrPatient;
    let updatedPatient: Patient = mockPrimaryPatient;

    patientStore.set((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedPatient = { ...p, ...patch } as Patient;
          return updatedPatient;
        }
        return p;
      })
    );

    return updatedPatient;
  },

  updateConsent(patientId: string, consent: ConsentSettings): void {
    patientStore.set((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, consent } : p))
    );
  }
};
