import React, { useState, useEffect, useMemo } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { ratingService } from '../../services/ratingService';
import { PatientDoctorRating } from '../../types/rating';
import { patientService } from '../../services/patientService';
import { mockHospitals, calculateDistanceKm, DEFAULT_PUNE_COORDINATES } from '../../data/hospitals';
import { realHospitalDiscoveryService, RealHealthcareFacility, NATIONAL_INDIA_HEALTHCARE_REGISTRY } from '../../services/realHospitalDiscoveryService';
import { FunctionalHospitalMap } from '../../components/maps/FunctionalHospitalMap';
import { INDIA_STATES_AND_DISTRICTS, getAllStates, getDistrictsForState } from '../../data/indiaGeographicData';
import { Appointment, BookingFormData, ConsultationType } from '../../types/appointment';
import { Hospital, Department, Doctor } from '../../types/hospital';
import { useToast } from '../../context/ToastContext';
import { 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Plus, 
  CheckCircle2,
  Star,
  MessageSquare, 
  XCircle, 
  AlertCircle, 
  Printer, 
  QrCode, 
  ChevronRight, 
  ArrowLeft, 
  MapPin, 
  Stethoscope,
  Info,
  Navigation,
  Search,
  Filter,
  Layers,
  Map as MapIcon,
  List as ListIcon,
  ShieldCheck,
  Phone,
  Bed,
  Activity,
  Heart,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuth } from '../../context/AuthContext';


// Interactive Star Rating Component with Hover Preview & 0-Star Default
interface StarRatingProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  t: any;
}

const StarRatingInput: React.FC<StarRatingProps> = ({ label, value, onChange, required, size = 'sm', t }) => {
  const [hoverVal, setHoverVal] = useState<number>(0);
  const activeRating = hoverVal || value;

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 1: return t.star1Poor || '⭐ 1 — Poor';
      case 2: return t.star2Fair || '⭐ 2 — Fair';
      case 3: return t.star3Good || '⭐ 3 — Good';
      case 4: return t.star4VeryGood || '⭐ 4 — Very Good';
      case 5: return t.star5Excellent || '⭐ 5 — Excellent';
      default: return t.notRated || 'Not Rated';
    }
  };

  const isLarge = size === 'lg';

  return (
    <div
      className={`rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 ${
        isLarge ? 'p-5 text-center bg-gradient-to-b from-slate-50/60 to-white' : 'p-4'
      }`}
    >
      {/* Category Title - Uncrowded on Top */}
      <div className={`mb-3 ${isLarge ? 'text-center' : 'text-center min-h-[32px] flex items-center justify-center'}`}>
        <span className={`font-bold text-slate-800 leading-snug block ${isLarge ? 'text-sm sm:text-base' : 'text-xs'}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
      </div>

      {/* 5 Stars Control - Centered, Never Wrap, Fixed Appropriate Size */}
      <div className="flex flex-col items-center justify-center space-y-2.5">
        <div
          className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2 w-full select-none"
          onMouseLeave={() => setHoverVal(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= activeRating;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverVal(star)}
                onClick={() => onChange(star)}
                className={`p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none focus:ring-1 focus:ring-amber-400 shrink-0 ${
                  isLarge ? 'p-1.5' : 'p-1'
                }`}
                title={`${star} Star`}
                aria-label={`${star} Star`}
              >
                <Star
                  className={`shrink-0 transition-colors ${
                    isLarge ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-6 h-6'
                  } ${
                    isFilled
                      ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                      : 'text-slate-300 hover:text-amber-300 fill-none stroke-[1.75]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Dynamic Status Text / Badge on its OWN line BELOW the stars */}
        <div className="h-6 flex items-center justify-center">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
              activeRating === 0
                ? 'text-slate-400 bg-slate-100'
                : activeRating >= 4
                ? 'text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold'
                : 'text-amber-800 bg-amber-50 border border-amber-200 font-bold'
            }`}
          >
            {getRatingLabel(activeRating)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const PatientAppointments: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { showSuccess, showInfo, showError } = useToast();
  const primaryPatient = patientService.getPatientForUser(user);

  // Check whether active account is a Demo Account vs a Real Patient Account
  const isDemoAccount = !user?.email || user.email.toLowerCase().includes('test@') || user.email.toLowerCase().includes('demo');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled' | 'NearbyHospitals'>('Upcoming');

  // Location State for Real Users
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(() => {
    if (isDemoAccount) return DEFAULT_PUNE_COORDINATES;
    const saved = localStorage.getItem('swasthyasync_user_coords');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });
  const [locationMode, setLocationMode] = useState<'gps' | 'manual' | 'default'>(() => {
    if (isDemoAccount) return 'default';
    return localStorage.getItem('swasthyasync_user_coords') ? 'gps' : 'default';
  });

  // India-Wide Search Filters
  const [selectedState, setSelectedState] = useState<string>(primaryPatient.address?.state || 'Delhi (NCT)');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(primaryPatient.address?.district || 'New Delhi');
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState<string>('');
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('All');
  const [hospitalViewMode, setHospitalViewMode] = useState<'map' | 'list'>('map');

  // Real Facilities State (for real users)
  const [realFacilities, setRealFacilities] = useState<RealHealthcareFacility[]>([]);
  const [activeRealFacility, setActiveRealFacility] = useState<RealHealthcareFacility | null>(null);

  // Demo Facilities State (for demo accounts)
  const [activeDemoHospital, setActiveDemoHospital] = useState<Hospital | null>(mockHospitals[0]);

  // Booking Modal State (7-step flow)
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(mockHospitals[0]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(mockHospitals[0].departments[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(mockHospitals[0].doctors[0]);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM - 10:30 AM');
  const [consultationType, setConsultationType] = useState<ConsultationType>('Follow-up');
  const [reason, setReason] = useState<string>('');
  const [symptomInput, setSymptomInput] = useState<string>('');

  // Cancellation Modal State
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);

  // Rating Modal State
  const [ratingAppt, setRatingAppt] = useState<Appointment | null>(null);
  const [existingRatingId, setExistingRatingId] = useState<string | null>(null);
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);
  const [overallDoctorRating, setOverallDoctorRating] = useState<number>(0);
  const [communicationRating, setCommunicationRating] = useState<number>(0);
  const [professionalismRating, setProfessionalismRating] = useState<number>(0);
  const [explanationRating, setExplanationRating] = useState<number>(0);
  const [staffHelpfulnessRating, setStaffHelpfulnessRating] = useState<number>(0);
  const [staffProfessionalismRating, setStaffProfessionalismRating] = useState<number>(0);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(0);
  const [facilityExperienceRating, setFacilityExperienceRating] = useState<number>(0);
  const [waitingQueueRating, setWaitingQueueRating] = useState<number>(0);
  const [overallHospitalRating, setOverallHospitalRating] = useState<number>(0);
  const [ratingFeedback, setRatingFeedback] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);

  const handleOpenRatingModal = (appt: Appointment) => {
    const existing = ratingService.getRatingForAppointment(appt.id);
    setRatingAppt(appt);

    if (existing) {
      setExistingRatingId(existing.id);
      setIsEditingReview(true);
      setOverallDoctorRating(existing.consultationRating?.overallRating || 0);
      setCommunicationRating(existing.consultationRating?.communication || 0);
      setProfessionalismRating(existing.consultationRating?.professionalism || 0);
      setExplanationRating(existing.consultationRating?.explanationClarity || 0);
      setStaffHelpfulnessRating(existing.staffRating?.staffHelpfulness || 0);
      setStaffProfessionalismRating(existing.staffRating?.staffProfessionalism || 0);
      setCleanlinessRating(existing.facilityRating?.cleanliness || 0);
      setFacilityExperienceRating(existing.facilityRating?.facilityExperience || 0);
      setWaitingQueueRating(existing.facilityRating?.waitingQueueExperience || 0);
      setOverallHospitalRating(existing.facilityRating?.overallHospitalExperience || 0);
      setRatingFeedback(existing.feedback || '');
    } else {
      setExistingRatingId(null);
      setIsEditingReview(false);
      setOverallDoctorRating(0);
      setCommunicationRating(0);
      setProfessionalismRating(0);
      setExplanationRating(0);
      setStaffHelpfulnessRating(0);
      setStaffProfessionalismRating(0);
      setCleanlinessRating(0);
      setFacilityExperienceRating(0);
      setWaitingQueueRating(0);
      setOverallHospitalRating(0);
      setRatingFeedback('');
    }
  };

  const handleSubmitRating = async () => {
    if (!ratingAppt) return;

    if (overallDoctorRating === 0) {
      showError(
        t.ratingRequiredTitle || 'Rating Required',
        t.ratingRequiredMsg || 'Please select a rating for the doctor consultation (1–5 stars) before submitting.'
      );
      return;
    }

    setIsSubmittingRating(true);

    try {
      if (isEditingReview && existingRatingId) {
        // Update existing review
        ratingService.updateRating(existingRatingId, {
          consultationRating: {
            overallRating: overallDoctorRating,
            communication: communicationRating || overallDoctorRating,
            professionalism: professionalismRating || overallDoctorRating,
            explanationClarity: explanationRating || overallDoctorRating
          },
          staffRating: {
            staffHelpfulness: staffHelpfulnessRating || 4,
            staffProfessionalism: staffProfessionalismRating || 4
          },
          facilityRating: {
            cleanliness: cleanlinessRating || 4,
            facilityExperience: facilityExperienceRating || 4,
            waitingQueueExperience: waitingQueueRating || 4,
            overallHospitalExperience: overallHospitalRating || overallDoctorRating
          },
          feedback: ratingFeedback
        });

        setIsSubmittingRating(false);

        showSuccess(
          t.reviewUpdatedSuccess || 'Review Updated Successfully',
          t.reviewUpdatedDesc || 'Your updated review has been recorded.'
        );
      } else {
        // Submit new review
        ratingService.submitRating({
          appointmentId: ratingAppt.id,
          patientId: primaryPatient.id,
          patientName: primaryPatient.name,
          doctorId: ratingAppt.doctorId || 'doc-1',
          doctorName: ratingAppt.doctorName,
          department: ratingAppt.departmentName,
          facilityId: ratingAppt.hospitalId,
          facilityName: ratingAppt.hospitalName,
          state: selectedState || 'Maharashtra',
          district: selectedDistrict || 'Pune',
          visitDate: ratingAppt.date,
          tokenNumber: ratingAppt.tokenNumber,
          consultationRating: {
            overallRating: overallDoctorRating,
            communication: communicationRating || overallDoctorRating,
            professionalism: professionalismRating || overallDoctorRating,
            explanationClarity: explanationRating || overallDoctorRating
          },
          staffRating: {
            staffHelpfulness: staffHelpfulnessRating || 4,
            staffProfessionalism: staffProfessionalismRating || 4
          },
          facilityRating: {
            cleanliness: cleanlinessRating || 4,
            facilityExperience: facilityExperienceRating || 4,
            waitingQueueExperience: waitingQueueRating || 4,
            overallHospitalExperience: overallHospitalRating || overallDoctorRating
          },
          feedback: ratingFeedback
        });

        setIsSubmittingRating(false);

        showSuccess(
          t.ratingSubmittedSuccess || 'Review Submitted Successfully',
          t.ratingSubmittedDesc || 'Thank you! Your feedback has been recorded for healthcare quality auditing.'
        );
      }

      setRatingAppt(null);
      // Refresh appointments
      setAppointments(appointmentService.getAllAppointments());
    } catch (e: any) {
      setIsSubmittingRating(false);
      showError('Error', e.message || 'Could not save review.');
    }
  };
  const [cancelReason, setCancelReason] = useState<string>('');

  // Token Slip View Modal
  const [tokenSlipAppt, setTokenSlipAppt] = useState<Appointment | null>(null);

  // External Facility Info Modal
  const [externalFacilityModal, setExternalFacilityModal] = useState<RealHealthcareFacility | null>(null);

  useEffect(() => {
    setAppointments(appointmentService.getAppointmentsByPatient(primaryPatient.id));
    const unsub = appointmentService.subscribe((list) => {
      setAppointments(list.filter((a) => a.patientId === primaryPatient.id));
    });
    return unsub;
  }, [primaryPatient.id]);

  // Query Real Healthcare Facilities when filters/location change (for real users)
  useEffect(() => {
    if (isDemoAccount) return;

    if (locationMode === 'gps' && userCoords && !hospitalSearchQuery && (!selectedState || selectedState === 'All')) {
      realHospitalDiscoveryService.findNearbyRealHospitals(userCoords.lat, userCoords.lng).then(facilities => {
        setRealFacilities(facilities);
        if (facilities.length > 0) {
          setActiveRealFacility(facilities[0]);
        }
      });
    } else {
      const results = realHospitalDiscoveryService.searchFacilitiesByQuery({
        state: selectedState,
        district: selectedDistrict,
        searchQuery: hospitalSearchQuery,
        userCoords: userCoords || undefined,
        isGpsActive: locationMode === 'gps'
      });

      // If specific district filter yielded 0 results, fall back gracefully to all state facilities
      if (results.length === 0 && selectedDistrict) {
        const stateResults = realHospitalDiscoveryService.searchFacilitiesByQuery({
          state: selectedState,
          searchQuery: hospitalSearchQuery,
          userCoords: userCoords || undefined
        });
        setRealFacilities(stateResults.length > 0 ? stateResults : NATIONAL_INDIA_HEALTHCARE_REGISTRY);
        if (stateResults.length > 0) {
          setActiveRealFacility(stateResults[0]);
        }
      } else {
        setRealFacilities(results.length > 0 ? results : NATIONAL_INDIA_HEALTHCARE_REGISTRY);
        if (results.length > 0) {
          setActiveRealFacility(results[0]);
        }
      }
    }
  }, [isDemoAccount, selectedState, selectedDistrict, hospitalSearchQuery, userCoords, locationMode]);

  // Demo Hospitals Distance List (for demo user only)
  const demoHospitalsWithDistance = useMemo(() => {
    const baseCoords = DEFAULT_PUNE_COORDINATES;
    return mockHospitals.map(h => {
      const hLat = h.coordinates?.lat || DEFAULT_PUNE_COORDINATES.lat;
      const hLng = h.coordinates?.lng || DEFAULT_PUNE_COORDINATES.lng;
      const distance = calculateDistanceKm(baseCoords.lat, baseCoords.lng, hLat, hLng);
      return { ...h, distanceKm: distance };
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, []);

  const tabs = [
    { id: 'Upcoming', label: t.upcomingConsultations, count: appointments.filter((a) => a.status === 'Upcoming' || a.status === 'Checked In').length },
    { id: 'NearbyHospitals', label: `🏥 ${t.findNearbyHospitals}`, count: isDemoAccount ? mockHospitals.length : realFacilities.length },
    { id: 'Completed', label: t.pastCompletedVisits, count: appointments.filter((a) => a.status === 'Completed').length },
    { id: 'Cancelled', label: t.cancelledTokens, count: appointments.filter((a) => a.status === 'Cancelled').length },
  ];

  const filteredAppointments = appointments.filter((a) => {
    if (activeTab === 'Upcoming') return a.status === 'Upcoming' || a.status === 'Checked In' || a.status === 'In Consultation';
    if (activeTab === 'Completed') return a.status === 'Completed';
    return a.status === 'Cancelled' || a.status === 'No Show';
  });

  const timeSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:30 AM - 12:00 PM',
    '12:00 PM - 12:30 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM'
  ];

  const handleOpenBooking = () => {
    setBookingStep(1);
    setSelectedHospital(mockHospitals[0]);
    setSelectedDepartment(mockHospitals[0].departments[0]);
    setSelectedDoctor(mockHospitals[0].doctors[0]);
    setReason('');
    setSymptomInput('');
    setIsBookingOpen(true);
  };

  // Direct 1-Click booking for a hospital
  const handleBookHospitalDirect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setSelectedDepartment(hospital.departments[0] || null);
    setSelectedDoctor(hospital.doctors[0] || null);
    setBookingStep(2);
    setIsBookingOpen(true);
  };

  // Real Facility Booking Handler
  const handleRealFacilityAction = (facility: RealHealthcareFacility) => {
    if (facility.appointmentMode === 'Direct_OPD_Portal') {
      // Find matching or closest integrated facility
      const demoMatch = mockHospitals[0];
      setSelectedHospital({
        ...demoMatch,
        name: facility.name,
        address: facility.address,
        taluka: facility.district,
        emergencyHelpline: facility.emergencyHelpline
      });
      setSelectedDepartment(demoMatch.departments[0]);
      setSelectedDoctor(demoMatch.doctors[0]);
      setBookingStep(2);
      setIsBookingOpen(true);
    } else {
      setExternalFacilityModal(facility);
    }
  };

  const handleHospitalChange = (hospId: string) => {
    const hosp = mockHospitals.find((h) => h.id === hospId) || mockHospitals[0];
    setSelectedHospital(hosp);
    setSelectedDepartment(hosp.departments[0] || null);
    setSelectedDoctor(hosp.doctors[0] || null);
  };

  const handleDepartmentChange = (deptId: string) => {
    if (!selectedHospital) return;
    const dept = selectedHospital.departments.find((d) => d.id === deptId) || selectedHospital.departments[0];
    setSelectedDepartment(dept);
    const docs = selectedHospital.doctors.filter((d) => d.departmentId === dept.id);
    setSelectedDoctor(docs[0] || selectedHospital.doctors[0] || null);
  };

  const handleConfirmBooking = () => {
    if (!selectedHospital || !selectedDepartment || !selectedDoctor || !bookingDate || !selectedSlot) {
      showError('Incomplete Information', 'Please complete all required appointment booking steps.');
      return;
    }

    const bookingData: BookingFormData = {
      hospitalId: selectedHospital.id,
      departmentId: selectedDepartment.id,
      doctorId: selectedDoctor.id,
      date: bookingDate,
      timeSlot: selectedSlot,
      consultationType,
      reason: reason || 'Routine public hospital OPD consultation',
      symptoms: symptomInput ? symptomInput.split(',').map((s) => s.trim()) : undefined
    };

    const newAppt = appointmentService.bookAppointment(bookingData, {
      id: primaryPatient.id,
      name: primaryPatient.name,
      phone: primaryPatient.phone
    });

    setIsBookingOpen(false);
    setActiveTab('Upcoming');
    showSuccess('Appointment Confirmed', `Token #${newAppt.tokenNumber} generated for ${newAppt.doctorName}.`);
    setTokenSlipAppt(newAppt);
  };

  const handleConfirmCancel = () => {
    if (!cancellingAppt) return;
    try {
      appointmentService.cancelAppointment(cancellingAppt.id, cancelReason || 'Patient request');
      setCancellingAppt(null);
      setCancelReason('');
      showInfo('Appointment Cancelled', 'The OPD token has been marked as cancelled.');
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Precise Geolocation Request for Real User
  const [isLocating, setIsLocating] = useState(false);

  const handleRequestPreciseLocation = () => {
    if (isDemoAccount) {
      showInfo('Demo Environment', 'Demo patient operates in controlled simulation mode (Pune).');
      setIsLocationModalOpen(false);
      return;
    }

    if (!('geolocation' in navigator)) {
      showError('Not Supported', 'Geolocation is not supported by your browser.');
      setIsLocationModalOpen(false);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setLocationMode('gps');
        localStorage.setItem('swasthyasync_user_coords', JSON.stringify(coords));
        setIsLocationModalOpen(false);

        // Fetch real nearby facilities by coordinates
        const nearby = await realHospitalDiscoveryService.findNearbyRealHospitals(coords.lat, coords.lng);
        setRealFacilities(nearby);
        if (nearby.length > 0) {
          setActiveRealFacility(nearby[0]);
          if (nearby[0].state) setSelectedState(nearby[0].state);
          if (nearby[0].district) setSelectedDistrict(nearby[0].district);
        }
        setIsLocating(false);
        showSuccess('Precise Location Acquired', `Found ${nearby.length} nearby healthcare facilities sorted by distance.`);
      },
      (error) => {
        console.warn('Geolocation denied or error:', error);
        setIsLocating(false);
        setLocationMode('manual');
        setIsLocationModalOpen(false);
        showInfo('Location Permission Denied', 'Switched to manual State & District healthcare directory search.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.appointmentsTitle}
        subtitle={t.appointmentsSubtitle}
        breadcrumbs={[
          { label: t.portalPatient, path: '/patient' },
          { label: t.navAppointments }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Navigation className="w-4 h-4 text-emerald-600" />}
              onClick={() => {
                setActiveTab('NearbyHospitals');
                setIsLocationModalOpen(true);
              }}
            >
              {t.findNearbyHospitals}
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenBooking}
            >
              {t.bookNewAppointment}
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as any)}
        variant="underline"
      />

      {/* ================================================================= */}
      {/* TAB 1: NEARBY HOSPITALS & INTERACTIVE GIS MAP (DEMO vs REAL) */}
      {/* ================================================================= */}
      {activeTab === 'NearbyHospitals' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Demo Banner if demo account */}
          {isDemoAccount ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Prototype / Demo Account:</strong> Displaying controlled simulation healthcare facility network. Real GPS tracking is disabled.
                </span>
              </div>
              <span className="font-mono font-bold text-[10px] bg-amber-200/80 px-2 py-0.5 rounded">
                SIMULATION MODE
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Real Healthcare Facility Discovery:</strong> Connected to National India Health Facility Directory across all States & Union Territories.
                </span>
              </div>
              <span className="font-mono font-bold text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-950">
                NATIONAL DIRECTORY
              </span>
            </div>
          )}

          {/* Location Status & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{t.locationStatus}:</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {isDemoAccount ? 'Simulation Coordinates (Pune)' : locationMode === 'gps' ? t.locationGranted : `${selectedDistrict}, ${selectedState}`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isDemoAccount 
                    ? `Proximity calculated across ${mockHospitals.length} demo public hospitals.`
                    : `Discovered ${realFacilities.length} empaneled healthcare facilities in ${selectedState}.`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {!isDemoAccount && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-xs"
                >
                  Change State / District / Location
                </Button>
              )}

              {/* Map vs List View Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setHospitalViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    hospitalViewMode === 'map'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> {t.mapView}
                </button>

                <button
                  type="button"
                  onClick={() => setHospitalViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    hospitalViewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ListIcon className="w-3.5 h-3.5" /> {t.listView}
                </button>
              </div>
            </div>
          </div>

          {/* Search & State / District Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search hospital name, city, PIN code..."
                value={hospitalSearchQuery}
                onChange={(e) => setHospitalSearchQuery(e.target.value)}
                className="pl-10 text-xs"
              />
            </div>

            {!isDemoAccount && (
              <>
                <div>
                  <Select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const districts = getDistrictsForState(e.target.value);
                      setSelectedDistrict(districts[0] || '');
                    }}
                    options={getAllStates().map(s => ({ value: s, label: s }))}
                  />
                </div>

                <div>
                  <Select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    options={getDistrictsForState(selectedState).map(d => ({ value: d, label: d }))}
                  />
                </div>
              </>
            )}
          </div>

          {/* ================= MAP VIEW (DEMO vs REAL) ================= */}
          {hospitalViewMode === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Functional Leaflet OpenStreetMap View */}
              <div className="lg:col-span-2 space-y-3">
                <FunctionalHospitalMap
                  userCoords={isDemoAccount ? DEFAULT_PUNE_COORDINATES : userCoords}
                  facilities={isDemoAccount ? demoHospitalsWithDistance : realFacilities}
                  activeFacilityId={isDemoAccount ? activeDemoHospital?.id : activeRealFacility?.id}
                  onSelectFacility={(fac) => {
                    if (isDemoAccount) setActiveDemoHospital(fac);
                    else setActiveRealFacility(fac);
                  }}
                  onBookAppointment={(fac) => {
                    if (isDemoAccount) handleBookHospitalDirect(fac);
                    else handleRealFacilityAction(fac);
                  }}
                  locationMode={locationMode}
                  isDemo={isDemoAccount}
                />
              </div>

              {/* Active Hospital Preview Details Card */}
              {isDemoAccount ? (
                activeDemoHospital && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {activeDemoHospital.facilityType}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {activeDemoHospital.name}
                          </h3>
                        </div>
                        <span className="text-xs font-extrabold text-health-800 bg-health-50 px-2.5 py-1 rounded-xl border border-health-200 whitespace-nowrap">
                          {t("distanceFromSimulated", { distance: activeDemoHospital.distanceKm ?? 0 })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>{activeDemoHospital.address}</span>
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-slate-400" /> Available Beds:
                          </span>
                          <strong className="text-emerald-700">
                            {activeDemoHospital.beds.generalTotal - activeDemoHospital.beds.generalOccupied} Free (of {activeDemoHospital.beds.generalTotal})
                          </strong>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" /> Emergency Helpline:
                          </span>
                          <span className="font-bold text-rose-600">
                            {activeDemoHospital.emergencyHelpline}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-1.5">
                          Active OPD Clinical Specialties:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {activeDemoHospital.departments.map(d => (
                            <span key={d.id} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {d.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => handleBookHospitalDirect(activeDemoHospital)}
                      className="font-bold text-xs bg-health-600 hover:bg-health-500 text-white shadow-sm"
                    >
                      {t.bookAppointmentHere} →
                    </Button>
                  </div>
                )
              ) : (
                activeRealFacility && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {activeRealFacility.facilityType}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {activeRealFacility.name}
                          </h3>
                        </div>
                        {activeRealFacility.distanceKm && (
                          <span className="text-xs font-extrabold text-health-800 bg-health-50 px-2.5 py-1 rounded-xl border border-health-200 whitespace-nowrap">
                            {t("distanceFromUser", { distance: activeRealFacility.distanceKm })}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>{activeRealFacility.address}</span>
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Contact / Helpline:</span>
                          <strong className="text-slate-900">{activeRealFacility.contactNumber}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Emergency 24x7:</span>
                          <strong className="text-rose-600">{activeRealFacility.emergencyHelpline}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Facility Mode:</span>
                          <span className="font-semibold text-emerald-700">
                            {activeRealFacility.appointmentMode === 'Direct_OPD_Portal' ? 'Online OPD' : 'Walk-In & Triage'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-1.5">
                          Departments & Specialties:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {activeRealFacility.departments.map(d => (
                            <span key={d} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => handleRealFacilityAction(activeRealFacility)}
                      className="font-bold text-xs bg-health-600 hover:bg-health-500 text-white shadow-sm"
                    >
                      {activeRealFacility.appointmentMode === 'Direct_OPD_Portal' 
                        ? `${t.bookAppointmentHere} →` 
                        : 'View Facility & OPD Directions →'
                      }
                    </Button>
                  </div>
                )
              )}
            </div>
          )}

          {/* ================= LIST VIEW (DEMO vs REAL) ================= */}
          {hospitalViewMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isDemoAccount ? (
                demoHospitalsWithDistance.map(hosp => (
                  <Card key={hosp.id} className="border-slate-200 hover:border-health-400 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {hosp.facilityType}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {hosp.name}
                          </h3>
                        </div>
                        <span className="text-xs font-extrabold text-health-800 bg-health-50 px-2.5 py-1 rounded-xl border border-health-200 whitespace-nowrap">
                          {isDemoAccount ? t("distanceFromSimulated", { distance: hosp.distanceKm ?? 0 }) : t("distanceFromUser", { distance: hosp.distanceKm ?? 0 })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>{hosp.address}</span>
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div>General Beds: <strong className="text-emerald-700">{hosp.beds.generalTotal - hosp.beds.generalOccupied} Free</strong></div>
                        <div>Emergency: <strong className="text-rose-600">{hosp.emergencyHelpline}</strong></div>
                      </div>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {hosp.departments.length} Clinical Departments
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBookHospitalDirect(hosp)}
                          className="text-xs font-bold"
                        >
                          {t.bookAppointmentBtn} →
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                realFacilities.map(fac => (
                  <Card key={fac.id} className="border-slate-200 hover:border-health-400 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {fac.facilityType}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {fac.name}
                          </h3>
                        </div>
                        {fac.distanceKm && (
                          <span className="text-xs font-extrabold text-health-800 bg-health-50 px-2.5 py-1 rounded-xl border border-health-200 whitespace-nowrap">
                            {t("distanceFromUser", { distance: fac.distanceKm })}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>{fac.address}</span>
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div>District: <strong className="text-slate-800">{fac.district}</strong></div>
                        <div>Helpline: <strong className="text-rose-600">{fac.emergencyHelpline}</strong></div>
                        <div>24x7 Casualty: <strong className="text-emerald-700">Operational</strong></div>
                        <div>Mode: <strong className="text-slate-800">{fac.appointmentMode === 'Direct_OPD_Portal' ? 'Online OPD' : 'Walk-In OPD'}</strong></div>
                      </div>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {fac.departments.length} Medical Specialties
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleRealFacilityAction(fac)}
                          className="text-xs font-bold"
                        >
                          {fac.appointmentMode === 'Direct_OPD_Portal' ? `${t.bookAppointmentBtn} →` : 'Facility Info →'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: REGULAR APPOINTMENTS LIST */}
      {/* ================================================================= */}
      {activeTab !== 'NearbyHospitals' && (
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <Card key={appt.id} className="border-slate-200 hover:border-slate-300">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left meta */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-lg bg-health-100 text-health-900 border border-health-200">
                        {t.tokenNumber}: {appt.tokenNumber}
                      </span>
                      <StatusBadge
                        variant={
                          appt.status === 'Upcoming'
                            ? 'info'
                            : appt.status === 'Completed'
                            ? 'success'
                            : appt.status === 'In Consultation'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {appt.status}
                      </StatusBadge>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {appt.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {appt.doctorName}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {appt.departmentName} • {appt.doctorSpecialization}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {appt.hospitalName} ({appt.roomNumber || 'Room 104'})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <strong>{t.reasonForVisit}:</strong> {appt.reason}
                      </span>
                    </div>

                    {appt.cancellationReason && (
                      <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-100">
                        {t.cancelAppointment}: {appt.cancellationReason}
                      </p>
                    )}

                    {appt.notes && (
                      <p className="text-xs text-emerald-800 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        {t.doctorRecommendation}: {appt.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Date, time, actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 gap-3">
                    <div className="text-left lg:text-right">
                      <div className="text-sm font-bold text-slate-900 flex items-center lg:justify-end gap-1.5">
                        <Calendar className="w-4 h-4 text-health-600" />
                        {new Date(appt.date).toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-slate-500 font-medium flex items-center lg:justify-end gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {appt.timeSlot}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<QrCode className="w-3.5 h-3.5" />}
                        onClick={() => setTokenSlipAppt(appt)}
                      >
                        {t.tokenSlip}
                      </Button>

                      {appt.status === 'Completed' && (() => {
                        const existingRating = ratingService.getRatingForAppointment(appt.id);
                        return existingRating ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              {t.alreadyReviewedBadge || 'Rated ★★★★★'}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs font-semibold py-1 px-2.5 border-amber-300 text-amber-900 hover:bg-amber-100"
                              onClick={() => handleOpenRatingModal(appt)}
                            >
                              {t.editReviewBtn || 'Edit Review'}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-bold text-amber-900 border-amber-300 bg-amber-50/50 hover:bg-amber-100 flex items-center gap-1"
                            leftIcon={<Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                            onClick={() => handleOpenRatingModal(appt)}
                          >
                            {t.rateVisitBtn || 'Rate Visit'}
                          </Button>
                        );
                      })()}

                      {appt.status === 'Upcoming' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => setCancellingAppt(appt)}
                        >
                          {t.cancel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">{t.noAppointmentsFound}</p>
              <Button variant="primary" size="sm" onClick={handleOpenBooking} className="mt-4">
                {t.bookAppointmentBtn}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* LOCATION PERMISSION & INDIA-WIDE SEARCH MODAL */}
      {/* ================================================================= */}
      {isLocationModalOpen && (
        <Modal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          title={t.locationPermissionTitle}
          subtitle="Proximity discovery for public health hospitals & emergency facilities"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLocationModalOpen(false)}
              >
                {t.notNowBtn}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-700" />
                {t.findNearbyHospitals}
              </p>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                {t.locationPermissionDesc}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<Navigation className="w-4 h-4" />}
                onClick={handleRequestPreciseLocation}
                className="font-bold text-xs bg-health-600 hover:bg-health-500 text-white shadow-sm"
              >
                {t.allowLocationBtn}
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-semibold">or select state / district</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">State / Union Territory</label>
                  <Select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const districts = getDistrictsForState(e.target.value);
                      setSelectedDistrict(districts[0] || '');
                      setLocationMode('manual');
                    }}
                    options={getAllStates().map(s => ({ value: s, label: s }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">District</label>
                  <Select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setLocationMode('manual');
                      setIsLocationModalOpen(false);
                    }}
                    options={getDistrictsForState(selectedState).map(d => ({ value: d, label: d }))}
                  />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
              {t.locationPrivacyNotice}
            </p>
          </div>
        </Modal>
      )}

      {/* External Facility Notice Modal */}
      {externalFacilityModal && (
        <Modal
          isOpen={!!externalFacilityModal}
          onClose={() => setExternalFacilityModal(null)}
          title={externalFacilityModal.name}
          subtitle="National Healthcare Directory • Walk-in OPD & Casualty"
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setExternalFacilityModal(null)}>
              {t.close}
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 space-y-1">
              <span className="font-bold block">Direct Walk-In & Triage Registration:</span>
              <p className="text-[11px] text-sky-800">
                This facility operates on-premise priority token generation and 24x7 Emergency Triage. Online pre-booking will be linked in Phase 2.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div><strong>Address:</strong> {externalFacilityModal.address}</div>
              <div><strong>City/District:</strong> {externalFacilityModal.city}, {externalFacilityModal.district}</div>
              <div><strong>State:</strong> {externalFacilityModal.state} ({externalFacilityModal.pincode})</div>
              <div><strong>Casualty Hotline:</strong> <span className="text-rose-600 font-bold">{externalFacilityModal.emergencyHelpline}</span></div>
              <div><strong>Enquiry:</strong> {externalFacilityModal.contactNumber}</div>
            </div>
          </div>
        </Modal>
      )}

      {/* ================================================================= */}
      {/* 7-STEP INTERACTIVE BOOKING MODAL */}
      {/* ================================================================= */}
      {isBookingOpen && (
        <Modal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          title={`${t.bookNewAppointment} (${t.step} ${bookingStep} ${t.of} 7)`}
          subtitle="Empaneled Empaneled Healthcare Facilities"
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              {bookingStep > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBookingStep((s) => s - 1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  {t.back}
                </Button>
              ) : (
                <div />
              )}

              {bookingStep < 7 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setBookingStep((s) => s + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  {t.next}
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleConfirmBooking}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {t.confirmBookAppointment}
                </Button>
              )}
            </div>
          }
        >
          {/* Step Progress Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Step {bookingStep}: {[
                'Select Hospital',
                'Select Department',
                'Select Doctor',
                'Select Date',
                'Select Time Slot',
                'Reason & Symptoms',
                'Review & Confirm'
              ][bookingStep - 1]}</span>
              <span>{Math.round((bookingStep / 7) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-health-600 transition-all duration-300"
                style={{ width: `${(bookingStep / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Select Hospital */}
          {bookingStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Choose an empaneled government healthcare facility:</p>
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {demoHospitalsWithDistance.map((hosp) => (
                  <div
                    key={hosp.id}
                    onClick={() => handleHospitalChange(hosp.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      selectedHospital?.id === hosp.id
                        ? 'bg-health-50/80 border-health-500 ring-2 ring-health-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{hosp.name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {hosp.facilityType}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {hosp.distanceKm} km away
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{hosp.address}</p>
                      <div className="text-[11px] text-slate-400 pt-0.5">
                        District: {hosp.taluka} • General Beds: {hosp.beds.generalTotal - hosp.beds.generalOccupied} Free • ICU: {hosp.beds.icuTotal - hosp.beds.icuOccupied} Free
                      </div>
                    </div>
                    {selectedHospital?.id === hosp.id && (
                      <span className="w-5 h-5 rounded-full bg-health-600 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Department */}
          {bookingStep === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Select clinical speciality at {selectedHospital?.name}:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {selectedHospital?.departments.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => handleDepartmentChange(dept.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedDepartment?.id === dept.id
                        ? 'bg-health-50/80 border-health-500 ring-2 ring-health-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                      {selectedDepartment?.id === dept.id && (
                        <span className="w-4 h-4 rounded-full bg-health-600 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Head: {dept.headDoctor}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Active Doctors: {dept.activeDoctors} • Waiting Queue: {dept.waitingQueueCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Doctor */}
          {bookingStep === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Available consulting doctors in {selectedDepartment?.name}:</p>
              <div className="space-y-2.5">
                {selectedHospital?.doctors
                  .filter((d) => !selectedDepartment || d.departmentId === selectedDepartment.id)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        selectedDoctor?.id === doc.id
                          ? 'bg-health-50/80 border-health-500 ring-2 ring-health-400/30'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{doc.qualification} • {doc.specialization}</p>
                        <div className="text-[11px] text-slate-400">
                          {doc.roomNumber} • OPD Timings: {doc.opdTimings}
                        </div>
                      </div>
                      {selectedDoctor?.id === doc.id && (
                        <span className="w-5 h-5 rounded-full bg-health-600 text-white flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Step 4: Select Date */}
          {bookingStep === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Choose consultation date (OPD is functional Mon - Sat):</p>
              <div className="max-w-xs">
                <FormField label="Consultation Date" required>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </FormField>
              </div>
              <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>OPD registration counters open at 08:30 AM. Online tokens are granted priority triage access.</span>
              </div>
            </div>
          )}

          {/* Step 5: Select Time Slot */}
          {bookingStep === 5 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Select preferred appointment time slot:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      selectedSlot === slot
                        ? 'bg-health-700 text-white border-health-800 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="pt-3">
                <FormField label="Consultation Type">
                  <Select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value as any)}
                    options={[
                      { value: 'OPD General', label: 'OPD General Consultation' },
                      { value: 'Follow-up', label: 'Follow-up Routine Check' },
                      { value: 'Specialist Consultation', label: 'Specialist Consultation' },
                      { value: 'Diagnostic Review', label: 'Lab Report / Diagnostic Review' }
                    ]}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* Step 6: Reason & Symptoms */}
          {bookingStep === 6 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Provide brief clinical context for the doctor:</p>
              <FormField label="Chief Reason for Visit" required>
                <Input
                  placeholder="e.g. Quarterly diabetes checkup, knee ache, fever review..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </FormField>

              <FormField label="Associated Symptoms (Optional, comma-separated)">
                <Input
                  placeholder="e.g. Mild fatigue, joint stiffness, dry cough..."
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                />
              </FormField>
            </div>
          )}

          {/* Step 7: Review & Confirm */}
          {bookingStep === 7 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="text-sm font-bold text-slate-900 border-b pb-2">Appointment Confirmation Summary</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Patient Name:</span>
                    <span className="font-bold text-slate-900">{primaryPatient.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ABHA ID:</span>
                    <span className="font-mono font-bold text-slate-900">{primaryPatient.abhaId || t.abhaNotLinked}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Hospital:</span>
                    <span className="font-bold text-slate-900">{selectedHospital?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Department:</span>
                    <span className="font-bold text-slate-900">{selectedDepartment?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Consulting Doctor:</span>
                    <span className="font-bold text-slate-900">{selectedDoctor?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Scheduled Date:</span>
                    <span className="font-bold text-health-800">{bookingDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Time Slot:</span>
                    <span className="font-bold text-health-800">{selectedSlot}</span>
                  </div>
                </div>

                <div className="pt-2 border-t text-slate-600">
                  <strong>Reason:</strong> {reason || 'Routine OPD consultation'}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero registration fee under Empaneled Health Coverage Network.</span>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ================================================================= */}
      {/* PATIENT TO DOCTOR POST-VISIT RATING & AUDIT MODAL */}
      {/* ================================================================= */}
      {ratingAppt && (
        <Modal
          isOpen={!!ratingAppt}
          onClose={() => setRatingAppt(null)}
          title={isEditingReview ? (t.editReviewBtn || "Edit Consultation Review") : (t.reviewDoctorTitle || "Rate Consultation & Hospital Visit")}
          subtitle={`${ratingAppt.doctorName} • ${ratingAppt.departmentName} • ${ratingAppt.hospitalName}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRatingAppt(null)}
              >
                {t.cancel}
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmittingRating}
                leftIcon={<Star className="w-4 h-4" />}
                onClick={handleSubmitRating}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                {isEditingReview ? (t.updateReviewBtn || "Update Review") : (t.submitReviewBtn || "Submit Verified Review")}
              </Button>
            </div>
          }
        >
          <div className="space-y-6 text-xs max-h-[70vh] overflow-y-auto pr-1">
            
            {/* Quality Audit Disclaimer Banner */}
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block text-[11px]">Internal Healthcare Quality Audit</span>
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  {t.internalAuditDisclaimer || "Your feedback is confidential, anonymized for patient privacy, and used exclusively by health authorities for clinical quality improvement."}
                </p>
              </div>
            </div>

            {/* 1. Doctor Rating Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {t.doctorRatingSection || "Doctor & Clinical Consultation"}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {ratingAppt.hospitalName} • Token: {ratingAppt.tokenNumber || 'OPD'}
                </span>
              </div>

              {/* Primary Overall Doctor Rating */}
              <StarRatingInput
                label={t.doctorOverallRating || "Overall Doctor Consultation Rating"}
                value={overallDoctorRating}
                onChange={setOverallDoctorRating}
                required
                size="lg"
                t={t}
              />

              {/* Clinical Subcategories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <StarRatingInput
                  label={t.communicationRating || "Communication & Empathy"}
                  value={communicationRating}
                  onChange={setCommunicationRating}
                  t={t}
                />
                <StarRatingInput
                  label={t.professionalismRating || "Clinical Professionalism"}
                  value={professionalismRating}
                  onChange={setProfessionalismRating}
                  t={t}
                />
                <StarRatingInput
                  label={t.explanationClarityRating || "Explanation of Diagnosis & Medicine"}
                  value={explanationRating}
                  onChange={setExplanationRating}
                  t={t}
                />
              </div>
            </div>

            {/* 2. Hospital Staff Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-extrabold text-slate-900 text-sm block border-b pb-2">
                {t.hospitalStaffSection || "Hospital Staff & Nursing"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <StarRatingInput
                  label={t.staffHelpfulnessRating || "Staff Helpfulness & Assistance"}
                  value={staffHelpfulnessRating}
                  onChange={setStaffHelpfulnessRating}
                  t={t}
                />
                <StarRatingInput
                  label={t.staffProfessionalismRating || "Staff Professionalism"}
                  value={staffProfessionalismRating}
                  onChange={setStaffProfessionalismRating}
                  t={t}
                />
              </div>
            </div>

            {/* 3. Facility Infrastructure Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-extrabold text-slate-900 text-sm block border-b pb-2">
                {t.facilitySection || "Hospital Facility & Infrastructure"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <StarRatingInput
                  label={t.cleanlinessRating || "Hospital Cleanliness & Hygiene"}
                  value={cleanlinessRating}
                  onChange={setCleanlinessRating}
                  t={t}
                />
                <StarRatingInput
                  label={t.waitingQueueRating || "Waiting & OPD Queue Experience"}
                  value={waitingQueueRating}
                  onChange={setWaitingQueueRating}
                  t={t}
                />
              </div>
            </div>

            {/* 4. Optional Written Feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>{t.additionalFeedbackLabel || "Additional Feedback & Suggestions (Optional)"}</span>
                <span className="text-[10px] text-slate-400">{ratingFeedback.length}/500</span>
              </label>
              <textarea
                rows={3}
                maxLength={500}
                placeholder={t.additionalFeedbackPlaceholder || "Share constructive feedback regarding your visit (max 500 characters)..."}
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
            </div>

          </div>
        </Modal>
      )}

      {/* Cancel Appointment Modal */}
      {cancellingAppt && (
        <Modal
          isOpen={!!cancellingAppt}
          onClose={() => setCancellingAppt(null)}
          title={t.cancelAppointment}
          maxWidth="sm"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setCancellingAppt(null)}>
                {t.keepAppointment}
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmCancel}>
                {t.confirmCancellation}
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              {t.cancellationConfirm} (<strong>{cancellingAppt.doctorName}</strong>, {cancellingAppt.date})
            </p>
            <FormField label={t.reasonForVisit}>
              <Input
                placeholder="e.g. Rescheduling to next week, personal conflict..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </FormField>
          </div>
        </Modal>
      )}

      {/* Token Slip Print / View Modal */}
      {tokenSlipAppt && (
        <Modal
          isOpen={!!tokenSlipAppt}
          onClose={() => setTokenSlipAppt(null)}
          title={t.tokenSlip}
          subtitle={t.scanAtRegistration}
          maxWidth="sm"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setTokenSlipAppt(null)}>
                {t.close}
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                {t.print}
              </Button>
            </>
          }
        >
          <div className="bg-white p-4 border border-dashed border-slate-300 rounded-xl space-y-4 text-center">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">{tokenSlipAppt.hospitalName}</h3>
              <p className="text-[11px] text-slate-500">{t.departmentName}</p>
            </div>

            <div className="py-2 bg-health-50 rounded-xl border border-health-200">
              <span className="text-[11px] font-semibold text-health-800 uppercase block">{t.tokenNumber}</span>
              <span className="text-2xl font-black font-mono text-health-950">{tokenSlipAppt.tokenNumber}</span>
            </div>

            {/* QR Code */}
            <div className="flex justify-center py-2">
              <QRCodeSVG
                value={`SW-OPD:${tokenSlipAppt.tokenNumber}|PAT:${tokenSlipAppt.patientId}|DOC:${tokenSlipAppt.doctorId}|DATE:${tokenSlipAppt.date}`}
                size={120}
                level="M"
              />
            </div>

            <div className="text-left text-xs space-y-1.5 border-t pt-3 text-slate-700">
              <div><strong>{t.patientName}:</strong> {tokenSlipAppt.patientName}</div>
              <div><strong>{t.selectedDoctor}:</strong> {tokenSlipAppt.doctorName}</div>
              <div><strong>{t.departmentFacility}:</strong> {tokenSlipAppt.departmentName} ({tokenSlipAppt.roomNumber})</div>
              <div><strong>{t.date} & {t.time}:</strong> {tokenSlipAppt.date} at {tokenSlipAppt.timeSlot}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
