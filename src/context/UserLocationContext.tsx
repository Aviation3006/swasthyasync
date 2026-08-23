import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { LocationInfo, HealthcareProfessionalProfile, AdministratorProfile } from '../types/location';
import { patientService } from '../services/patientService';

interface UserLocationContextValue {
  location: LocationInfo;
  facility: HealthcareProfessionalProfile | null;
  jurisdiction: AdministratorProfile | null;
  getLocationDisplay: () => string;
  updateLocation: (newLoc: Partial<LocationInfo>) => void;
  updateFacility: (newFac: Partial<HealthcareProfessionalProfile>) => void;
  updateJurisdiction: (newJur: Partial<AdministratorProfile>) => void;
  isGpsActive: boolean;
  setGpsCoordinates: (coords: { lat: number; lng: number } | null) => void;
}

const DEFAULT_NATIONAL_LOCATION: LocationInfo = {
  country: 'India',
  state: '',
  district: '',
  city: '',
  locality: '',
  pinCode: ''
};

const UserLocationContext = createContext<UserLocationContextValue | undefined>(undefined);

export const UserLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, updateUser } = useAuth();

  // 1. Compute Base Location from User Profile
  const [location, setLocation] = useState<LocationInfo>(() => {
    if (user?.location) return user.location;
    if (role === 'patient') {
      const p = patientService.getPatientForUser(user);
      if (p.address) {
        return {
          country: 'India',
          state: p.address.state || user?.state || '',
          district: p.address.district || user?.district || '',
          city: p.address.village || '',
          locality: p.address.taluka || '',
          pinCode: p.address.pincode || ''
        };
      }
    }
    return {
      country: 'India',
      state: user?.state || '',
      district: user?.district || '',
      city: '',
      locality: '',
      pinCode: ''
    };
  });

  // 2. Sync with user changes
  useEffect(() => {
    if (user?.location) {
      setLocation(user.location);
    } else if (role === 'patient') {
      const p = patientService.getPatientForUser(user);
      if (p.address) {
        setLocation({
          country: 'India',
          state: p.address.state || user?.state || '',
          district: p.address.district || user?.district || '',
          city: p.address.village || '',
          locality: p.address.taluka || '',
          pinCode: p.address.pincode || ''
        });
      }
    } else if (user?.state || user?.district) {
      setLocation({
        country: 'India',
        state: user.state || '',
        district: user.district || '',
        city: user.professionalProfile?.location.city || user.adminProfile?.location.city || '',
        locality: '',
        pinCode: user.professionalProfile?.location.pinCode || user.adminProfile?.location.pinCode || ''
      });
    }
  }, [user, role]);

  // 3. Healthcare Facility Context (for Doctor / Hospital Staff)
  const facility = useMemo<HealthcareProfessionalProfile | null>(() => {
    if (role !== 'hospital') return null;
    if (user?.professionalProfile) return user.professionalProfile;

    return {
      professionalRole: 'Doctor',
      facilityName: user?.facilityName || 'Healthcare Facility',
      facilityType: 'District Hospital',
      department: 'General Medicine',
      designation: 'Medical Officer',
      location: location
    };
  }, [role, user, location]);

  // 4. Administrator Jurisdiction Context (for District Admin)
  const jurisdiction = useMemo<AdministratorProfile | null>(() => {
    if (role !== 'district_admin') return null;
    if (user?.adminProfile) return user.adminProfile;

    const dist = location.district || user?.district || 'District';
    return {
      adminRole: 'District Health Officer (DHO)',
      departmentOrAuthority: 'District Health Administration',
      jurisdictionLevel: 'District',
      administrativeJurisdiction: `${dist} District Health Administration`,
      location: location
    };
  }, [role, user, location]);

  // 5. GPS State
  const [isGpsActive, setIsGpsActive] = useState(false);

  const setGpsCoordinates = (coords: { lat: number; lng: number } | null) => {
    if (coords) {
      setLocation(prev => ({ ...prev, latitude: coords.lat, longitude: coords.lng }));
      setIsGpsActive(true);
    } else {
      setIsGpsActive(false);
    }
  };

  // 6. Formatted Location Display Helper
  const getLocationDisplay = (): string => {
    const city = location.city?.trim();
    const district = location.district?.trim();
    const state = location.state?.trim();

    if (city && state) return `${city}, ${state}`;
    if (district && state) return `${district}, ${state}`;
    if (city) return city;
    if (district) return district;
    if (state) return state;
    return 'Location not provided';
  };

  // 7. Mutators
  const updateLocation = (newLoc: Partial<LocationInfo>) => {
    const updated = { ...location, ...newLoc };
    setLocation(updated);
    if (user) {
      const updatedUser = {
        ...user,
        location: updated,
        district: updated.district,
        state: updated.state
      };
      if (updateUser) updateUser(updatedUser);
      localStorage.setItem('swasthyasync_user_location', JSON.stringify(updated));
    }
  };

  const updateFacility = (newFac: Partial<HealthcareProfessionalProfile>) => {
    if (!facility || !user) return;
    const updated = { ...facility, ...newFac };
    const updatedUser = { ...user, professionalProfile: updated, facilityName: updated.facilityName };
    if (updateUser) updateUser(updatedUser);
  };

  const updateJurisdiction = (newJur: Partial<AdministratorProfile>) => {
    if (!jurisdiction || !user) return;
    const updated = { ...jurisdiction, ...newJur };
    const updatedUser = { ...user, adminProfile: updated };
    if (updateUser) updateUser(updatedUser);
  };

  return (
    <UserLocationContext.Provider
      value={{
        location,
        facility,
        jurisdiction,
        getLocationDisplay,
        updateLocation,
        updateFacility,
        updateJurisdiction,
        isGpsActive,
        setGpsCoordinates
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = (): UserLocationContextValue => {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error('useUserLocation must be used within a UserLocationProvider');
  }
  return context;
};
