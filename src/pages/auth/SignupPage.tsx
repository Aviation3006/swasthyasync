import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { FormField } from '../../components/forms/FormField';
import { Select } from '../../components/forms/Select';
import { getAllStates, getDistrictsForState } from '../../data/indiaGeographicData';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  ShieldCheck, 
  AlertCircle,
  Activity,
  HeartPulse,
  CreditCard,
  Info
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

export const SignupPage: React.FC = () => {
  const { signUpWithEmail } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const { setThemeRole } = useTheme();
  const navigate = useNavigate();

  // Ensure patient theme is active on Signup page
  useEffect(() => {
    setThemeRole('patient');
  }, [setThemeRole]);

  // ---------------------------------------------------------------------------
  // 1. Account Information (Required)
  // ---------------------------------------------------------------------------
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [abhaNumber, setAbhaNumber] = useState('');
  const [abhaError, setAbhaError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ---------------------------------------------------------------------------
  // 2. Demographic Information
  // ---------------------------------------------------------------------------
  const allStates = getAllStates();
  const [state, setState] = useState(allStates[0] || 'Delhi (NCT)');
  const [district, setDistrict] = useState(
    () => getDistrictsForState(allStates[0] || 'Delhi (NCT)')[0] || 'New Delhi'
  );
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [pinCode, setPinCode] = useState('');

  // ---------------------------------------------------------------------------
  // 3. Basic Health Information (Optional)
  // ---------------------------------------------------------------------------
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [allergiesText, setAllergiesText] = useState<string>('');
  const [chronicConditionsText, setChronicConditionsText] = useState<string>('');
  const [currentMedicationsText, setCurrentMedicationsText] = useState<string>('');
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState<string>('Spouse');

  const [isLoading, setIsLoading] = useState(false);

  const handleStateChange = (newState: string) => {
    setState(newState);
    const districts = getDistrictsForState(newState);
    setDistrict(districts[0] || '');
  };

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Validate ABHA Number Format if provided
  const handleAbhaChange = (val: string) => {
    setAbhaNumber(val);
    if (!val.trim()) {
      setAbhaError(null);
      return;
    }
    const cleanDigits = val.replace(/\D/g, '');
    if (cleanDigits.length > 0 && cleanDigits.length !== 14) {
      setAbhaError('ABHA number must be 14 digits (e.g., 12-3456-7890-1234)');
    } else {
      setAbhaError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required Field Validations
    if (!fullName.trim()) {
      showError('Required Field Missing', 'Please enter your full legal name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      showError('Invalid Email Address', 'Please provide a valid email address.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      showError('Invalid Mobile Number', 'Please provide a valid 10-digit Indian mobile number.');
      return;
    }

    // Optional ABHA validation check before submit
    if (abhaNumber.trim()) {
      const cleanDigits = abhaNumber.replace(/\D/g, '');
      if (cleanDigits.length !== 14) {
        showError('Invalid ABHA Number', 'If provided, ABHA Number must contain exactly 14 digits.');
        setAbhaError('ABHA number must be 14 digits (e.g., 12-3456-7890-1234)');
        return;
      }
    }

    if (!password || password.length < 6) {
      showError('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Password Mismatch', 'The password confirmation does not match.');
      return;
    }

    setIsLoading(true);

    try {
      const allergiesList = allergiesText.trim() 
        ? allergiesText.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const chronicConditionsList = chronicConditionsText.trim()
        ? chronicConditionsText.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const medicationsList = currentMedicationsText.trim()
        ? currentMedicationsText.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const calculatedAge = dob ? calculateAge(dob) : 0;

      // CRITICAL AUTHORIZATION BOUNDARY:
      // Public signup is strictly locked to role = 'patient'.
      const { user: createdUser, error } = await signUpWithEmail({
        email: email.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        role: 'patient',
        phone: phone.trim(),
        abhaNumber: abhaNumber.trim() || undefined,
        dob: dob || undefined,
        age: calculatedAge > 0 ? calculatedAge : undefined,
        gender: gender,
        bloodGroup: (bloodGroup as any) || undefined,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        allergies: allergiesList,
        chronicConditions: chronicConditionsList,
        currentMedications: medicationsList,
        emergencyContactName: emergencyContactName.trim() || undefined,
        emergencyContactPhone: emergencyContactPhone.trim() || undefined,
        emergencyContactRelation: emergencyContactRelation.trim() || undefined,
        state,
        district,
        city: city.trim(),
        locality: locality.trim(),
        pinCode: pinCode.trim()
      });

      setIsLoading(false);

      if (error) {
        showError('Registration Failed', error.message || 'Could not register account.');
        return;
      }

      if (!createdUser) {
        showError('Registration Failed', 'The account could not be created. Please try again.');
        return;
      }

      showSuccess(
        'Account Registered Successfully',
        `Welcome to SwasthyaSync, ${fullName.trim()}! Your CareSetu digital health card is active.`
      );

      navigate('/patient');
    } catch (err: any) {
      setIsLoading(false);
      showError('Registration Error', err.message || 'An unexpected error occurred.');
    }
  };

  const districtsForSelectedState = getDistrictsForState(state);

  return (
    <div className="w-full max-w-2xl mx-auto my-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden">
        
        {/* Deep Burgundy/Pink Header */}
        <div className="bg-gradient-to-r from-[#4A0420] via-[#5C0628] to-[#360317] text-white p-6 sm:p-8 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-white/20 text-white border border-white/30 shadow-xs backdrop-blur-xs">
            <HeartPulse className="w-3.5 h-3.5 text-white" />
            <span>PATIENT PORTAL • CITIZEN REGISTRATION</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Patient Account
          </h2>

          <p className="text-xs sm:text-sm text-white/85 max-w-md mx-auto leading-relaxed">
            Register for your universal CareSetu smart health identity and connected clinical records.
          </p>
        </div>

        {/* Body Form */}
        <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          
          {/* Public Citizen Notice */}
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 text-xs text-slate-800 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#DB2777] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Citizen & Patient Health Locker</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Public registration is available exclusively for citizens and patients. Healthcare professionals and district administrators are provisioned separately through authorized institutional channels.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ================================================================= */}
            {/* SECTION A: ACCOUNT & IDENTITY INFORMATION (REQUIRED) */}
            {/* ================================================================= */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-pink-100">
                <User className="w-4 h-4 text-[#DB2777]" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  1. Account & Identity Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Legal Name" required>
                  <Input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rameshwar B. Jadhav"
                  />
                </FormField>

                <FormField label="Mobile Number" required helperText="10-digit Indian Mobile Number">
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9822451902"
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  />
                </FormField>

                <FormField label="Email Address" required helperText="Used for login and notifications">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  />
                </FormField>

                {/* Optional ABHA Number Field with Clarified Copy */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      ABHA Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <span className="text-[10px] font-semibold text-[#DB2777] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      Optional
                    </span>
                  </div>
                  <Input
                    type="text"
                    value={abhaNumber}
                    onChange={(e) => handleAbhaChange(e.target.value)}
                    placeholder="14-digit ABHA (e.g. 12-3456-7890-1234)"
                    leftIcon={<CreditCard className="w-4 h-4 text-slate-400" />}
                  />
                  {abhaError ? (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">{abhaError}</p>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Already have an ABHA? Add it to help connect your existing digital health records.
                    </p>
                  )}
                </div>

                <FormField label="Gender" required>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other / Prefer not to say' }
                    ]}
                  />
                </FormField>

                <FormField label="Date of Birth" helperText="Used for clinical age determination">
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </FormField>

                <FormField label="Password" required helperText="Minimum 6 characters">
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                </FormField>

                <FormField label="Confirm Password" required>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                </FormField>
              </div>
            </div>

            {/* ================================================================= */}
            {/* SECTION B: DEMOGRAPHIC & DOMICILE INFORMATION */}
            {/* ================================================================= */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-pink-100">
                <MapPin className="w-4 h-4 text-[#DB2777]" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  2. Domicile & Location Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="State / Union Territory" required>
                  <Select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    options={allStates.map((s) => ({ value: s, label: s }))}
                  />
                </FormField>

                <FormField label="District" required>
                  <Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    options={districtsForSelectedState.map((d) => ({ value: d, label: d }))}
                  />
                </FormField>

                <FormField label="City / Taluka / Block">
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune City"
                  />
                </FormField>

                <FormField label="Village / Locality / Sector">
                  <Input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Aundh"
                  />
                </FormField>

                <FormField label="Postal PIN Code">
                  <Input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="411027"
                  />
                </FormField>
              </div>
            </div>

            {/* ================================================================= */}
            {/* SECTION C: CLINICAL PROFILE & EMERGENCY ACCESS (OPTIONAL) */}
            {/* ================================================================= */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-pink-100">
                <Heart className="w-4 h-4 text-[#DB2777]" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  3. Clinical Profile & Emergency Access <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Blood Group">
                  <Select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    options={[
                      { value: '', label: 'Select Blood Group' },
                      { value: 'A+', label: 'A+' },
                      { value: 'A-', label: 'A-' },
                      { value: 'B+', label: 'B+' },
                      { value: 'B-', label: 'B-' },
                      { value: 'AB+', label: 'AB+' },
                      { value: 'AB-', label: 'AB-' },
                      { value: 'O+', label: 'O+' },
                      { value: 'O-', label: 'O-' }
                    ]}
                  />
                </FormField>

                <FormField label="Height (cm)">
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 172"
                  />
                </FormField>

                <FormField label="Weight (kg)">
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 68"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Known Drug / Food Allergies" helperText="Separate multiple allergies with commas">
                  <Input
                    type="text"
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts"
                  />
                </FormField>

                <FormField label="Chronic Conditions" helperText="e.g. Type 2 Diabetes, Hypertension">
                  <Input
                    type="text"
                    value={chronicConditionsText}
                    onChange={(e) => setChronicConditionsText(e.target.value)}
                    placeholder="e.g. Hypertension, Asthma"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <FormField label="Emergency Contact Name">
                  <Input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="e.g. Sunita Jadhav"
                  />
                </FormField>

                <FormField label="Emergency Contact Phone">
                  <Input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="9822000000"
                  />
                </FormField>

                <FormField label="Relationship">
                  <Select
                    value={emergencyContactRelation}
                    onChange={(e) => setEmergencyContactRelation(e.target.value)}
                    options={[
                      { value: 'Spouse', label: 'Spouse' },
                      { value: 'Parent', label: 'Parent' },
                      { value: 'Child', label: 'Child' },
                      { value: 'Sibling', label: 'Sibling' },
                      { value: 'Guardian', label: 'Guardian' },
                      { value: 'Other', label: 'Other' }
                    ]}
                  />
                </FormField>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 space-y-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="bg-[#DB2777] hover:bg-[#BE185D] text-white shadow-lg text-sm font-black tracking-wide py-3.5 focus:ring-[#F472B6]"
              >
                {isLoading ? "Creating Patient Account..." : "Create Patient Account & Generate CareSetu ID →"}
              </Button>

              <div className="text-center">
                <p className="text-xs text-slate-600">
                  Already registered with SwasthyaSync?{' '}
                  <Link to="/login" className="text-[#DB2777] hover:text-[#9D174D] font-extrabold underline">
                    Sign In to Your Account
                  </Link>
                </p>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
