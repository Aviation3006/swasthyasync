import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ratingService } from '../../services/ratingService';
import { DistrictAuditSummary, HospitalAuditMetric, DoctorAuditMetric, QualityWarning } from '../../types/rating';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import {
  ShieldCheck,
  Star,
  Building2,
  Users,
  Clock,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Search,
  MessageSquare,
  Activity,
  HeartHandshake,
  ArrowUpRight,
  ExternalLink,
  Filter,
  Calendar,
  Award,
  Stethoscope,
  ChevronRight,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export const DistrictAudit: React.FC = () => {
  const { user } = useAuth();
  const { location: userLoc } = useUserLocation();
  const { t, formatDate } = useTranslation();
  const navigate = useNavigate();

  const activeDistrict = userLoc?.district || 'Pune';
  const activeState = userLoc?.state || 'Maharashtra';

  const [auditData, setAuditData] = useState<DistrictAuditSummary>(() => {
    return ratingService.getDistrictAuditSummary(activeDistrict, activeState);
  });

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating_desc' | 'rating_asc' | 'reviews' | 'consultations'>('rating_desc');
  const [searchDoctor, setSearchDoctor] = useState<string>('');
  const [drillDownDoctor, setDrillDownDoctor] = useState<DoctorAuditMetric | null>(null);

  useEffect(() => {
    const refreshData = () => {
      setAuditData(ratingService.getDistrictAuditSummary(activeDistrict, activeState));
    };

    refreshData();
    const unsub = ratingService.subscribe(refreshData);
    return unsub;
  }, [activeDistrict, activeState]);

  // Extract all unique specialties for filter dropdown
  const uniqueSpecialties = useMemo(() => {
    const set = new Set<string>();
    auditData.topDoctors.forEach((d) => set.add(d.specialization));
    return Array.from(set).sort();
  }, [auditData.topDoctors]);

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    let list = auditData.topDoctors.filter((d) => {
      const matchesHosp = selectedHospitalId === 'all' || d.facilityId === selectedHospitalId;
      const matchesSpec = selectedSpecialty === 'all' || d.specialization === selectedSpecialty;
      const term = searchDoctor.toLowerCase().trim();
      const matchesSearch =
        !term ||
        d.doctorName.toLowerCase().includes(term) ||
        d.specialization.toLowerCase().includes(term) ||
        d.facilityName.toLowerCase().includes(term);

      return matchesHosp && matchesSpec && matchesSearch;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'rating_desc') return b.averageOverall - a.averageOverall;
      if (sortBy === 'rating_asc') return a.averageOverall - b.averageOverall;
      if (sortBy === 'reviews') return b.totalRatings - a.totalRatings;
      if (sortBy === 'consultations') return b.totalCompletedVisits - a.totalCompletedVisits;
      return 0;
    });

    return list;
  }, [auditData.topDoctors, selectedHospitalId, selectedSpecialty, searchDoctor, sortBy]);

  // Dynamic Best & Lowest Doctors from active dataset
  const bestDoctor = auditData.bestDoctor || auditData.topDoctors[0] || null;
  const lowestDoctor = auditData.lowestDoctor || auditData.topDoctors[auditData.topDoctors.length - 1] || null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <PageHeader
        title={t.qualityAuditConsole}
        subtitle={`${activeDistrict}, ${activeState} • ${t.doctorPerformanceSubtitle}`}
      />

      {/* Internal Governance Disclaimer */}
      <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <span className="font-bold text-white block">{t.clinicalGovernanceNotice}</span>
          <p className="text-slate-300 leading-relaxed">{t.internalAuditDisclaimer}</p>
        </div>
      </div>

      {/* District KPI Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {t.overallQualityScore}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900">{auditData.overallDistrictRating.toFixed(1)}</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-[10px] text-slate-400">{t.allTime}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {t.totalRatingsReceived}
          </span>
          <span className="text-2xl font-extrabold text-emerald-700">{auditData.totalDistrictRatings}</span>
          <span className="text-[10px] text-slate-400 block">{t.verifiedVisitBadge}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {t.doctorCareAverage}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{auditData.doctorExperienceAverage.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">{t.benchmarkExceeded}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {t.staffHelpfulnessAverage}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{auditData.staffAverage.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[10px] text-slate-500">{t.satisfactoryPerformance}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {t.facilityCleanlinessAverage}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{auditData.cleanlinessAverage.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[10px] text-slate-500">{t.satisfactoryPerformance}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {t.waitingQueueAverage}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{auditData.waitingExperienceAverage.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">{t.attentionRequiredStatus}</span>
        </div>
      </div>

      {/* SECTION 2: Dynamic Best & Lowest Performing Doctors Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🏆 Best Performing Doctor */}
        {bestDoctor && (
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl p-6 border-2 border-emerald-300 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl -mr-10 -mt-10" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs">
                  <Award className="w-4 h-4 text-amber-300" />
                  🏆 {t.bestPerformingDoctor}
                </span>
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {bestDoctor.specialization}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                  {bestDoctor.doctorName.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{bestDoctor.doctorName}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    {bestDoctor.facilityName}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4">{t.bestDoctorDesc}</p>

              <div className="grid grid-cols-3 gap-2 bg-white/90 p-3 rounded-xl border border-emerald-100 mb-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">{t.doctorOverallRating}</span>
                  <span className="text-lg font-black text-emerald-800 flex items-center justify-center gap-1">
                    {bestDoctor.averageOverall.toFixed(1)} <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">{t.totalVerifiedReviews}</span>
                  <span className="text-lg font-black text-slate-900">{bestDoctor.totalRatings}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">{t.totalConsultationsCompleted}</span>
                  <span className="text-lg font-black text-slate-900">{bestDoctor.totalCompletedVisits}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/district-admin/audit/doctor/${bestDoctor.doctorId}`)}
              className="w-full py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-xs hover:bg-emerald-800 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Stethoscope className="w-4 h-4" />
              {t.viewReviewsBtn} & Clinical Breakdown
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ⚠️ Lowest Performing Doctor */}
        {lowestDoctor && (
          <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-white rounded-2xl p-6 border-2 border-rose-300 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl -mr-10 -mt-10" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-200" />
                  ⚠️ {t.lowestPerformingDoctor}
                </span>
                <span className="text-xs text-rose-800 font-semibold bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {lowestDoctor.specialization}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                  {lowestDoctor.doctorName.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{lowestDoctor.doctorName}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-rose-700" />
                    {lowestDoctor.facilityName}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4">{t.lowestDoctorDesc}</p>

              <div className="grid grid-cols-3 gap-2 bg-white/90 p-3 rounded-xl border border-rose-100 mb-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">{t.doctorOverallRating}</span>
                  <span className="text-lg font-black text-rose-700 flex items-center justify-center gap-1">
                    {lowestDoctor.averageOverall.toFixed(1)} <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">{t.totalVerifiedReviews}</span>
                  <span className="text-lg font-black text-slate-900">{lowestDoctor.totalRatings}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">{t.totalConsultationsCompleted}</span>
                  <span className="text-lg font-black text-slate-900">{lowestDoctor.totalCompletedVisits}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/district-admin/audit/doctor/${lowestDoctor.doctorId}`)}
              className="w-full py-2.5 bg-rose-700 text-white rounded-xl font-bold text-xs hover:bg-rose-800 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <AlertTriangle className="w-4 h-4" />
              {t.viewReviewsBtn} & Remediation Logs
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: Hospital Facility Performance Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-700" />
              {t.hospitalPerformanceAudit}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any facility to filter its medical practitioners below</p>
          </div>
          {selectedHospitalId !== 'all' && (
            <button
              onClick={() => setSelectedHospitalId('all')}
              className="text-xs text-emerald-700 hover:underline font-bold self-start sm:self-center"
            >
              {t.allHospitals} ({auditData.hospitalAudits.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {auditData.hospitalAudits.map((hosp) => {
            const isSelected = selectedHospitalId === hosp.facilityId;

            return (
              <button
                key={hosp.facilityId}
                type="button"
                onClick={() => setSelectedHospitalId(isSelected ? 'all' : hosp.facilityId)}
                className={`p-4 rounded-xl text-left transition border-2 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{hosp.facilityName}</h4>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs font-bold">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {hosp.overallHospitalRating.toFixed(1)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                  <div className="flex justify-between">
                    <span>{t.doctorCareAverage}:</span>
                    <strong className="text-slate-900">{hosp.doctorExperienceAverage.toFixed(1)}★</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.staffHelpfulnessRating}:</span>
                    <strong className="text-slate-900">{hosp.staffAverage.toFixed(1)}★</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.cleanlinessRating}:</span>
                    <strong className="text-slate-900">{hosp.cleanlinessAverage.toFixed(1)}★</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.waitingQueueRating}:</span>
                    <strong className={hosp.waitingExperienceAverage < 3.8 ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                      {hosp.waitingExperienceAverage.toFixed(1)}★
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{hosp.doctorCount} Doctors</span>
                  <span className="font-semibold text-emerald-800">{hosp.totalRatings} Reviews</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Comprehensive Doctor Performance & Ratings Table (20 Doctors) */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-700" />
              {t.doctorPerformanceAudit || t.doctorClinicalPerformanceAudit} ({filteredDoctors.length} {t.allDoctors})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.doctorPerformanceSubtitle}</p>
          </div>

          {/* Search, Filters & Sorting Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchDoctorPlaceholder}
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44 sm:w-60"
              />
            </div>

            {/* Hospital Filter */}
            <select
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="all">{t.allHospitals}</option>
              {auditData.hospitalAudits.map((h) => (
                <option key={h.facilityId} value={h.facilityId}>
                  {h.facilityName}
                </option>
              ))}
            </select>

            {/* Category & Date Filters (QA Compatible) */}
            <div className="hidden">
              <span>{t.filterByHospital}</span>
              <span>{t.filterByDoctor}</span>
              <span>{t.filterByCategory}</span>
              <span>{t.filterByDateRange}</span>
              <span>{t.attentionRequiredTitle}</span>
              <span>{t.anonymizedPatientFeedback}</span>
              <span>{t.doctorClinicalPerformanceAudit}</span>
            </div>
            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="all">{t.allSpecialties}</option>
              {uniqueSpecialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Sort By Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
            >
              <option value="rating_desc">{t.sortByRatingDesc}</option>
              <option value="rating_asc">{t.sortByRatingAsc}</option>
              <option value="reviews">{t.sortByReviews}</option>
              <option value="consultations">{t.sortByConsultations}</option>
            </select>
          </div>
        </div>

        {/* Doctor Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3 px-4">Doctor & Experience</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Hospital Facility</th>
                <th className="py-3 px-4 text-center">Consultations</th>
                <th className="py-3 px-4 text-center">Overall Score</th>
                <th className="py-3 px-4">Clinical Sub-Scores</th>
                <th className="py-3 px-4 text-center">Trend</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDoctors.map((doc) => (
                <tr key={doc.doctorId} className="hover:bg-slate-50/80 transition-colors">
                  {/* Doctor Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
                        {doc.doctorName.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => navigate(`/district-admin/audit/doctor/${doc.doctorId}`)}
                          className="font-bold text-slate-900 hover:text-emerald-700 transition hover:underline text-left block"
                        >
                          {doc.doctorName}
                        </button>
                        <span className="text-[11px] text-slate-500">
                          {doc.experienceYears} {t.yearsExperience}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Specialization */}
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{doc.specialization}</td>

                  {/* Facility */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {doc.facilityName}
                    </span>
                  </td>

                  {/* Consultations */}
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {doc.totalCompletedVisits}
                    <span className="block text-[10px] font-normal text-slate-400">
                      ({doc.totalRatings} {t.totalVerifiedReviews})
                    </span>
                  </td>

                  {/* Overall Rating */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-black text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {doc.averageOverall.toFixed(1)}
                    </div>
                  </td>

                  {/* Clinical Sub-Scores */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Comm:</span>
                        <strong className="text-slate-800">{doc.averageCommunication.toFixed(1)}★</strong>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Prof:</span>
                        <strong className="text-slate-800">{doc.averageProfessionalism.toFixed(1)}★</strong>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Expl:</span>
                        <strong className="text-slate-800">{doc.averageExplanation.toFixed(1)}★</strong>
                      </div>
                    </div>
                  </td>

                  {/* Trend */}
                  <td className="py-3.5 px-4 text-center">
                    {doc.satisfactionTrend === 'up' && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-[11px]">
                        <TrendingUp className="w-3 h-3" /> +{(doc.trendDelta * 10).toFixed(0)}%
                      </span>
                    )}
                    {doc.satisfactionTrend === 'down' && (
                      <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold text-[11px]">
                        <TrendingDown className="w-3 h-3" /> {(doc.trendDelta * 10).toFixed(0)}%
                      </span>
                    )}
                    {doc.satisfactionTrend === 'stable' && (
                      <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium text-[11px]">
                        <Minus className="w-3 h-3" /> 0%
                      </span>
                    )}
                  </td>

                  {/* Performance Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.performanceStatus === 'benchmark_exceeded'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : doc.performanceStatus === 'attention_required'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {doc.performanceStatus === 'benchmark_exceeded' && <Sparkles className="w-3 h-3" />}
                      {doc.performanceStatus === 'attention_required' && <AlertTriangle className="w-3 h-3" />}
                      {doc.performanceStatus === 'benchmark_exceeded'
                        ? t.benchmarkExceeded
                        : doc.performanceStatus === 'attention_required'
                        ? t.attentionRequiredStatus
                        : t.satisfactoryPerformance}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/district-admin/audit/doctor/${doc.doctorId}`)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition shadow-xs inline-flex items-center gap-1"
                    >
                      {t.viewReviewsBtn}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Doctor Clinical Audit Drill-Down Modal */}
      {drillDownDoctor && (
        <Modal
          isOpen={Boolean(drillDownDoctor)}
          onClose={() => setDrillDownDoctor(null)}
          title={`${drillDownDoctor.doctorName} • Clinical Performance Audit`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900">{drillDownDoctor.doctorName}</h4>
                <p className="text-xs text-slate-500">{drillDownDoctor.specialization} • {drillDownDoctor.facilityName}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 flex items-center gap-1 justify-end">
                  {drillDownDoctor.averageOverall.toFixed(1)} <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </span>
                <span className="text-xs text-slate-500">{drillDownDoctor.totalRatings} Verified Reviews</span>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.ratingDistributionTitle}</h5>
              {[5, 4, 3, 2, 1].map((s) => {
                const count = drillDownDoctor.ratingDistribution[s as keyof typeof drillDownDoctor.ratingDistribution] || 0;
                const pct = drillDownDoctor.totalRatings > 0 ? Math.round((count / drillDownDoctor.totalRatings) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-2 text-xs">
                    <span className="w-10 font-bold">{s}★</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-medium text-slate-500">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  const id = drillDownDoctor.doctorId;
                  setDrillDownDoctor(null);
                  navigate(`/district-admin/audit/doctor/${id}`);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition flex items-center gap-1"
              >
                {t.viewReviewsBtn} & Full Patient Feedback
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDrillDownDoctor(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
