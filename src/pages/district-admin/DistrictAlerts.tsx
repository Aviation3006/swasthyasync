import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
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
        title="District Health Alerts & Emergency Broadcast Command"
        subtitle={`Issue real-time epidemiological warnings, capacity alerts, and epidemic directives across ${userLoc?.district || "the district"}`}
        breadcrumbs={[
          { label: 'District Admin', path: '/district-admin' },
          { label: 'Emergency Alerts' }
        ]}
        actions={
          <Button
            variant="danger"
            size="md"
            leftIcon={<Radio className="w-4 h-4" />}
            onClick={() => setIsBroadcastModalOpen(true)}
          >
            Broadcast New Emergency Advisory
          </Button>
        }
      />

      <Tabs
        tabs={[
          { id: 'All', label: 'All Advisories', count: alerts.length },
          { id: 'Active', label: 'Active Alerts', count: alerts.filter((a) => a.status === 'Active').length },
          { id: 'Investigation', label: 'Under Investigation', count: alerts.filter((a) => a.status === 'Under Investigation').length },
          { id: 'Resolved', label: 'Resolved Archives', count: alerts.filter((a) => a.status === 'Resolved').length },
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
                      {alert.severity} Severity
                    </StatusBadge>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      Status: {alert.status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    Reported on {alert.reportedDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 uppercase text-[10px] block">
                    Action Required by Hospitals / PHCs:
                  </span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {alert.actionRequired}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Talukas: <strong>{alert.affectedTalukas.join(', ')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Broadcast Channel: <strong>{alert.broadcastTo.join(', ')}</strong>
                    </span>
                  </div>

                  {/* Status Toggle Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {alert.status !== 'Resolved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(alert.id, 'Resolved')}
                        leftIcon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {alert.status === 'Active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(alert.id, 'Under Investigation')}
                        className="text-amber-700"
                      >
                        Investigate
                      </Button>
                    )}
                    {alert.status === 'Resolved' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(alert.id, 'Active')}
                        className="text-rose-700"
                      >
                        Re-open Alert
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            <AlertTriangle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No health alerts in this category</p>
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <Modal
          isOpen={isBroadcastModalOpen}
          onClose={() => setIsBroadcastModalOpen(false)}
          title="Broadcast District Public Health Alert"
          subtitle="Dispatches instantaneous priority notification to all hospital staff & medical officers"
          maxWidth="lg"
        >
          <form onSubmit={handleBroadcastAlert} className="space-y-4 text-xs">
            <FormField label="Advisory Headline / Title" required>
              <Input
                placeholder="e.g. Surge in Dengue NS1 Positivity in Haveli Taluka..."
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Alert Category">
                <Select
                  value={alertCategory}
                  onChange={(e) => setAlertCategory(e.target.value as any)}
                  options={[
                    { value: 'Epidemic', label: 'Epidemic / Disease Outbreak' },
                    { value: 'Capacity', label: 'Hospital Bed / ICU Saturation' },
                    { value: 'Supply Shortage', label: 'Medicine / Vaccine Stockout' },
                    { value: 'Weather/Disaster', label: 'Monsoon / Natural Advisory' },
                    { value: 'Advisory', label: 'General Administrative Directive' }
                  ]}
                />
              </FormField>

              <FormField label="Severity Level">
                <Select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value as any)}
                  options={[
                    { value: 'Critical', label: 'Critical (Red Code)' },
                    { value: 'Warning', label: 'Warning (Amber Code)' },
                    { value: 'Informational', label: 'Informational Advisory' }
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Affected Talukas (comma-separated)">
              <Input
                value={talukasInput}
                onChange={(e) => setTalukasInput(e.target.value)}
                placeholder="e.g. Haveli, Baramati, Junnar..."
              />
            </FormField>

            <FormField label="Situation Overview & Clinical Findings" required>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-health-600 focus:outline-none"
                placeholder="Detail the exact incident, case count surge, or facility load..."
                value={alertDesc}
                onChange={(e) => setAlertDesc(e.target.value)}
              />
            </FormField>

            <FormField label="Mandatory Action Directive">
              <textarea
                rows={2}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-health-600 focus:outline-none"
                placeholder="What actions must Chief Medical Officers and PHC doctors take immediately?"
                value={actionReq}
                onChange={(e) => setActionReq(e.target.value)}
              />
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsBroadcastModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                Broadcast Advisory
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
