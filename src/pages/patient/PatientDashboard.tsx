import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { recordService } from '../../services/recordService';
import { notificationService } from '../../services/notificationService';
import { Patient } from '../../types/patient';
import { Appointment } from '../../types/appointment';
import { MedicalRecord } from '../../types/records';
import { NotificationItem } from '../../types/notifications';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Stethoscope, 
  FileCheck2, 
  QrCode, 
  ShieldCheck, 
  PhoneCall, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Pill,
  Droplet,
  ChevronRight,
  Sparkles,
  MapPin,
  Building2,
  Bell,
  Mic
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient>(() => patientService.getPatientForUser(user));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Daily medication checklist state (for test patient account)
  const isTestAccount = user?.email === 'patient.test@swasthasync.com';
  const [medsTaken, setMedsTaken] = useState<{ [key: string]: boolean }>({
    'morning-metformin': true,
    'morning-telmisartan': true,
    'afternoon-calcium': false,
    'night-metformin': false,
    'night-atorvastatin': false
  });

  useEffect(() => {
    const currentPatient = patientService.getPatientForUser(user);
    setPatient(currentPatient);
    setAppointments(appointmentService.getAppointmentsByPatient(currentPatient.id));
    setRecords(recordService.getRecordsByPatient(currentPatient.id));
    setNotifications(notificationService.getNotificationsForUser(currentPatient.id));

    const unsubAppts = appointmentService.subscribe((list) => {
      setAppointments(list.filter((a) => a.patientId === currentPatient.id));
    });
    const unsubPatient = patientService.subscribe((list) => {
      const p = list.find((item) => item.id === currentPatient.id);
      if (p) setPatient(p);
    });
    const unsubRecords = recordService.subscribe((list) => {
      setRecords(list.filter((r) => r.patientId === currentPatient.id));
    });
    const unsubNotifs = notificationService.subscribe((list) => {
      setNotifications(list.filter((n) => n.recipientId === currentPatient.id || n.recipientId === 'all'));
    });

    return () => {
      unsubAppts();
      unsubPatient();
      unsubRecords();
      unsubNotifs();
    };
  }, [user]);

  const upcomingAppts = appointments.filter((a) => a.status === 'Upcoming');
  const nextAppt = upcomingAppts[0];

  const toggleMed = (key: string) => {
    setMedsTaken((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Patient Health Summary Top Banner */}
      <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-navy-950 rounded-2xl p-5 sm:p-7 text-white shadow-elevated border border-pink-800/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {language === 'mr' && patient.nameMarathi ? patient.nameMarathi : (patient.name || user?.name || t.citizenPatientTab)}
              </h1>
              {patient.abhaId ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t.verified} ABHA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t.abhaPending || "ABHA Link Pending"}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-300">
              <span><strong>{t.abhaId}:</strong> {patient.abhaId || t.notLinked}</span>
              <span>•</span>
              <span><strong>{t.ageGender}:</strong> {patient.age > 0 ? `${patient.age} ${t.years || "Yrs"} / ${patient.gender === "Male" ? t.male : patient.gender === "Female" ? t.female : patient.gender || t.notSpecified}` : t.notSpecified}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-rose-300">
                <Droplet className="w-3.5 h-3.5" /> {t.bloodGroup}: {patient.bloodGroup || t.notRecorded}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {(() => {
                  const v = patient.address?.village?.trim();
                  const d = patient.address?.district?.trim();
                  const s = patient.address?.state?.trim();
                  if (v && d && s) return `${v}, ${d}, ${s}`;
                  if (d && s) return `${d}, ${s}`;
                  if (v && s) return `${v}, ${s}`;
                  if (d) return d;
                  if (s) return s;
                  if (v) return v;
                  return t.locationNotSet || 'Location not provided';
                })()}
              </span>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-slate-200 border border-white/10">
                🏥 {patient.registeredHospital || `${t.departmentFacility}: ${t.notAssigned}`}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-health-600/30 text-health-200 border border-health-500/30">
                🛡️ {patient.activeScheme ? (t.comprehensiveHealthPlan || patient.activeScheme) : `${t.activeScheme}: ${t.notEnrolled}`}
              </span>
            </div>
          </div>

          {/* Quick Health Card Link - Clearly visible high-contrast buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-row gap-2.5 w-full lg:w-auto items-stretch">
            <Link to="/patient/health-qr" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                leftIcon={<QrCode className="w-4 h-4 text-emerald-800 flex-shrink-0" />}
                className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold border-2 border-emerald-400 shadow-md w-full sm:w-auto px-4 py-2"
              >
                {t.careSetuCard || "CareSetu Smart Card"}
              </Button>
            </Link>
            <Link to="/patient/appointments" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Calendar className="w-4 h-4 text-white flex-shrink-0" />}
                className="bg-health-600 hover:bg-health-500 text-white font-bold border border-health-400/80 shadow-md w-full sm:w-auto px-4 py-2"
              >
                {t.bookOpdAppointment}
              </Button>
            </Link>
          </div>
        </div>

        {/* Critical Alerts Banner (Allergies & Conditions) */}
        <div className="mt-5 pt-4 border-t border-health-700/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/40">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300">{t.allergiesRecorded}: </span>
              <span className="text-slate-200">
                {patient.allergies && patient.allergies.length > 0
                  ? patient.allergies.map((a) => `${a.substance} (${a.severity})`).join(', ')
                  : t.noDrugFoodAllergies}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-health-950/40 p-2.5 rounded-lg border border-health-700/40">
            <Activity className="w-4 h-4 text-health-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-health-300">{t.chronicCareRegimen}: </span>
              <span className="text-slate-200">
                {patient.chronicConditions && patient.chronicConditions.length > 0
                  ? patient.chronicConditions.map((c) => c.name).join(', ')
                  : t.noChronicConditions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          {t.actions}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Link to="/patient/records" className="group">
            <Card hoverEffect padded={false} className="p-4 text-center h-full flex flex-col items-center justify-center group-hover:border-health-400">
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800">{t.navRecords}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t.medicalRecordsTitle}</p>
            </Card>
          </Link>

          <Link to="/patient/appointments" className="group">
            <Card hoverEffect padded={false} className="p-4 text-center h-full flex flex-col items-center justify-center group-hover:border-health-400">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800">{t.navAppointments}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t.bookNewAppointment}</p>
            </Card>
          </Link>

          <Link to="/patient/symptoms/voice" className="group">
            <Card hoverEffect padded={false} className="p-4 text-center h-full flex flex-col items-center justify-center group-hover:border-health-400">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800">{t.navSymptoms}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t.voiceSymptomLogger || "Voice Symptom Logger"}</p>
            </Card>
          </Link>

          <Link to="/patient/reports" className="group">
            <Card hoverEffect padded={false} className="p-4 text-center h-full flex flex-col items-center justify-center group-hover:border-health-400">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800">{t.navReports}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t.recordExplainerTitle}</p>
            </Card>
          </Link>

          <Link to="/patient/health-qr" className="group col-span-2 sm:col-span-1">
            <Card hoverEffect padded={false} className="p-4 text-center h-full flex flex-col items-center justify-center group-hover:border-health-400">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800">CareSetu</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{t.smartHealthCard || "Smart Health Card"}</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Upcoming Appointment, Medication Tracker, Chronic Vitals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointment Spotlight */}
          <Card>
            <CardHeader
              title={t.upcomingAppointments}
              subtitle={t.confirmedOpdToken}
              icon={<Calendar className="w-5 h-5" />}
              action={
                <Link to="/patient/appointments">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    {t.all} ({upcomingAppts.length})
                  </Button>
                </Link>
              }
            />
            <CardContent>
              {nextAppt ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-health-100 text-health-800 border border-health-200">
                        {t.tokenNumber}: {nextAppt.tokenNumber}
                      </span>
                      <StatusBadge variant="info" size="sm">
                        {nextAppt.type === "Follow-up" ? (t.followUp || "Follow-up") : nextAppt.type}
                      </StatusBadge>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{nextAppt.doctorName}</h4>
                    <p className="text-xs text-slate-600">
                      {nextAppt.departmentName} • {nextAppt.doctorSpecialization}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {nextAppt.hospitalName} ({nextAppt.roomNumber})
                    </p>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-bold text-health-800">
                        {new Date(nextAppt.date).toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-slate-500 font-medium flex items-center sm:justify-end gap-1">
                        <Clock className="w-3.5 h-3.5" /> {nextAppt.timeSlot}
                      </div>
                    </div>
                    <Link to="/patient/appointments">
                      <Button variant="outline" size="sm" className="mt-1">
                        {t.viewDetails}
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  {t.noUpcomingAppointments}.{' '}
                  <Link to="/patient/appointments" className="text-health-700 font-semibold underline">
                    {t.bookAppointmentBtn}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Medication & Prescription Schedule */}
          <Card>
            <CardHeader
              title={t.activeMedications}
              subtitle={t.prescriptionsSubtitle || "Digital dosage schedule linked to district hospital Rx"}
              icon={<Pill className="w-5 h-5" />}
              action={
                isTestAccount ? (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {Object.values(medsTaken).filter(Boolean).length} {t.of} 5 {t.dosesTakenCount}
                  </span>
                ) : undefined
              }
            />
            <CardContent>
              {isTestAccount ? (
                <div className="space-y-3">
                  {/* Morning */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                        ☀️ {t.morningDosage}
                      </span>
                      <span className="text-[11px] text-slate-500">08:30 AM - 09:30 AM</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        medsTaken['morning-metformin'] ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">Metformin SR 500mg</span>
                          <span className="text-[11px] text-slate-500">1 Tab • {t.bloodSugar}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={medsTaken['morning-metformin']}
                          onChange={() => toggleMed('morning-metformin')}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </label>

                      <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        medsTaken['morning-telmisartan'] ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">Telmisartan 40mg</span>
                          <span className="text-[11px] text-slate-500">1 Tab • {t.bloodPressure}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={medsTaken['morning-telmisartan']}
                          onChange={() => toggleMed('morning-telmisartan')}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Afternoon & Night */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
                        🌤️ {t.afternoonDosage}
                      </div>
                      <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        medsTaken['afternoon-calcium'] ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">Calcium + Vit D3</span>
                          <span className="text-[11px] text-slate-500">1 Tab</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={medsTaken['afternoon-calcium']}
                          onChange={() => toggleMed('afternoon-calcium')}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </label>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                        🌙 {t.nightDosage}
                      </div>
                      <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        medsTaken['night-atorvastatin'] ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">Atorvastatin 10mg</span>
                          <span className="text-[11px] text-slate-500">1 Tab</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={medsTaken['night-atorvastatin']}
                          onChange={() => toggleMed('night-atorvastatin')}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs space-y-1">
                  <p>{t.noActiveMedications}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chronic Vitals Monitoring */}
          <Card>
            <CardHeader
              title={t.vitalsOverview}
              subtitle={patient.registeredHospital ? `${t.recorded || "Recorded at"} ${patient.registeredHospital}` : t.vitalsOverview}
              icon={<Activity className="w-5 h-5" />}
              action={
                <Link to="/patient/profile">
                  <Button variant="ghost" size="sm">
                    {t.viewDetails}
                  </Button>
                </Link>
              }
            />
            <CardContent>
              {patient.vitals && (patient.vitals.bloodPressure || patient.vitals.bloodSugarFasting || patient.vitals.heartRate || patient.vitals.spO2) ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="text-[11px] text-slate-500 uppercase font-medium">{t.bloodPressure}</span>
                    <div className="text-base sm:text-lg font-bold text-slate-900">{patient.vitals.bloodPressure || '-- / --'}</div>
                    <StatusBadge variant={patient.vitals.bloodPressure ? 'success' : 'neutral'} size="sm">
                      {patient.vitals.bloodPressure ? t.optimal : t.noData}
                    </StatusBadge>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="text-[11px] text-slate-500 uppercase font-medium">{t.bloodSugar}</span>
                    <div className="text-base sm:text-lg font-bold text-slate-900">{patient.vitals.bloodSugarFasting ? `${patient.vitals.bloodSugarFasting} mg/dL` : '--'}</div>
                    <StatusBadge variant={patient.vitals.bloodSugarFasting ? 'success' : 'neutral'} size="sm">
                      {patient.vitals.bloodSugarFasting ? t.normal : t.noData}
                    </StatusBadge>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="text-[11px] text-slate-500 uppercase font-medium">{t.heartRate}</span>
                    <div className="text-base sm:text-lg font-bold text-slate-900">{patient.vitals.heartRate ? `${patient.vitals.heartRate} bpm` : '--'}</div>
                    <StatusBadge variant={patient.vitals.heartRate ? 'success' : 'neutral'} size="sm">
                      {patient.vitals.heartRate ? t.normal : t.noData}
                    </StatusBadge>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="text-[11px] text-slate-500 uppercase font-medium">{t.spO2}</span>
                    <div className="text-base sm:text-lg font-bold text-slate-900">{patient.vitals.spO2 ? `${patient.vitals.spO2}% SpO2` : '--'}</div>
                    <StatusBadge variant={patient.vitals.spO2 ? 'success' : 'neutral'} size="sm">
                      {patient.vitals.spO2 ? t.optimal : t.noData}
                    </StatusBadge>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">{t.noVitalsRecordedYet}</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {t.visitPhcPrompt}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Emergency Card, Recent Records, Notifications */}
        <div className="space-y-6">
          {/* Emergency 24x7 Quick Card */}
          <div className="bg-rose-600 text-white rounded-2xl p-5 shadow-card border border-rose-500 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t.emergency108}</h3>
                <p className="text-xs text-rose-100">{t.nationalMedicalAssistance}</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                <span>{t.ambulanceDispatch}</span>
                <a href="tel:108" className="font-bold underline text-sm">108</a>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                <span>{t.hospitalCasualty}</span>
                <a href="tel:+912027280999" className="font-bold underline text-xs">+91 20 2728 0999</a>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                <span>{t.emergencyContact} ({patient.emergencyContact?.relationship || t.emergencyContact})</span>
                <span className="font-bold">{patient.emergencyContact?.phone || patient.phone}</span>
              </div>
            </div>
          </div>

          {/* Recent Records & Reports */}
          <Card>
            <CardHeader
              title={t.recentMedicalRecords}
              subtitle={t.latestTestsSummaries}
              icon={<FileText className="w-5 h-5" />}
              action={
                <Link to="/patient/records">
                  <Button variant="ghost" size="sm">
                    {t.viewAllRecords}
                  </Button>
                </Link>
              }
            />
            <CardContent>
              {records.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {records.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <StatusBadge variant={rec.recordType === 'Lab Report' ? 'teal' : 'neutral'} size="sm">
                          {rec.recordType}
                        </StatusBadge>
                        <span className="text-[11px] text-slate-400">{rec.date}</span>
                      </div>
                      <h5 className="text-xs font-semibold text-slate-900 line-clamp-1">{rec.title}</h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{rec.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  {t.noRecentRecords}.{' '}
                  <Link to="/patient/reports" className="text-health-700 font-semibold underline">
                    {t.uploadNewRecord}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications Widget */}
          <Card>
            <CardHeader
              title={t.notifications}
              subtitle={t.importantUpdatesReminders}
              icon={<Bell className="w-5 h-5" />}
              action={
                <Link to="/patient/notifications">
                  <Button variant="ghost" size="sm">
                    {t.viewAllNotifications}
                  </Button>
                </Link>
              }
            />
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-2.5">
                  {notifications.slice(0, 3).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border text-xs space-y-1 ${
                        !notif.isRead ? 'bg-health-50/50 border-health-200' : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span className="line-clamp-1">{notif.title}</span>
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-health-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  {t.noNotifications}.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
