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

export const SignupPage: React.FC = () => {
  const { signUpWithEmail } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const allStates = getAllStates();

  const [state, setState] = useState(allStates[0] || 'Delhi (NCT)');
  const [district, setDistrict] = useState(
    () => getDistrictsForState(allStates[0] || 'Delhi (NCT)')[0] || 'New Delhi'
  );
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleStateChange = (newState: string) => {
    setState(newState);

    const districts = getDistrictsForState(newState);
    setDistrict(districts[0] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      showError(
        'Missing Fields',
        'Please provide your full name, email, and password.'
      );
      return;
    }

    if (password.length < 6) {
      showError(
        'Weak Password',
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (!state || !district) {
      showError(
        'Location Required',
        'Please select your State and District.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const { user: createdUser, error } = await signUpWithEmail({
        email: email.trim(),
        password: password.trim(),
        fullName: fullName.trim(),

        // PUBLIC SIGNUP IS PATIENT/CITIZEN ONLY.
        role: 'patient',

        phone: phone.trim() || undefined,
        state,
        district,
        city: city.trim(),
        locality: locality.trim(),
        pinCode: pinCode.trim()
      });

      setIsLoading(false);

      if (error) {
        showError(
          'Registration Failed',
          error.message || 'Could not register account.'
        );
        return;
      }

      if (!createdUser) {
        showError(
          'Registration Failed',
          'The account could not be created.'
        );
        return;
      }

      showSuccess(
        'Account Registered Successfully',
        'Welcome to SwasthyaSync! Your digital health profile is active.'
      );

      navigate('/patient');
    } catch (err: any) {
      setIsLoading(false);

      showError(
        'Registration Error',
        err?.message || 'An unexpected error occurred during signup.'
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">

      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {t.createAccount}
        </h2>

        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Create your citizen digital health account
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-emerald-900">
          Citizen / Patient Account
        </p>

        <p className="text-xs text-emerald-800 mt-1">
          Public registration is available for citizens and patients.
          Healthcare professionals and district administrators are onboarded
          separately through authorized channels.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <FormField label={t.fullName} required>
          <Input
            placeholder="e.g. Rameshwar Jadhav"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Email Address" required>
          <Input
            type="email"
            placeholder="you@example.com"
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

          <FormField label="Mobile Contact">
            <Input
              type="tel"
              placeholder="+91 98000 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormField>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <FormField label="State / Union Territory" required>
            <Select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              options={allStates.map((s) => ({
                value: s,
                label: s
              }))}
            />
          </FormField>

          <FormField label="District" required>
            <Select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={getDistrictsForState(state).map((d) => ({
                value: d,
                label: d
              }))}
            />
          </FormField>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

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

        <FormField label="Locality">
          <Input
            placeholder="e.g. Aundh"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
          />
        </FormField>

        <div className="pt-3 border-t border-slate-100">

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
          >
            Create Citizen Account
          </Button>

        </div>

      </form>

      <div className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-emerald-800 hover:text-emerald-950 underline"
        >
          {t.signIn}
        </Link>
      </div>

    </div>
  );
};