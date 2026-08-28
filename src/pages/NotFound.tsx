import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getHomePath = () => {
    if (role === 'patient') return '/patient';
    if (role === 'hospital') return '/hospital';
    if (role === 'district_admin') return '/district-admin';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">404 - {t('pageNotFound') || 'Page Not Found'}</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('pageNotFoundDesc') || 'The requested medical portal route could not be found or may have been moved.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            {t.back || 'Go Back'}
          </Button>
          <Link to={getHomePath()}>
            <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
              {t.home || 'Portal Dashboard'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
