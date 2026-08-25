import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  Sparkles,
  ShieldAlert,
  BadgeAlert,
  MapPin,
  HeartPulse,
  Stethoscope,
  Building
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

  // Role Card Visual Configuration
  const roleCardConfig = {
    patient: {
      cardBorder: 'border-2 border-pink-300/80 shadow-pink-200/70',
      headerBg: 'bg-gradient-to-r from-[#4A0420] via-[#5C0628] to-[#360317]',
      portalBadge: 'PATIENT PORTAL',
      tagline: 'Citizen Health & Records • Unified CareSetu Digital Locker',
      icon: HeartPulse,
      btnClass: 'bg-[#DB2777] hover:bg-[#BE185D] text-white shadow-md shadow-pink-500/30 focus:ring-[#F472B6]',
      roleBadgeBg: 'bg-pink-50 text-pink-900 border-pink-200',
      accentColor: 'text-[#DB2777]',
      submitLabel: 'Sign In to Patient Portal →'
    },
    hospital: {
      cardBorder: 'border-2 border-blue-300/80 shadow-blue-200/70',
      headerBg: 'bg-gradient-to-r from-[#0A192F] via-[#0D213F] to-[#081326]',
      portalBadge: 'DOCTOR PORTAL',
      tagline: 'Clinical Care & Patient Management • Hospital Command',
      icon: Stethoscope,
      btnClass: 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-md shadow-blue-500/30 focus:ring-[#60A5FA]',
      roleBadgeBg: 'bg-sky-50 text-sky-900 border-sky-200',
      accentColor: 'text-[#1D4ED8]',
      submitLabel: 'Sign In to Doctor Portal →'
    },
    district_admin: {
      cardBorder: 'border-2 border-emerald-300/80 shadow-emerald-200/70',
      headerBg: 'bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#022119]',
      portalBadge: 'DISTRICT ADMIN PORTAL',
      tagline: 'District Health Administration • Surveillance & Governance',
      icon: Building,
      btnClass: 'bg-[#047857] hover:bg-[#065F46] text-white shadow-md shadow-emerald-500/30 focus:ring-[#34D399]',
      roleBadgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      accentColor: 'text-[#047857]',
      submitLabel: 'Sign In to Admin Portal →'
    }
  }[selectedRole];

  const RoleHeaderIcon = roleCardConfig.icon;

  return (
    <div className="w-full max-w-lg mx-auto transition-all duration-300 animate-fade-in">
      {/* Main Authentication Card */}
      <div className={`bg-white rounded-3xl shadow-2xl ${roleCardConfig.cardBorder} overflow-hidden transition-all duration-300`}>
        
        {/* Prominent Role Header Area */}
        <div className={`${roleCardConfig.headerBg} text-white p-5 sm:p-7 text-center space-y-2 relative overflow-hidden transition-colors duration-300`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-white/20 text-white border border-white/30 shadow-xs backdrop-blur-xs">
            <RoleHeaderIcon className="w-3.5 h-3.5 text-white" />
            <span>{roleCardConfig.portalBadge}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {"Sign In to SwasthyaSync"}
          </h2>

          <p className="text-xs text-white/85 max-w-md mx-auto leading-relaxed font-medium">
            {roleCardConfig.tagline}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-7 space-y-6">
          
          {/* 1. Clear Role Selector Tabs ("Switch Portal Role") */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Select Portal Role
              </label>
              <span className={`text-[10px] font-black uppercase tracking-wider ${roleCardConfig.accentColor}`}>
                Active: {roleCardConfig.portalBadge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
              {/* Patient Tab */}
              <button
                type="button"
                onClick={() => handleRoleSelect('patient')}
                className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl transition-all ${
                  selectedRole === 'patient'
                    ? 'bg-[#DB2777] text-white font-bold shadow-md shadow-pink-900/30 border border-pink-400 ring-2 ring-pink-300/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <User className={`w-4 h-4 ${selectedRole === 'patient' ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-[11px] leading-tight font-bold">
                  {t.citizenPatientTab}
                </span>
              </button>

              {/* Hospital Staff Tab */}
              <button
                type="button"
                onClick={() => handleRoleSelect('hospital')}
                className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl transition-all ${
                  selectedRole === 'hospital'
                    ? 'bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-900/30 border border-blue-400 ring-2 ring-blue-300/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Building2 className={`w-4 h-4 ${selectedRole === 'hospital' ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-[11px] leading-tight font-bold">
                  {t.hospitalStaffTab}
                </span>
              </button>

              {/* District Admin Tab */}
              <button
                type="button"
                onClick={() => handleRoleSelect('district_admin')}
                className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl transition-all ${
                  selectedRole === 'district_admin'
                    ? 'bg-[#047857] text-white font-bold shadow-md shadow-emerald-900/30 border border-emerald-400 ring-2 ring-emerald-300/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <ShieldAlert className={`w-4 h-4 ${selectedRole === 'district_admin' ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-[11px] leading-tight font-bold">
                  {t.districtAdminTab}
                </span>
              </button>
            </div>

            {/* Role Purpose Advisory */}
            <div className={`p-2.5 rounded-xl text-xs text-center border font-medium ${roleCardConfig.roleBadgeBg}`}>
              {selectedRole === 'patient' && (
                <span>{t.citizenRoleDesc}</span>
              )}
              {selectedRole === 'hospital' && (
                <span className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1D4ED8] shrink-0" /> {t.hospitalRoleDesc}
                </span>
              )}
              {selectedRole === 'district_admin' && (
                <span className="flex items-center justify-center gap-1.5">
                  <BadgeAlert className="w-4 h-4 text-[#047857] shrink-0" /> {t.adminRoleDesc}
                </span>
              )}
            </div>
          </div>

          {/* 2. Demo Persona Region Quick Selector */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Test Region Persona:</span>
              </span>
              <span className="font-mono text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300 text-[11px]">
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
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
              <span>Account ID: <strong className="text-slate-900 font-mono">{identifier}</strong></span>
              <span className="text-emerald-700 font-bold">Auto-filled</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Sign In Notice</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* 3. Form Inputs */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                {selectedRole === 'patient' ? (t.abhaNumberOrPhone || "Email / ABHA ID / Mobile") : (t.emailAddress ? `${t.emailAddress} / Username` : "Email / Username")}
              </label>
              <Input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={selectedRole === 'patient' ? "patient.delhi@swasthasync.com" : "user@swasthasync.com"}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                className="bg-white border-slate-300 text-slate-900 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-light font-medium"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  {t.password}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-slate-500 hover:text-slate-900 underline transition-colors"
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
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-700 focus:outline-none p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                className="bg-white border-slate-300 text-slate-900 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-light font-medium"
              />
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded border-slate-300 text-theme-primary focus:ring-theme-primary w-4 h-4"
                />
                <span>{t.rememberDevice}</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                256-Bit SSL Secured
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
                className={`${roleCardConfig.btnClass} shadow-md text-sm font-black tracking-wide py-3`}
              >
                {isSubmitting ? (t.loading || "Verifying Credentials...") : roleCardConfig.submitLabel}
              </Button>
            </div>
          </form>

          {/* 4. Footer & Registration Link for Citizens */}
          <div className="pt-5 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-600">
              {"New citizen or patient without an account?"}{' '}
              <Link
                to="/signup"
                className="text-[#DB2777] hover:text-[#9D174D] font-extrabold underline transition-colors"
              >
                {"Create Patient Account →"}
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ayushman Bharat Digital Mission (ABDM) Compliant</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
