export interface HealthAlert {
  id: string;
  title: string;
  category: 'Epidemic' | 'Capacity' | 'Supply Shortage' | 'Weather/Disaster' | 'Advisory';
  severity: 'Critical' | 'Warning' | 'Informational';
  affectedTalukas: string[];
  affectedHospitals: string[];
  description: string;
  actionRequired: string;
  status: 'Active' | 'Under Investigation' | 'Resolved';
  reportedDate: string;
  broadcastTo: ('Public' | 'Hospitals' | 'PHCs')[];
}

export interface DiseaseSurveillanceStat {
  disease: string;
  activeCases: number;
  newCasesToday: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  highRiskTalukas: string[];
  recoveryRate: number;
}

export interface HealthProgram {
  id: string;
  name: string;
  code: string;
  targetPopulation: string;
  enrolledCount: number;
  targetCount: number;
  coveragePercentage: number;
  status: 'Active' | 'Phase 2 Rolling Out' | 'Target Met';
  description: string;
}

export interface DistrictSummary {
  districtName: string;
  totalHospitals: number;
  totalPHCs: number;
  totalSubCentres: number;
  totalRegisteredPatients: number;
  todayOpdFootfall: number;
  todayEmergencyFootfall: number;
  overallBedOccupancyRate: number; // e.g. 78.4%
  totalBeds: number;
  occupiedBeds: number;
  totalIcuBeds: number;
  occupiedIcuBeds: number;
  totalOxygenBeds: number;
  occupiedOxygenBeds: number;
  ambulanceFleetActive: number;
  ambulanceFleetTotal: number;
  bloodBankStockUnits: number;
}

export interface MonthlyTrendData {
  month: string;
  opdCount: number;
  ipdCount: number;
  emergencyCount: number;
  teleConsultationCount: number;
}

export interface TalukaPerformance {
  taluka: string;
  hospitalsCount: number;
  phcCount: number;
  patientVolume: number;
  bedOccupancyRate: number;
  immunizationCoverage: number;
  maternalHealthScore: number;
  alertLevel: 'Green' | 'Amber' | 'Red';
}
