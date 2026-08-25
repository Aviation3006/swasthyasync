import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, Language } from '../types/common';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService, AuthSessionUser } from '../services/authService';
import { LocationInfo, HealthcareProfessionalProfile, AdministratorProfile } from '../types/location';

export interface DemoPersona {
  role: UserRole;
  user: User;
  badge: string;
  description: string;
  region: 'Maharashtra' | 'Delhi' | 'Karnataka';
}

// Multi-Region Demo Personas for Quick Switch and Testing
export const DEMO_PERSONAS: Record<string, DemoPersona> = {
  'patient-mh': {
    role: 'patient',
    region: 'Maharashtra',
    user: {
      id: 'pat-mh-001',
      name: 'Rameshwar B. Jadhav',
      email: 'patient.test@swasthasync.com',
      role: 'patient',
      roleTitle: 'Citizen / Patient (ABHA Verified)',
      district: 'Pune',
      state: 'Maharashtra',
      phone: '+91 98224 51902',
      facilityName: 'Aundh District Hospital (Attached)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: { country: 'India', state: 'Maharashtra', district: 'Pune', city: 'Pune', pinCode: '411027' }
    },
    badge: 'Citizen (Pune, Maharashtra)',
    description: '48 y/o male with Type 2 Diabetes & Hypertension history. ABHA Health Locker active.'
  },
  'hospital-mh': {
    role: 'hospital',
    region: 'Maharashtra',
    user: {
      id: 'doc-01',
      name: 'Dr. Anjali Deshmukh',
      email: 'hospital.test@swasthasync.com',
      role: 'hospital',
      roleTitle: 'Chief Medical Officer / Physician',
      facilityName: 'Aundh District Hospital, Pune',
      district: 'Pune',
      state: 'Maharashtra',
      phone: '+91 20 2728 0122',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
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
    },
    badge: 'CMO (Aundh DH, Pune)',
    description: 'Senior Physician & OPD In-charge managing clinical triage, appointments & digital Rx.'
  },
  'admin-mh': {
    role: 'district_admin',
    region: 'Maharashtra',
    user: {
      id: 'admin-dho-01',
      name: 'Dr. Suresh Patil',
      email: 'admin.test@swasthasync.com',
      role: 'district_admin',
      roleTitle: 'District Health Officer (DHO)',
      facilityName: 'District Health Directorate',
      district: 'Pune',
      state: 'Maharashtra',
      phone: '+91 20 2605 1888',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
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
    },
    badge: 'DHO (Pune District)',
    description: 'District Administrator overseeing bed capacity, disease surveillance & public health alerts.'
  },

  // Delhi Test Personas
  'patient-delhi': {
    role: 'patient',
    region: 'Delhi',
    user: {
      id: 'pat-del-001',
      name: 'Ankit Sharma',
      email: 'patient.delhi@swasthasync.com',
      role: 'patient',
      roleTitle: 'Citizen / Patient (Delhi)',
      district: 'West Delhi',
      state: 'Delhi (NCT)',
      phone: '+91 98110 23456',
      facilityName: 'Deen Dayal Upadhyay Hospital (Attached)',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      location: { country: 'India', state: 'Delhi (NCT)', district: 'West Delhi', city: 'Paschim Vihar', pinCode: '110063' }
    },
    badge: 'Citizen (West Delhi, Delhi)',
    description: 'Resident of Paschim Vihar, West Delhi. Longitudinal health records active.'
  },
  'hospital-delhi': {
    role: 'hospital',
    region: 'Delhi',
    user: {
      id: 'doc-del-01',
      name: 'Dr. Rajiv Malhotra',
      email: 'hospital.delhi@swasthasync.com',
      role: 'hospital',
      roleTitle: 'Senior Consultant & HOD',
      facilityName: 'Deen Dayal Upadhyay Hospital (DDU)',
      district: 'West Delhi',
      state: 'Delhi (NCT)',
      phone: '+91 11 2549 4402',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
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
    },
    badge: 'HOD (DDU Hospital, West Delhi)',
    description: 'Lead Physician managing OPD queues and triage at Deen Dayal Upadhyay Hospital, West Delhi.'
  },
  'admin-delhi': {
    role: 'district_admin',
    region: 'Delhi',
    user: {
      id: 'admin-del-01',
      name: 'Dr. Alok Verma',
      email: 'admin.delhi@swasthasync.com',
      role: 'district_admin',
      roleTitle: 'Chief District Medical Officer (CDMO)',
      facilityName: 'West Delhi District Health Directorate',
      district: 'West Delhi',
      state: 'Delhi (NCT)',
      phone: '+91 11 2598 4744',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
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
    },
    badge: 'CDMO (West Delhi District)',
    description: 'District Health Administrator overseeing bed monitoring and IDSP surveillance across West Delhi.'
  },

  // Karnataka Test Personas
  'patient-karnataka': {
    role: 'patient',
    region: 'Karnataka',
    user: {
      id: 'pat-ka-001',
      name: 'Vijay Kumar',
      email: 'patient.karnataka@swasthasync.com',
      role: 'patient',
      roleTitle: 'Citizen / Patient (Karnataka)',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      phone: '+91 98450 12345',
      facilityName: 'Victoria Hospital (Attached)',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560002' }
    },
    badge: 'Citizen (Bengaluru Urban, Karnataka)',
    description: 'Resident of Malleshwaram, Bengaluru Urban. Integrated CareSetu Smart Health Card profile.'
  },
  'hospital-karnataka': {
    role: 'hospital',
    region: 'Karnataka',
    user: {
      id: 'doc-ka-01',
      name: 'Dr. Ramesh Rao',
      email: 'hospital.karnataka@swasthasync.com',
      role: 'hospital',
      roleTitle: 'Chief Medical Officer / Surgeon',
      facilityName: 'Victoria Hospital & Bangalore Medical College',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      phone: '+91 80 2670 1150',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
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
    },
    badge: 'CMO (Victoria Hospital, Bengaluru)',
    description: 'Senior Physician & Hospital In-charge at Victoria Hospital, Bangalore Medical College.'
  },
  'admin-karnataka': {
    role: 'district_admin',
    region: 'Karnataka',
    user: {
      id: 'admin-ka-01',
      name: 'Dr. Nandita Hegde',
      email: 'admin.karnataka@swasthasync.com',
      role: 'district_admin',
      roleTitle: 'District Health Officer (DHO)',
      facilityName: 'Bengaluru Urban District Health Command',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      phone: '+91 80 2221 3456',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560009' },
      adminProfile: {
        adminRole: 'Chief Medical Officer of Health (CMOH)',
        administratorId: 'DHO-BLR-URBAN-01',
        departmentOrAuthority: 'Karnataka State Health & Family Welfare Directorate',
        jurisdictionLevel: 'District',
        administrativeJurisdiction: 'Bengaluru Urban District Health Command',
        officeAddress: 'Anand Rao Circle, Bengaluru 560009',
        officePinCode: '560009',
        location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', pinCode: '560009' }
      }
    },
    badge: 'DHO (Bengaluru Urban District)',
    description: 'District Administrator managing bed availability & epidemiological alerts for Bengaluru Urban.'
  }
};

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  switchRole: (role: UserRole) => void;
  signInWithPersona: (personaKey: string) => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ user: User | null; error: Error | null }>;
  signUpWithEmail: (params: {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
    abhaNumber?: string;
    phone: string;
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
  }) => Promise<{ user: User | null; error: Error | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  isConfigured: boolean;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('swasthyasync_active_role') as UserRole) || 'patient';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('swasthyasync_language') as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swasthyasync_language', lang);
    if (lang === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  }, []);

  useEffect(() => {
    if (language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session on mount from Supabase Auth or Local Storage
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            const rawRole = (profile?.role || session.user.user_metadata?.role || 'patient').toString().toLowerCase();
            const mappedRole: UserRole = rawRole.includes('admin')
              ? 'district_admin'
              : rawRole.includes('hosp')
              ? 'hospital'
              : 'patient';

            const userState = profile?.state || session.user.user_metadata?.state;
            const userDistrict = profile?.district || session.user.user_metadata?.district;
            const userCity = profile?.city || session.user.user_metadata?.city;
            const userPin = profile?.pin_code || session.user.user_metadata?.pin_code;

            const loc: LocationInfo = {
              country: 'India',
              state: userState || '',
              district: userDistrict || '',
              city: userCity || '',
              pinCode: userPin || ''
            };

            const appUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
              role: mappedRole,
              roleTitle: mappedRole === 'patient' ? 'Citizen Patient' : mappedRole === 'hospital' ? 'Chief Medical Officer' : 'District Health Officer',
              district: userDistrict,
              state: userState,
              phone: profile?.phone || session.user.user_metadata?.phone || '+91 98000 00000',
              facilityName: profile?.facility_name || session.user.user_metadata?.facility_name,
              location: loc,
              professionalProfile: session.user.user_metadata?.professional_profile,
              adminProfile: session.user.user_metadata?.admin_profile
            };

            setUser(appUser);
            setRole(mappedRole);
            setIsAuthenticated(true);
            localStorage.setItem('swasthyasync_active_role', mappedRole);
            localStorage.setItem('swasthyasync_auth_status', 'true');
          } else if (mounted) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.setItem('swasthyasync_auth_status', 'false');
          }
        } catch (e) {
          if (mounted) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      if (mounted) {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('swasthyasync_active_role', newRole);
    const personaKey = `${newRole}-mh`;
    const defaultPersona = DEMO_PERSONAS[personaKey] || DEMO_PERSONAS['patient-mh'];
    setUser(defaultPersona.user);
    setIsAuthenticated(true);
    localStorage.setItem('swasthyasync_auth_status', 'true');
  };

  const signInWithPersona = (personaKey: string) => {
    const persona = DEMO_PERSONAS[personaKey] || DEMO_PERSONAS['patient-mh'];
    setRole(persona.role);
    setUser(persona.user);
    setIsAuthenticated(true);
    localStorage.setItem('swasthyasync_active_role', persona.role);
    localStorage.setItem('swasthyasync_auth_status', 'true');
  };

  const signInWithEmail = async (email: string, pass: string): Promise<{ user: User | null; error: Error | null }> => {
    setIsLoading(true);
    const { user: sessionUser, error } = await authService.signIn(email, pass);
    setIsLoading(false);

    if (error) {
      return { user: null, error };
    }

    if (sessionUser) {
      const appUser: User = {
        id: sessionUser.id,
        name: sessionUser.fullName,
        email: sessionUser.email,
        role: sessionUser.role,
        roleTitle: sessionUser.role === 'patient' ? 'Citizen Patient (ABHA Verified)' : sessionUser.role === 'hospital' ? 'Chief Medical Officer' : 'District Health Officer',
        district: sessionUser.district,
        state: sessionUser.state,
        phone: sessionUser.phone || '+91 98000 00000',
        facilityName: sessionUser.facilityName,
        location: sessionUser.location,
        professionalProfile: sessionUser.professionalProfile,
        adminProfile: sessionUser.adminProfile
      };
      setUser(appUser);
      setRole(sessionUser.role);
      setIsAuthenticated(true);
      localStorage.setItem('swasthyasync_active_role', sessionUser.role);
      localStorage.setItem('swasthyasync_auth_status', 'true');
      return { user: appUser, error: null };
    }

    return { user: null, error: null };
  };

  const signUpWithEmail = async (params: {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
    abhaNumber?: string;
    phone: string;
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
  }): Promise<{ user: User | null; error: Error | null }> => {
    setIsLoading(true);
    const { user: sessionUser, error } = await authService.signUp(params);
    setIsLoading(false);

    if (error) {
      return { user: null, error };
    }

    if (sessionUser) {
      const appUser: User = {
        id: sessionUser.id,
        name: sessionUser.fullName,
        email: sessionUser.email,
        role: sessionUser.role,
        roleTitle: 'Citizen / Patient (Registered)',
        abhaNumber: sessionUser.abhaNumber,
        district: sessionUser.district,
        state: sessionUser.state,
        phone: sessionUser.phone || '+91 98000 00000',
        facilityName: sessionUser.facilityName,
        location: sessionUser.location,
        professionalProfile: sessionUser.professionalProfile,
        adminProfile: sessionUser.adminProfile
      };
      setUser(appUser);
      setRole(sessionUser.role);
      setIsAuthenticated(true);
      localStorage.setItem('swasthyasync_active_role', sessionUser.role);
      localStorage.setItem('swasthyasync_auth_status', 'true');
      return { user: appUser, error: null };
    }

    return { user: null, error: null };
  };

  const signOut = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('swasthyasync_cached_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        language,
        setLanguage,
        switchRole,
        signInWithPersona,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        logout: signOut,
        isConfigured: authService.isConfigured(),
        resetPassword: async (email: string) => authService.resetPassword(email),
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
