import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import { useTranslation } from '../../i18n/useTranslation';
import React, { useState, useEffect } from 'react';
import { districtService } from '../../services/districtService';
import { HealthAlert } from '../../types/district';
import { useToast } from '../../context/ToastContext';
import { 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Send, 
  Building2, 
  MapPin, 
  Activity, 
  ShieldAlert,
  Radio
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Tabs } from '../../components/common/Tabs';

export const DistrictAlerts: React.FC = () => {
  const { location: userLoc } = useUserLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showSuccess, showInfo } = useToast();
  const [alerts, setAlerts] = useState<HealthAlert[]>(districtService.getHealthAlerts());
  const [activeTab, setActiveTab] = useState<string>('All');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Form State
  const [alertTitle, setAlertTitle] = useState('');
  const [alertCategory, setAlertCategory] = useState<'Epidemic' | 'Capacity' | 'Supply Shortage' | 'Weather/Disaster' | 'Advisory'>('Epidemic');
  const [alertSeverity, setAlertSeverity] = useState<'Critical' | 'Warning' | 'Informational'>('Critical');
  const [talukasInput, setTalukasInput] = useState('Haveli, Khed, Shirur');
  const [alertDesc, setAlertDesc] = useState('');
  const [actionReq, setActionReq] = useState('');

  useEffect(() => {
    const unsub = districtService.subscribeAlerts((list) => setAlerts(list));
    return unsub;
  }, []);

  const handleStatusChange = (alertId: string, status: 'Active' | 'Under Investigation' | 'Resolved') => {
    districtService.updateAlertStatus(alertId, status);
    showSuccess('Alert Status Updated', `Alert marked as "${status}".`);
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertDesc.trim()) {
      showInfo('Incomplete Alert', 'Please enter title and description for the broadcast advisory.');
      return;
    }

    const talukaList = talukasInput.split(',').map((t) => t.trim()).filter(Boolean);

    districtService.createAlert({
      title: alertTitle.trim(),
      category: alertCategory,
      severity: alertSeverity,
      affectedTalukas: talukaList.length > 0 ? talukaList : [userLoc?.district ? `${userLoc?.district} District Wide` : 'District Wide'],
      affectedHospitals: ['All Empaneled District & Sub-District Hospitals'],
      description: alertDesc.trim(),
      actionRequired: actionReq.trim() || 'Immediate compliance with state public health protocols.',
      status: 'Active',
      broadcastTo: ['Hospitals', 'PHCs', 'Public']
    });

    setIsBroadcastModalOpen(false);
    setAlertTitle('');
    setAlertDesc('');
    setActionReq('');
    showSuccess('Emergency Alert Broadcasted', 'Notification dispatched to 28 hospitals and 96 PHCs.');
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return a.status === 'Active';
    if (activeTab === 'Investigation') return a.status === 'Under Investigation';
    if (activeTab === 'Resolved') return a.status === 'Resolved';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.districtAlertsTitle || "District Health Alerts & Emergency Broadcast Command"}
        subtitle={t.districtAlertsSubtitle || "Issue real-time epidemiological warnings, capacity alerts, and epidemic directives across the district."}
        breadcrumbs={[
          { label: t.portalAdmin || 'District Admin', path: '/district-admin' },
          { label: t.navEmergencyAlerts || 'Emergency Alerts' }
        ]}
        actions={
          <Button
            variant="danger"
            size="md"
            leftIcon={<Radio className="w-4 h-4" />}
            onClick={() => setIsBroadcastModalOpen(true)}
          >
            {t.broadcastNewAdvisory || "Broadcast New Emergency Advisory"}
          </Button>
        }
      />

      <Tabs
        tabs={[
          { id: 'All', label: `${t.all || "All"} (${alerts.length})`, count: alerts.length },
          { id: 'Active', label: `${t.active || "Active"} (${alerts.filter((a) => a.status === 'Active').length})`, count: alerts.filter((a) => a.status === 'Active').length },
          { id: 'Investigation', label: `${t.statusAttention || "Under Investigation"} (${alerts.filter((a) => a.status === 'Under Investigation').length})`, count: alerts.filter((a) => a.status === 'Under Investigation').length },
          { id: 'Resolved', label: `${t.statusCompleted || "Resolved"} (${alerts.filter((a) => a.status === 'Resolved').length})`, count: alerts.filter((a) => a.status === 'Resolved').length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`border-l-4 transition-all ${
                alert.severity === 'Critical'
                  ? 'border-l-rose-600 bg-rose-50/20'
                  : alert.severity === 'Warning'
                  ? 'border-l-amber-500 bg-amber-50/20'
                  : 'border-l-sky-500 bg-sky-50/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {alert.category}
                    </span>
                    <StatusBadge
                      variant={
                        alert.severity === 'Critical'
                          ? 'urgent'
                          : alert.severity === 'Warning'
                          ? 'warning'
                          : 'info'
                      }
                      size="sm"
                    >
                      {alert.severity}
                    </StatusBadge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date((alert as any).timestamp || alert.reportedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {alert.status === 'Active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(alert.id, 'Under Investigation')}
                      >
                        {t.investigate || "Investigate"}
                      </Button>
                    )}
                    {alert.status !== 'Resolved' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        onClick={() => handleStatusChange(alert.id, 'Resolved')}
                      >
                        {t.statusCompleted || "Resolve"}
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{alert.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.actionRequiredDirective || "Mandatory Action Directive"}</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed pl-5">
                    {alert.actionRequired}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="p-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">{t.noAlertsInCategory || "No active public health alerts in this category."}</h4>
              <p className="text-xs text-slate-400">All healthcare facilities operating within normal thresholds.</p>
            </div>
          </Card>
        )}
      </div>

      {/* Broadcast Advisory Modal */}
      <Modal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        title={t.broadcastAdvisory || "Broadcast Public Health Alert"}
      >
        <form onSubmit={handleBroadcastAlert} className="space-y-4 text-xs">
          <FormField label={t.advisoryHeadline || "Advisory Headline / Title"} required>
            <Input
              type="text"
              placeholder={t.advisoryHeadlinePlaceholder || "e.g. Surge in Dengue NS1 Positivity in Haveli Taluka..."}
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label={t.alertCategory || "Alert Category"} required>
              <Select
                value={alertCategory}
                onChange={(e) => setAlertCategory(e.target.value as any)}
                options={[
                  { value: 'Epidemic', label: 'Epidemic / Outbreak' },
                  { value: 'Capacity', label: 'Bed Capacity Surge' },
                  { value: 'Supply Shortage', label: 'Blood/Medicine Shortage' },
                  { value: 'Weather/Disaster', label: 'Heatwave / Flood Warning' },
                  { value: 'Advisory', label: 'General Clinical Advisory' },
                ]}
              />
            </FormField>

            <FormField label={t.alertSeverity || "Alert Severity"} required>
              <Select
                value={alertSeverity}
                onChange={(e) => setAlertSeverity(e.target.value as any)}
                options={[
                  { value: 'Critical', label: 'Critical (Red Flag)' },
                  { value: 'Warning', label: 'Warning (Amber)' },
                  { value: 'Informational', label: 'Informational (Blue)' },
                ]}
              />
            </FormField>
          </div>

          <FormField label={t.affectedTalukas || "Affected Talukas (comma-separated)"}>
            <Input
              type="text"
              placeholder="e.g. Haveli, Baramati, Shirur"
              value={talukasInput}
              onChange={(e) => setTalukasInput(e.target.value)}
            />
          </FormField>

          <FormField label={t.detailedIncidentDesc || "Detailed Incident Description"} required>
            <textarea
              rows={3}
              placeholder={t.detailedIncidentPlaceholder || "Detail the exact incident, case count surge, or facility load..."}
              value={alertDesc}
              onChange={(e) => setAlertDesc(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </FormField>

          <FormField label={t.actionRequiredDirective || "Mandatory Action Directive for Hospitals & PHCs"}>
            <textarea
              rows={2}
              placeholder={t.actionRequiredPlaceholder || "What actions must Chief Medical Officers and PHC doctors take immediately?"}
              value={actionReq}
              onChange={(e) => setActionReq(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsBroadcastModalOpen(false)}
            >
              {t.cancel || "Cancel"}
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              {t.broadcastAdvisory || "Broadcast Public Health Alert"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
