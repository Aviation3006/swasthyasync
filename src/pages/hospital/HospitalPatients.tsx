import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { recordService } from '../../services/recordService';
import { prescriptionService } from '../../services/prescriptionService';
import { Patient } from '../../types/patient';
import { MedicalRecord } from '../../types/records';
import { Prescription } from '../../types/prescriptions';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Droplet, 
  Heart, 
  Activity, 
  FileText, 
  Pill, 
  Calendar, 
  Plus, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Stethoscope,
  MapPin,
  Clock
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Modal } from '../../components/common/Modal';
import { Tabs } from '../../components/common/Tabs';
import { useToast } from '../../context/ToastContext';

export const HospitalPatients: React.FC = () => {
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>(patientService.getAllPatients());
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([]);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'overview' | 'records' | 'prescriptions'>('overview');

  useEffect(() => {
    const unsub = patientService.subscribe((list) => setPatients(list));
    return unsub;
  }, []);

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setPatientRecords(recordService.getRecordsByPatient(p.id));
    setPatientPrescriptions(prescriptionService.getPrescriptionsByPatient(p.id));
    setActiveDrawerTab('overview');
  };

  const columns: Column<Patient>[] = [
    {
      header: 'Citizen / Patient',
      cell: (p) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            {p.name}
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xs text-slate-500 font-mono">{p.abhaId}</div>
        </div>
      )
    },
    {
      header: 'Age / Gender',
      cell: (p) => (
        <span className="text-xs text-slate-700 font-medium">
          {p.age} Yrs / {p.gender}
        </span>
      )
    },
    {
      header: 'Blood Group',
      cell: (p) => (
        <span className="inline-flex items-center gap-1 font-bold text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
          <Droplet className="w-3 h-3 text-rose-600" /> {p.bloodGroup}
        </span>
      )
    },
    {
      header: 'Location / Taluka',
      cell: (p) => (
        <div className="text-xs text-slate-600">
          <div>{p.address?.district || p.address?.taluka || 'District'}</div>
          <div className="text-[10px] text-slate-400">{p.address?.state || p.address?.village || 'India'}</div>
        </div>
      )
    },
    {
      header: 'Chronic Care',
      cell: (p) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {p.chronicConditions && p.chronicConditions.map((c) => (
            <span key={c.id} className="text-[10px] px-2 py-0.5 rounded bg-health-50 text-health-800 font-medium border border-health-200">
              {c.name}
            </span>
          ))}
          {(!p.chronicConditions || p.chronicConditions.length === 0) && <span className="text-xs text-slate-400">None</span>}
        </div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (p) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleSelectPatient(p);
          }}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View EHR
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Patient 360° EHR Directory"
        subtitle="Search and review comprehensive electronic longitudinal health records across healthcare facilities"
        breadcrumbs={[
          { label: 'Hospital Portal', path: '/hospital' },
          { label: 'Patient Directory' }
        ]}
      />

      {/* Patients Table */}
      <DataTable
        data={patients}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Search by patient name, ABHA ID, mobile, or taluka..."
        onRowClick={handleSelectPatient}
      />

      {/* Detailed Patient EHR Modal / Drawer */}
      {selectedPatient && (
        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`EHR 360°: ${selectedPatient.name}`}
          subtitle={`ABHA ID: ${selectedPatient.abhaId} • ${selectedPatient.age} Yrs (${selectedPatient.gender})`}
          maxWidth="4xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500">
                Scheme: <strong>{selectedPatient.activeScheme}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Pill className="w-4 h-4" />}
                  onClick={() => {
                    setSelectedPatient(null);
                    navigate('/hospital/prescriptions');
                  }}
                >
                  Write Prescription (Rx)
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Tabs */}
            <Tabs
              tabs={[
                { id: 'overview', label: 'Clinical Overview & Vitals' },
                { id: 'records', label: `Medical Records (${patientRecords.length})` },
                { id: 'prescriptions', label: `Prescriptions (${patientPrescriptions.length})` }
              ]}
              activeTab={activeDrawerTab}
              onChange={(t) => setActiveDrawerTab(t as any)}
              variant="pills"
            />

            {/* TAB 1: Clinical Overview */}
            {activeDrawerTab === 'overview' && (
              <div className="space-y-4">
                {/* Allergy Warning Alert */}
                {selectedPatient.allergies.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-700">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      CRITICAL ALLERGY ALERT / CONTRAINDICATION:
                    </div>
                    <ul className="list-disc pl-5 text-rose-800 space-y-0.5">
                      {selectedPatient.allergies.map((a) => (
                        <li key={a.id}>
                          <strong>{a.substance}</strong> ({a.severity}) - Reaction: {a.reaction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Vitals Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Recorded Clinical Vitals
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 uppercase">Blood Pressure</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{selectedPatient.vitals.bloodPressure}</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 uppercase">Fasting Sugar</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{selectedPatient.vitals.bloodSugarFasting} mg/dL</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 uppercase">Heart Rate</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{selectedPatient.vitals.heartRate} bpm</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 uppercase">SpO2 Oxygen</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{selectedPatient.vitals.spO2}%</div>
                    </div>
                  </div>
                </div>

                {/* Chronic Conditions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Chronic Conditions & Care Plans
                  </h4>
                  <div className="space-y-2">
                    {selectedPatient.chronicConditions.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900">{c.name}</h5>
                          <StatusBadge variant="info" size="sm">{c.status}</StatusBadge>
                        </div>
                        <p className="text-slate-600">Treating Physician: {c.treatingDoctor} ({c.hospital})</p>
                        {c.notes && <p className="text-slate-500 italic mt-1">Clinical Notes: {c.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demographics & Contact */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Mobile Phone:</span>
                    <span className="font-bold">{selectedPatient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Emergency Contact:</span>
                    <span className="font-bold">{selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.phone})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Address:</span>
                    <span className="font-bold">{selectedPatient.address.village}, {selectedPatient.address.taluka}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Medical Records */}
            {activeDrawerTab === 'records' && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {patientRecords.length > 0 ? (
                  patientRecords.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <StatusBadge variant="teal" size="sm">{r.recordType}</StatusBadge>
                        <span className="text-xs text-slate-500">{r.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{r.title}</h4>
                      <p className="text-xs text-slate-600">{r.summary}</p>
                      <div className="text-[11px] text-slate-400">
                        {r.doctorName} • {r.hospitalName} ({r.department})
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">No medical records on file.</div>
                )}
              </div>
            )}

            {/* TAB 3: Prescriptions */}
            {activeDrawerTab === 'prescriptions' && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {patientPrescriptions.length > 0 ? (
                  patientPrescriptions.map((rx) => (
                    <div key={rx.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-health-800">{rx.prescriptionNumber}</span>
                        <StatusBadge variant="success" size="sm">{rx.dispensingStatus}</StatusBadge>
                      </div>
                      <p className="text-xs text-slate-700"><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                      <div className="text-xs space-y-1 pt-1 border-t">
                        {rx.medications.map((m) => (
                          <div key={m.id} className="flex items-center justify-between text-slate-700">
                            <span>• {m.medicineName} ({m.dosage})</span>
                            <span className="text-slate-500 font-mono text-[11px]">{m.frequency} • {m.durationDays}d</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1 border-t">
                        Prescribed by {rx.doctorName} on {rx.date}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">No prescriptions recorded.</div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
