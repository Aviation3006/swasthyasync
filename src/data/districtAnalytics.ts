import { 
  DistrictSummary, 
  MonthlyTrendData, 
  DiseaseSurveillanceStat, 
  HealthAlert, 
  HealthProgram,
  TalukaPerformance 
} from '../types/district';

export const mockDistrictSummary: DistrictSummary = {
  districtName: 'Pune District, Maharashtra',
  totalHospitals: 28,
  totalPHCs: 96,
  totalSubCentres: 540,
  totalRegisteredPatients: 1482090,
  todayOpdFootfall: 14820,
  todayEmergencyFootfall: 842,
  overallBedOccupancyRate: 81.4, // %
  totalBeds: 4850,
  occupiedBeds: 3948,
  totalIcuBeds: 420,
  occupiedIcuBeds: 362,
  totalOxygenBeds: 1250,
  occupiedOxygenBeds: 940,
  ambulanceFleetActive: 88,
  ambulanceFleetTotal: 96,
  bloodBankStockUnits: 1480
};

export const mockMonthlyTrends: MonthlyTrendData[] = [
  { month: 'Mar 2026', opdCount: 312000, ipdCount: 22400, emergencyCount: 16800, teleConsultationCount: 8400 },
  { month: 'Apr 2026', opdCount: 328000, ipdCount: 23100, emergencyCount: 17200, teleConsultationCount: 9100 },
  { month: 'May 2026', opdCount: 345000, ipdCount: 24800, emergencyCount: 18900, teleConsultationCount: 10400 },
  { month: 'Jun 2026', opdCount: 382000, ipdCount: 28400, emergencyCount: 21500, teleConsultationCount: 12800 },
  { month: 'Jul 2026', opdCount: 420000, ipdCount: 31200, emergencyCount: 24600, teleConsultationCount: 15200 },
  { month: 'Aug 2026', opdCount: 445000, ipdCount: 33800, emergencyCount: 26100, teleConsultationCount: 16900 }
];

export const mockDiseaseSurveillance: DiseaseSurveillanceStat[] = [
  {
    disease: 'Dengue (Vector-Borne)',
    activeCases: 342,
    newCasesToday: 28,
    trend: 'increasing',
    highRiskTalukas: ['Haveli', 'Khed', 'Shirur'],
    recoveryRate: 94.2
  },
  {
    disease: 'Hypertension (NCD)',
    activeCases: 18450,
    newCasesToday: 142,
    trend: 'stable',
    highRiskTalukas: ['Pune City Urban', 'Baramati', 'Maval'],
    recoveryRate: 98.6
  },
  {
    disease: 'Type 2 Diabetes (NCD)',
    activeCases: 22100,
    newCasesToday: 168,
    trend: 'stable',
    highRiskTalukas: ['Haveli', 'Pune City Urban', 'Daund'],
    recoveryRate: 97.8
  },
  {
    disease: 'Acute Respiratory Infections',
    activeCases: 1280,
    newCasesToday: 94,
    trend: 'increasing',
    highRiskTalukas: ['Junnar', 'Ambegaon', 'Mulshi'],
    recoveryRate: 96.1
  },
  {
    disease: 'Malaria (Plasmodium Vivax/Falciparum)',
    activeCases: 48,
    newCasesToday: 3,
    trend: 'decreasing',
    highRiskTalukas: ['Bhor', 'Velhe'],
    recoveryRate: 99.1
  }
];

export const mockTalukaPerformances: TalukaPerformance[] = [
  { taluka: 'Haveli', hospitalsCount: 8, phcCount: 18, patientVolume: 114000, bedOccupancyRate: 86.5, immunizationCoverage: 96.4, maternalHealthScore: 94.8, alertLevel: 'Amber' },
  { taluka: 'Baramati', hospitalsCount: 4, phcCount: 12, patientVolume: 52000, bedOccupancyRate: 74.2, immunizationCoverage: 98.2, maternalHealthScore: 96.5, alertLevel: 'Green' },
  { taluka: 'Khed (Rajgurunagar)', hospitalsCount: 3, phcCount: 10, patientVolume: 44000, bedOccupancyRate: 82.0, immunizationCoverage: 94.1, maternalHealthScore: 91.2, alertLevel: 'Amber' },
  { taluka: 'Shirur', hospitalsCount: 3, phcCount: 9, patientVolume: 38000, bedOccupancyRate: 68.0, immunizationCoverage: 95.0, maternalHealthScore: 93.0, alertLevel: 'Green' },
  { taluka: 'Junnar', hospitalsCount: 3, phcCount: 11, patientVolume: 36000, bedOccupancyRate: 63.3, immunizationCoverage: 96.8, maternalHealthScore: 94.0, alertLevel: 'Green' },
  { taluka: 'Maval', hospitalsCount: 2, phcCount: 8, patientVolume: 31000, bedOccupancyRate: 79.4, immunizationCoverage: 93.2, maternalHealthScore: 90.5, alertLevel: 'Green' },
  { taluka: 'Daund', hospitalsCount: 2, phcCount: 9, patientVolume: 29000, bedOccupancyRate: 72.8, immunizationCoverage: 94.6, maternalHealthScore: 92.4, alertLevel: 'Green' },
  { taluka: 'Bhor / Velhe', hospitalsCount: 3, phcCount: 19, patientVolume: 24000, bedOccupancyRate: 58.4, immunizationCoverage: 97.1, maternalHealthScore: 95.2, alertLevel: 'Green' }
];

export const mockHealthAlerts: HealthAlert[] = [
  {
    id: 'alt-001',
    title: 'Dengue Outbreak Cluster in Haveli & Wagholi Urban Fringe',
    category: 'Epidemic',
    severity: 'Critical',
    affectedTalukas: ['Haveli', 'Khed'],
    affectedHospitals: ['Aundh District Hospital', 'Wagholi Rural Hospital', 'Hadapsar CHC'],
    description: 'Surge in NS1 positive antigen tests reported across Haveli taluka over the past 7 days (48 new cases). Vector control teams deployed for fogging.',
    actionRequired: 'All PHCs must maintain 100+ rapid diagnostic kits and report daily fever cases by 4:00 PM. Reserved 20 isolation beds at Aundh District Hospital.',
    status: 'Active',
    reportedDate: '2026-08-22',
    broadcastTo: ['Hospitals', 'PHCs']
  },
  {
    id: 'alt-002',
    title: 'ICU Bed Saturation Warning at Sassoon General Hospital',
    category: 'Capacity',
    severity: 'Critical',
    affectedTalukas: ['Pune City Urban', 'Haveli'],
    affectedHospitals: ['Sassoon General Hospital & BJ Medical College'],
    description: 'Sassoon ICU bed occupancy has reached 93.3% (112 out of 120 beds occupied). Trauma referrals should be coordinated with Aundh DH.',
    actionRequired: 'Activate step-down HDU wards and coordinate inter-hospital critical care transport via 108 Emergency dispatch.',
    status: 'Active',
    reportedDate: '2026-08-23',
    broadcastTo: ['Hospitals']
  },
  {
    id: 'alt-003',
    title: 'Anti-Rabies Immunoglobulin (ARV) Low Stock Warning',
    category: 'Supply Shortage',
    severity: 'Warning',
    affectedTalukas: ['Baramati', 'Daund'],
    affectedHospitals: ['Baramati Sub-District Hospital', 'Daund Rural Hospital'],
    description: 'ARV vial inventory dropped below 15-day safety threshold in southern taluka depots due to supply chain transit delay from Haffkine Institute.',
    actionRequired: 'Inter-district buffer transfer of 400 vials authorized from Central Pune Medical Depot.',
    status: 'Under Investigation',
    reportedDate: '2026-08-21',
    broadcastTo: ['Hospitals', 'PHCs']
  },
  {
    id: 'alt-004',
    title: 'Intense Monsoon Rainfall & Leptospirosis Preventive Advisory',
    category: 'Weather/Disaster',
    severity: 'Informational',
    affectedTalukas: ['Maval', 'Mulshi', 'Velhe', 'Bhor'],
    affectedHospitals: ['All Western Ghat Rural Hospitals and PHCs'],
    description: 'Heavy rainfall warning in ghat catchment areas. Doxycycline 200mg prophylaxis advised for flood-wading populations.',
    actionRequired: 'Distribute prophylactic blisters to ASHA workers in vulnerable flood-prone settlements.',
    status: 'Active',
    reportedDate: '2026-08-19',
    broadcastTo: ['Public', 'Hospitals', 'PHCs']
  }
];

export const mockHealthPrograms: HealthProgram[] = [
  {
    id: 'prog-01',
    name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY 2.0)',
    code: 'MJPJAY-MH',
    targetPopulation: 'Universal Health Coverage for all ration card holders in Maharashtra',
    enrolledCount: 1340000,
    targetCount: 1480000,
    coveragePercentage: 90.5,
    status: 'Active',
    description: 'Cashless treatment up to ₹5,00,000 per family per year across empaneled public and private hospitals.'
  },
  {
    id: 'prog-02',
    name: 'Mission Indradhanush 5.0 (Universal Child & Maternal Immunization)',
    code: 'IMI-5',
    targetPopulation: '0-5 Year Children and Pregnant Women in Hard-to-Reach Pockets',
    enrolledCount: 88400,
    targetCount: 92000,
    coveragePercentage: 96.1,
    status: 'Target Met',
    description: 'Intensified vaccination drives for DPT, Polio, Measles-Rubella, and Pentavalent vaccines.'
  },
  {
    id: 'prog-03',
    name: 'National Non-Communicable Disease (NCD) Population Screening',
    code: 'NP-NCD',
    targetPopulation: 'Adults aged 30+ years in Pune District',
    enrolledCount: 524000,
    targetCount: 680000,
    coveragePercentage: 77.0,
    status: 'Active',
    description: 'Community doorstep screening for Diabetes, Hypertension, Oral, Breast, and Cervical cancers.'
  },
  {
    id: 'prog-04',
    name: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA - 9th of every month)',
    code: 'PMSMA',
    targetPopulation: 'Pregnant Women in 2nd and 3rd Trimester',
    enrolledCount: 42300,
    targetCount: 45000,
    coveragePercentage: 94.0,
    status: 'Active',
    description: 'Free comprehensive antenatal checkups and ultrasounds by specialist OB-GYNs.'
  }
];
