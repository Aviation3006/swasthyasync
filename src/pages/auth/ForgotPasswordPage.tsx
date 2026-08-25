import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/forms/Input';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const { setThemeRole } = useTheme();

  useEffect(() => {
    setThemeRole('patient');
  }, [setThemeRole]);

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    const { error } = await resetPassword(email.trim());
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to dispatch reset instructions.');
      showError('Error', error.message || 'Request failed.');
    } else {
      setIsSubmitted(true);
      showSuccess('Email Dispatched', 'Password reset instructions have been sent to your email.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 animate-fade-in text-white">
      <div className="bg-slate-800/90 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-elevated">
        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 rounded-xl bg-theme-primary-subtle text-theme-primary border border-theme-primary-border flex items-center justify-center mx-auto shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Account Password</h1>
          <p className="text-xs text-slate-400">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-sm text-white">Reset Link Sent</h4>
              <p>
                We have dispatched password reset instructions to <strong>{email}</strong>.
              </p>
            </div>

            <Link to="/login" className="block pt-2">
              <Button variant="outline" size="sm" fullWidth className="bg-slate-900 border-slate-700 text-white hover:bg-slate-700">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-200 block mb-1.5">
                Registered Email <span className="text-rose-400">*</span>
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
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
              Send Password Reset Link
            </Button>

            <div className="text-center pt-3 border-t border-slate-700/80">
              <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
