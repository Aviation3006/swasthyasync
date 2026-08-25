import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { UserRole } from '../types/common';
import { RoleThemeConfig, ROLE_THEMES } from '../types/theme';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: RoleThemeConfig;
  role: UserRole;
  isPatient: boolean;
  isHospital: boolean;
  isAdmin: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();

  const currentRole: UserRole = role || 'patient';
  const theme = useMemo(() => ROLE_THEMES[currentRole] || ROLE_THEMES.patient, [currentRole]);

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
    }
  }, [currentRole, theme]);

  const value = useMemo(() => ({
    theme,
    role: currentRole,
    isPatient: currentRole === 'patient',
    isHospital: currentRole === 'hospital',
    isAdmin: currentRole === 'district_admin'
  }), [theme, currentRole]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback for unauthenticated / isolated components
    return {
      theme: ROLE_THEMES.patient,
      role: 'patient',
      isPatient: true,
      isHospital: false,
      isAdmin: false
    };
  }
  return context;
};
