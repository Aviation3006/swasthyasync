import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospitalService';
import { patientService } from '../../services/patientService';
import { QueueItem, QueueStatus } from '../../types/hospital';
import { useToast } from '../../context/ToastContext';
import { 
  Clock, 
  Users, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Stethoscope, 
  Activity, 
  ArrowRight,
  Flame,
  Search,
  Building2
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';

export const HospitalQueue: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const [queue, setQueue] = useState<QueueItem[]>(hospitalService.getQueue());
  const [isAddWalkInOpen, setIsAddWalkInOpen] = useState(false);

  // Form state for walk-in
  const [walkInName, setWalkInName] = useState('');
  const [walkInAge, setWalkInAge] = useState(45);
  const [walkInGender, setWalkInGender] = useState('Male');
  const [walkInPhone, setWalkInPhone] = useState('+91 98');
  const [walkInDept, setWalkInDept] = useState('General Medicine');
  const [walkInComplaint, setWalkInComplaint] = useState('');
  const [walkInPriority, setWalkInPriority] = useState<'Normal' | 'Senior Citizen' | 'Emergency' | 'Maternal'>('Normal');

  useEffect(() => {
    const unsub = hospitalService.subscribeQueue((q) => setQueue(q));
    return unsub;
  }, []);

  const handleStatusChange = (itemId: string, newStatus: QueueStatus) => {
    hospitalService.updateQueueItemStatus(itemId, newStatus);
    showSuccess('Queue Updated', `Patient token moved to ${newStatus}.`);
  };

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim() || !walkInComplaint.trim()) {
      showInfo('Incomplete Form', 'Please enter patient name and chief complaint.');
      return;
    }

    const randomSeq = Math.floor(Math.random() * 80) + 20;
    const tokenNumber = `WALK-GEN-${randomSeq}`;

    hospitalService.addToQueue({
      tokenNumber,
      patientId: `pat-walkin-${Date.now()}`,
      patientName: walkInName.trim(),
      patientAge: Number(walkInAge),
      patientGender: walkInGender,
      patientPhone: walkInPhone,
      departmentId: 'dept-gen-med',
      departmentName: walkInDept,
      doctorId: 'doc-01',
      doctorName: 'Dr. Anjali Deshmukh',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: walkInPriority === 'Emergency' ? 'Urgent' : 'Waiting',
      priority: walkInPriority,
      chiefComplaint: walkInComplaint,
      vitalsSnapshot: {
        bp: '120/80',
        pulse: 76,
        spO2: 98,
        temp: 98.6
      }
    });

    setIsAddWalkInOpen(false);
    setWalkInName('');
    setWalkInComplaint('');
    showSuccess('Walk-In Token Added', `Token ${tokenNumber} registered to queue.`);
  };

  const columns: { id: QueueStatus | 'UrgentCol'; title: string; filter: (item: QueueItem) => boolean; color: string; badge: string }[] = [
    {
      id: 'UrgentCol',
      title: '🚨 Urgent / Emergency Triage',
      filter: (item) => item.priority === 'Emergency' || item.status === 'Urgent',
      color: 'border-rose-300 bg-rose-50/40',
      badge: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'Waiting',
      title: '⏳ Waiting in OPD Lobby',
      filter: (item) => item.status === 'Waiting' && item.priority !== 'Emergency',
      color: 'border-amber-200 bg-amber-50/30',
      badge: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'In Consultation',
      title: '🩺 In Doctor Consultation',
      filter: (item) => item.status === 'In Consultation',
      color: 'border-sky-300 bg-sky-50/40',
      badge: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'Completed',
      title: '✅ Completed / Discharged',
      filter: (item) => item.status === 'Completed',
      color: 'border-emerald-200 bg-emerald-50/30',
      badge: 'bg-emerald-100 text-emerald-800'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Live OPD Triage & Patient Queue Board"
        subtitle="Manage real-time outpatient flow, priority triage, and consultation status transitions"
        breadcrumbs={[
          { label: 'Hospital Portal', path: '/hospital' },
          { label: 'Queue Manager' }
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddWalkInOpen(true)}
          >
            Register Walk-In Patient
          </Button>
        }
      />

      {/* Queue Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = queue.filter(col.filter);
          return (
            <div
              key={col.id}
              className={`rounded-2xl border ${col.color} p-4 flex flex-col min-h-[500px] shadow-subtle`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">{col.title}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                  {items.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-subtle space-y-2 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {item.tokenNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.checkInTime}</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {item.patientName}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.patientAge} Yrs, {item.patientGender} • {item.departmentName}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
                        {item.chiefComplaint}
                      </p>

                      {/* Vitals Snapshot if present */}
                      {item.vitalsSnapshot && (
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 bg-slate-100/70 p-1.5 rounded-md font-mono">
                          <span>BP: <strong>{item.vitalsSnapshot.bp}</strong></span>
                          <span>SpO2: <strong>{item.vitalsSnapshot.spO2}%</strong></span>
                          <span>Pulse: <strong>{item.vitalsSnapshot.pulse}</strong></span>
                          <span>Temp: <strong>{item.vitalsSnapshot.temp}°F</strong></span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        {item.status !== 'In Consultation' && item.status !== 'Completed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => handleStatusChange(item.id, 'In Consultation')}
                            leftIcon={<UserCheck className="w-3 h-3" />}
                            className="text-xs py-1"
                          >
                            Call Into OPD
                          </Button>
                        )}

                        {item.status === 'In Consultation' && (
                          <Button
                            variant="success"
                            size="sm"
                            fullWidth
                            onClick={() => handleStatusChange(item.id, 'Completed')}
                            leftIcon={<CheckCircle2 className="w-3 h-3" />}
                            className="text-xs py-1"
                          >
                            Mark Completed
                          </Button>
                        )}

                        {item.status !== 'Urgent' && item.priority !== 'Emergency' && item.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, 'Urgent')}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 text-xs font-semibold"
                            title="Mark Urgent"
                          >
                            🚨
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center text-xs text-slate-400">
                    <span>No patients in this stage</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Walk-In Patient Modal */}
      {isAddWalkInOpen && (
        <Modal
          isOpen={isAddWalkInOpen}
          onClose={() => setIsAddWalkInOpen(false)}
          title="Register Walk-In OPD Patient"
          subtitle="Generate instant registration token and triage assignment"
          maxWidth="md"
        >
          <form onSubmit={handleAddWalkIn} className="space-y-4 text-xs">
            <FormField label="Patient Full Name" required>
              <Input
                placeholder="e.g. Anand K. Bhosale"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Age" required>
                <Input
                  type="number"
                  value={walkInAge}
                  onChange={(e) => setWalkInAge(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Gender">
                <Select
                  value={walkInGender}
                  onChange={(e) => setWalkInGender(e.target.value)}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Contact Mobile">
              <Input
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
              />
            </FormField>

            <FormField label="Target Clinical Department">
              <Select
                value={walkInDept}
                onChange={(e) => setWalkInDept(e.target.value)}
                options={[
                  { value: 'General Medicine', label: 'General Medicine (Room 104)' },
                  { value: 'Cardiology', label: 'Cardiology (Room 202)' },
                  { value: 'Pediatrics & Neonatology', label: 'Pediatrics (Room 108)' },
                  { value: 'Obstetrics & Gynecology', label: 'OBGYN (Room 112)' },
                  { value: 'Orthopedics & Trauma', label: 'Orthopedics (Room 118)' }
                ]}
              />
            </FormField>

            <FormField label="Chief Medical Complaint / Triage Symptoms" required>
              <Input
                placeholder="e.g. Acute abdominal colic with fever..."
                value={walkInComplaint}
                onChange={(e) => setWalkInComplaint(e.target.value)}
              />
            </FormField>

            <FormField label="Triage Priority">
              <Select
                value={walkInPriority}
                onChange={(e) => setWalkInPriority(e.target.value as any)}
                options={[
                  { value: 'Normal', label: 'Normal (Standard queue order)' },
                  { value: 'Senior Citizen', label: 'Senior Citizen (Priority ticket)' },
                  { value: 'Maternal', label: 'Maternal / ANC priority' },
                  { value: 'Emergency', label: 'Emergency / Urgent (Direct doctor bypass)' }
                ]}
              />
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddWalkInOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Generate Token
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
