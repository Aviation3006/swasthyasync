import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import { useTranslation } from '../../i18n/useTranslation';
import React, { useState } from 'react';
import { districtService } from '../../services/districtService';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  PieChart as PieIcon, 
  Calendar, 
  FileSpreadsheet, 
  ShieldCheck,
  Download
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const DistrictAnalytics: React.FC = () => {
  const { location: userLoc } = useUserLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showSuccess } = useToast();
  const monthlyData = districtService.getMonthlyTrends();
  const diseaseData = districtService.getDiseaseSurveillance();
  const talukas = districtService.getTalukaPerformances();

  const [timeRange, setTimeRange] = useState('6M');

  // Department distribution pie data
  const deptData = [
    { name: 'General Medicine', value: 38, color: '#0369A1' },
    { name: 'Pediatrics', value: 18, color: '#059669' },
    { name: 'OB-GYN (Maternal)', value: 16, color: '#D97706' },
    { name: 'Orthopedics', value: 12, color: '#7C3AED' },
    { name: 'Cardiology', value: 9, color: '#DC2626' },
    { name: 'Ophthalmology', value: 7, color: '#0D9488' },
  ];

  // Bed capacity stacked bar data
  const bedUtilizationData = [
    { facility: 'Aundh DH', occupied: 310, available: 100 },
    { facility: 'Sassoon GH', occupied: 1482, available: 238 },
    { facility: 'Baramati SDH', occupied: 154, available: 76 },
    { facility: 'Shirur RH', occupied: 58, available: 32 },
    { facility: 'Junnar CHC', occupied: 32, available: 23 },
    { facility: 'Haveli PHCs', occupied: 84, available: 46 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.districtAnalyticsTitle || "District Health Analytics & Epidemiological Intelligence"}
        subtitle={t.districtAnalyticsSubtitle || "Comparative maternal health, immunization and bed occupancy scores across all talukas."}
        breadcrumbs={[
          { label: t.portalAdmin || 'District Admin', path: '/district-admin' },
          { label: t.navDistrictAnalytics || 'Analytics' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800 shadow-subtle"
            >
              <option value="1M">{t.last30Days || "Past 30 Days"}</option>
              <option value="3M">{t.last90Days || "Past Quarter (3M)"}</option>
              <option value="6M">Past 6 Months</option>
              <option value="1Y">{t.allTime || "Past Year"}</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => showSuccess('Export Started', 'Aggregated CSV dataset generated.')}
            >
              {t.exportData || "Export Data"}
            </Button>
          </div>
        }
      />

      {/* Top 2 Charts: Patient Footfall & Disease Surveillance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly OPD & IPD Footfall */}
        <Card>
          <CardHeader
            title="Monthly Patient Footfall Trends (OPD & Inpatient)"
            subtitle="Volume of consultations across district network"
            icon={<TrendingUp className="w-5 h-5 text-health-600" />}
          />
          <CardContent>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="opdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="ipdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [Number(val).toLocaleString('en-IN'), '']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="opdCount" name="OPD Footfall" stroke="#0284C7" fillOpacity={1} fill="url(#opdGrad)" />
                  <Area type="monotone" dataKey="ipdCount" name="Inpatient (IPD)" stroke="#059669" fillOpacity={1} fill="url(#ipdGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Disease Surveillance Bar Chart */}
        <Card>
          <CardHeader
            title={t.activeCommunicableCases || "Active Communicable & Chronic Cases"}
            subtitle={t.diseaseSurveillanceCounts || "Disease surveillance counts under active monitoring"}
            icon={<Activity className="w-5 h-5 text-rose-600" />}
          />
          <CardContent>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v > 1000 ? `${v / 1000}k` : v}`} />
                  <YAxis type="category" dataKey="disease" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip
                    formatter={(val: any) => [Number(val).toLocaleString('en-IN'), 'Active Cases']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="activeCases" name="Active Case Count" fill="#0369A1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom 2 Charts: Bed Capacity & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bed Utilization Stacked Bar (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader
              title={t.bedAvailability || "Hospital Bed Occupancy vs Availability"}
              subtitle={t.granularConsentSubtitle || "Facility-wise distribution of occupied and vacant beds"}
              icon={<BarChart3 className="w-5 h-5 text-health-600" />}
            />
            <CardContent className="flex-1">
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bedUtilizationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="facility" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="occupied" name="Occupied Beds" stackId="a" fill="#0369A1" />
                    <Bar dataKey="available" name="Available Beds" stackId="a" fill="#94A3B8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Demand Pie (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader
              title={t.departmentalVolume || "Departmental Patient Volume %"}
              subtitle={t.department || "Speciality caseload distribution"}
              icon={<PieIcon className="w-5 h-5 text-health-600" />}
            />
            <CardContent className="flex-1">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Share']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Taluka Performance Scorecard */}
      <Card>
        <CardHeader
          title={t.talukaScorecard || "Taluka Public Health Scorecard & Readiness Index"}
          subtitle={t.districtAnalyticsSubtitle || "Comparative maternal health, immunization and bed occupancy scores across 8 talukas"}
          icon={<FileSpreadsheet className="w-5 h-5 text-emerald-600" />}
        />
        <CardContent>
          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="p-3">{t.taluka || "Taluka"}</th>
                  <th className="p-3">{t.allHospitals || "Facilities"}</th>
                  <th className="p-3">{t.patientVolume || "Monthly Footfall"}</th>
                  <th className="p-3">{t.bedOccupancyRate || "Bed Occupancy %"}</th>
                  <th className="p-3">{t.childImmunization || "Child Immunization"}</th>
                  <th className="p-3">{t.maternalCareScore || "Maternal Care Score"}</th>
                  <th className="p-3">{t.status || "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {talukas.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="p-3 font-bold text-slate-900">{item.taluka}</td>
                    <td className="p-3 text-slate-600">{item.hospitalsCount} Hosp + {item.phcCount} PHCs</td>
                    <td className="p-3 font-mono font-bold text-slate-800">{item.patientVolume.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-semibold">{item.bedOccupancyRate}%</td>
                    <td className="p-3 font-semibold text-emerald-700">{item.immunizationCoverage}%</td>
                    <td className="p-3 font-semibold text-health-800">{item.maternalHealthScore}/100</td>
                    <td className="p-3">
                      <StatusBadge
                        variant={item.alertLevel === 'Green' ? 'success' : item.alertLevel === 'Amber' ? 'warning' : 'error'}
                        size="sm"
                      >
                        {item.alertLevel === 'Green' ? (t.statusNormal || 'Stable') : (t.statusAttention || 'Elevated Load')}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
