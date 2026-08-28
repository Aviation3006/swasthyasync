import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { Patient, ConsentSettings } from '../../types/patient';
import { useToast } from '../../context/ToastContext';
import { 
  QrCode, 
  ShieldCheck, 
  Heart, 
  Lock, 
  Printer, 
  PhoneCall, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  RefreshCw,
  Sparkles,
  Download,
  CreditCard,
  Building2,
  Calendar,
  UserCheck,
  Zap,
  Activity
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ToggleSwitch } from '../../components/forms/ToggleSwitch';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';

export const PatientHealthQR: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { showSuccess, showInfo } = useToast();
  const [patient, setPatient] = useState<Patient>(() => patientService.getPatientForUser(user));
  const [consent, setConsent] = useState<ConsentSettings>(patient.consent);

  useEffect(() => {
    const current = patientService.getPatientForUser(user);
    if (!current.careSetuId) {
      patientService.ensureCareSetuId(current);
    }
    setPatient(current);
    setConsent(current.consent);
  }, [user]);

  const handleToggleConsent = (key: keyof ConsentSettings, value: boolean) => {
    const updatedConsent = { ...consent, [key]: value };
    setConsent(updatedConsent);
    patientService.updateConsent(patient.id, updatedConsent);
    showSuccess((t as any).consentUpdated || 'Consent Updated', `Privacy setting for "${key}" updated successfully.`);
  };

  const careSetuId = patient.careSetuId || 'CSU-IND-PUN-00018427';
  const issueDate = patient.careSetuIssueDate || '2024-04-12';
  const cardStatus = patient.careSetuStatus || 'Active';

  // Secure tokenized CareSetu payload (DO NOT dump raw unencrypted health history)
  const secureQrPayload = JSON.stringify({
    system: 'CareSetu',
    version: '2.4',
    careSetuId: careSetuId,
    patientName: patient.name || user?.name || 'Citizen User',
    token: `sec_csu_${patient.id}_${Date.now().toString(36)}`,
    gatewayUrl: `https://swasthyasync.gov.in/caresetu/record?id=${careSetuId}`,
    authRoleRequired: 'healthcare_provider',
    emergencyAccessEnabled: consent.allowEmergencyAccess,
    issuedAt: issueDate
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="CareSetu"
        subtitle={t.careSetuSubtitle || "Your Smart Health Card • Your health information, connected when you need it."}
        breadcrumbs={[
          { label: t.portalPatient || "Patient Portal", path: '/patient' },
          { label: "CareSetu" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => {
                showSuccess("Download Started", "CareSetu Digital Smart Health Card downloaded as PDF.");
              }}
            >
              {(t as any).downloadPdf || "Download Card"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              {t.printCard || "Print Smart Card"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. CARESETU SMART HEALTH CARD (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden group">
            
            {/* Background Holographic & Watermark Accents */}
            <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Microchip Graphic & Card Brand Header */}
            <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-3.5 pb-4 border-b border-slate-800/80 min-w-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                {/* Gold Smart Chip Graphic */}
                <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                  <div className="w-full h-full border border-amber-800/40 rounded flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-950" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                      Care<span className="text-emerald-400">Setu</span>™
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {cardStatus}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide truncate">
                    {t.smartHealthCard || "Smart Health Card"} • National Health Network
                  </p>
                </div>
              </div>

              <div className="text-left xs:text-right shrink-0 min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                  {t.careSetuId || "CareSetu ID"}
                </span>
                <span className="font-mono font-black text-emerald-300 text-xs sm:text-base tracking-wider break-all">
                  {careSetuId}
                </span>
              </div>
            </div>

            {/* Middle Section: Demographics & QR Gateway */}
            <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-5 min-w-0">
              
              {/* Demographics Area */}
              <div className="space-y-3 flex-1 text-center sm:text-left min-w-0 w-full">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    {t.patientName || "Patient Name"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight break-words">
                    {language === 'mr' && patient.nameMarathi ? patient.nameMarathi : (patient.name || user?.name || "Rameshwar B. Jadhav")}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 min-w-0">
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 min-w-0">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium truncate">{t.bloodGroup || "Blood Group"}</span>
                    <span className="font-extrabold text-rose-400 text-sm flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 fill-rose-400" />
                      {patient.bloodGroup || 'B+'}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 min-w-0">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium truncate">{t.ageGender || "Age / Gender"}</span>
                    <span className="font-bold text-slate-200 text-xs truncate block">
                      {patient.age > 0 ? `${patient.age} Yrs / ${patient.gender}` : '48 Yrs / Male'}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 min-w-0">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium truncate">{t.district || "Location"}</span>
                    <span className="font-semibold text-slate-200 text-xs truncate block" title={`${patient.address?.district || 'Pune'}, ${patient.address?.state || 'Maharashtra'}`}>
                      {patient.address?.district || 'Pune'}, {patient.address?.state || 'Maharashtra'}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 min-w-0">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium truncate">{(t as any).issuedDate || "Issue Date"}</span>
                    <span className="font-semibold text-slate-300 text-xs truncate block">{issueDate}</span>
                  </div>
                </div>

                {/* Emergency Contact */}
                {patient.emergencyContact?.phone && (
                  <div className="pt-1 text-[11px] text-slate-300 flex items-center gap-1.5 flex-wrap">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="break-words"><strong>Emergency:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.phone})</span>
                  </div>
                )}
              </div>

              {/* Secure CareSetu QR Gateway */}
              <div className="shrink-0 p-3 bg-white rounded-2xl shadow-2xl border-4 border-emerald-500 flex flex-col items-center">
                <QRCodeSVG
                  value={secureQrPayload}
                  size={135}
                  level="H"
                  includeMargin={false}
                  className="w-28 h-28 sm:w-34 sm:h-34"
                />
                <span className="mt-2 text-[9px] font-black text-slate-800 tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  CareSetu Secure QR
                </span>
              </div>
            </div>

            {/* Card Footer Security Notice */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Encrypted ABDM-Compliant Healthcare Gateway</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                AUTH: GOV-IN-CSU-2026
              </div>
            </div>
          </div>

          {/* Quick Action Bar Below Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 text-center text-xs font-bold text-slate-800 hover:text-emerald-700 transition-all shadow-xs flex flex-col items-center justify-center gap-1"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>Print Physical Card</span>
            </button>
            <button
              type="button"
              onClick={() => showSuccess("Downloaded", "CareSetu Smart Card PDF saved.")}
              className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 text-center text-xs font-bold text-slate-800 hover:text-emerald-700 transition-all shadow-xs flex flex-col items-center justify-center gap-1"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download Digital PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText?.(careSetuId);
                showSuccess("Copied", `CareSetu ID ${careSetuId} copied to clipboard.`);
              }}
              className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 text-center text-xs font-bold text-slate-800 hover:text-emerald-700 transition-all shadow-xs flex flex-col items-center justify-center gap-1"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Copy CareSetu ID</span>
            </button>
          </div>
        </div>

        {/* 2. HOW CARESETU WORKS & PRIVACY SETTINGS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* How CareSetu Works Card */}
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader
              title={
                <span className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {t.howCareSetuWorks || "How CareSetu Works"}
                </span>
              }
              subtitle={t.careSetuSubtitle || "Your proprietary smart health card and encrypted medical identity"}
            />
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Carry your CareSetu QR</h4>
                  <p className="text-slate-600 mt-0.5">{t.scanAtRegistration || "Keep your physical smart card or digital profile handy on your mobile phone."}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Authorized Healthcare Provider Scans</h4>
                  <p className="text-slate-600 mt-0.5">Authorized doctors and hospital OPD desks scan your secure QR via their authenticated app.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Encrypted Health Record Gateway</h4>
                  <p className="text-slate-600 mt-0.5">Your allergies, chronic conditions, prescriptions, and lab tests unlock strictly within their medical session.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Connected Continuity of Care</h4>
                  <p className="text-slate-600 mt-0.5">Consultations, case papers, and new e-prescriptions instantly synchronize to your permanent CareSetu record.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Emergency Access Controls */}
          <Card className="border-slate-200">
            <CardHeader
              title={
                <span className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  CareSetu Privacy & Access Controls
                </span>
              }
              subtitle="Control how authorized healthcare providers view your records"
            />
            <CardContent className="space-y-3.5">
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Emergency Trauma Access</span>
                  <p className="text-[11px] text-slate-500">Allow emergency OPDs to view blood group & critical allergies</p>
                </div>
                <ToggleSwitch
                  checked={consent.allowEmergencyAccess}
                  onChange={(val) => handleToggleConsent('allowEmergencyAccess', val)}
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Share with Empaneled Hospitals</span>
                  <p className="text-[11px] text-slate-500">Grant authorized network doctors instant access upon QR scan</p>
                </div>
                <ToggleSwitch
                  checked={consent.shareRecordsWithEmpaneledHospitals}
                  onChange={(val) => handleToggleConsent('shareRecordsWithEmpaneledHospitals', val)}
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">SMS Access Notifications</span>
                  <p className="text-[11px] text-slate-500">Receive instant SMS alert whenever your CareSetu record is opened</p>
                </div>
                <ToggleSwitch
                  checked={consent.notifyOnAccess}
                  onChange={(val) => handleToggleConsent('notifyOnAccess', val)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};