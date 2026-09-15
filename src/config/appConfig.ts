/**
 * Centralized Application Configuration & Security Gates
 * 
 * In production builds, VITE_ENABLE_DEMO_MODE must be absent or 'false'.
 * When demo mode is disabled (default in production), demo personas, local
 * authentication bypasses, and unverified sessions are strictly blocked,
 * and all authentication is delegated directly to Supabase.
 */

export const IS_DEMO_MODE: boolean = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

export const isDemoMode = (): boolean => IS_DEMO_MODE;

export const isProductionAuthRequired = (): boolean => !IS_DEMO_MODE;

export const APP_CONFIG = {
  isDemoMode: IS_DEMO_MODE,
  isProductionAuthRequired: !IS_DEMO_MODE,
  version: '1.0.0',
  environment: import.meta.env.MODE || 'production'
};
