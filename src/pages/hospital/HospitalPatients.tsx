import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
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
  const { t } = useTranslation();
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
      header: t.citizenPatientTab || 'Citizen / Patient',
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
      header: t.ageGender || 'Age / Gender',
      cell: (p) => (
        <span className="text-xs text-slate-700 font-medium">
          {p.age} {t.years || 'Yrs'} / {p.gender}
        </span>
      )
    },
    {
      header: t.bloodGroup || 'Blood Group',
      cell: (p) => (
        <span className="inline-flex items-center gap-1 font-bold text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
          <Droplet className="w-3 h-3 text-rose-600" /> {p.bloodGroup}
        </span>
      )
    },
    {
      header: t.taluka || 'Location / Taluka',
      cell: (p) => (
        <div className="text-xs text-slate-600">
          <div>{p.address?.district || p.address?.taluka || 'District'}</div>
          <div className="text-[10px] text-slate-400">{p.address?.state || p.address?.village || 'India'}</div>
        </div>
      )
    },
    {
      header: t.chronicCareRegimen || 'Chronic Care',
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
      header: t.action || 'Actions',
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
          {t.viewMedicalRecords || "View EHR"}
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.patientDirectoryTitle || "Patient 360° EHR Directory"}
        subtitle={t.patientDirectorySubtitle || "Search and review comprehensive electronic longitudinal health records across healthcare facilities."}
        breadcrumbs={[
          { label: t.portalHospital || 'Hospital Portal', path: '/hospital' },
          { label: t.navPatientDirectory || 'Patient Directory' }
        ]}
      />

      {/* Patients Table */}
      <DataTable
        data={patients}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder={t.searchPatient || "Search by patient name, ABHA ID, mobile, or taluka..."}
        onRowClick={handleSelectPatient}
      />

      {/* Detailed Patient EHR Modal / Drawer */}
      {selectedPatient && (
        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`${selectedPatient.name} — ${t.careSetuRecordTitle || "Longitudinal EHR"}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveDrawerTab('overview')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  activeDrawerTab === 'overview' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.clinicalOverview || "Overview"}
              </button>
              <button
                onClick={() => setActiveDrawerTab('records')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  activeDrawerTab === 'records' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.navRecords || "Records"} ({patientRecords.length})
              </button>
              <button
                onClick={() => setActiveDrawerTab('prescriptions')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  activeDrawerTab === 'prescriptions' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.navPrescriptions || "Prescriptions"} ({patientPrescriptions.length})
              </button>
            </div>

            {activeDrawerTab === 'overview' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">{t.bloodGroup || "Blood Group"}</span>
                    <span className="font-bold text-rose-700">{selectedPatient.bloodGroup}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">{t.bloodPressure || "Blood Pressure"}</span>
                    <span className="font-bold text-slate-800">{selectedPatient.vitals?.bloodPressure || '120/80'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">{t.heartRate || "Heart Rate"}</span>
                    <span className="font-bold text-slate-800">{selectedPatient.vitals?.heartRate || '74'} bpm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">ABHA ID</span>
                    <span className="font-mono font-bold text-slate-800 text-[10px] truncate block">{selectedPatient.abhaId}</span>
                  </div>
                </div>

                {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                    <div className="font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>{t.criticalAllergyAlert || "CRITICAL ALLERGY ALERT / CONTRAINDICATION:"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-5">
                      {selectedPatient.allergies.map((al, idx) => (
                        <span key={idx} className="font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded text-[11px]">
                          {al.substance} ({al.severity})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeDrawerTab === 'records' && (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {patientRecords.length > 0 ? (
                  patientRecords.map((rec) => (
                    <div key={rec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{rec.title}</span>
                        <span className="text-slate-400 text-[10px]">{rec.date}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{rec.summary}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400">{t.noMedicalRecordsOnFile || "No medical records on file."}</div>
                )}
              </div>
            )}

            {activeDrawerTab === 'prescriptions' && (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {patientPrescriptions.length > 0 ? (
                  patientPrescriptions.map((px) => (
                    <div key={px.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{px.diagnosis}</span>
                        <span className="text-slate-400 text-[10px]">{px.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {px.medications.map((m) => `${m.medicineName} (${m.dosage})`).join(', ')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400">{t.noPrescriptionsRecorded || "No prescriptions recorded."}</div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                {t.close || "Close"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
