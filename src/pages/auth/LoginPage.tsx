import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_PERSONAS } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { UserRole } from '../../types/common';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  KeyRound, 
  Sparkles,
  ShieldAlert,
  BadgeAlert,
  MapPin
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithEmail, isConfigured, isLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Selected Role: 'patient' | 'hospital' | 'district_admin'
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [selectedDemoRegion, setSelectedDemoRegion] = useState<'Maharashtra' | 'Delhi' | 'Karnataka'>('Delhi');

  // Form Fields
  const [identifier, setIdentifier] = useState('patient.delhi@swasthasync.com');
  const [password, setPassword] = useState('Delhi@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSupabaseConnected = isConfigured;

  // Handle Role Tab Switching
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);

    // Auto-update sample credentials based on role & active demo region
    updateCredentialsForRoleAndRegion(role, selectedDemoRegion);
  };

  const handleRegionSelect = (region: 'Maharashtra' | 'Delhi' | 'Karnataka') => {
    setSelectedDemoRegion(region);
    updateCredentialsForRoleAndRegion(selectedRole, region);
  };

  const updateCredentialsForRoleAndRegion = (role: UserRole, region: 'Maharashtra' | 'Delhi' | 'Karnataka') => {
    if (region === 'Delhi') {
      if (role === 'patient') {
        setIdentifier('patient.delhi@swasthasync.com');
        setPassword('Delhi@123');
      } else if (role === 'hospital') {
        setIdentifier('hospital.delhi@swasthasync.com');
        setPassword('Delhi@123');
      } else {
        setIdentifier('admin.delhi@swasthasync.com');
        setPassword('Delhi@123');
      }
    } else if (region === 'Karnataka') {
      if (role === 'patient') {
        setIdentifier('patient.karnataka@swasthasync.com');
        setPassword('Karnataka@123');
      } else if (role === 'hospital') {
        setIdentifier('hospital.karnataka@swasthasync.com');
        setPassword('Karnataka@123');
      } else {
        setIdentifier('admin.karnataka@swasthasync.com');
        setPassword('Karnataka@123');
      }
    } else {
      if (role === 'patient') {
        setIdentifier('patient.test@swasthasync.com');
        setPassword('Patient@123');
      } else if (role === 'hospital') {
        setIdentifier('hospital.test@swasthasync.com');
        setPassword('Hospital@123');
      } else {
        setIdentifier('admin.test@swasthasync.com');
        setPassword('Admin@123');
      }
    }
  };

  // Form Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Please enter your email/ID and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailToSubmit = identifier.includes('@') 
        ? identifier.trim() 
        : `${identifier.trim().toLowerCase()}@swasthasync.com`;

      const { user, error } = await signInWithEmail(emailToSubmit, password);

      setIsSubmitting(false);

      if (error) {
        setErrorMessage(error.message || "Invalid credentials or user not found.");
        showError('Authentication Error', error.message || "Invalid credentials or user not found.");
        return;
      }

      if (user) {
        showSuccess(
          'Login Successful',
          `Signed in as ${user.name} (${user.roleTitle || user.role}).`
        );

        if (user.role === 'hospital') {
          navigate('/hospital');
        } else if (user.role === 'district_admin') {
          navigate('/district-admin');
        } else {
          navigate('/patient');
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const msg = err.message || "Invalid credentials or user not found.";
      setErrorMessage(msg);
      showError('Authentication Error', msg);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Authentication Card */}
      <div className="bg-slate-950/85 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-3xl p-6 sm:p-8 text-white">
        
        {/* Card Header */}
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {"Sign In to SwasthyaSync"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.signInSubtitle}
          </p>
        </div>

        {/* 1. Clear Role Selector ("I am a...") */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block text-center">
            {"Select your account role"}
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-700">
            {/* Patient Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('patient')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                selectedRole === 'patient'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/40 border border-emerald-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className={`w-4 h-4 ${selectedRole === 'patient' ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-[11px] leading-tight">
                {t.citizenPatientTab}
              </span>
            </button>

            {/* Hospital Staff Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('hospital')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                selectedRole === 'hospital'
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-900/40 border border-sky-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className={`w-4 h-4 ${selectedRole === 'hospital' ? 'text-sky-200' : 'text-slate-400'}`} />
              <span className="text-[11px] leading-tight">
                {t.hospitalStaffTab}
              </span>
            </button>

            {/* District Admin Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('district_admin')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                selectedRole === 'district_admin'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40 border border-purple-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${selectedRole === 'district_admin' ? 'text-purple-200' : 'text-slate-400'}`} />
              <span className="text-[11px] leading-tight">
                {t.districtAdminTab}
              </span>
            </button>
          </div>

          {/* Role Description Badge */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px] text-slate-300 text-center">
            {selectedRole === 'patient' && t.citizenRoleDesc}
            {selectedRole === 'hospital' && (
              <span className="flex items-center justify-center gap-1.5 text-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> {t.hospitalRoleDesc}
              </span>
            )}
            {selectedRole === 'district_admin' && (
              <span className="flex items-center justify-center gap-1.5 text-purple-200">
                <BadgeAlert className="w-3.5 h-3.5 text-purple-400" /> {t.adminRoleDesc}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Role-Based Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Identifier Input */}
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1.5">
              {selectedRole === 'patient' 
                ? t.emailOrPhone 
                : selectedRole === 'hospital' 
                ? t.employeeIdOrEmail 
                : t.adminIdOrEmail} <span className="text-rose-400">*</span>
            </label>
            <Input
              type="text"
              placeholder={
                selectedRole === 'patient'
                  ? 'e.g. user@swasthasync.com or +91 98000 00000'
                  : selectedRole === 'hospital'
                  ? 'e.g. doctor@hospital.org or EMP-HOSP-01'
                  : 'e.g. admin@health.gov.in or DHO-ADMIN-01'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              className="bg-white text-slate-900 placeholder:text-slate-400 font-medium border-slate-300 focus:border-health-600 focus:ring-2 focus:ring-health-200"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1.5">
              {t.password} <span className="text-rose-400">*</span>
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-700 pointer-events-auto p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              className="bg-white text-slate-900 placeholder:text-slate-400 font-medium border-slate-300 focus:border-health-600 focus:ring-2 focus:ring-health-200"
            />
          </div>

          {/* Remember Device & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded text-health-600 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span>{t.rememberDevice}</span>
            </label>

            <Link to="/forgot-password" className="text-health-400 hover:underline font-semibold">
              {t.forgotPassword}
            </Link>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={isSubmitting || isLoading}
            className="mt-2 text-sm font-bold shadow-md bg-health-600 hover:bg-health-500 text-white"
          >
            {selectedRole === 'patient' 
              ? t.signIn 
              : selectedRole === 'hospital' 
              ? `${t.signIn} — ${t.hospitalStaffTab}` 
              : `${t.signIn} — ${t.districtAdminTab}`}
          </Button>

          {/* Registration Link */}
          <div className="text-center pt-3 border-t border-slate-700/80 text-slate-400">
            {t.noAccountYet}{' '}
            <Link to="/signup" className="text-health-400 hover:underline font-bold">
              {t.createAccount} →
            </Link>
          </div>
        </form>

        {/* Multi-Region Test Personas Quick-Selector */}
        <div className="mt-6 pt-5 border-t border-slate-700/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-health-400" /> Multi-Region Test Personas
            </span>
            <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/60">
              Select Region to Test
            </span>
          </div>

          {/* Region Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => handleRegionSelect('Delhi')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                selectedDemoRegion === 'Delhi' ? 'bg-health-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Delhi (NCT)
            </button>
            <button
              type="button"
              onClick={() => handleRegionSelect('Karnataka')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                selectedDemoRegion === 'Karnataka' ? 'bg-health-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Karnataka
            </button>
            <button
              type="button"
              onClick={() => handleRegionSelect('Maharashtra')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                selectedDemoRegion === 'Maharashtra' ? 'bg-health-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Maharashtra
            </button>
          </div>

          {/* Active Demo Persona Details Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {selectedDemoRegion === 'Delhi' 
                    ? (selectedRole === 'patient' ? 'Ankit Sharma (West Delhi)' : selectedRole === 'hospital' ? 'Dr. Rajiv Malhotra (DDU Hospital)' : 'Dr. Alok Verma (CDMO West Delhi)')
                    : selectedDemoRegion === 'Karnataka'
                    ? (selectedRole === 'patient' ? 'Vijay Kumar (Bengaluru Urban)' : selectedRole === 'hospital' ? 'Dr. Ramesh Rao (Victoria Hospital)' : 'Dr. Nandita Hegde (DHO Bengaluru)')
                    : (selectedRole === 'patient' ? 'Rameshwar Jadhav (Pune)' : selectedRole === 'hospital' ? 'Dr. Anjali Deshmukh (Aundh DH)' : 'Dr. Suresh Patil (DHO Pune)')
                  }
                </span>
              </div>
              <div className="text-slate-400 text-[11px] font-mono">
                {identifier}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateCredentialsForRoleAndRegion(selectedRole, selectedDemoRegion)}
              className="text-xs bg-slate-800 hover:bg-health-700 hover:text-white border-slate-600 text-slate-200 self-end sm:self-center"
            >
              {t.fillCredentialsBtn}
            </Button>
          </div>
        </div>

        {/* Backend & Compliance Footer */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Auth Engine: <strong>{isSupabaseConnected ? 'Supabase Live' : 'Demo Mode'}</strong>
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Digital Health & DPDP Act 2023 Compliant
          </div>
        </div>

      </div>
    </div>
  );
};
