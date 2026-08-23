import { 
  DistrictSummary, 
  MonthlyTrendData, 
  DiseaseSurveillanceStat, 
  HealthAlert, 
  HealthProgram,
  TalukaPerformance 
} from '../types/district';
import { 
  mockDistrictSummary, 
  mockMonthlyTrends, 
  mockDiseaseSurveillance, 
  mockTalukaPerformances, 
  mockHealthAlerts, 
  mockHealthPrograms 
} from '../data/districtAnalytics';
import { StorageStore } from '../utils/storage';

const summaryStore = new StorageStore<DistrictSummary>('district_summary', mockDistrictSummary);
const alertsStore = new StorageStore<HealthAlert[]>('district_alerts', mockHealthAlerts);

export const districtService = {
  getSummary(): DistrictSummary {
    return summaryStore.get();
  },

  getMonthlyTrends(): MonthlyTrendData[] {
    return mockMonthlyTrends;
  },

  getDiseaseSurveillance(): DiseaseSurveillanceStat[] {
    return mockDiseaseSurveillance;
  },

  getTalukaPerformances(): TalukaPerformance[] {
    return mockTalukaPerformances;
  },

  getHealthAlerts(): HealthAlert[] {
    return alertsStore.get();
  },

  getHealthPrograms(): HealthProgram[] {
    return mockHealthPrograms;
  },

  updateAlertStatus(alertId: string, status: 'Active' | 'Under Investigation' | 'Resolved'): HealthAlert {
    let updated: HealthAlert | undefined;
    alertsStore.set((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          updated = { ...a, status };
          return updated;
        }
        return a;
      })
    );
    if (!updated) throw new Error('Alert not found');
    return updated;
  },

  createAlert(data: Omit<HealthAlert, 'id' | 'reportedDate'>): HealthAlert {
    const newAlert: HealthAlert = {
      ...data,
      id: `alt-${Date.now()}`,
      reportedDate: new Date().toISOString().split('T')[0]
    };
    alertsStore.set((prev) => [newAlert, ...prev]);
    return newAlert;
  },

  subscribeAlerts(listener: (alerts: HealthAlert[]) => void): () => void {
    return alertsStore.subscribe(listener);
  }
};
