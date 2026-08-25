export type UserRole = 'patient' | 'hospital' | 'district_admin';

export type Language = 
  | 'en' // English
  | 'as' // Assamese
  | 'bn' // Bengali
  | 'brx' // Bodo
  | 'doi' // Dogri
  | 'gu' // Gujarati
  | 'hi' // Hindi
  | 'kn' // Kannada
  | 'ks' // Kashmiri
  | 'kok' // Konkani
  | 'mai' // Maithili
  | 'ml' // Malayalam
  | 'mni' // Manipuri
  | 'mr' // Marathi
  | 'ne' // Nepali
  | 'or' // Odia
  | 'pa' // Punjabi
  | 'sa' // Sanskrit
  | 'sat' // Santali
  | 'sd' // Sindhi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'ur'; // Urdu

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'National / Global' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'North / Central India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra / Goa' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal / Tripura' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh / Telangana' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu / Puducherry' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat / Daman & Diu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala / Lakshadweep' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab / Chandigarh' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam' },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو', region: 'National / Telangana / J&K / UP' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', region: 'Goa / Konkan / Coastal Karnataka' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', region: 'Bihar / Jharkhand' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', region: 'Jammu & Kashmir' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'Sikkim / North Bengal' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', region: 'Classical / Pan-India' },
  { code: 'sd', name: 'Sindhi', nativeName: 'सिन्धी / سنڌي', region: 'Western India' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', region: 'Jammu' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', region: 'Manipur' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', region: 'Bodoland / Assam' },
  { code: 'sat', name: 'Santali', nativeName: 'संताली', region: 'Jharkhand / Odisha / West Bengal' }
];

import { LocationInfo, HealthcareProfessionalProfile, AdministratorProfile } from './location';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  facilityName?: string;
  district?: string;
  state?: string;
  avatarUrl?: string;
  abhaNumber?: string;
  phone: string;
  location?: LocationInfo;
  professionalProfile?: HealthcareProfessionalProfile;
  adminProfile?: AdministratorProfile;
}

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'urgent';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
