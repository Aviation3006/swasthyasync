import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { UserRole } from '../types/common';
import { RoleThemeConfig, ROLE_THEMES } from '../types/theme';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: RoleThemeConfig;
  role: UserRole;
  setThemeRole: (role: UserRole) => void;
  isPatient: boolean;
  isHospital: boolean;
  isAdmin: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role: authRole } = useAuth();
  const location = useLocation();

  // Determine initial role from URL path or query params if unauthenticated
  const getInitialRole = (): UserRole => {
    if (authRole) return authRole;
    if (typeof window !== 'undefined') {
      const path = location.pathname.toLowerCase();
      const search = new URLSearchParams(location.search);
      const roleParam = search.get('role');
      if (roleParam === 'hospital' || roleParam === 'district_admin' || roleParam === 'patient') {
        return roleParam as UserRole;
      }
      if (path.startsWith('/hospital')) return 'hospital';
      if (path.startsWith('/district-admin')) return 'district_admin';
    }
    return 'patient';
  };

  const [overrideRole, setOverrideRole] = useState<UserRole | null>(null);

  // Sync with authRole when user logs in or out
  useEffect(() => {
    if (authRole) {
      setOverrideRole(null);
    }
  }, [authRole]);

  // Sync with location change when switching routes directly
  useEffect(() => {
    if (!authRole) {
      const path = location.pathname.toLowerCase();
      const search = new URLSearchParams(location.search);
      const roleParam = search.get('role');
      if (roleParam === 'hospital' || roleParam === 'district_admin' || roleParam === 'patient') {
        setOverrideRole(roleParam as UserRole);
      } else if (path.startsWith('/hospital')) {
        setOverrideRole('hospital');
      } else if (path.startsWith('/district-admin')) {
        setOverrideRole('district_admin');
      } else if (path.startsWith('/signup') || path.startsWith('/patient')) {
        setOverrideRole('patient');
      }
    }
  }, [location.pathname, location.search, authRole]);

  const currentRole: UserRole = overrideRole || authRole || getInitialRole();
  const theme = useMemo(() => ROLE_THEMES[currentRole] || ROLE_THEMES.patient, [currentRole]);

  const setThemeRole = useCallback((newRole: UserRole) => {
    setOverrideRole(newRole);
  }, []);

  // Synchronize CSS variables and data-theme attribute on document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', currentRole);
      
      // Inject theme CSS variables directly for instant runtime reactivity
      root.style.setProperty('--theme-primary', theme.primary);
      root.style.setProperty('--theme-primary-hover', theme.primaryHover);
      root.style.setProperty('--theme-primary-light', theme.primaryLight);
      root.style.setProperty('--theme-primary-subtle', theme.primarySubtle);
      root.style.setProperty('--theme-primary-border', theme.primaryBorder);
      root.style.setProperty('--theme-text-accent', theme.textAccent);
      root.style.setProperty('--theme-ring', theme.ringColor);
      root.style.setProperty('--theme-background', theme.pageBackground);
      root.style.setProperty('--theme-border', theme.primaryLight);
      root.style.setProperty('--theme-sidebar-active', theme.primary);
    }
  }, [currentRole, theme]);

  const value = useMemo(() => ({
    theme,
    role: currentRole,
    setThemeRole,
    isPatient: currentRole === 'patient',
    isHospital: currentRole === 'hospital',
    isAdmin: currentRole === 'district_admin'
  }), [theme, currentRole, setThemeRole]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: ROLE_THEMES.patient,
      role: 'patient',
      setThemeRole: () => {},
      isPatient: true,
      isHospital: false,
      isAdmin: false
    };
  }
  return context;
};
