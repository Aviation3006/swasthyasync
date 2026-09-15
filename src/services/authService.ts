import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, UserRole } from '../types/common';
import { LocationInfo, HealthcareProfessionalProfile, AdministratorProfile } from '../types/location';
import { isDemoMode } from '../config/appConfig';

export interface AuthSessionUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  abhaNumber?: string;
  phone?: string;
  dob?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height?: number;
  weight?: number;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  facilityName?: string;
  district?: string;
  state?: string;
  location?: LocationInfo;
  professionalProfile?: HealthcareProfessionalProfile;
  adminProfile?: AdministratorProfile;
}

export interface DemoCredential {
  email: string;
  password: string;
  role: UserRole;
  personaKey: string;
}

export const KNOWN_DEMO_CREDENTIALS: Record<string, DemoCredential> = {
  // Maharashtra Personas
  'patient.test@swasthasync.com': {
    email: 'patient.test@swasthasync.com',
    password: 'Patient@123',
    role: 'patient',
    personaKey: 'patient-mh'
  },
  'hospital.test@swasthasync.com': {
    email: 'hospital.test@swasthasync.com',
    password: 'Hospital@123',
    role: 'hospital',
    personaKey: 'hospital-mh'
  },
  'admin.test@swasthasync.com': {
    email: 'admin.test@swasthasync.com',
    password: 'Admin@123',
    role: 'district_admin',
    personaKey: 'admin-mh'
  },
  // Delhi Personas
  'patient.delhi@swasthasync.com': {
    email: 'patient.delhi@swasthasync.com',
    password: 'Delhi@123',
    role: 'patient',
    personaKey: 'patient-delhi'
  },
  'hospital.delhi@swasthasync.com': {
    email: 'hospital.delhi@swasthasync.com',
    password: 'Delhi@123',
    role: 'hospital',
    personaKey: 'hospital-delhi'
  },
  'admin.delhi@swasthasync.com': {
    email: 'admin.delhi@swasthasync.com',
    password: 'Delhi@123',
    role: 'district_admin',
    personaKey: 'admin-delhi'
  },
  // Karnataka Personas
  'patient.karnataka@swasthasync.com': {
    email: 'patient.karnataka@swasthasync.com',
    password: 'Karnataka@123',
    role: 'patient',
    personaKey: 'patient-karnataka'
  },
  'hospital.karnataka@swasthasync.com': {
    email: 'hospital.karnataka@swasthasync.com',
    password: 'Karnataka@123',
    role: 'hospital',
    personaKey: 'hospital-karnataka'
  },
  'admin.karnataka@swasthasync.com': {
    email: 'admin.karnataka@swasthasync.com',
    password: 'Karnataka@123',
    role: 'district_admin',
    personaKey: 'admin-karnataka'
  }
};

export function getDemoSessionUser(personaKey: string): AuthSessionUser {
  switch (personaKey) {
    case 'patient-mh':
      return {
        id: 'pat-mh-001',
        email: 'patient.test@swasthasync.com',
        fullName: 'Rameshwar B. Jadhav',
        role: 'patient',
        district: 'Pune',
        state: 'Maharashtra',
        facilityName: 'Aundh District Hospital (Attached)',
        location: { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411027' },
        phone: '+91 98224 51902'
      };
    case 'hospital-mh':
      return {
        id: 'doc-01',
        email: 'hospital.test@swasthasync.com',
        fullName: 'Dr. Anjali Deshmukh',
        role: 'hospital',
        district: 'Pune',
        state: 'Maharashtra',
        facilityName: 'Aundh District Hospital, Pune',
        phone: '+91 20 2728 0122',
        location: { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411027' },
        professionalProfile: {
          professionalRole: 'Doctor',
          registrationNumber: 'MMC-2014-9912',
          employeeId: 'ADH-DOC-01',
          facilityName: 'Aundh District Hospital, Pune',
          facilityType: 'District Hospital',
          department: 'General Medicine',
          designation: 'Chief Medical Officer',
          facilityAddress: 'Chikhalwadi, Aundh, Pune 411027',
          facilityPinCode: '411027',
          location: { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411027' }
        }
      };
    case 'admin-mh':
      return {
        id: 'admin-dho-01',
        email: 'admin.test@swasthasync.com',
        fullName: 'Dr. Suresh Patil',
        role: 'district_admin',
        district: 'Pune',
        state: 'Maharashtra',
        facilityName: 'District Health Directorate',
        phone: '+91 20 2605 1888',
        location: { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411001' },
        adminProfile: {
          adminRole: 'District Health Officer (DHO)',
          administratorId: 'DHO-PUNE-01',
          departmentOrAuthority: 'District Health Directorate',
          jurisdictionLevel: 'District',
          administrativeJurisdiction: 'Pune District Health Directorate',
          officeAddress: 'Collector Office Compound, Pune 411001',
          officePinCode: '411001',
          location: { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411001' }
        }
      };
    case 'patient-delhi':
      return {
        id: 'pat-del-001',
        email: 'patient.delhi@swasthasync.com',
        fullName: 'Ankit Sharma',
        role: 'patient',
        district: 'West Delhi',
        state: 'Delhi (NCT)',
        facilityName: 'Deen Dayal Upadhyay Hospital (Attached)',
        phone: '+91 98110 23456',
        location: { country: 'India', state: 'Delhi (NCT)', district: 'West Delhi', city: 'Paschim Vihar', pinCode: '110063' }
      };
    case 'hospital-delhi':
      return {
        id: 'doc-del-01',
        email: 'hospital.delhi@swasthasync.com',
        fullName: 'Dr. Rajiv Malhotra',
        role: 'hospital',
        district: 'West Delhi',
        state: 'Delhi (NCT)',
        facilityName: 'Deen Dayal Upadhyay Hospital (DDU)',
        phone: '+91 11 2549 4402',
        location: { country: 'India', state: 'Delhi (NCT)', district: 'West Delhi', city: 'Delhi', pinCode: '110064' },
        professionalProfile: {
          professionalRole: 'Doctor',
          registrationNumber: 'DMC-2016-8821',
          employeeId: 'EMP-DDU-401',
          facilityName: 'Deen Dayal Upadhyay Hospital (DDU)',
          facilityType: 'District Hospital',
          department: 'General Medicine',
          designation: 'Senior Consultant & In-Charge',
          facilityAddress: 'Clock Tower, Hari Nagar, West Delhi 110064',
          facilityPinCode: '110064',
          location: { country: 'India', state: 'Delhi (NCT)', district: 'West Delhi', city: 'Delhi', pinCode: '110064' }
        }
      };
    case 'admin-delhi':
      return {
        id: 'admin-del-01',
        email: 'admin.delhi@swasthasync.com',
        fullName: 'Dr. Alok Verma',
        role: 'district_admin',
        district: 'West Delhi',
        state: 'Delhi (NCT)',
        facilityName: 'West Delhi District Health Directorate',
        phone: '+91 11 2598 4744',
        location: { country: 'India', state: 'Delhi (NCT)', district: 'West Delhi', city: 'Delhi', pinCode: '110027' },
        adminProfile: {
          adminRole: 'District Health Officer (DHO)',
          administratorId: 'DHO-DELHI-WEST-01',
          departmentOrAuthority: 'Directorate of Health Services, Delhi',
          jurisdictionLevel: 'District',
          administrativeJurisdiction: 'West Delhi District Health Directorate',
          officeAddress: 'Shivaji Enclave, Raja Garden, West Delhi 110027',
          officePinCode: '110027',
          location: { country: 'India', state: 'Delhi (NCT)', district: 'West Delhi', city: 'Delhi', pinCode: '110027' }
        }
      };
    case 'patient-karnataka':
      return {
        id: 'pat-ka-001',
        email: 'patient.karnataka@swasthasync.com',
        fullName: 'Vijay Kumar',
        role: 'patient',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        facilityName: 'Victoria Hospital (Attached)',
        phone: '+91 98450 12345',
        location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560002' }
      };
    case 'hospital-karnataka':
      return {
        id: 'doc-ka-01',
        email: 'hospital.karnataka@swasthasync.com',
        fullName: 'Dr. Ramesh Rao',
        role: 'hospital',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        facilityName: 'Victoria Hospital & Bangalore Medical College',
        phone: '+91 80 2670 1150',
        location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560002' },
        professionalProfile: {
          professionalRole: 'Doctor',
          registrationNumber: 'KMC-2012-4419',
          employeeId: 'BMC-VIC-109',
          facilityName: 'Victoria Hospital & Bangalore Medical College',
          facilityType: 'Teaching & Multispecialty Hospital',
          department: 'General Medicine',
          designation: 'Chief Medical Officer',
          facilityAddress: 'Fort Road, Near City Market, Kalasipalya, Bengaluru 560002',
          facilityPinCode: '560002',
          location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560002' }
        }
      };
    case 'admin-karnataka':
      return {
        id: 'admin-ka-01',
        email: 'admin.karnataka@swasthasync.com',
        fullName: 'Dr. Nandita Hegde',
        role: 'district_admin',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        facilityName: 'Bengaluru Urban District Health Command',
        phone: '+91 80 2221 4433',
        location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560009' },
        adminProfile: {
          adminRole: 'Chief Medical Officer of Health (CMOH)',
          administratorId: 'DHO-BLR-URBAN-01',
          departmentOrAuthority: 'Karnataka State Health & Family Welfare Directorate',
          jurisdictionLevel: 'District',
          administrativeJurisdiction: 'Bengaluru Urban District Health Authority',
          officeAddress: 'Anand Rao Circle, Bengaluru 560009',
          officePinCode: '560009',
          location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560009' }
        }
      };
    default:
      return {
        id: 'pat-mh-001',
        email: 'patient.test@swasthasync.com',
        fullName: 'Rameshwar B. Jadhav',
        role: 'patient',
        district: 'Pune',
        state: 'Maharashtra',
        facilityName: 'Aundh District Hospital (Attached)',
        location: { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411027' },
        phone: '+91 98224 51902'
      };
  }
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  /**
   * Public Citizen/Patient Sign Up
   * 
   * CRITICAL SECURITY BOUNDARY:
   * Public signup is strictly locked to role = 'patient'.
   * Privileged roles ('hospital', 'district_admin') are never created through public registration.
   */
  async signUp(params: {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
    abhaNumber?: string; // Ignored / Overridden to 'patient' at authorization boundary
    phone?: string;
    dob?: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    height?: number;
    weight?: number;
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: string[];
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    facilityName?: string;
    district?: string;
    state?: string;
    city?: string;
    locality?: string;
    pinCode?: string;
    professionalProfile?: Partial<HealthcareProfessionalProfile>;
    adminProfile?: Partial<AdministratorProfile>;
  }): Promise<{ user: AuthSessionUser | null; error: Error | null }> {
    // ENFORCE PATIENT ROLE AT THE AUTHORIZATION BOUNDARY
    const enforcedRole: UserRole = 'patient';

    const userState = params.state?.trim() || '';
    const userDistrict = params.district?.trim() || '';
    const userCity = params.city?.trim() || '';
    const userLocality = params.locality?.trim() || '';
    const userPin = params.pinCode?.trim() || '';

    const location: LocationInfo = {
      country: 'India',
      state: userState,
      district: userDistrict,
      city: userCity,
      locality: userLocality,
      pinCode: userPin
    };

    if (!this.isConfigured() || !supabase) {
      if (!isDemoMode()) {
        return {
          user: null,
          error: new Error('Production registration requires active Supabase authentication backend.')
        };
      }

      // Prototype Offline / Client-side fallback (Demo Mode Only)
      const fallbackUser: AuthSessionUser = {
        id: `user-${Date.now()}`,
        email: params.email.trim(),
        fullName: params.fullName.trim(),
        role: enforcedRole,
        abhaNumber: params.abhaNumber?.trim(),
        phone: params.phone?.trim() || '+91 98000 00000',
        dob: params.dob,
        age: params.age,
        gender: params.gender || 'Male',
        bloodGroup: params.bloodGroup,
        height: params.height,
        weight: params.weight,
        allergies: params.allergies,
        chronicConditions: params.chronicConditions,
        currentMedications: params.currentMedications,
        emergencyContactName: params.emergencyContactName,
        emergencyContactPhone: params.emergencyContactPhone,
        emergencyContactRelation: params.emergencyContactRelation,
        district: userDistrict,
        state: userState,
        location
      };

      // Persist in localStorage for cross-page session continuity
      localStorage.setItem(`user_profile_${params.email.trim().toLowerCase()}`, JSON.stringify(fallbackUser));
      return { user: fallbackUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            role: enforcedRole,
            phone: params.phone?.trim(),
            dob: params.dob,
            age: params.age,
            gender: params.gender || 'Male',
            blood_group: params.bloodGroup,
            height: params.height,
            weight: params.weight,
            allergies: params.allergies,
            chronic_conditions: params.chronicConditions,
            current_medications: params.currentMedications,
            emergency_contact_name: params.emergencyContactName,
            emergency_contact_phone: params.emergencyContactPhone,
            emergency_contact_relation: params.emergencyContactRelation,
            district: userDistrict,
            state: userState,
            city: userCity,
            locality: userLocality,
            pin_code: userPin
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from signup');

      // Best-effort profile sync
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: params.email.trim(),
          full_name: params.fullName.trim(),
          role: enforcedRole,
          phone: params.phone?.trim(),
          district: userDistrict,
          state: userState
        });
      } catch (profileErr) {
        // Handled by database trigger
      }

      const sessionUser: AuthSessionUser = {
        id: data.user.id,
        email: data.user.email || params.email.trim(),
        fullName: params.fullName.trim(),
        role: enforcedRole,
        abhaNumber: params.abhaNumber?.trim(),
        phone: params.phone?.trim(),
        dob: params.dob,
        age: params.age,
        gender: params.gender || 'Male',
        bloodGroup: params.bloodGroup,
        height: params.height,
        weight: params.weight,
        allergies: params.allergies,
        chronicConditions: params.chronicConditions,
        currentMedications: params.currentMedications,
        emergencyContactName: params.emergencyContactName,
        emergencyContactPhone: params.emergencyContactPhone,
        emergencyContactRelation: params.emergencyContactRelation,
        district: userDistrict,
        state: userState,
        location
      };

      localStorage.setItem(`user_profile_${params.email.trim().toLowerCase()}`, JSON.stringify(sessionUser));
      return { user: sessionUser, error: null };
    } catch (err: any) {
      return { user: null, error: err };
    }
  },

  /**
   * Sign in with email and password
   * 
   * SECURITY ENFORCEMENT:
   * - In demo mode (IS_DEMO_MODE=true), exact demo persona credentials require the exact demo password.
   * - In production mode (IS_DEMO_MODE=false), all logins strictly authenticate against Supabase Auth.
   * - Substring matching and arbitrary email role escalations are strictly forbidden.
   */
  async signIn(email: string, password: string): Promise<{ user: AuthSessionUser | null; error: Error | null }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return {
        user: null,
        error: new Error('Please enter both email and password.')
      };
    }

    // 1. Explicit Demo Mode Authentication
    if (isDemoMode()) {
      const demoAccount = KNOWN_DEMO_CREDENTIALS[cleanEmail];
      if (demoAccount) {
        if (cleanPassword === demoAccount.password) {
          const demoUser = getDemoSessionUser(demoAccount.personaKey);
          return { user: demoUser, error: null };
        } else {
          return {
            user: null,
            error: new Error('Invalid credentials for demo persona.')
          };
        }
      }

      // In demo mode only: allow registered demo patient profiles from localStorage
      const savedProfile = localStorage.getItem(`user_profile_${cleanEmail}`);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          // Strict security: Only 'patient' role allowed from unverified local storage
          if (parsed && parsed.role === 'patient') {
            return { user: parsed, error: null };
          }
        } catch (e) {}
      }
    }

    // 2. Production Authentication Boundary (Strict Fail-Closed)
    if (!this.isConfigured() || !supabase) {
      return {
        user: null,
        error: new Error('Authentication backend is unavailable. Supabase must be configured for production authentication.')
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from login');

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const userRole: UserRole = profile?.role || data.user.user_metadata?.role || 'patient';
      const userState = profile?.state || data.user.user_metadata?.state || '';
      const userDistrict = profile?.district || data.user.user_metadata?.district || '';
      const userCity = profile?.city || data.user.user_metadata?.city || '';
      const userLocality = profile?.locality || data.user.user_metadata?.locality || '';
      const userPin = profile?.pin_code || data.user.user_metadata?.pin_code || '';

      const location: LocationInfo = {
        country: 'India',
        state: userState,
        district: userDistrict,
        city: userCity,
        locality: userLocality,
        pinCode: userPin
      };

      const sessionUser: AuthSessionUser = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || 'Citizen User',
        role: userRole,
        facilityName: profile?.facility_name || data.user.user_metadata?.facility_name,
        district: userDistrict,
        state: userState,
        phone: profile?.phone || data.user.user_metadata?.phone,
        dob: data.user.user_metadata?.dob,
        age: data.user.user_metadata?.age,
        gender: data.user.user_metadata?.gender,
        bloodGroup: data.user.user_metadata?.blood_group,
        height: data.user.user_metadata?.height,
        weight: data.user.user_metadata?.weight,
        allergies: data.user.user_metadata?.allergies,
        chronicConditions: data.user.user_metadata?.chronic_conditions,
        currentMedications: data.user.user_metadata?.current_medications,
        emergencyContactName: data.user.user_metadata?.emergency_contact_name,
        emergencyContactPhone: data.user.user_metadata?.emergency_contact_phone,
        emergencyContactRelation: data.user.user_metadata?.emergency_contact_relation,
        location
      };

      localStorage.setItem(`user_profile_${cleanEmail}`, JSON.stringify(sessionUser));
      return { user: sessionUser, error: null };
    } catch (err: any) {
      return { user: null, error: err };
    }
  },

  /**
   * Reset Password Request
   */
  async resetPassword(email: string): Promise<{ error: Error | null }> {
    if (!this.isConfigured() || !supabase) {
      return { error: null };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Update Password
   */
  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    if (!this.isConfigured() || !supabase) {
      return { error: null };
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    if (this.isConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    localStorage.removeItem('swasthyasync_active_role');
    localStorage.removeItem('swasthyasync_auth_status');
  }
};
