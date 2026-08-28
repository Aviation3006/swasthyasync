import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { useToast } from '../../context/ToastContext';

export const ResetPasswordPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const { setThemeRole } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setThemeRole('patient');
  }, [setThemeRole]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(t.passwordsMustMatch);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(t.passwordsMustMatch);
      return;
    }

    setIsLoading(true);
    const { error } = await authService.updatePassword(newPassword);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to update password.');
      showError(t.error, error.message || 'Password update failed.');
    } else {
      showSuccess(t.savedSuccessfully, t.savedSuccessfully);
      navigate('/login');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 animate-fade-in text-slate-900">
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-elevated">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">{t.setNewPasswordTitle}</h1>
          <p className="text-xs text-slate-500">
            {t.setNewPasswordSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              {t.setNewPasswordTitle} <span className="text-rose-500">*</span>
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              className="bg-white text-slate-900 placeholder:text-slate-400 font-medium border-slate-300 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-light"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              {t.confirmNewPassword} <span className="text-rose-500">*</span>
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="bg-white text-slate-900 placeholder:text-slate-400 font-medium border-slate-300 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-light"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="bg-[#DB2777] hover:bg-[#BE185D] text-white shadow-md font-bold py-2.5 mt-2"
          >
            {isLoading ? t.pleaseWait : t.updatePasswordBtn}
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs text-slate-600 hover:text-slate-900">
              {t.backToSignIn}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
