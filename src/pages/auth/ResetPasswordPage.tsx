import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/forms/Input';
import { useToast } from '../../context/ToastContext';

export const ResetPasswordPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const { setThemeRole } = useTheme();
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
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const { error } = await authService.updatePassword(newPassword);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to update password.');
      showError('Error', error.message || 'Password update failed.');
    } else {
      showSuccess('Password Updated', 'Your account password has been changed.');
      navigate('/login');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 animate-fade-in text-white">
      <div className="bg-slate-800/90 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-elevated">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-white">Set New Password</h1>
          <p className="text-xs text-slate-400">
            Enter your new secure password below to regain full account access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1.5">
              New Password <span className="text-rose-400">*</span>
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
            <label className="text-xs font-semibold text-slate-200 block mb-1.5">
              Confirm New Password <span className="text-rose-400">*</span>
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
            size="md"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Update Password & Sign In
          </Button>

          <div className="text-center pt-3 border-t border-slate-700/80">
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200">
              Return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
