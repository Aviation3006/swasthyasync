import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import { useTranslation } from '../../i18n/useTranslation';
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types/appointment';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  User, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Building2, 
  FileText, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, Column } from '../../components/tables/DataTable';
import { useToast } from '../../context/ToastContext';

export const HospitalAppointments: React.FC = () => {
  const { location: userLoc } = useUserLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showSuccess, showInfo } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load hospital appointments
    const list = appointmentService.getHospitalAppointments();
    setAppointments(list);
    const unsub = appointmentService.subscribeAppointments(() => {
      setAppointments(appointmentService.getHospitalAppointments());
    });
    return unsub;
  }, []);

  const departments = ['All', 'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'OB-GYN'];

  const filteredAppointments = appointments.filter((a) => {
    const matchesDept = selectedDept === 'All' || a.department === selectedDept;
    const matchesSearch = 
      (a.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.tokenNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.reason || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleStatusUpdate = (id: string, status: 'In Consultation' | 'Completed' | 'Cancelled') => {
    appointmentService.updateStatus(id, status);
    showSuccess(t.status || 'Status Updated', `Appointment marked as "${status}".`);
  };

  const columns: Column<Appointment>[] = [
    {
      header: t.tokenNumber || 'Token #',
      cell: (a) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
          {a.tokenNumber}
        </span>
      )
    },
    {
      header: t.patientName || 'Patient Details',
      cell: (a) => (
        <div>
          <div className="font-bold text-slate-900">{a.patientName}</div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>{a.age ? `${a.age} ${t.years || 'Yrs'}` : ''} • {a.gender || ''}</span>
            {a.abhaId && <span className="text-emerald-700 font-mono text-[10px]">ABHA: {a.abhaId}</span>}
          </div>
        </div>
      )
    },
    {
      header: t.department || 'Department & Doctor',
      cell: (a) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800">{a.department}</div>
          <div className="text-slate-500">{a.doctorName}</div>
        </div>
      )
    },
    {
      header: t.time || 'Schedule',
      cell: (a) => (
        <div className="text-xs text-slate-600">
          <div>{a.date}</div>
          <div className="font-medium text-slate-800">{a.timeSlot}</div>
        </div>
      )
    },
    {
      header: t.status || 'Status',
      cell: (a) => (
        <StatusBadge
          variant={
            a.status === 'Completed'
              ? 'success'
              : a.status === 'In Consultation'
              ? 'warning'
              : a.status === 'Cancelled'
              ? 'error'
              : 'info'
          }
          size="sm"
        >
          {a.status}
        </StatusBadge>
      )
    },
    {
      header: t.action || 'Actions',
      cell: (a) => (
        <div className="flex items-center gap-1.5">
          {a.status === 'Upcoming' && (
            <Button
              variant="primary"
              size="xs"
              onClick={() => handleStatusUpdate(a.id, 'In Consultation')}
            >
              {t.callIntoOpd || "Call In"}
            </Button>
          )}
          {a.status === 'In Consultation' && (
            <Button
              variant="secondary"
              size="xs"
              leftIcon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              onClick={() => handleStatusUpdate(a.id, 'Completed')}
            >
              {t.statusCompleted || "Complete"}
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.clinicalOpdSchedule || "Clinical OPD Schedule & Appointments"}
        subtitle={t.opdScheduleSubtitle || "Live daily outpatient appointment list with check-in, triage caller, and consultation statuses."}
        breadcrumbs={[
          { label: t.portalHospital || 'Hospital Portal', path: '/hospital' },
          { label: t.navAppointments || 'Appointments' }
        ]}
      />

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPatient || "Search patient, token number..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">{t.filterDepartment || "Filter Department:"}</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? (t.allDepartments || 'All Departments') : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredAppointments}
            keyExtractor={(a) => a.id}
            emptyMessage={t.noAppointmentsFound || "No appointments found matching the current filters."}
          />
        </CardContent>
      </Card>
    </div>
  );
};
