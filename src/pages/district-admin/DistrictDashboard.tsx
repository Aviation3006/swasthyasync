import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { districtService } from '../../services/districtService';
import { hospitalService } from '../../services/hospitalService';
import { DistrictSummary, HealthAlert, DiseaseSurveillanceStat } from '../../types/district';
import { Hospital } from '../../types/hospital';
import { 
  ShieldAlert, 
  Building2, 
  Users, 
  Activity, 
  Bed, 
  AlertTriangle, 
  TrendingUp, 
  FileSpreadsheet, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Droplet,
  HeartPulse,
  Syringe,
  ChevronRight
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';

export const DistrictDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { location, jurisdiction } = useUserLocation();
  const [summary, setSummary] = useState<DistrictSummary>(districtService.getSummary());
  const [alerts, setAlerts] = useState<HealthAlert[]>(districtService.getHealthAlerts());
  const [diseases, setDiseases] = useState<DiseaseSurveillanceStat[]>(districtService.getDiseaseSurveillance());
  const [hospitals, setHospitals] = useState<Hospital[]>(hospitalService.getAllHospitals());

  useEffect(() => {
    const unsubAlerts = districtService.subscribeAlerts((a) => setAlerts(a));
    return unsubAlerts;
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === 'Active');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Command Center Top Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 rounded-2xl p-6 sm:p-7 text-white shadow-elevated border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-health-500/20 text-health-300 border border-health-500/30">
                {location.state ? `${location.state} Health Administration` : 'National Health Governance'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ● Live Command Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {jurisdiction?.administrativeJurisdiction || (location.district ? `${location.district} District Health Operations Command` : 'District Health Administration & Operations Command')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              {user?.name || 'District Health Officer'} ({jurisdiction?.adminRole || 'DHO'}) • {jurisdiction?.departmentOrAuthority || (location.district ? `${location.district} Directorate of Health Services` : 'District Health Authority')}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link to="/district-admin/alerts">
              <Button variant="danger" size="md" leftIcon={<AlertTriangle className="w-4 h-4" />}>
                {t.navEmergencyAlerts}
              </Button>
            </Link>
            <Link to="/district-admin/analytics">
              <Button variant="outline" size="md" leftIcon={<BarChart3 className="w-4 h-4" />} className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                {t.navDistrictAnalytics}
              </Button>
            </Link>
          </div>
        </div>

        {/* Aggregate District Capacity Stats */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">{t.bedOccupancyRate}</span>
            <div className="text-xl font-bold text-white mt-0.5">
              {summary.overallBedOccupancyRate}%{' '}
              <span className="text-xs font-normal text-slate-400">({summary.occupiedBeds}/{summary.totalBeds})</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block">{t.icuBedsAvailable}</span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {summary.occupiedIcuBeds} / {summary.totalIcuBeds}{' '}
              <span className="text-xs font-normal text-slate-400">{t.beds}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block">{t.ambulancesActive}</span>
            <div className="text-xl font-bold text-sky-400 mt-0.5">
              {summary.ambulanceFleetActive} / {summary.ambulanceFleetTotal}{' '}
              <span className="text-xs font-normal text-slate-400">Fleet</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block">{t.opdPatientsToday}</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {summary.todayOpdFootfall.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-400">Patients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Ribbon */}
      {activeAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-xs space-y-2 shadow-subtle">
          <div className="flex items-center justify-between font-bold text-rose-900">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
              HIGH-PRIORITY DISTRICT HEALTH ALERTS ({activeAlerts.length} ACTIVE)
            </span>
            <Link to="/district-admin/alerts" className="text-rose-700 underline hover:text-rose-900">
              Manage all alerts →
            </Link>
          </div>
          <div className="space-y-1">
            {activeAlerts.slice(0, 2).map((a) => (
              <div key={a.id} className="text-rose-800 flex items-start gap-2">
                <span className="font-semibold">• {a.title}:</span>
                <span className="text-rose-700">{a.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Core Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t.navHospitalNetwork}</span>
            <Building2 className="w-4 h-4 text-health-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {summary.totalHospitals + summary.totalPHCs}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {summary.totalHospitals} Hospitals • {summary.totalPHCs} PHCs
          </div>
        </Card>

        <Card className="border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t.citizenPatientTab}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {(summary.totalRegisteredPatients / 1000000).toFixed(2)}M
          </div>
          <div className="text-xs text-slate-500 mt-1">ABHA Registered Citizens</div>
        </Card>

        <Card className="border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t.emergencyAdmissions}</span>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">
            {summary.todayEmergencyFootfall}
          </div>
          <div className="text-xs text-slate-500 mt-1">Casualty & 108 Influx</div>
        </Card>

        <Card className="border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t.bloodUnitsAvailable}</span>
            <Droplet className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {summary.bloodBankStockUnits}
          </div>
          <div className="text-xs text-slate-500 mt-1">Units available across 8 banks</div>
        </Card>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Disease Surveillance & Hospital Capacity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Disease Surveillance Table */}
          <Card>
            <CardHeader
              title="Disease & Vector Surveillance Monitor"
              subtitle={`Integrated Disease Surveillance Programme (IDSP) ${location.district || "District"}`}
              icon={<Activity className="w-5 h-5 text-health-600" />}
              action={
                <Link to="/district-admin/analytics">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    View Trends
                  </Button>
                </Link>
              }
            />
            <CardContent>
              <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Disease / Indicator</th>
                      <th className="p-3">Active Cases</th>
                      <th className="p-3">New Today</th>
                      <th className="p-3">Trend</th>
                      <th className="p-3">High-Risk Talukas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {diseases.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-900">{d.disease}</td>
                        <td className="p-3 font-bold text-slate-800">{d.activeCases.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-semibold text-rose-600">+{d.newCasesToday}</td>
                        <td className="p-3">
                          <StatusBadge
                            variant={d.trend === 'increasing' ? 'error' : d.trend === 'stable' ? 'warning' : 'success'}
                            size="sm"
                          >
                            {d.trend}
                          </StatusBadge>
                        </td>
                        <td className="p-3 text-slate-600">{d.highRiskTalukas.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Hospital Readiness Matrix */}
          <Card>
            <CardHeader
              title="Facility Readiness & Bed Capacity"
              subtitle="Real-time occupancy across major taluka and district hospitals"
              icon={<Building2 className="w-5 h-5 text-health-600" />}
              action={
                <Link to="/district-admin/hospitals">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    All 28 Facilities
                  </Button>
                </Link>
              }
            />
            <CardContent>
              <div className="space-y-3">
                {hospitals.map((hosp) => {
                  const total = hosp.beds.generalTotal + hosp.beds.icuTotal + hosp.beds.oxygenTotal;
                  const occupied = hosp.beds.generalOccupied + hosp.beds.icuOccupied + hosp.beds.oxygenOccupied;
                  const pct = Math.round((occupied / total) * 100);

                  return (
                    <div key={hosp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{hosp.name}</h4>
                          <span className="text-[11px] text-slate-500">{hosp.facilityType} • {hosp.taluka} Taluka</span>
                        </div>
                        <StatusBadge
                          variant={hosp.operationalStatus === 'Normal' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {hosp.operationalStatus}
                        </StatusBadge>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600">Bed Occupancy: {occupied} / {total}</span>
                          <span className={pct > 85 ? 'text-rose-600 font-bold' : 'text-slate-700'}>{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${pct > 85 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                        <span>ICU Beds Free: <strong>{hosp.beds.icuTotal - hosp.beds.icuOccupied}</strong></span>
                        <span>Blood Bank Units: <strong>{hosp.bloodBankUnitsAvailable}</strong></span>
                        <span>Ambulances: <strong>{hosp.ambulanceAvailable}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Public Health Programs & Quick Launch */}
        <div className="space-y-6">
          {/* Quick Admin Actions */}
          <Card>
            <CardHeader
              title={t.actions}
              subtitle="Governance & Command Actions"
              icon={<ShieldAlert className="w-5 h-5 text-health-600" />}
            />
            <CardContent className="space-y-2.5">
              <Link to="/district-admin/alerts" className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<AlertTriangle className="w-4 h-4 text-rose-600" />} className="justify-start">
                  {t.navEmergencyAlerts}
                </Button>
              </Link>
              <Link to="/district-admin/hospitals" className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<Building2 className="w-4 h-4 text-health-700" />} className="justify-start">
                  {t.navHospitalNetwork}
                </Button>
              </Link>
              <Link to="/district-admin/analytics" className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<BarChart3 className="w-4 h-4 text-emerald-700" />} className="justify-start">
                  {t.navDistrictAnalytics}
                </Button>
              </Link>
              <Link to="/district-admin/reports" className="block">
                <Button variant="outline" size="md" fullWidth leftIcon={<FileSpreadsheet className="w-4 h-4 text-sky-700" />} className="justify-start">
                  {t.navReports}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Key Health Schemes & Coverage */}
          <Card>
            <CardHeader
              title="State Health Programs Scorecard"
              subtitle={`${location.state || "National"} Health Coverage & Empanelment`}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            />
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900">MJPJAY 2.0 Coverage</h5>
                  <span className="text-xs font-bold text-emerald-700">90.5%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: '90.5%' }} />
                </div>
                <p className="text-[10px] text-slate-500">1.34M of 1.48M target ration card holders</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900">Mission Indradhanush (Immunization)</h5>
                  <span className="text-xs font-bold text-emerald-700">96.1%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: '96.1%' }} />
                </div>
                <p className="text-[10px] text-slate-500">88.4K infants vaccinated</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900">NCD Doorstep Screening</h5>
                  <span className="text-xs font-bold text-amber-700">77.0%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600" style={{ width: '77.0%' }} />
                </div>
                <p className="text-[10px] text-slate-500">524K adults screened for BP/Sugar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
