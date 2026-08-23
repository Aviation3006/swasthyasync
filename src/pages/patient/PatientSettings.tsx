import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { SUPPORTED_LANGUAGES, Language } from '../../types/common';
import { 
  Globe, 
  Bell, 
  Shield, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Save, 
  Check, 
  MapPin, 
  RotateCcw,
  Navigation,
  Info,
  Search
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ToggleSwitch } from '../../components/forms/ToggleSwitch';
import { useToast } from '../../context/ToastContext';

export const PatientSettings: React.FC = () => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { showSuccess, showInfo } = useToast();

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [languageSearch, setLanguageSearch] = useState('');

  // Location State
  const [hasLocationSaved, setHasLocationSaved] = useState(() => {
    return !!localStorage.getItem('swasthyasync_user_coords');
  });

  const handleSavePreferences = () => {
    showSuccess(t.saveChanges, 'Your communication and display settings have been updated.');
  };

  const handleResetLocation = () => {
    localStorage.removeItem('swasthyasync_user_coords');
    setHasLocationSaved(false);
    showInfo('Location Reset', 'Stored geolocation coordinates cleared. You will be prompted on next hospital search.');
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(languageSearch.toLowerCase()) ||
    l.region.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.settings}
        subtitle={t.languageSelectDesc}
        breadcrumbs={[
          { label: t.portalPatient, path: '/patient' },
          { label: t.navSettings }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSavePreferences}
          >
            {t.saveChanges}
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Active Language Information Card */}
        <Card>
          <CardHeader
            title={`${t.preferredLanguage}: ${SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName || 'English'} (${SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English'})`}
            subtitle="The portal language is controlled globally via the language selector in the top navigation bar."
            icon={<Globe className="w-5 h-5 text-health-600" />}
          />
          <CardContent>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-health-100 text-health-800 flex items-center justify-center font-bold text-sm">
                  {language.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName} ({SUPPORTED_LANGUAGES.find(l => l.code === language)?.name})
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Regional Scope: {SUPPORTED_LANGUAGES.find(l => l.code === language)?.region}
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm font-medium">
                🌐 Managed from Top Navigation Header
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Geo-Discovery Privacy Card */}
        <Card>
          <CardHeader
            title={t.locationSettingsTitle}
            subtitle="Manage your location sharing preference for finding public hospitals and emergency centres"
            icon={<MapPin className="w-5 h-5 text-emerald-600" />}
          />
          <CardContent>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{t.locationStatus}:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                      hasLocationSaved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {hasLocationSaved ? t.locationGranted : t.locationNotSet}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {hasLocationSaved
                      ? 'Your device coordinates are saved locally to calculate real distances to hospitals.'
                      : 'No precise GPS coordinates stored. You can provide location when searching facilities.'}
                  </p>
                </div>

                {hasLocationSaved && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={handleResetLocation}
                    className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  >
                    {t.resetLocationPermission}
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-sky-50 p-3 rounded-lg border border-sky-100">
                <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>{t.locationPrivacyNotice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Delivery Channels */}
        <Card>
          <CardHeader
            title="Communication & Alert Channels"
            subtitle="Configure where OPD token confirmations and reminder messages are sent"
            icon={<Bell className="w-5 h-5 text-health-600" />}
          />
          <CardContent>
            <div className="divide-y divide-slate-100">
              <ToggleSwitch
                id="pref-sms"
                label="SMS Mobile Alerts"
                description="Receive token numbers and appointment reminder messages via National Health SMS Gateway"
                checked={smsAlerts}
                onChange={setSmsAlerts}
              />

              <ToggleSwitch
                id="pref-email"
                label="Email Notifications"
                description="Receive lab report summaries and discharge summaries at registered email"
                checked={emailAlerts}
                onChange={setEmailAlerts}
              />

              <ToggleSwitch
                id="pref-wa"
                label="WhatsApp Health Updates"
                description="Receive instant token QR slips on your verified WhatsApp mobile number"
                checked={whatsappAlerts}
                onChange={setWhatsappAlerts}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
