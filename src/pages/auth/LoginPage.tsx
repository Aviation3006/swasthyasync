import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { UserRole } from '../../types/common';
import { isDemoMode } from '../../config/appConfig';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldAlert, 
  MapPin, 
  HeartPulse, 
  Stethoscope, 
  Building,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithEmail, isLoading, isAuthenticated, role: authRole } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const { theme, setThemeRole } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected Role derived from URL query parameter or defaulting to citizen patient
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    const search = new URLSearchParams(location.search);
    const r = search.get('role');
    if (r === 'hospital' || r === 'district_admin' || r === 'patient') return r as UserRole;
    return 'patient';
  });

  const [selectedDemoRegion, setSelectedDemoRegion] = useState<'Maharashtra' | 'Delhi' | 'Karnataka'>('Delhi');

  // Form Fields
  const isDemo = isDemoMode();
  const [identifier, setIdentifier] = useState(isDemo ? 'patient.delhi@swasthasync.com' : '');
  const [password, setPassword] = useState(isDemo ? 'Delhi@123' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect to appropriate active dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (authRole === 'hospital') {
        navigate('/hospital', { replace: true });
      } else if (authRole === 'district_admin') {
        navigate('/district-admin', { replace: true });
      } else {
        navigate('/patient', { replace: true });
      }
    }
  }, [isAuthenticated, authRole, navigate]);

  // Sync initial role credentials and theme on mount
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const r = search.get('role');
    const targetRole: UserRole = (r === 'hospital' || r === 'district_admin' || r === 'patient') ? (r as UserRole) : 'patient';
    setSelectedRole(targetRole);
    setThemeRole(targetRole);
    if (isDemoMode()) {
      updateCredentialsForRoleAndRegion(targetRole, selectedDemoRegion);
    }
  }, [location.search, setThemeRole]);

  // Handle Role Tab Switching
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setThemeRole(role);
    setErrorMessage(null);
    if (isDemoMode()) {
      updateCredentialsForRoleAndRegion(role, selectedDemoRegion);
    }
  };

  const handleRegionSelect = (region: 'Maharashtra' | 'Delhi' | 'Karnataka') => {
    setSelectedDemoRegion(region);
    if (isDemoMode()) {
      updateCredentialsForRoleAndRegion(selectedRole, region);
    }
  };

  const updateCredentialsForRoleAndRegion = (role: UserRole, region: 'Maharashtra' | 'Delhi' | 'Karnataka') => {
    if (!isDemoMode()) return;
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
          `Welcome back, ${user.name || user.email}! (${user.roleTitle || theme.portalBadgeText})`
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
      cardBorder: 'border border-slate-200',
      headerBg: 'bg-[#831843]',
      portalBadge: t.portalPatient || 'PATIENT PORTAL',
      tagline: t.citizenRoleDesc || 'Citizen Health & Records • Unified CareSetu Digital Locker',
      icon: HeartPulse,
      btnClass: 'bg-[#DB2777] hover:bg-[#BE185D] text-white focus:ring-pink-300',
      roleBadgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
      accentColor: 'text-[#DB2777]',
      submitLabel: t.signInToPatientPortal || 'Sign In to Patient Portal →'
    },
    hospital: {
      cardBorder: 'border border-slate-200',
      headerBg: 'bg-[#1E3A8A]',
      portalBadge: t.portalHospital || 'DOCTOR PORTAL',
      tagline: t.hospitalRoleDesc || 'Clinical Care & Patient Management • Hospital Command',
      icon: Stethoscope,
      btnClass: 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white focus:ring-blue-300',
      roleBadgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
      accentColor: 'text-[#1D4ED8]',
      submitLabel: t.signInToDoctorPortal || 'Sign In to Doctor Portal →'
    },
    district_admin: {
      cardBorder: 'border border-slate-200',
      headerBg: 'bg-[#064E3B]',
      portalBadge: t.portalAdmin || 'DISTRICT ADMIN PORTAL',
      tagline: t.adminRoleDesc || 'District Health Administration • Surveillance & Governance',
      icon: Building,
      btnClass: 'bg-[#047857] hover:bg-[#065F46] text-white focus:ring-emerald-300',
      roleBadgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
      accentColor: 'text-[#047857]',
      submitLabel: t.signInToAdminPortal || 'Sign In to Admin Portal →'
    }
  }[selectedRole];

  const RoleHeaderIcon = roleCardConfig.icon;

  return (
    <div className="w-full max-w-5xl mx-auto py-2 sm:py-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Context Column (Desktop only) - Grounds the page as an authentic healthcare public infrastructure portal */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between space-y-6 pr-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.abdmMissionTagline || "Privacy-focused digital health platform"}</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              Unified Healthcare Access for Citizens, Doctors & Administrators
            </h1>

            <p className="text-xs text-slate-600 leading-relaxed">
              SwasthyaSync connects citizens, clinical OPD tokens, and district health coordination in one cohesive ecosystem.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-semibold block text-slate-900">CareSetu Smart Health Locker</strong>
                  <span className="text-slate-500">QR-accessible personal health records encrypted for safe hospital sharing.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-semibold block text-slate-900">Live Hospital & OPD Integration</strong>
                  <span className="text-slate-500">Fast token issuance, prescription tracking, and specialist appointment routing.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-md bg-pink-50 text-pink-700 border border-pink-200 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="font-semibold block text-slate-900">23 Indian Languages Parity</strong>
                  <span className="text-slate-500">Accessible across English and all 22 Eighth Schedule Indian languages.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Helpline Strip */}
          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700 block">Emergency 24x7 Medical Assistance</span>
            <p>Ambulance Dispatch: <strong className="text-slate-900 font-mono">108</strong> • Health Information: <strong className="text-slate-900 font-mono">104</strong></p>
          </div>
        </div>

        {/* Right Form Column: Clean, Authoritative Healthcare Authentication Card */}
        <div className="lg:col-span-7 w-full max-w-lg mx-auto">
          <div className={`bg-white rounded-xl shadow-card ${roleCardConfig.cardBorder} overflow-hidden transition-all duration-200`}>
            
            {/* Clean, Restrained Role Header Banner */}
            <div className={`${roleCardConfig.headerBg} p-4 sm:p-8 text-white text-center space-y-2 border-b border-white/10 transition-colors duration-200`}>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-white/15 text-white border border-white/20 shadow-2xs">
                <RoleHeaderIcon className="w-3.5 h-3.5 text-white" />
                <span>{roleCardConfig.portalBadge}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t.loginTitle || "Sign In to SwasthyaSync"}
              </h2>

              <p className="text-xs text-white/85 max-w-md mx-auto leading-relaxed font-normal">
                {roleCardConfig.tagline}
              </p>
            </div>

            {/* Card Body with Restrained Density and 6px Geometry */}
            <div className="p-4 sm:p-6 space-y-5">
              
              {/* 1. Clear Segmented Role Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                    {t.selectRole || "Select Portal Role"}
                  </label>
                  <span className={`text-[11px] font-bold ${roleCardConfig.accentColor}`}>
                    {t.activeRole || "Active:"} {roleCardConfig.portalBadge}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  {/* Patient Tab */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('patient')}
                    className={`flex flex-col items-center gap-1 py-2 px-2 rounded-md transition-colors ${
                      selectedRole === 'patient'
                        ? 'bg-[#DB2777] text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <User className={`w-4 h-4 ${selectedRole === 'patient' ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-[11px] leading-tight font-medium">
                      {t.citizenPatientTab}
                    </span>
                  </button>

                  {/* Hospital Staff Tab */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('hospital')}
                    className={`flex flex-col items-center gap-1 py-2 px-2 rounded-md transition-colors ${
                      selectedRole === 'hospital'
                        ? 'bg-[#1D4ED8] text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${selectedRole === 'hospital' ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-[11px] leading-tight font-medium">
                      {t.hospitalStaffTab}
                    </span>
                  </button>

                  {/* District Admin Tab */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('district_admin')}
                    className={`flex flex-col items-center gap-1 py-2 px-2 rounded-md transition-colors ${
                      selectedRole === 'district_admin'
                        ? 'bg-[#047857] text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <ShieldAlert className={`w-4 h-4 ${selectedRole === 'district_admin' ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-[11px] leading-tight font-medium">
                      {t.districtAdminTab}
                    </span>
                  </button>
                </div>

                {/* Role Purpose Note */}
                <div className="px-3 py-1.5 rounded-md text-xs text-center border font-normal bg-slate-50 text-slate-600 border-slate-200">
                  {selectedRole === 'patient' && <span>{t.citizenRoleDesc}</span>}
                  {selectedRole === 'hospital' && <span>{t.hospitalRoleDesc}</span>}
                  {selectedRole === 'district_admin' && <span>{t.adminRoleDesc}</span>}
                </div>
              </div>

              {/* 2. Demo Environment Region Quick Selector (Active ONLY in Demo Mode) */}
              {isDemoMode() && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.testRegionPersona || "Test Region Persona:"}</span>
                    </span>
                    <span className="font-mono text-slate-700 font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                      {selectedDemoRegion} (Demo)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Delhi', 'Maharashtra', 'Karnataka'] as const).map((reg) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => handleRegionSelect(reg)}
                        className={`py-1 px-2 rounded-md text-xs font-medium transition-colors ${
                          selectedDemoRegion === reg
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
                    <span>{t.accountId || "Account ID:"} <strong className="text-slate-900 font-mono break-all">{identifier}</strong></span>
                    <span className="text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">Demo Evaluation</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block">{t.signInNotice || "Sign In Notice"}</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* 3. Form Inputs */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
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
                    <label className="text-xs font-semibold text-slate-700">
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
                    {t.sslSecured || "256-Bit SSL Secured"}
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
                    className={`${roleCardConfig.btnClass} shadow-xs text-xs font-bold tracking-wide py-2.5`}
                  >
                    {isSubmitting ? (t.loading || "Verifying Credentials...") : roleCardConfig.submitLabel}
                  </Button>
                </div>
              </form>

              {/* 4. Footer & Registration Link for Citizens */}
              <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                <p className="text-xs text-slate-600">
                  {t.newCitizenPrompt || "New citizen or patient without an account?"}{' '}
                  <Link
                    to="/signup"
                    className="text-[#DB2777] hover:text-[#9D174D] font-bold underline transition-colors"
                  >
                    {t.createAccountLink || "Create Patient Account →"}
                  </Link>
                </p>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.abdmMissionTagline || "Privacy-focused digital health platform"}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
