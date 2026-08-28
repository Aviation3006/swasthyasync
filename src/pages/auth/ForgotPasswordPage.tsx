import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const { setThemeRole } = useTheme();
  const { t } = useTranslation();

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
      setErrorMsg(t.pleaseWait || 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    const { error } = await resetPassword(email.trim());
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to dispatch reset instructions.');
      showError(t.error, error.message || 'Request failed.');
    } else {
      setIsSubmitted(true);
      showSuccess(t.resetLinkSent, t.resetLinkSentDesc);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 animate-fade-in text-slate-900">
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-elevated">
        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 rounded-xl bg-theme-primary-subtle text-theme-primary border border-theme-primary-border flex items-center justify-center mx-auto shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t.resetPassword}</h1>
          <p className="text-xs text-slate-500">
            {t.resetPasswordInstructions}
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900">{t.resetLinkSent}</h4>
              <p>
                {t.resetLinkSentDesc} (<strong>{email}</strong>).
              </p>
            </div>

            <Link to="/login" className="block pt-2">
              <Button variant="outline" size="sm" fullWidth className="border-slate-300 text-slate-700 hover:bg-slate-50">
                {t.backToSignIn}
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {t.registeredEmail} <span className="text-rose-500">*</span>
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
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="bg-[#DB2777] hover:bg-[#BE185D] text-white shadow-md font-bold py-2.5"
            >
              {isLoading ? t.pleaseWait : t.sendResetInstructions}
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.backToSignIn}</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
