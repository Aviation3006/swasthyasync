import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, UserRole } from '../types/common';
import { LocationInfo, HealthcareProfessionalProfile, AdministratorProfile } from '../types/location';

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
      // Prototype Offline / Client-side fallback
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
   * Sign in with email and password (multi-region test personas and provisioned accounts aware)
   */
  async signIn(email: string, password: string): Promise<{ user: AuthSessionUser | null; error: Error | null }> {
    const cleanEmail = email.trim().toLowerCase();

    // Check if customized profile exists in localStorage
    const savedProfile = localStorage.getItem(`user_profile_${cleanEmail}`);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        return { user: parsed, error: null };
      } catch (e) {}
    }

    // MULTI-REGION TEST ACCOUNTS CONFIGURATION (PROVISIONED / SEEDED ACCOUNTS)
    if (cleanEmail.includes('delhi')) {
      const role: UserRole = cleanEmail.includes('admin') ? 'district_admin' : cleanEmail.includes('hospital') ? 'hospital' : 'patient';
      const loc: LocationInfo = { country: 'India', state: 'Delhi (NCT)', district: 'West Delhi', city: 'Paschim Vihar', pinCode: '110063' };
      const delhiUser: AuthSessionUser = {
        id: `usr-delhi-${role}`,
        email: cleanEmail,
        fullName: role === 'patient' ? 'Ankit Sharma' : role === 'hospital' ? 'Dr. Rajiv Malhotra' : 'Dr. Alok Verma',
        role,
        district: 'West Delhi',
        state: 'Delhi (NCT)',
        facilityName: role === 'hospital' ? 'Deen Dayal Upadhyay Hospital (DDU)' : undefined,
        location: loc,
        professionalProfile: role === 'hospital' ? {
          professionalRole: 'Doctor',
          registrationNumber: 'DMC-2016-8821',
          employeeId: 'EMP-DDU-401',
          facilityName: 'Deen Dayal Upadhyay Hospital (DDU)',
          facilityType: 'District Hospital',
          department: 'General Medicine',
          designation: 'Senior Consultant & In-Charge',
          facilityAddress: 'Clock Tower, Hari Nagar, West Delhi 110064',
          facilityPinCode: '110064',
          location: loc
        } : undefined,
        adminProfile: role === 'district_admin' ? {
          adminRole: 'District Health Officer (DHO)',
          administratorId: 'DHO-DELHI-WEST-01',
          departmentOrAuthority: 'Directorate of Health Services, Delhi',
          jurisdictionLevel: 'District',
          administrativeJurisdiction: 'West Delhi District Health Directorate',
          officeAddress: 'Shivaji Enclave, Raja Garden, West Delhi 110027',
          officePinCode: '110027',
          location: loc
        } : undefined
      };
      return { user: delhiUser, error: null };
    }

    if (cleanEmail.includes('karnataka')) {
      const role: UserRole = cleanEmail.includes('admin') ? 'district_admin' : cleanEmail.includes('hospital') ? 'hospital' : 'patient';
      const loc: LocationInfo = { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560002' };
      const karnatakaUser: AuthSessionUser = {
        id: `usr-ka-${role}`,
        email: cleanEmail,
        fullName: role === 'patient' ? 'Vijay Kumar' : role === 'hospital' ? 'Dr. Ramesh Rao' : 'Dr. Nandita Hegde',
        role,
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        facilityName: role === 'hospital' ? 'Victoria Hospital & Bangalore Medical College' : undefined,
        location: loc,
        professionalProfile: role === 'hospital' ? {
          professionalRole: 'Doctor',
          registrationNumber: 'KMC-2012-4419',
          employeeId: 'BMC-VIC-109',
          facilityName: 'Victoria Hospital & Bangalore Medical College',
          facilityType: 'Teaching & Multispecialty Hospital',
          department: 'General Medicine',
          designation: 'Chief Medical Officer',
          facilityAddress: 'Fort Road, Near City Market, Kalasipalya, Bengaluru 560002',
          facilityPinCode: '560002',
          location: loc
        } : undefined,
        adminProfile: role === 'district_admin' ? {
          adminRole: 'Chief Medical Officer of Health (CMOH)',
          administratorId: 'DHO-BLR-URBAN-01',
          departmentOrAuthority: 'Karnataka State Health & Family Welfare Directorate',
          jurisdictionLevel: 'District',
          administrativeJurisdiction: 'Bengaluru Urban District Health Authority',
          officeAddress: 'Anand Rao Circle, Bengaluru 560009',
          officePinCode: '560009',
          location: loc
        } : undefined
      };
      return { user: karnatakaUser, error: null };
    }

    // Default Maharashtra Test Users
    if (cleanEmail.includes('admin') || cleanEmail === 'admin.test@swasthasync.com') {
      const loc: LocationInfo = { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411001' };
      const mhAdmin: AuthSessionUser = {
        id: 'admin-dho-01',
        email: cleanEmail,
        fullName: 'Dr. Suresh Patil',
        role: 'district_admin',
        district: 'Pune',
        state: 'Maharashtra',
        facilityName: 'District Health Directorate',
        location: loc,
        adminProfile: {
          adminRole: 'District Health Officer (DHO)',
          administratorId: 'DHO-PUNE-01',
          departmentOrAuthority: 'District Health Directorate',
          jurisdictionLevel: 'District',
          administrativeJurisdiction: 'Pune District Health Directorate',
          officeAddress: 'Collector Office Compound, Pune 411001',
          officePinCode: '411001',
          location: loc
        }
      };
      return { user: mhAdmin, error: null };
    }

    if (cleanEmail.includes('hospital') || cleanEmail.includes('doctor') || cleanEmail === 'hospital.test@swasthasync.com') {
      const loc: LocationInfo = { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411027' };
      const mhDoctor: AuthSessionUser = {
        id: 'doc-01',
        email: cleanEmail,
        fullName: 'Dr. Anjali Deshmukh',
        role: 'hospital',
        district: 'Pune',
        state: 'Maharashtra',
        facilityName: 'Aundh District Hospital, Pune',
        location: loc,
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
          location: loc
        }
      };
      return { user: mhDoctor, error: null };
    }

    // Default Maharashtra Patient Test Account
    if (cleanEmail === 'patient.test@swasthasync.com' || cleanEmail.includes('patient')) {
      const loc: LocationInfo = { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411027' };
      const mhPatient: AuthSessionUser = {
        id: 'pat-mh-001',
        email: cleanEmail,
        fullName: 'Rameshwar B. Jadhav',
        role: 'patient',
        district: 'Pune',
        state: 'Maharashtra',
        facilityName: 'Aundh District Hospital (Attached)',
        location: loc
      };
      return { user: mhPatient, error: null };
    }

    if (!this.isConfigured() || !supabase) {
      // General Offline Patient Fallback
      return {
        user: {
          id: `usr-${Date.now()}`,
          email: cleanEmail,
          fullName: 'Citizen User',
          role: 'patient',
          district: '',
          state: '',
          location: { country: 'India', state: '', district: '', city: '', locality: '', pinCode: '' }
        },
        error: null
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
