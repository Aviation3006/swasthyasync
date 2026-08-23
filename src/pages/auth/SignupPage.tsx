import React, { useState } from 'react';
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
  Droplet,
  PhoneCall,
  Info
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signUpWithEmail } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // 1. Account Information (Required)
  // ---------------------------------------------------------------------------
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

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
    return Math.abs(ageDate.getUTCFullYear() - 1970) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required Field Validations
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      showError('Missing Fields', 'Please provide your full name, email, and password.');
      return;
    }

    if (password.length < 6) {
      showError('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Password Mismatch', 'The passwords entered do not match. Please re-enter.');
      return;
    }

    if (!phone.trim()) {
      showError('Phone Number Required', 'Please enter your mobile contact number.');
      return;
    }

    if (!state || !district) {
      showError('Location Required', 'Please select your State and District.');
      return;
    }

    setIsLoading(true);

    try {
      // Parse optional list fields
      const allergiesList = allergiesText
        ? allergiesText.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const chronicConditionsList = chronicConditionsText
        ? chronicConditionsText.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const medicationsList = currentMedicationsText
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
      showError('Registration Error', err?.message || 'An unexpected error occurred during signup.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-10 space-y-8 animate-fade-in">
        
        {/* Header & Registration Advisory */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Citizen / Patient Registration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Your Health Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Register for your universal CareSetu smart health identity and connected clinical records.
          </p>
        </div>

        {/* Public Citizen Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">Citizen / Patient Registration Portal</p>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              Public registration is available exclusively for citizens and patients. Healthcare professionals and district administrators are provisioned separately through authorized institutional channels.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ================================================================= */}
          {/* SECTION A: ACCOUNT INFORMATION (REQUIRED) */}
          {/* ================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                1. Account Information <span className="text-rose-500 text-xs font-normal">(Required)</span>
              </h3>
            </div>

            <FormField label="Full Name" required>
              <Input
                placeholder="e.g. Rameshwar Baburao Jadhav"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Mobile Phone Number" required>
                <Input
                  type="tel"
                  placeholder="+91 98224 51902"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Confirm Password" required>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </FormField>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SECTION B: BASIC DEMOGRAPHICS */}
          {/* ================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                2. Basic Demographics & Residential Location
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Date of Birth">
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </FormField>

              <FormField label="Gender" required>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other / Non-binary' }
                  ]}
                />
              </FormField>
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
                  options={getDistrictsForState(state).map((d) => ({ value: d, label: d }))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="City / Town / Village">
                <Input
                  placeholder="e.g. Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </FormField>

              <FormField label="Postal PIN Code">
                <Input
                  placeholder="e.g. 411027"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Locality / Residential Address">
              <Input
                placeholder="e.g. Chikhalwadi, Near Aundh Bus Stop"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
              />
            </FormField>
          </div>

          {/* ================================================================= */}
          {/* SECTION C: BASIC HEALTH INFORMATION (OPTIONAL) */}
          {/* ================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  3. Basic Health Information (Optional)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>

            <p className="text-xs text-slate-500">
              This information helps populate your CareSetu health profile. You can leave any or all of these blank and fill them later.
            </p>

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
                  placeholder="e.g. 172"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min={50}
                  max={250}
                />
              </FormField>

              <FormField label="Weight (kg)">
                <Input
                  type="number"
                  placeholder="e.g. 68"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min={10}
                  max={300}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Known Drug/Food Allergies">
                <Input
                  placeholder="e.g. Penicillin, Peanuts, Sulfa"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                />
              </FormField>

              <FormField label="Existing Medical Conditions">
                <Input
                  placeholder="e.g. Type 2 Diabetes, Hypertension"
                  value={chronicConditionsText}
                  onChange={(e) => setChronicConditionsText(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Current Daily Medications">
              <Input
                placeholder="e.g. Metformin 500mg, Telmisartan 40mg"
                value={currentMedicationsText}
                onChange={(e) => setCurrentMedicationsText(e.target.value)}
              />
            </FormField>

            {/* Emergency Contact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                Emergency Contact Details (Optional)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Contact Person Name">
                  <Input
                    placeholder="e.g. Sunita Jadhav"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
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
                      { value: 'Friend', label: 'Friend / Other' }
                    ]}
                  />
                </FormField>

                <FormField label="Emergency Contact Number">
                  <Input
                    type="tel"
                    placeholder="+91 98224 51903"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-lg py-3 rounded-2xl text-sm tracking-wide"
              isLoading={isLoading}
            >
              {isLoading ? 'Creating Citizen Account...' : 'Create Citizen Health Account'}
            </Button>

            <p className="text-center text-xs text-slate-500">
              Already registered on SwasthyaSync?{' '}
              <Link to="/login" className="font-bold text-emerald-700 hover:underline">
                Sign In to Account
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
