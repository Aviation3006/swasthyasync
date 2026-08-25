import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_PERSONAS } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { UserRole } from '../../types/common';
import { ROLE_THEMES } from '../../types/theme';
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
  MapPin,
  HeartHandshake
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
  const currentTheme = ROLE_THEMES[selectedRole] || ROLE_THEMES.patient;

  // Dynamically synchronize theme on document element when role tab changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', selectedRole);
      root.style.setProperty('--theme-primary', currentTheme.primary);
      root.style.setProperty('--theme-primary-hover', currentTheme.primaryHover);
      root.style.setProperty('--theme-primary-light', currentTheme.primaryLight);
      root.style.setProperty('--theme-primary-subtle', currentTheme.primarySubtle);
      root.style.setProperty('--theme-primary-border', currentTheme.primaryBorder);
      root.style.setProperty('--theme-text-accent', currentTheme.textAccent);
      root.style.setProperty('--theme-ring', currentTheme.ringColor);
      root.style.setProperty('--theme-background', currentTheme.pageBackground);
    }
  }, [selectedRole, currentTheme]);

  // Handle Role Tab Switching
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
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
      setErrorMessage("Please enter both your identifier/email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { user, error } = await signInWithEmail(identifier.trim(), password.trim());

      setIsSubmitting(false);

      if (error) {
        setErrorMessage(error.message || "Invalid credentials or unauthorized role.");
        showError('Sign In Failed', error.message || 'Could not sign in.');
        return;
      }

      if (user) {
        showSuccess(
          'Authentication Verified',
          `Welcome back, ${user.name || user.email}! (${user.roleTitle || currentTheme.portalBadgeText})`
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
    <div className="w-full max-w-lg mx-auto transition-all duration-300">
      {/* Main Authentication Card */}
      <div className={`bg-slate-950/90 backdrop-blur-xl border ${selectedRole === 'patient' ? 'border-pink-900/60 shadow-pink-950/30' : selectedRole === 'hospital' ? 'border-sky-950 shadow-sky-950/30' : 'border-emerald-950 shadow-emerald-950/30'} shadow-2xl rounded-3xl p-4 sm:p-8 text-white transition-colors duration-300`}>
        
        {/* Card Header & Portal Indicator */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-white/10 text-white border border-white/20 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>{currentTheme.portalBadgeText} SIGN IN</span>
          </div>
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
            {"Select Your Access Role"}
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-700/80">
            {/* Patient Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('patient')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                selectedRole === 'patient'
                  ? 'bg-[#DB2777] text-white font-bold shadow-md shadow-pink-950/50 border border-pink-400/60 ring-1 ring-pink-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className={`w-4 h-4 ${selectedRole === 'patient' ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-[11px] leading-tight font-semibold">
                {t.citizenPatientTab}
              </span>
            </button>

            {/* Hospital Staff Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('hospital')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                selectedRole === 'hospital'
                  ? 'bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-950/50 border border-sky-400/60 ring-1 ring-sky-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className={`w-4 h-4 ${selectedRole === 'hospital' ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-[11px] leading-tight font-semibold">
                {t.hospitalStaffTab}
              </span>
            </button>

            {/* District Admin Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('district_admin')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                selectedRole === 'district_admin'
                  ? 'bg-[#047857] text-white font-bold shadow-md shadow-emerald-950/50 border border-emerald-400/60 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${selectedRole === 'district_admin' ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-[11px] leading-tight font-semibold">
                {t.districtAdminTab}
              </span>
            </button>
          </div>

          {/* Role Description Badge */}
          <div className={`p-2.5 rounded-xl text-[11px] text-center transition-colors ${
            selectedRole === 'patient' 
              ? 'bg-pink-950/50 border border-pink-800/50 text-pink-200' 
              : selectedRole === 'hospital' 
              ? 'bg-sky-950/50 border border-sky-800/50 text-sky-200' 
              : 'bg-emerald-950/50 border border-emerald-800/50 text-emerald-200'
          }`}>
            {selectedRole === 'patient' && t.citizenRoleDesc}
            {selectedRole === 'hospital' && (
              <span className="flex items-center justify-center gap-1.5 text-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> {t.hospitalRoleDesc}
              </span>
            )}
            {selectedRole === 'district_admin' && (
              <span className="flex items-center justify-center gap-1.5 text-emerald-200">
                <BadgeAlert className="w-3.5 h-3.5 text-emerald-400" /> {t.adminRoleDesc}
              </span>
            )}
          </div>
        </div>

        {/* 2. Multi-Region Demo Persona Quick Selector */}
        <div className="mb-6 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Region Demo State:</span>
            </span>
            <span className="font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
              {selectedDemoRegion}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(['Delhi', 'Maharashtra', 'Karnataka'] as const).map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => handleRegionSelect(reg)}
                className={`py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedDemoRegion === reg
                    ? 'bg-slate-700 text-white border border-slate-500 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span>Demo Test ID: <strong className="text-slate-200 font-mono">{identifier}</strong></span>
            <span className="text-emerald-400 font-mono">Auto-populated</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Sign In Notice</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* 3. Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              {selectedRole === 'patient' ? (t.abhaNumberOrPhone || "Email / ABHA ID / Mobile") : (t.emailAddress ? `${t.emailAddress} / Username` : "Email / Username")}
            </label>
            <Input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={selectedRole === 'patient' ? "patient.delhi@swasthasync.com" : "user@swasthasync.com"}
              leftIcon={<Mail className="w-4 h-4" />}
              className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                {t.password}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
              >
                {t.forgotPassword}
              </Link>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              className="bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Remember Device Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-health-600 focus:ring-health-500 w-4 h-4"
              />
              <span>{t.rememberDevice}</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              256-Bit SSL Encrypted
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting || isLoading}
              className={`${currentTheme.buttonPrimaryClass} shadow-lg text-sm font-bold tracking-wide transition-all`}
            >
              {isSubmitting ? (t.loading || "Verifying...") : `${t.signIn} as ${selectedRole === 'patient' ? 'Citizen' : selectedRole === 'hospital' ? 'Doctor / Hospital' : 'District Admin'}`}
            </Button>
          </div>
        </form>

        {/* 4. Footer & Registration Link */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-xs text-slate-400">
            {"Don't have an ABHA patient account yet?"}{' '}
            <Link
              to="/signup"
              className="text-pink-400 hover:text-pink-300 font-bold underline transition-colors"
            >
              {"Create Patient Account →"}
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ayushman Bharat Digital Mission (ABDM) Compliant Architecture</span>
          </div>
        </div>

      </div>
    </div>
  );
};
