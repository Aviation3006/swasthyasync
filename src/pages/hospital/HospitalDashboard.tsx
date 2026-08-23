import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hospitalService } from '../../services/hospitalService';
import { appointmentService } from '../../services/appointmentService';
import { prescriptionService } from '../../services/prescriptionService';
import { ratingService } from '../../services/ratingService';
import { HospitalAuditMetric } from '../../types/rating';
import { patientService } from '../../services/patientService';
import { Hospital, QueueItem } from '../../types/hospital';
import { Appointment } from '../../types/appointment';
import { 
  QrCode,
  Sparkles,
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Pill, 
  FileText, 
  Activity, 
  Bed, 
  Stethoscope, 
  ArrowRight, 
  PhoneCall,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Star,
  MessageSquare,
  AlertTriangle,
  Award
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';

export const HospitalDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess } = useToast();
  const { user } = useAuth();
  const { location, facility } = useUserLocation();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<Hospital>(hospitalService.getDefaultHospital());
  const [hospitalAudit, setHospitalAudit] = useState<HospitalAuditMetric | null>(() => {
    return ratingService.getHospitalAudit(facility?.facilityId || 'hosp-pune-01') || ratingService.getHospitalAudit('hosp-pune-01');
  });
  const [queue, setQueue] = useState<QueueItem[]>(hospitalService.getQueue());
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentService.getAllAppointments());
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualCareSetuId, setManualCareSetuId] = useState('');

  useEffect(() => {
    const unsubQueue = hospitalService.subscribeQueue((q) => setQueue(q));
    const unsubHosp = hospitalService.subscribeHospitals((hList) => {
      if (hList[0]) setHospital(hList[0]);
    });
    const unsubAppts = appointmentService.subscribe((list) => setAppointments(list));
    const unsubRating = ratingService.subscribe(() => {
      const audit = ratingService.getHospitalAudit(facility?.facilityId || hospital.id) || ratingService.getHospitalAudit('hosp-pune-01');
      setHospitalAudit(audit);
    });
    return () => {
      unsubQueue();
      unsubHosp();
      unsubAppts();
      unsubRating();
    };
  }, []);

  const waitingCount = queue.filter((q) => q.status === 'Waiting').length;
  const inConsultCount = queue.filter((q) => q.status === 'In Consultation').length;
  const urgentCount = queue.filter((q) => q.priority === 'Urgent' || q.status === 'Urgent').length;

  const handleCallNextPatient = (item: QueueItem) => {
    hospitalService.updateQueueItemStatus(item.id, 'In Consultation');
    showSuccess('Patient Called', `Token ${item.tokenNumber} (${item.patientName}) moved to In Consultation.`);
  };

  const handleCompleteConsultation = (item: QueueItem) => {
    hospitalService.updateQueueItemStatus(item.id, 'Completed');
    showSuccess('Consultation Completed', `Token ${item.tokenNumber} marked as Completed.`);
  };

  const totalBeds = hospital.beds.generalTotal + hospital.beds.icuTotal + hospital.beds.oxygenTotal;
  const occupiedBeds = hospital.beds.generalOccupied + hospital.beds.icuOccupied + hospital.beds.oxygenOccupied;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hospital Clinical Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-950 to-slate-900 rounded-2xl p-5 sm:p-7 text-white shadow-elevated border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-health-500/20 text-health-300 border border-health-500/30">
                {facility?.facilityType || hospital.facilityType} • {location.district ? `${location.district} District, ${location.state}` : `${hospital.taluka} District`}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ● Live OPD Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{facility?.facilityName || user?.facilityName || hospital.name}</h1>

            <p className="text-xs sm:text-sm text-slate-300">{facility?.facilityAddress || (location.district ? `${location.city || location.district}, ${location.state}` : hospital.address)} • Emergency Casualty: <strong>{facility?.facilityContact || hospital.emergencyHelpline}</strong></p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={<QrCode className="w-4 h-4" />}
              onClick={() => setIsScannerOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
            >
              {t.scanCareSetuBtn || 'Scan CareSetu QR'}
            </Button>
            <Link to="/hospital/queue">
              <Button variant="primary" size="md" leftIcon={<Clock className="w-4 h-4" />}>
                {t.navLiveQueue}
              </Button>
            </Link>
            <Link to="/hospital/prescriptions">
              <Button variant="outline" size="md" leftIcon={<Pill className="w-4 h-4" />} className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                {t.navPrescriptions}
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Operational Metrics */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">{t.bedOccupancyRate}</span>
            <div className="text-lg font-bold text-white mt-0.5">
              {occupancyRate}% <span className="text-xs font-normal text-slate-400">({occupiedBeds}/{totalBeds})</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block">{t.icuBedsAvailable}</span>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {hospital.beds.icuOccupied} / {hospital.beds.icuTotal} <span className="text-xs font-normal text-slate-400">{t.beds}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block">{t.bloodUnitsAvailable}</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {hospital.bloodBankUnitsAvailable} <span className="text-xs font-normal text-slate-400">{t.units}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block">{t.ambulancesActive}</span>
            <div className="text-lg font-bold text-sky-400 mt-0.5">
              {hospital.ambulanceAvailable} <span className="text-xs font-normal text-slate-400">Vehicles</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t.opdPatientsToday}</span>
            <Users className="w-4 h-4 text-health-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{queue.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-amber-600">{waitingCount} waiting</span> • {inConsultCount} in consult
          </div>
        </Card>

        <Card className="border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t.emergencyAdmissions}</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">{urgentCount}</div>
          <div className="text-xs text-slate-500 mt-1">Priority Triage & Emergency</div>
        </Card>

        <Card className="border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t.navAppointments}</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{appointments.length}</div>
          <div className="text-xs text-slate-500 mt-1">Scheduled across 6 departments</div>
        </Card>

        <Card className="border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t.doctorsOnDuty}</span>
            <Stethoscope className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{hospital.doctors.length}</div>
          <div className="text-xs text-slate-500 mt-1">Active in OPD & Emergency</div>
        </Card>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active Queue Table & Department Load */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Queue Triage Widget */}
          <Card>
            <CardHeader
              title={t.navLiveQueue}
              subtitle="Real-time patient flow and clinical consultation caller"
              icon={<Clock className="w-5 h-5 text-health-600" />}
              action={
                <Link to="/hospital/queue">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    {t.viewAllRecords}
                  </Button>
                </Link>
              }
            />
            <CardContent>
              <div className="divide-y divide-slate-100">
                {queue.slice(0, 5).map((item) => (
                  <div key={item.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {item.tokenNumber}
                        </span>
                        <StatusBadge
                          variant={
                            item.status === 'In Consultation'
                              ? 'warning'
                              : item.status === 'Completed'
                              ? 'success'
                              : item.priority === 'Urgent'
                              ? 'urgent'
                              : 'info'
                          }
                          size="sm"
                        >
                          {item.status}
                        </StatusBadge>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {item.priority}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {item.patientName}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          ({item.patientAge} Yrs, {item.patientGender})
                        </span>
                      </h4>

                      <p className="text-xs text-slate-600">
                        {item.departmentName} • Dr. {item.doctorName}
                      </p>

                      <p className="text-xs text-slate-500 italic line-clamp-1">
                        Complaint: {item.chiefComplaint}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {item.status === 'Waiting' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCallNextPatient(item)}
                          leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                        >
                          Call Patient
                        </Button>
                      )}

                      {item.status === 'In Consultation' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleCompleteConsultation(item)}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Finish Visit
                        </Button>
                      )}

                      <Link to={`/hospital/patients`}>
                        <Button variant="outline" size="sm">
                          {t.navRecords}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Overview */}
          <Card>
            <CardHeader
              title="Clinical Department Overview"
              subtitle="Active physician load and department bed availability"
              icon={<Building2 className="w-5 h-5 text-health-600" />}
            />
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hospital.departments.map((dept) => (
                  <div key={dept.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                      <span className="text-xs font-bold text-health-800 bg-health-100 px-2 py-0.5 rounded-full">
                        {dept.waitingQueueCount} Waiting
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Head: {dept.headDoctor}</p>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200">
                      <span>Active Doctors: <strong>{dept.activeDoctors}</strong></span>
                      <span>Beds Free: <strong>{dept.availableBeds}/{dept.totalBeds}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Doctor Launchpad, Critical Alerts */}
        <div className="space-y-6">
          {/* Quick Doctor Actions */}
          <Card>
            <CardHeader
              title={t.actions}
              subtitle="Standard physician workflows"
              icon={<Stethoscope className="w-5 h-5 text-health-600" />}
            />
            <CardContent className="space-y-2.5">
              <Link to="/hospital/patients" className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<Users className="w-4 h-4 text-health-700" />} className="justify-start">
                  {t.navPatientDirectory}
                </Button>
              </Link>
              <Link to="/hospital/prescriptions" className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<Pill className="w-4 h-4 text-emerald-700" />} className="justify-start">
                  {t.navPrescriptions}
                </Button>
              </Link>
              <Link to="/hospital/queue" className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<Clock className="w-4 h-4 text-amber-700" />} className="justify-start">
                  {t.navLiveQueue}
                </Button>
              </Link>
              <Link to="/hospital/reports" className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<FileText className="w-4 h-4 text-sky-700" />} className="justify-start">
                  {t.navReports}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Doctors on Duty List */}
          <Card>
            <CardHeader
              title={t.doctorsOnDuty}
              subtitle="OPD Room Allocation"
              icon={<UserCheck className="w-5 h-5 text-health-600" />}
            />
            <CardContent>
              <div className="space-y-2.5">
                {hospital.doctors.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-900">{doc.name}</h5>
                      <p className="text-[11px] text-slate-500">{doc.departmentName} • {doc.roomNumber}</p>
                    </div>
                    <StatusBadge variant={doc.status === 'In OPD' ? 'success' : 'neutral'} size="sm">
                      {doc.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
      {/* ================================================================= */}
      {/* REVIEWS & CLINICAL QUALITY AUDIT SECTION (HOSPITAL LEVEL) */}
      {/* ================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {t.hospitalQualityTitle || 'Hospital Clinical Quality & Patient Reviews'}
            </h2>
            <p className="text-xs text-slate-500">
              {t.hospitalQualitySubtitle || 'Aggregated post-visit patient reviews and clinical quality indicators across departments'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            {t.readOnlyNotice || 'Read-Only Quality Metric'}
          </span>
        </div>

        {/* Quality KPI Cards */}
        {hospitalAudit && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <Card className="border-slate-200 text-center p-3.5 bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.overallHospitalScore || 'Overall Hospital Score'}</span>
              <span className="text-xl font-extrabold text-amber-700 mt-1 block">⭐ {hospitalAudit.overallHospitalRating} / 5</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{hospitalAudit.totalRatings} Verified Reviews</span>
            </Card>

            <Card className="border-slate-200 text-center p-3.5 bg-white">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.doctorCareAverage || 'Doctor Clinical Care'}</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">⭐ {hospitalAudit.doctorExperienceAverage}</span>
              <span className="text-[10px] text-emerald-600 mt-0.5 block">Clinical Quality</span>
            </Card>

            <Card className="border-slate-200 text-center p-3.5 bg-white">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.staffBehaviourAverage || 'Staff Behaviour'}</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">⭐ {hospitalAudit.staffAverage}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Courtesy & Help</span>
            </Card>

            <Card className="border-slate-200 text-center p-3.5 bg-white">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.facilityHygieneAverage || 'Cleanliness & Hygiene'}</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">⭐ {hospitalAudit.cleanlinessAverage}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Sanitation Index</span>
            </Card>

            <Card className="border-slate-200 text-center p-3.5 bg-white col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.waitingTimeAverage || 'Queue & Wait Exp.'}</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">⭐ {hospitalAudit.waitingExperienceAverage}</span>
              <span className="text-[10px] text-amber-700 mt-0.5 block">OPD Triage</span>
            </Card>
          </div>
        )}

        {/* Doctor-by-Doctor Clinical Rating Breakdown */}
        <Card className="border-slate-200">
          <CardHeader
            title={t.doctorBreakdownTitle || 'Doctor-by-Doctor Clinical Rating Breakdown'}
            subtitle={t.doctorBreakdownSubtitle || 'Verified patient ratings and feedback by practitioner (Read-Only Audit)'}
            icon={<Award className="w-5 h-5 text-emerald-700" />}
          />
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-2.5 px-3 font-bold">Doctor / Practitioner</th>
                    <th className="py-2.5 px-3 font-bold">Department</th>
                    <th className="py-2.5 px-3 font-bold">Completed Visits</th>
                    <th className="py-2.5 px-3 font-bold">Verified Reviews</th>
                    <th className="py-2.5 px-3 font-bold">Communication</th>
                    <th className="py-2.5 px-3 font-bold">Professionalism</th>
                    <th className="py-2.5 px-3 font-bold">Explanation</th>
                    <th className="py-2.5 px-3 font-bold">Average Overall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hospitalAudit && hospitalAudit.doctorMetrics.length > 0 ? (
                    hospitalAudit.doctorMetrics.map((doc) => (
                      <tr key={doc.doctorId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">{doc.doctorName}</td>
                        <td className="py-3 px-3 text-slate-600">{doc.department}</td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">{doc.totalCompletedVisits}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-800">{doc.totalRatings}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">⭐ {doc.averageCommunication}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">⭐ {doc.averageProfessionalism}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">⭐ {doc.averageExplanation}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            ⭐ {doc.averageOverall} / 5
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-400">
                        {t.noReviewsYet || 'No reviews recorded for this facility yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Anonymized Patient Feedback */}
        {hospitalAudit && hospitalAudit.doctorMetrics.some(d => d.recentFeedbacks.length > 0) && (
          <Card className="border-slate-200">
            <CardHeader
              title={t.recentPatientFeedback || 'Recent Anonymized Patient Feedback'}
              subtitle="Constructive post-consultation observations for clinical quality improvement"
              icon={<MessageSquare className="w-5 h-5 text-sky-600" />}
            />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hospitalAudit.doctorMetrics.flatMap(d => 
                  d.recentFeedbacks.map(fb => ({ ...fb, doctorName: d.doctorName, department: d.department }))
                ).slice(0, 4).map((fb) => (
                  <div key={fb.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{fb.doctorName} ({fb.department})</span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ⭐ {fb.rating} / 5
                      </span>
                    </div>
                    <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-100">
                      "{fb.feedback}"
                    </p>
                    <span className="text-[10px] text-slate-400 block text-right">{fb.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>


      {/* ================================================================= */}
      {/* CARESETU QR SCANNER & DEMO PATIENT MODAL */}
      {/* ================================================================= */}
      {isScannerOpen && (
        <Modal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          title={
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>{t.scanCareSetuTitle || "Scan CareSetu Smart Health Card"}</span>
            </div>
          }
          subtitle={t.scanCareSetuDesc || "Scan patient CareSetu QR code or launch demonstration scenario"}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" size="sm" onClick={() => setIsScannerOpen(false)}>
                {t.close || "Close"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const targetId = manualCareSetuId.trim() || 'CSU-IND-PUN-00018427';
                  setIsScannerOpen(false);
                  navigate(`/hospital/caresetu-record/${targetId}`);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Access Patient Record
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            
            {/* Live Camera Scanner Simulation Graphic */}
            <div className="bg-slate-950 rounded-2xl p-6 border-2 border-dashed border-emerald-500/60 text-center relative overflow-hidden">
              <div className="w-40 h-40 mx-auto border-2 border-emerald-400 rounded-xl relative flex items-center justify-center bg-slate-900/80">
                {/* Scanning Laser Line Animation */}
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                <QrCode className="w-20 h-20 text-slate-600" />
                <span className="absolute bottom-2 text-[10px] text-emerald-300 font-mono">
                  Align CareSetu QR Code
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-3">
                Point device camera at patient's CareSetu Smart Card or Mobile Profile
              </p>
            </div>

            {/* Quick Demo Presentation Scenario for Judges */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {t.demoCareSetuNotice || "Demo Patient Scenario (1-Click)"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                  Verified Seed
                </span>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200">
                <div>
                  <h4 className="font-bold text-slate-900">Rameshwar B. Jadhav</h4>
                  <span className="font-mono text-[11px] text-emerald-800">CSU-IND-PUN-00018427</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsScannerOpen(false);
                    navigate('/hospital/caresetu-record/CSU-IND-PUN-00018427');
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs transition"
                >
                  {t.openDemoCareSetuRecord || "Open Demo Record"} →
                </button>
              </div>
            </div>

            {/* Manual CareSetu ID Entry */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Or Enter CareSetu ID Manually</label>
              <input
                type="text"
                placeholder="e.g. CSU-IND-PUN-00018427"
                value={manualCareSetuId}
                onChange={(e) => setManualCareSetuId(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
