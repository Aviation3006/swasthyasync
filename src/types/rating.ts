export interface DoctorConsultationRating {
  overallRating: number; // 1 to 5
  communication: number; // 1 to 5
  professionalism: number; // 1 to 5
  explanationClarity: number; // 1 to 5
}

export interface HospitalStaffRating {
  staffHelpfulness: number; // 1 to 5
  staffProfessionalism: number; // 1 to 5
}

export interface FacilityExperienceRating {
  cleanliness: number; // 1 to 5
  facilityExperience: number; // 1 to 5
  waitingQueueExperience: number; // 1 to 5
  overallHospitalExperience: number; // 1 to 5
}

export interface PatientDoctorRating {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName?: string; // Anonymized when displayed to others (e.g. "Patient #1042")
  doctorId: string;
  doctorName: string;
  specialization?: string;
  department: string;
  facilityId: string;
  facilityName: string;
  district: string;
  state: string;
  visitDate?: string;
  tokenNumber?: string;
  consultationRating: DoctorConsultationRating;
  staffRating: HospitalStaffRating;
  facilityRating: FacilityExperienceRating;
  feedback?: string;
  isVerifiedVisit?: boolean;
  isEdited?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DoctorAuditMetric {
  doctorId: string;
  doctorName: string;
  avatar?: string;
  specialization: string;
  department: string;
  facilityId: string;
  facilityName: string;
  district: string;
  state: string;
  experienceYears: number;
  totalCompletedVisits: number;
  totalRatings: number;
  averageOverall: number;
  averageCommunication: number;
  averageProfessionalism: number;
  averageExplanation: number;
  // Associated facility averages from this doctor's visits
  staffHelpfulnessAvg: number;
  staffProfessionalismAvg: number;
  cleanlinessAvg: number;
  waitingQueueAvg: number;
  satisfactionTrend: 'up' | 'down' | 'stable';
  trendDelta: number;
  performanceStatus: 'benchmark_exceeded' | 'satisfactory' | 'attention_required';
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  isLimitedSampleSize: boolean; // Flagged when ratings < 5
  trendPercentage: number; // 30-day percentage trend
  recentFeedbacks: {
    id: string;
    patientId: string;
    patientAlias: string;
    date: string;
    rating: number;
    communication: number;
    professionalism: number;
    explanation: number;
    feedback: string;
    isVerifiedVisit: boolean;
  }[];
}

export interface HospitalAuditMetric {
  facilityId: string;
  facilityName: string;
  district: string;
  state: string;
  totalCompletedVisits: number;
  totalRatings: number;
  participationRate: number; // percentage
  overallHospitalRating: number;
  doctorExperienceAverage: number;
  staffAverage: number;
  cleanlinessAverage: number;
  waitingExperienceAverage: number;
  doctorCount: number;
  doctorMetrics: DoctorAuditMetric[];
  qualityWarnings: QualityWarning[];
}

export interface QualityWarning {
  id: string;
  facilityId: string;
  facilityName: string;
  category: 'Cleanliness' | 'Waiting Queue' | 'Staff Behaviour' | 'Doctor Communication';
  currentScore: number;
  benchmarkScore: number;
  severity: 'warning' | 'critical';
  message: string;
}

export interface DistrictAuditSummary {
  district: string;
  state: string;
  totalDistrictRatings: number;
  totalCompletedVisits: number;
  overallDistrictRating: number;
  doctorExperienceAverage: number;
  staffAverage: number;
  cleanlinessAverage: number;
  waitingExperienceAverage: number;
  hospitalAudits: HospitalAuditMetric[];
  topDoctors: DoctorAuditMetric[];
  bestDoctor?: DoctorAuditMetric | null;
  lowestDoctor?: DoctorAuditMetric | null;
  recentFeedbacks: {
    id: string;
    doctorName: string;
    department: string;
    facilityName: string;
    date: string;
    rating: number;
    feedback: string;
  }[];
  qualityWarnings: QualityWarning[];
}
