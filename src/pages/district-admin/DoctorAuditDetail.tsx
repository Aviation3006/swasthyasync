import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { ratingService } from '../../services/ratingService';
import { DoctorAuditMetric, PatientDoctorRating } from '../../types/rating';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Building2,
  Stethoscope,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  AlertTriangle,
  Award,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

export const DoctorAuditDetail: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { t, formatDate } = useTranslation();

  const [doctor, setDoctor] = useState<DoctorAuditMetric | null>(null);
  const [reviews, setReviews] = useState<PatientDoctorRating[]>([]);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!doctorId) return;

    const loadData = () => {
      const profile = ratingService.getDoctorProfileById(doctorId);
      if (profile) {
        setDoctor(profile);
      }
      const docReviews = ratingService.getDoctorReviews(doctorId);
      setReviews(docReviews);
    };

    loadData();
    const unsubscribe = ratingService.subscribe(loadData);
    return () => unsubscribe();
  }, [doctorId]);

  if (!doctor) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/district-admin/audit')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToAuditList}
        </button>
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t.noAppointmentsFound}</h2>
          <p className="text-slate-500 mb-6">{t.auditDisclaimer}</p>
          <button
            onClick={() => navigate('/district-admin/audit')}
            className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-medium hover:bg-emerald-800 transition shadow-sm"
          >
            {t.backToAuditList}
          </button>
        </div>
      </div>
    );
  }

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const score = Math.round(r.consultationRating.overallRating);
    if (selectedStarFilter !== 'all' && score !== selectedStarFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchFeedback = (r.feedback || '').toLowerCase().includes(term);
      const matchPatient = (r.patientName || '').toLowerCase().includes(term);
      if (!matchFeedback && !matchPatient) return false;
    }
    return true;
  });

  const totalReviewsCount = reviews.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/district-admin/audit')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToAuditList}
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {t.verifiedAbdm} • {t.qualityAuditConsole}
        </div>
      </div>

      {/* Doctor Master Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-2xl shadow-inner">
                {doctor.doctorName.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
              </div>
              {doctor.averageOverall >= 4.7 && (
                <span className="absolute -top-2 -right-2 p-1.5 bg-amber-400 text-amber-950 rounded-full shadow-md">
                  <Award className="w-4 h-4" />
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{doctor.doctorName}</h1>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    doctor.performanceStatus === 'benchmark_exceeded'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : doctor.performanceStatus === 'attention_required'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {doctor.performanceStatus === 'benchmark_exceeded' && <Sparkles className="w-3 h-3 text-emerald-600" />}
                  {doctor.performanceStatus === 'attention_required' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                  {doctor.performanceStatus === 'benchmark_exceeded'
                    ? t.benchmarkExceeded
                    : doctor.performanceStatus === 'attention_required'
                    ? t.attentionRequiredStatus
                    : t.satisfactoryPerformance}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  {doctor.specialization}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {doctor.facilityName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {doctor.experienceYears} {t.yearsExperience}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Overall Rating Badge */}
          <div className="flex flex-wrap items-center md:flex-col md:items-end justify-between w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl border md:border-0 border-slate-100">
            <div className="text-left md:text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                {t.doctorOverallRating}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {doctor.averageOverall.toFixed(1)}
                </span>
                <div className="flex flex-col">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(doctor.averageOverall) ? 'fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {totalReviewsCount} {t.totalVerifiedReviews}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="text-slate-400">{t.satisfactionTrend}:</span>
              {doctor.satisfactionTrend === 'up' && (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" /> +{(doctor.trendDelta * 10).toFixed(0)}%
                </span>
              )}
              {doctor.satisfactionTrend === 'down' && (
                <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold">
                  <TrendingDown className="w-3.5 h-3.5" /> {(doctor.trendDelta * 10).toFixed(0)}%
                </span>
              )}
              {doctor.satisfactionTrend === 'stable' && (
                <span className="inline-flex items-center gap-0.5 text-slate-500 font-medium">
                  <Minus className="w-3.5 h-3.5" /> {t.statusNormal}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Sub-Scores & Star Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Clinical Consultation Care Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              {t.doctorRatingSection}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
              {doctor.averageOverall.toFixed(1)} / 5.0
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span>{t.communicationRating}</span>
                <span className="font-bold text-slate-900">{doctor.averageCommunication.toFixed(1)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${(doctor.averageCommunication / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span>{t.professionalismRating}</span>
                <span className="font-bold text-slate-900">{doctor.averageProfessionalism.toFixed(1)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${(doctor.averageProfessionalism / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span>{t.explanationClarityRating}</span>
                <span className="font-bold text-slate-900">{doctor.averageExplanation.toFixed(1)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(doctor.averageExplanation / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Associated Hospital Infrastructure & OPD Experience */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              {t.associatedHospitalMetrics}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
              {doctor.facilityName.split(' ')[0]}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span>{t.staffHelpfulnessRating}</span>
                <span className="font-bold text-slate-900">{doctor.staffHelpfulnessAvg.toFixed(1)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(doctor.staffHelpfulnessAvg / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span>{t.cleanlinessRating}</span>
                <span className="font-bold text-slate-900">{doctor.cleanlinessAvg.toFixed(1)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    doctor.cleanlinessAvg < 3.8 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${(doctor.cleanlinessAvg / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span>{t.waitingQueueRating}</span>
                <span className="font-bold text-slate-900">{doctor.waitingQueueAvg.toFixed(1)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    doctor.waitingQueueAvg < 3.8 ? 'bg-rose-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${(doctor.waitingQueueAvg / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: 1-to-5 Star Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              {t.ratingDistributionTitle}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {totalReviewsCount} {t.all}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = doctor.ratingDistribution[star as keyof typeof doctor.ratingDistribution] || 0;
              const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-12 font-semibold text-slate-700 flex items-center gap-1">
                    {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-slate-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verified Patient Reviews Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              {t.verifiedPatientReviews}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.internalAuditDisclaimer}</p>
          </div>

          {/* Star Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36 sm:w-44"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setSelectedStarFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedStarFilter === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setSelectedStarFilter(5)}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-0.5 ${
                  selectedStarFilter === 5
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5★
              </button>
              <button
                onClick={() => setSelectedStarFilter(4)}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-0.5 ${
                  selectedStarFilter === 4
                    ? 'bg-white text-teal-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4★
              </button>
              <button
                onClick={() => setSelectedStarFilter(3)}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-0.5 ${
                  selectedStarFilter === 3
                    ? 'bg-white text-amber-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3★
              </button>
              <button
                onClick={() => setSelectedStarFilter(2)}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-0.5 ${
                  selectedStarFilter === 2
                    ? 'bg-white text-rose-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ≤ 2★
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Stream List */}
        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">{t.noReviewsForFilter}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map((review) => {
              const score = review.consultationRating.overallRating;

              return (
                <div key={review.id} className="py-5 first:pt-0 last:pb-0 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        <Users className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          {review.patientName || t.anonymousPatient}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatDate(review.visitDate || review.createdAt)}
                          </span>
                          <span>•</span>
                          <span>{review.facilityName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {t.verifiedVisitBadge}
                      </span>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-extrabold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {score} / 5
                      </div>
                    </div>
                  </div>

                  {/* Written Clinical Feedback */}
                  <p className="text-sm text-slate-700 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 leading-relaxed italic">
                    "{review.feedback || 'Consultation verified by patient with satisfactory rating.'}"
                  </p>

                  {/* Sub-rating Score Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                      {t.communicationRating}: <strong className="text-slate-900">{review.consultationRating.communication}★</strong>
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                      {t.professionalismRating}: <strong className="text-slate-900">{review.consultationRating.professionalism}★</strong>
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                      {t.explanationClarityRating}: <strong className="text-slate-900">{review.consultationRating.explanationClarity}★</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
