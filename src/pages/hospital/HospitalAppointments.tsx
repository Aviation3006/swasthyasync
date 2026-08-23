import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { hospitalService } from '../../services/hospitalService';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { 
  Calendar, 
  Clock, 
  Search, 
  User, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Filter,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Tabs } from '../../components/common/Tabs';
import { useToast } from '../../context/ToastContext';

export const HospitalAppointments: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentService.getAllAppointments());
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  useEffect(() => {
    const unsub = appointmentService.subscribe((list) => setAppointments(list));
    return unsub;
  }, []);

  const handleUpdateStatus = (apptId: string, newStatus: AppointmentStatus) => {
    appointmentService.updateStatus(apptId, newStatus);
    showSuccess('Status Updated', `Appointment marked as "${newStatus}".`);
  };

  const tabs = [
    { id: 'All', label: 'All OPD Bookings', count: appointments.length },
    { id: 'Upcoming', label: 'Upcoming', count: appointments.filter((a) => a.status === 'Upcoming').length },
    { id: 'Checked In', label: 'Checked In', count: appointments.filter((a) => a.status === 'Checked In').length },
    { id: 'In Consultation', label: 'In Consultation', count: appointments.filter((a) => a.status === 'In Consultation').length },
    { id: 'Completed', label: 'Completed', count: appointments.filter((a) => a.status === 'Completed').length },
    { id: 'Cancelled', label: 'Cancelled', count: appointments.filter((a) => a.status === 'Cancelled').length }
  ];

  const filteredAppointments = appointments.filter((a) => {
    const matchesTab = activeTab === 'All' || a.status === activeTab;
    const matchesDept = selectedDept === 'All' || a.departmentName === selectedDept;
    return matchesTab && matchesDept;
  });

  const columns: Column<Appointment>[] = [
    {
      header: 'Token / Date',
      cell: (a) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-health-100 text-health-900 border border-health-200">
            {a.tokenNumber}
          </span>
          <div className="text-xs text-slate-500 font-medium pt-1">
            {a.date} ({a.timeSlot})
          </div>
        </div>
      )
    },
    {
      header: 'Patient Details',
      cell: (a) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900">{a.patientName}</div>
          <div className="text-xs text-slate-500">{a.patientPhone}</div>
          <div className="text-[11px] text-slate-400 italic line-clamp-1">Reason: {a.reason}</div>
        </div>
      )
    },
    {
      header: 'Doctor & Department',
      cell: (a) => (
        <div className="space-y-0.5">
          <div className="font-semibold text-slate-900 text-xs">{a.doctorName}</div>
          <div className="text-xs text-slate-500">{a.departmentName}</div>
          <div className="text-[10px] text-slate-400">{a.roomNumber || 'OPD Room 104'}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (a) => (
        <StatusBadge
          variant={
            a.status === 'Upcoming'
              ? 'info'
              : a.status === 'Checked In'
              ? 'warning'
              : a.status === 'In Consultation'
              ? 'urgent'
              : a.status === 'Completed'
              ? 'success'
              : 'error'
          }
          size="sm"
        >
          {a.status}
        </StatusBadge>
      )
    },
    {
      header: 'Triage Actions',
      className: 'text-right',
      cell: (a) => (
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          {a.status === 'Upcoming' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateStatus(a.id, 'Checked In')}
              leftIcon={<UserCheck className="w-3 h-3 text-amber-600" />}
            >
              Check In
            </Button>
          )}

          {a.status === 'Checked In' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleUpdateStatus(a.id, 'In Consultation')}
              leftIcon={<Stethoscope className="w-3 h-3" />}
            >
              Start Visit
            </Button>
          )}

          {a.status === 'In Consultation' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleUpdateStatus(a.id, 'Completed')}
              leftIcon={<CheckCircle2 className="w-3 h-3" />}
            >
              Complete
            </Button>
          )}

          {a.status !== 'Completed' && a.status !== 'Cancelled' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50"
              onClick={() => handleUpdateStatus(a.id, 'Cancelled')}
            >
              No Show
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Clinical OPD Schedule & Appointments"
        subtitle="Live daily outpatient appointment list with check-in, triage caller, and consultation statuses"
        breadcrumbs={[
          { label: 'Hospital Portal', path: '/hospital' },
          { label: 'Appointments' }
        ]}
      />

      <div className="space-y-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">Filter Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 bg-white shadow-subtle"
            >
              <option value="All">All Departments</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics & Neonatology">Pediatrics</option>
              <option value="Obstetrics & Gynecology">OBGYN</option>
              <option value="Orthopedics & Trauma">Orthopedics</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={filteredAppointments}
          columns={columns}
          keyExtractor={(a) => a.id}
          searchPlaceholder="Search by patient name, phone, doctor, or token..."
        />
      </div>
    </div>
  );
};
