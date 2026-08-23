import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { FormField } from '../../components/forms/FormField';
import { Select } from '../../components/forms/Select';
import { UserRole } from '../../types/common';
import { 
  HealthcareProfessionalRole, 
  HealthcareFacilityType, 
  AdministratorRole 
} from '../../types/location';
import { getAllStates, getDistrictsForState } from '../../data/indiaGeographicData';
import { 
  Building2, 
  User, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Stethoscope, 
  FileText,
  BadgeCheck
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signUpWithEmail } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Role Selection: 'patient' | 'hospital' | 'district_admin'
  const [role, setRole] = useState<UserRole>('patient');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Common Account Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Location Fields (Pan-India)
  const allStates = getAllStates();
  const [state, setState] = useState(allStates[0] || 'Delhi (NCT)');
  const [district, setDistrict] = useState(() => getDistrictsForState(allStates[0] || 'Delhi (NCT)')[0] || 'New Delhi');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Doctor / Healthcare Professional Fields
  const [profRole, setProfRole] = useState<HealthcareProfessionalRole>('Doctor');
  const [regNumber, setRegNumber] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('General Medicine');
  const [designation, setDesignation] = useState('Senior Consultant');
  const [facilityName, setFacilityName] = useState('');
  const [facilityType, setFacilityType] = useState<HealthcareFacilityType>('District Hospital');
  const [facilityAddress, setFacilityAddress] = useState('');

  // District Admin Fields
  const [adminRole, setAdminRole] = useState<AdministratorRole>('District Health Officer (DHO)');
  const [administratorId, setAdministratorId] = useState('');
  const [departmentOrAuthority, setDepartmentOrAuthority] = useState('District Health Directorate');
  const [administrativeJurisdiction, setAdministrativeJurisdiction] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  const handleStateChange = (newState: string) => {
    setState(newState);
    const distList = getDistrictsForState(newState);
    const defaultDist = distList[0] || '';
    setDistrict(defaultDist);
    if (role === 'district_admin') {
      setAdministrativeJurisdiction(`${defaultDist} District Health Directorate`);
    }
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    if (role === 'district_admin' && !administrativeJurisdiction) {
      setAdministrativeJurisdiction(`${newDist} District Health Directorate`);
    }
  };

  const totalSteps = role === 'patient' ? 2 : 3;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        showError('Missing Fields', 'Please provide full name, email, and password.');
        return;
      }
      if (password.length < 6) {
        showError('Weak Password', 'Password must be at least 6 characters.');
        return;
      }
    }

    if (currentStep === 2 && role !== 'patient') {
      if (role === 'hospital' && (!department.trim() || !designation.trim())) {
        showError('Incomplete Information', 'Please fill in your professional department and designation.');
        return;
      }
      if (role === 'district_admin' && (!departmentOrAuthority.trim())) {
        showError('Incomplete Information', 'Please provide your health authority department.');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state || !district) {
      showError('Location Required', 'Please select your State and District.');
      return;
    }

    if (role === 'hospital' && !facilityName.trim()) {
      showError('Facility Name Required', 'Please specify your hospital or healthcare facility name.');
      return;
    }

    setIsLoading(true);

    try {
      const { user: createdUser, error } = await signUpWithEmail({
        email: email.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        role,
        phone: phone.trim() || '+91 98000 00000',
        state,
        district,
        city: city.trim(),
        locality: locality.trim(),
        pinCode: pinCode.trim(),
        facilityName: role === 'hospital' ? facilityName.trim() : undefined,
        professionalProfile: role === 'hospital' ? {
          professionalRole: profRole,
          registrationNumber: regNumber.trim(),
          employeeId: employeeId.trim(),
          facilityName: facilityName.trim(),
          facilityType,
          department: department.trim(),
          designation: designation.trim(),
          facilityAddress: facilityAddress.trim(),
          facilityPinCode: pinCode.trim(),
          location: {
            country: 'India',
            state,
            district,
            city: city.trim(),
            pinCode: pinCode.trim()
          }
        } : undefined,
        adminProfile: role === 'district_admin' ? {
          adminRole,
          administratorId: administratorId.trim(),
          departmentOrAuthority: departmentOrAuthority.trim(),
          jurisdictionLevel: 'District',
          administrativeJurisdiction: administrativeJurisdiction.trim() || `${district} District Health Directorate`,
          officeAddress: officeAddress.trim(),
          officePinCode: pinCode.trim(),
          location: {
            country: 'India',
            state,
            district,
            city: city.trim(),
            pinCode: pinCode.trim()
          }
        } : undefined
      });

      setIsLoading(false);

      if (error) {
        showError('Registration Notice', error.message || 'Could not register account.');
        return;
      }

      showSuccess(
        'Account Registered Successfully',
        role === 'patient' 
          ? 'Welcome to SwasthyaSync! Your digital health profile is active.' 
          : role === 'hospital' 
          ? `Welcome Dr. ${fullName}! Your clinical workspace at ${facilityName} is ready.` 
          : `Welcome Administrator! Your command console for ${district} is ready.`
      );

      if (role === 'patient') navigate('/patient');
      else if (role === 'hospital') navigate('/hospital');
      else navigate('/district-admin');
    } catch (err: any) {
      setIsLoading(false);
      showError('Error', err.message || 'An unexpected error occurred during signup.');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {t.createAccount}
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {role === 'patient' 
            ? 'Unified Digital Health Profile & ABHA Health Locker' 
            : role === 'hospital' 
            ? 'Healthcare Professional Onboarding & Hospital Staff Portal' 
            : 'District Health Administration & Epidemiological Command'}
        </p>
      </div>

      {/* Role Selector Card Grid */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => { setRole('patient'); setCurrentStep(1); }}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all ${
            role === 'patient'
              ? 'bg-white text-emerald-950 font-extrabold shadow-sm border border-emerald-500/30 ring-1 ring-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <User className={`w-4 h-4 ${role === 'patient' ? 'text-emerald-700' : 'text-slate-400'}`} />
          <span className="text-[11px] leading-tight">Citizen Patient</span>
        </button>

        <button
          type="button"
          onClick={() => { setRole('hospital'); setCurrentStep(1); }}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all ${
            role === 'hospital'
              ? 'bg-white text-emerald-950 font-extrabold shadow-sm border border-emerald-500/30 ring-1 ring-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <Building2 className={`w-4 h-4 ${role === 'hospital' ? 'text-emerald-700' : 'text-slate-400'}`} />
          <span className="text-[11px] leading-tight">Doctor / Hospital</span>
        </button>

        <button
          type="button"
          onClick={() => { setRole('district_admin'); setCurrentStep(1); }}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all ${
            role === 'district_admin'
              ? 'bg-white text-emerald-950 font-extrabold shadow-sm border border-emerald-500/30 ring-1 ring-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 font-semibold'
          }`}
        >
          <Shield className={`w-4 h-4 ${role === 'district_admin' ? 'text-emerald-700' : 'text-slate-400'}`} />
          <span className="text-[11px] leading-tight">District Admin</span>
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between px-2 pt-1 border-b border-slate-100 pb-3">
        <span className="text-xs font-bold text-slate-700">
          Step {currentStep} of {totalSteps}: {
            currentStep === 1 
              ? 'Account Credentials' 
              : currentStep === 2 && role === 'hospital'
              ? 'Professional Information'
              : currentStep === 2 && role === 'district_admin'
              ? 'Administrative Authority'
              : 'Geographic Location & Facility'
          }
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`w-5 h-1.5 rounded-full transition-all ${
                i + 1 === currentStep ? 'bg-emerald-700 w-8' : i + 1 < currentStep ? 'bg-emerald-400' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ================= STEP 1: ACCOUNT CREDENTIALS ================= */}
        {currentStep === 1 && (
          <div className="space-y-3 animate-fade-in">
            <FormField label={t.fullName} required>
              <Input
                placeholder={role === 'hospital' ? 'Dr. Priya Sharma' : 'e.g. Rameshwar Jadhav / Ankit Sharma'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </FormField>

            <FormField label={role === 'patient' ? 'Email Address' : 'Official Work Email'} required>
              <Input
                type="email"
                placeholder={
                  role === 'hospital' 
                    ? 'doctor.name@hospital.org' 
                    : role === 'district_admin'
                    ? 'dho.district@health.gov.in'
                    : 'user@example.com'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label={t.password} required>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Mobile Contact" required>
                <Input
                  type="tel"
                  placeholder="+91 98000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </FormField>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PROFESSIONAL DETAILS (HOSPITAL / DOCTOR) ================= */}
        {currentStep === 2 && role === 'hospital' && (
          <div className="space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Professional Role" required>
                <Select
                  value={profRole}
                  onChange={(e) => setProfRole(e.target.value as HealthcareProfessionalRole)}
                  options={[
                    { value: 'Doctor', label: 'Doctor / Physician / Surgeon' },
                    { value: 'Nurse', label: 'Nursing Officer / Staff Nurse' },
                    { value: 'Pharmacist', label: 'Clinical Pharmacist' },
                    { value: 'Lab Technician', label: 'Medical Lab Technician' },
                    { value: 'Other Healthcare Professional', label: 'Other Healthcare Professional' }
                  ]}
                />
              </FormField>

              <FormField label="Medical / Council Registration No.">
                <Input
                  placeholder="e.g. MCI-2018-9841 / DMC-4421"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Clinical Department" required>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  options={[
                    { value: 'General Medicine', label: 'General Medicine & Internal Medicine' },
                    { value: 'Cardiology', label: 'Cardiology' },
                    { value: 'Pediatrics', label: 'Pediatrics & Neonatology' },
                    { value: 'Orthopedics', label: 'Orthopedics & Joint Care' },
                    { value: 'General Surgery', label: 'General Surgery' },
                    { value: 'Obstetrics & Gynaecology', label: 'Obstetrics & Gynaecology' },
                    { value: 'Emergency Medicine', label: 'Emergency & Trauma Care' },
                    { value: 'Neurology', label: 'Neurology' },
                    { value: 'Pulmonology', label: 'Pulmonology & Chest' },
                    { value: 'Dermatology', label: 'Dermatology' }
                  ]}
                />
              </FormField>

              <FormField label="Clinical Designation" required>
                <Input
                  placeholder="e.g. Chief Medical Officer / Senior Consultant"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <FormField label="Employee ID / Hospital Staff Code">
              <Input
                placeholder="e.g. EMP-HOSP-8012"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </FormField>
          </div>
        )}

        {/* ================= STEP 2: ADMINISTRATIVE JURISDICTION (DISTRICT ADMIN) ================= */}
        {currentStep === 2 && role === 'district_admin' && (
          <div className="space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Administrative Role" required>
                <Select
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value as AdministratorRole)}
                  options={[
                    { value: 'District Health Officer (DHO)', label: 'District Health Officer (DHO)' },
                    { value: 'Chief Medical Officer of Health (CMOH)', label: 'Chief Medical Officer of Health (CMOH)' },
                    { value: 'District Epidemiologist', label: 'District Epidemiologist & IDSP In-Charge' },
                    { value: 'District Surveillance Officer (DSO)', label: 'District Surveillance Officer (DSO)' },
                    { value: 'Civil Surgeon', label: 'Civil Surgeon / Superintendent' },
                    { value: 'District Nodal Officer', label: 'District Nodal Officer' }
                  ]}
                />
              </FormField>

              <FormField label="Official Administrator ID">
                <Input
                  placeholder="e.g. DHO-ADMIN-2026-01"
                  value={administratorId}
                  onChange={(e) => setAdministratorId(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Health Authority / Department" required>
              <Input
                placeholder="e.g. Directorate of Health Services / Public Health Department"
                value={departmentOrAuthority}
                onChange={(e) => setDepartmentOrAuthority(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Official Administrative Office Address">
              <Input
                placeholder="e.g. District Collectorate Compound, Health Office"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
              />
            </FormField>
          </div>
        )}

        {/* ================= FINAL STEP: GEOGRAPHY & HEALTHCARE FACILITY ================= */}
        {((role === 'patient' && currentStep === 2) || (role !== 'patient' && currentStep === 3)) && (
          <div className="space-y-3 animate-fade-in">
            
            {/* State & District Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="State / Union Territory" required>
                <Select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  options={allStates.map(s => ({ value: s, label: s }))}
                />
              </FormField>

              <FormField label="District Jurisdiction" required>
                <Select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  options={getDistrictsForState(state).map(d => ({ value: d, label: d }))}
                />
              </FormField>
            </div>

            {/* City & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label={role === 'patient' ? 'City / Town / Village' : 'City / District Headquarters'}>
                <Input
                  placeholder="e.g. New Delhi / Paschim Vihar / Bengaluru / Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </FormField>

              <FormField label="Postal PIN Code">
                <Input
                  placeholder="e.g. 110063 / 560002 / 411027"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </FormField>
            </div>

            {/* Hospital Specific Facility Inputs */}
            {role === 'hospital' && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  Healthcare Facility Profile
                </div>

                <FormField label="Hospital / Facility Name" required>
                  <Input
                    placeholder="e.g. Deen Dayal Upadhyay Hospital / Victoria Hospital"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    required
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Facility Type" required>
                    <Select
                      value={facilityType}
                      onChange={(e) => setFacilityType(e.target.value as HealthcareFacilityType)}
                      options={[
                        { value: 'District Hospital', label: 'District Hospital' },
                        { value: 'Teaching & Multispecialty Hospital', label: 'Teaching / Medical College Hospital' },
                        { value: 'Apex National Institute', label: 'Apex National Institute (AIIMS/NIMHANS)' },
                        { value: 'Sub-District Hospital', label: 'Sub-District Hospital (SDH)' },
                        { value: 'Community Health Centre (CHC)', label: 'Community Health Centre (CHC)' },
                        { value: 'Primary Health Centre (PHC)', label: 'Primary Health Centre (PHC)' },
                        { value: 'Private Hospital', label: 'Private Empaneled Hospital' },
                        { value: 'Clinic', label: 'Specialty Clinic / Day Care' }
                      ]}
                    />
                  </FormField>

                  <FormField label="Facility Address">
                    <Input
                      placeholder="e.g. Clock Tower, Hari Nagar"
                      value={facilityAddress}
                      onChange={(e) => setFacilityAddress(e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Admin Specific Jurisdiction Header */}
            {role === 'district_admin' && (
              <FormField label="Administrative Jurisdiction Title" required>
                <Input
                  placeholder={`${district} District Health Directorate`}
                  value={administrativeJurisdiction}
                  onChange={(e) => setAdministrativeJurisdiction(e.target.value)}
                  required
                />
              </FormField>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={handlePrevStep}
            >
              Previous
            </Button>
          ) : <div />}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleNextStep}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Continue →
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Complete Registration & Access Portal
            </Button>
          )}
        </div>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-emerald-800 hover:text-emerald-950 underline">
          {t.signIn}
        </Link>
      </div>
    </div>
  );
};
