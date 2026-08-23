export interface LocationInfo {
  country: string;
  state: string;
  stateCode?: string;
  district: string;
  districtCode?: string;
  city?: string;
  locality?: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
  administrativeJurisdiction?: string;
}

export type HealthcareProfessionalRole = 
  | 'Doctor' 
  | 'Nurse' 
  | 'Pharmacist' 
  | 'Lab Technician' 
  | 'Other Healthcare Professional';

export type HealthcareFacilityType =
  | 'Apex National Institute'
  | 'Teaching & Multispecialty Hospital'
  | 'District Hospital'
  | 'Sub-District Hospital'
  | 'Community Health Centre (CHC)'
  | 'Primary Health Centre (PHC)'
  | 'Specialty Hospital'
  | 'Private Hospital'
  | 'Clinic'
  | 'Medical College / Hospital'
  | 'General Hospital'
  | 'Other';

export interface HealthcareProfessionalProfile {
  professionalRole: HealthcareProfessionalRole;
  registrationNumber?: string;
  employeeId?: string;
  facilityId?: string;
  facilityName: string;
  facilityType: HealthcareFacilityType;
  department: string;
  designation: string;
  facilityAddress?: string;
  facilityPinCode?: string;
  facilityContact?: string;
  location: LocationInfo;
}

export type AdministratorRole = 
  | 'District Health Officer (DHO)'
  | 'Chief Medical Officer of Health (CMOH)'
  | 'District Epidemiologist'
  | 'District Surveillance Officer (DSO)'
  | 'Civil Surgeon'
  | 'District Nodal Officer'
  | 'Other Administrator';

export interface AdministratorProfile {
  adminRole: AdministratorRole;
  officialEmail?: string;
  administratorId?: string;
  departmentOrAuthority: string;
  jurisdictionLevel: 'District' | 'State' | 'National';
  administrativeJurisdiction: string;
  officeAddress?: string;
  officePinCode?: string;
  officialContactNumber?: string;
  location: LocationInfo;
}

export interface FacilityProfile {
  facilityId: string;
  facilityName: string;
  facilityType: HealthcareFacilityType;
  state: string;
  district: string;
  city?: string;
  address: string;
  pinCode: string;
  contactNumber: string;
  emergencyHelpline: string;
  departments: string[];
  totalBeds?: number;
  availableBeds?: number;
  icuBeds?: number;
  oxygenCylinders?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
