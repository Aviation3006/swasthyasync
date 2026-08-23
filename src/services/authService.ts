import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, UserRole } from '../types/common';
import { LocationInfo, HealthcareProfessionalProfile, AdministratorProfile } from '../types/location';

export interface AuthSessionUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  facilityName?: string;
  district?: string;
  state?: string;
  phone?: string;
  location?: LocationInfo;
  professionalProfile?: HealthcareProfessionalProfile;
  adminProfile?: AdministratorProfile;
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  /**
   * Sign up with email, password, and custom metadata
   */
  async signUp(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    facilityName?: string;
    district?: string;
    state?: string;
    city?: string;
    locality?: string;
    pinCode?: string;
    professionalProfile?: Partial<HealthcareProfessionalProfile>;
    adminProfile?: Partial<AdministratorProfile>;
  }): Promise<{ user: AuthSessionUser | null; error: Error | null }> {
    const userState = params.state || params.professionalProfile?.location?.state || params.adminProfile?.location?.state || (params.role === 'patient' ? undefined : 'Delhi (NCT)');
    const userDistrict = params.district || params.professionalProfile?.location?.district || params.adminProfile?.location?.district || (params.role === 'patient' ? undefined : 'New Delhi');
    const userCity = params.city || params.professionalProfile?.location?.city || params.adminProfile?.location?.city || '';
    const userPin = params.pinCode || params.professionalProfile?.location?.pinCode || params.adminProfile?.location?.pinCode || '';

    const location: LocationInfo = {
      country: 'India',
      state: userState || '',
      district: userDistrict || '',
      city: userCity,
      locality: params.locality || '',
      pinCode: userPin
    };

    let professionalProfile: HealthcareProfessionalProfile | undefined = undefined;
    if (params.role === 'hospital') {
      professionalProfile = {
        professionalRole: params.professionalProfile?.professionalRole || 'Doctor',
        registrationNumber: params.professionalProfile?.registrationNumber || '',
        employeeId: params.professionalProfile?.employeeId || '',
        facilityName: params.facilityName || params.professionalProfile?.facilityName || 'Healthcare Facility',
        facilityType: params.professionalProfile?.facilityType || 'District Hospital',
        department: params.professionalProfile?.department || 'General Medicine',
        designation: params.professionalProfile?.designation || 'Medical Officer',
        facilityAddress: params.professionalProfile?.facilityAddress || '',
        facilityPinCode: userPin,
        facilityContact: params.phone,
        location
      };
    }

    let adminProfile: AdministratorProfile | undefined = undefined;
    if (params.role === 'district_admin') {
      adminProfile = {
        adminRole: params.adminProfile?.adminRole || 'District Health Officer (DHO)',
        administratorId: params.adminProfile?.administratorId || '',
        departmentOrAuthority: params.adminProfile?.departmentOrAuthority || 'District Health Administration',
        jurisdictionLevel: 'District',
        administrativeJurisdiction: params.adminProfile?.administrativeJurisdiction || `${userDistrict || 'District'} Health Administration`,
        officeAddress: params.adminProfile?.officeAddress || '',
        officePinCode: userPin,
        officialContactNumber: params.phone,
        location
      };
    }

    if (!this.isConfigured() || !supabase) {
      // Prototype Offline fallback
      const fallbackUser: AuthSessionUser = {
        id: `user-${Date.now()}`,
        email: params.email,
        fullName: params.fullName,
        role: params.role,
        facilityName: professionalProfile?.facilityName || params.facilityName,
        district: userDistrict,
        state: userState,
        phone: params.phone || '+91 98000 00000',
        location,
        professionalProfile,
        adminProfile
      };

      // Persist in localStorage for cross-page session continuity
      localStorage.setItem(`user_profile_${params.email.toLowerCase()}`, JSON.stringify(fallbackUser));
      return { user: fallbackUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            role: params.role,
            phone: params.phone,
            facility_name: professionalProfile?.facilityName || params.facilityName,
            district: userDistrict,
            state: userState,
            city: userCity,
            pin_code: userPin,
            professional_profile: professionalProfile,
            admin_profile: adminProfile
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from signup');

      // Best-effort profile sync
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: params.email,
          full_name: params.fullName,
          role: params.role,
          facility_name: professionalProfile?.facilityName || params.facilityName,
          phone: params.phone,
          district: userDistrict,
          state: userState
        });
      } catch (profileErr) {
        // Handled by trigger
      }

      const sessionUser: AuthSessionUser = {
        id: data.user.id,
        email: data.user.email || params.email,
        fullName: params.fullName,
        role: params.role,
        facilityName: professionalProfile?.facilityName || params.facilityName,
        district: userDistrict,
        state: userState,
        phone: params.phone,
        location,
        professionalProfile,
        adminProfile
      };

      localStorage.setItem(`user_profile_${params.email.toLowerCase()}`, JSON.stringify(sessionUser));
      return { user: sessionUser, error: null };
    } catch (err: any) {
      return { user: null, error: err };
    }
  },

  /**
   * Sign in with email and password (multi-region test personas aware)
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

    // MULTI-REGION TEST ACCOUNTS CONFIGURATION
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
          administrativeJurisdiction: 'Bengaluru Urban District Health Command',
          officeAddress: 'Anand Rao Circle, Bengaluru 560009',
          officePinCode: '560009',
          location: loc
        } : undefined
      };
      return { user: karnatakaUser, error: null };
    }

    // Default Demo Test Personas (Maharashtra / Pune)
    if (cleanEmail.includes('test') || cleanEmail.includes('pune') || !this.isConfigured() || !supabase) {
      const role: UserRole = cleanEmail.includes('admin') || cleanEmail.includes('dho')
        ? 'district_admin'
        : cleanEmail.includes('hospital') || cleanEmail.includes('doc')
        ? 'hospital'
        : 'patient';

      const loc: LocationInfo = { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411027' };
      const fallbackUser: AuthSessionUser = {
        id: `offline-${role}`,
        email: cleanEmail,
        fullName: role === 'patient' ? 'Rameshwar B. Jadhav' : role === 'hospital' ? 'Dr. Anjali Deshmukh' : 'Dr. Suresh Patil',
        role,
        facilityName: role === 'hospital' ? 'Aundh District Hospital, Pune' : undefined,
        district: 'Pune',
        state: 'Maharashtra',
        location: loc,
        professionalProfile: role === 'hospital' ? {
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
        } : undefined,
        adminProfile: role === 'district_admin' ? {
          adminRole: 'District Health Officer (DHO)',
          administratorId: 'DHO-PUNE-01',
          departmentOrAuthority: 'District Health Directorate',
          jurisdictionLevel: 'District',
          administrativeJurisdiction: 'Pune District Health Directorate',
          officeAddress: 'Collector Office Compound, Pune 411001',
          officePinCode: '411001',
          location: loc
        } : undefined
      };
      return { user: fallbackUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('User not found');

      // Fetch user profile from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const rawRole = (profile?.role || data.user.user_metadata?.role || 'patient').toString().toLowerCase();
      const role: UserRole = rawRole.includes('admin') ? 'district_admin' : rawRole.includes('hosp') ? 'hospital' : 'patient';

      const userState = profile?.state || data.user.user_metadata?.state;
      const userDistrict = profile?.district || data.user.user_metadata?.district;
      const userCity = profile?.city || data.user.user_metadata?.city;
      const userPin = profile?.pin_code || data.user.user_metadata?.pin_code;

      const loc: LocationInfo = {
        country: 'India',
        state: userState || '',
        district: userDistrict || '',
        city: userCity || '',
        pinCode: userPin || ''
      };

      const sessionUser: AuthSessionUser = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || 'User',
        role,
        facilityName: profile?.facility_name || data.user.user_metadata?.facility_name,
        district: userDistrict,
        state: userState,
        phone: profile?.phone || data.user.user_metadata?.phone,
        location: loc,
        professionalProfile: data.user.user_metadata?.professional_profile,
        adminProfile: data.user.user_metadata?.admin_profile
      };

      return { user: sessionUser, error: null };
    } catch (err: any) {
      return { user: null, error: err };
    }
  },

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    if (this.isConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        return { error };
      } catch (e: any) {
        return { error: e };
      }
    }
    return { error: null };
  },

  async updatePassword(password: string): Promise<{ error: Error | null }> {
    if (this.isConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.updateUser({ password });
        return { error };
      } catch (e: any) {
        return { error: e };
      }
    }
    return { error: null };
  },

  async signOut(): Promise<{ error: Error | null }> {
    if (this.isConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem('swasthyasync_auth_status');
    localStorage.removeItem('swasthyasync_active_role');
    return { error: null };
  }
};
