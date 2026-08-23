import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { mockMedicalRecords } from '../../data/records';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types/appointment';
import { Patient } from '../../types/patient';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useToast } from '../../context/ToastContext';
import { 
  ShieldCheck, 
  User, 
  Droplet, 
  AlertTriangle, 
  FileText, 
  Pill, 
  Calendar, 
  Activity, 
  PhoneCall, 
  Lock, 
  ArrowLeft, 
  Printer, 
  Stethoscope, 
  Heart
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const CareSetuPatientRecord: React.FC = () => {
  const { careSetuId } = useParams<{ careSetuId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { showSuccess } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'reports' | 'prescriptions' | 'appointments' | 'emergency'>('overview');

  const patient: Patient = React.useMemo(() => {
    if (careSetuId) {
      const found = patientService.getPatientByCareSetuId(careSetuId);
      if (found) return found;
    }
    return patientService.getPrimaryPatient();
  }, [careSetuId]);

  const patientRecords = mockMedicalRecords.filter(r => r.patientId === patient.id || patient.id === 'pat-mh-001');
  const patientAppointments: Appointment[] = appointmentService.getAllAppointments().filter((a: Appointment) => a.patientId === patient.id || patient.id === 'pat-mh-001');

  const auditTimestamp = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const activeCareSetuId = patient.careSetuId || 'CSU-IND-PUN-00018427';
  const hospitalName = user?.facilityName || 'Aundh District Hospital';
  const doctorName = user?.name || 'Dr. Anjali Deshmukh';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Navigation & Back Action */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/hospital')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{(t as any).backToDashboard || 'Back to Hospital Console'}</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            {(t as any).printSummary || 'Print Record Summary'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Stethoscope className="w-4 h-4" />}
            onClick={() => {
              showSuccess('Consultation Started', `OPD Consultation encounter initiated for ${patient.name}.`);
              navigate('/hospital/queue');
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
          >
            {(t as any).startConsultation || 'Start OPD Consultation'}
          </Button>
        </div>
      </div>

      {/* 1. SECURE ACCESS AUDIT BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-sky-950 text-white border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-wide">
                🔒 Authorized Healthcare Access Only
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 font-mono font-bold border border-emerald-600/40">
                SESSION: SES-2026-0823-842
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Accessed by <strong>{hospitalName}</strong> • {doctorName} • <span className="text-emerald-300">{auditTimestamp}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ABDM Encrypted Gateway</span>
        </div>
      </div>

      {/* 2. PATIENT IDENTITY HEADER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {language === 'mr' && patient.nameMarathi ? patient.nameMarathi : patient.name}
              </h2>
              <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                {activeCareSetuId}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ● Card Active
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap font-medium">
              <span><strong>Age:</strong> {patient.age || 48} Yrs ({patient.gender || 'Male'})</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-rose-600 font-bold">
                <Droplet className="w-3.5 h-3.5 fill-rose-600" /> Blood Group: {patient.bloodGroup || 'B+'}
              </span>
              <span>•</span>
              <span><strong>Location:</strong> {patient.address?.district || 'Pune'}, {patient.address?.state || 'Maharashtra'}</span>
              <span>•</span>
              <span><strong>Registered:</strong> {patient.registeredHospital || 'Aundh District Hospital'}</span>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-900 shrink-0 w-full md:w-auto">
          <div className="flex items-center gap-1.5 font-bold text-rose-700">
            <AlertTriangle className="w-4 h-4" />
            <span>Critical Clinical Warnings</span>
          </div>
          <p className="font-semibold text-[11px] mt-0.5">
            Allergy: <span className="font-bold text-rose-950">Penicillin / Amoxicillin (Severe)</span>
          </p>
          <p className="text-[10px] text-rose-700">Contraindicated: Beta-lactam antibiotics</p>
        </div>
      </div>

      {/* 3. CLINICAL RECORD NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Patient Overview', icon: User },
          { id: 'history', label: 'Medical History', icon: Stethoscope },
          { id: 'reports', label: 'Reports & Investigations', icon: FileText, badge: patientRecords.length },
          { id: 'prescriptions', label: 'Prescriptions & Meds', icon: Pill, badge: 2 },
          { id: 'appointments', label: 'Encounters & Visits', icon: Calendar, badge: patientAppointments.length },
          { id: 'emergency', label: 'Emergency Protocol', icon: Heart }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Blood Pressure</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">128/84 <span className="text-xs text-slate-500 font-medium">mmHg</span></span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">● Optimal</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Fasting Glucose</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">118 <span className="text-xs text-slate-500 font-medium">mg/dL</span></span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">● Monitoring</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">HbA1c (May 2026)</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">6.7%</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">● Controlled</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">SpO2 / Pulse</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">98% <span className="text-xs text-slate-500 font-medium">/ 74 bpm</span></span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">● Normal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader
                title="Chronic Health Conditions"
              />
              <CardContent className="space-y-3">
                {patient.chronicConditions?.map((cc) => (
                  <div key={cc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{cc.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {cc.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">{cc.notes}</p>
                    <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-2">
                      <span>Treating: {cc.treatingDoctor}</span>
                      <span>•</span>
                      <span>{cc.hospital}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Documented Clinical Allergies"
              />
              <CardContent className="space-y-3">
                {patient.allergies?.map((alg) => (
                  <div key={alg.id} className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-rose-950">{alg.substance}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-200 text-rose-900 uppercase">
                        {alg.severity}
                      </span>
                    </div>
                    <p className="text-rose-800 text-[11px] mt-1">Reaction: {alg.reaction}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: MEDICAL HISTORY */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader
            title="Consolidated Medical History & Consultation Encounters"
            subtitle="Encrypted timeline from empaneled district hospitals"
          />
          <CardContent className="space-y-4">
            {patientRecords.map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 inline-block mb-1">
                      {rec.recordType}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                    <p className="text-slate-500 text-xs">{rec.hospitalName} • {rec.department} • {rec.doctorName}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-semibold">{rec.date}</span>
                </div>
                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {rec.summary}
                </p>
                {rec.diagnosis && (
                  <div className="text-slate-800 font-semibold">
                    <strong>Diagnosis:</strong> {rec.diagnosis}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: REPORTS */}
      {activeTab === 'reports' && (
        <Card>
          <CardHeader
            title="Diagnostic Investigations & Laboratory Biomarkers"
            subtitle="Verified lab test findings and imaging reports"
          />
          <CardContent className="space-y-4">
            {patientRecords.filter(r => r.biomarkers && r.biomarkers.length > 0).map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500">{rec.hospitalName} • {rec.date}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Verified Lab Report
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {rec.biomarkers?.map((bm, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{bm.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bm.status === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {bm.status}
                        </span>
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        {bm.value} <span className="text-xs text-slate-500 font-normal">{bm.unit}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Ref: {bm.referenceRange}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 4: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <Card>
          <CardHeader
            title="Active Prescriptions & Regimen History"
            subtitle="Digital electronic prescriptions with valid signature authentication"
          />
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Chronic Maintenance Regimen (90-Day Valid)</h4>
                  <p className="text-xs text-slate-500">Prescribed by Dr. Anjali Deshmukh • Aundh District Hospital</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Active Refill
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Tab. Metformin Hydrochloride 500mg</span>
                    <span className="text-slate-500 text-[11px]">Dosage: 1 Tab Twice Daily (BD) • Take after meals</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Duration: 90 Days</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Tab. Telmisartan 40mg</span>
                    <span className="text-slate-500 text-[11px]">Dosage: 1 Tab Once Daily in Morning (OD) • Take with water</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Duration: 90 Days</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Dispensed at: Jan Aushadhi / MJPJAY Pharmacy Counter</span>
                <span className="font-mono">SIG: SHA256:91bc740118ea002a...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <Card>
          <CardHeader
            title="Hospital Visits & OPD Consultation History"
            subtitle="Previous visits across empaneled district healthcare facilities"
          />
          <CardContent className="space-y-3">
            {patientAppointments.map((appt: Appointment) => (
              <div key={appt.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{appt.doctorName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{appt.departmentName}</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{appt.hospitalName} • Token: <strong>{appt.tokenNumber}</strong></p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-slate-900 block">{appt.date}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 6: EMERGENCY */}
      {activeTab === 'emergency' && (
        <Card className="border-rose-200">
          <CardHeader
            title={
              <span className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
                <Heart className="w-4 h-4 fill-rose-600" />
                Emergency Trauma & Resuscitation Protocol
              </span>
            }
            subtitle="Rapid critical information for trauma response teams"
          />
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-950 text-sm">Primary Clinical Contraindications</h4>
              <ul className="list-disc list-inside text-rose-900 space-y-1">
                <li><strong>DO NOT ADMINISTER:</strong> Penicillin, Amoxicillin, Ampicillin, or beta-lactam derivatives (Severe Anaphylaxis Risk).</li>
                <li><strong>MONITOR GLUCOSE:</strong> Patient has Type 2 Diabetes Mellitus on oral hypoglycemic agents.</li>
                <li><strong>BLOOD GROUP:</strong> B RhD Positive (B+). Cross-match compatible with B+, B-, O+, O-.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block font-medium">Emergency Next-of-Kin Contact:</span>
                <span className="font-bold text-slate-900 text-sm">{patient.emergencyContact?.name || 'Sunita R. Jadhav (Spouse)'}</span>
              </div>
              <a
                href={`tel:${patient.emergencyContact?.phone || '+919822451903'}`}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {patient.emergencyContact?.phone || '+91 98224 51903'}</span>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};
