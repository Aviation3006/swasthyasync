import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import { patientService } from '../../services/patientService';
import { Prescription, MedicationItem } from '../../types/prescriptions';
import { Patient } from '../../types/patient';
import { useToast } from '../../context/ToastContext';
import { 
  Pill, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  AlertCircle, 
  Search, 
  FileText,
  Clock,
  User
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Modal } from '../../components/common/Modal';

export const HospitalPrescriptions: React.FC = () => {
  const { user } = useAuth();
  const { location: userLoc, facility } = useUserLocation();
  const { showSuccess, showInfo, showError } = useToast();
  const allPatients = patientService.getAllPatients();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(prescriptionService.getAllPrescriptions());
  const [selectedPatientId, setSelectedPatientId] = useState<string>(allPatients[0]?.id || 'pat-mh-001');
  const [diagnosis, setDiagnosis] = useState('Type 2 Diabetes Mellitus & Primary Hypertension Follow-up');
  const [chiefComplaint, setChiefComplaint] = useState('Quarterly routine checkup and glycemic refill');
  const [generalAdvice, setGeneralAdvice] = useState('Maintain low-sodium and low-glycemic diet. 45 min brisk walking.');
  const [followUpDate, setFollowUpDate] = useState('2026-11-20');

  // Dynamic Medication Items
  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: 'm-1',
      medicineName: 'Metformin Sustained Release',
      genericName: 'Metformin Hydrochloride IP',
      dosage: '500 mg',
      form: 'Tablet',
      frequency: '1-0-1 (Morning & Night)',
      timing: 'After Food',
      durationDays: 90,
      instructions: 'Take immediately after breakfast and dinner.'
    },
    {
      id: 'm-2',
      medicineName: 'Telmisartan',
      genericName: 'Telmisartan IP',
      dosage: '40 mg',
      form: 'Tablet',
      frequency: '1-0-0 (Morning)',
      timing: 'Before Food',
      durationDays: 90,
      instructions: 'Take in the morning with plain water.'
    }
  ]);

  // Current Patient preview
  const currentPatient = allPatients.find((p) => p.id === selectedPatientId) || allPatients[0];

  // Prescription preview modal
  const [previewRx, setPreviewRx] = useState<Prescription | null>(null);

  useEffect(() => {
    const unsub = prescriptionService.subscribe((list) => setPrescriptions(list));
    return unsub;
  }, []);

  const handleAddMedication = () => {
    const newMed: MedicationItem = {
      id: `m-${Date.now()}`,
      medicineName: 'Pantoprazole',
      genericName: 'Pantoprazole Sodium IP',
      dosage: '40 mg',
      form: 'Tablet',
      frequency: '1-0-0 (Morning)',
      timing: 'Empty Stomach',
      durationDays: 14,
      instructions: 'Take 30 mins before morning breakfast.'
    };
    setMedications([...medications, newMed]);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleMedChange = (id: string, field: keyof MedicationItem, value: any) => {
    setMedications(
      medications.map((m) => {
        if (m.id === id) {
          return { ...m, [field]: value };
        }
        return m;
      })
    );
  };

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || medications.length === 0) {
      showError('Incomplete Rx', 'Please specify a clinical diagnosis and at least one prescribed medication.');
      return;
    }

    // Check for known allergy contraindication warning
    const allergyMatch = currentPatient.allergies.some((a) =>
      medications.some((m) => m.medicineName.toLowerCase().includes(a.substance.toLowerCase().split(' ')[0]))
    );

    if (allergyMatch) {
      showError('Allergy Contraindication!', 'One of the prescribed drugs matches the patient’s documented severe allergy.');
      return;
    }

    const newRx = prescriptionService.createPrescription({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientAge: currentPatient.age,
      patientGender: currentPatient.gender,
      doctorId: 'doc-01',
      doctorName: user?.name || 'Dr. Medical Officer',
      doctorRegistrationNo: user?.professionalProfile?.registrationNumber || 'MCI-REG-2026-001',
      hospitalId: 'hosp-pune-01',
      hospitalName: facility?.facilityName || user?.facilityName || 'Healthcare Facility',
      department: facility?.department || 'General Medicine',
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      chiefComplaint,
      medications,
      generalAdvice,
      followUpDate,
      dispensingStatus: 'Pending'
    });

    showSuccess('Digital Prescription Issued', `Prescription #${newRx.prescriptionNumber} generated & sent to generic pharmacy.`);
    setPreviewRx(newRx);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Clinical Digital Prescription (Rx) Builder"
        subtitle="Issue digitally signed e-prescriptions integrated with ABDM and Fair Price Generic Pharmacy counters"
        breadcrumbs={[
          { label: 'Hospital Portal', path: '/hospital' },
          { label: 'Prescriptions' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prescription Builder Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader
              title="Issue Digital Prescription"
              subtitle={`${user?.name || "Dr. Medical Officer"} • ${facility?.facilityName || user?.facilityName || "Healthcare Facility"} (${facility?.department || "General Medicine"})`}
              icon={<Pill className="w-5 h-5 text-health-600" />}
            />
            <CardContent>
              <form onSubmit={handleIssuePrescription} className="space-y-5">
                {/* Patient Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Select Patient" required>
                    <Select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      options={allPatients.map((p) => ({
                        value: p.id,
                        label: `${p.name} (${p.abhaId})`
                      }))}
                    />
                  </FormField>

                  <FormField label="Consultation Date">
                    <Input
                      type="date"
                      value={new Date().toISOString().split('T')[0]}
                      disabled
                    />
                  </FormField>
                </div>

                {/* Patient Safety & Allergy Check Alert */}
                {currentPatient && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        {currentPatient.name} • {currentPatient.age} Yrs, {currentPatient.gender} (Blood Group: {currentPatient.bloodGroup})
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">{currentPatient.abhaId}</span>
                    </div>

                    {currentPatient.allergies.length > 0 && (
                      <div className="text-rose-700 flex items-center gap-1 font-semibold pt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Allergy Alert: {currentPatient.allergies.map((a) => a.substance).join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Chief Complaint & Clinical Diagnosis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Chief Complaint" required>
                    <Input
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      placeholder="e.g. High morning sugar, dry mouth..."
                    />
                  </FormField>

                  <FormField label="Clinical Diagnosis" required>
                    <Input
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Type 2 Diabetes Mellitus Stage 2..."
                    />
                  </FormField>
                </div>

                {/* Medications List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Prescribed Drug Regimen ({medications.length})
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddMedication}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Add Medication
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {medications.map((med, idx) => (
                      <div
                        key={med.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-health-800">
                            Drug #{idx + 1}
                          </span>
                          {medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedication(med.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                              aria-label="Remove drug"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <FormField label="Medicine / Brand Name" required>
                            <Input
                              value={med.medicineName}
                              onChange={(e) => handleMedChange(med.id, 'medicineName', e.target.value)}
                              placeholder="e.g. Metformin SR"
                            />
                          </FormField>

                          <FormField label="Dosage">
                            <Input
                              value={med.dosage}
                              onChange={(e) => handleMedChange(med.id, 'dosage', e.target.value)}
                              placeholder="e.g. 500 mg"
                            />
                          </FormField>

                          <FormField label="Form">
                            <Select
                              value={med.form}
                              onChange={(e) => handleMedChange(med.id, 'form', e.target.value as any)}
                              options={[
                                { value: 'Tablet', label: 'Tablet' },
                                { value: 'Capsule', label: 'Capsule' },
                                { value: 'Syrup', label: 'Syrup' },
                                { value: 'Injection', label: 'Injection' },
                                { value: 'Ointment', label: 'Ointment' },
                                { value: 'Drops', label: 'Drops' }
                              ]}
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <FormField label="Frequency Timetable">
                            <Select
                              value={med.frequency}
                              onChange={(e) => handleMedChange(med.id, 'frequency', e.target.value)}
                              options={[
                                { value: '1-0-1 (Morning & Night)', label: '1-0-1 (Morning & Night)' },
                                { value: '1-0-0 (Morning)', label: '1-0-0 (Morning Only)' },
                                { value: '0-0-1 (Night)', label: '0-0-1 (Night Only)' },
                                { value: '1-1-1 (Three Times)', label: '1-1-1 (Three Times a Day)' },
                                { value: 'SOS (When Needed)', label: 'SOS (Only When Pain/Fever persists)' }
                              ]}
                            />
                          </FormField>

                          <FormField label="Food Timing">
                            <Select
                              value={med.timing}
                              onChange={(e) => handleMedChange(med.id, 'timing', e.target.value as any)}
                              options={[
                                { value: 'After Food', label: 'After Food' },
                                { value: 'Before Food', label: 'Before Food' },
                                { value: 'Empty Stomach', label: 'Empty Stomach' },
                                { value: 'With Food', label: 'With Food' }
                              ]}
                            />
                          </FormField>

                          <FormField label="Duration (Days)">
                            <Input
                              type="number"
                              value={med.durationDays}
                              onChange={(e) => handleMedChange(med.id, 'durationDays', Number(e.target.value))}
                            />
                          </FormField>
                        </div>

                        <FormField label="Special Instructions for Pharmacist & Patient">
                          <Input
                            value={med.instructions || ''}
                            onChange={(e) => handleMedChange(med.id, 'instructions', e.target.value)}
                            placeholder="e.g. Do not crush tablet; take with plain water..."
                          />
                        </FormField>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Advice & Follow-Up */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Lifestyle & Dietary Advice">
                    <Input
                      value={generalAdvice}
                      onChange={(e) => setGeneralAdvice(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Next Follow-up Consultation Date">
                    <Input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                  </FormField>
                </div>

                {/* Digital Signature & Issue Button */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Digitally signed by Dr. Anjali Deshmukh (MMC-2004/08/3120)</span>
                  </div>

                  <Button type="submit" variant="primary" size="md" leftIcon={<Pill className="w-4 h-4" />}>
                    Issue & Sign Prescription
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recently Issued Prescriptions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader
              title="Recent Prescriptions"
              subtitle="Hospital Pharmacy Outbox"
              icon={<Clock className="w-5 h-5 text-health-600" />}
            />
            <CardContent>
              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    onClick={() => setPreviewRx(rx)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-health-400 cursor-pointer shadow-subtle space-y-1.5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-health-900">{rx.prescriptionNumber}</span>
                      <StatusBadge variant={rx.dispensingStatus === 'Dispensed' ? 'success' : 'warning'} size="sm">
                        {rx.dispensingStatus}
                      </StatusBadge>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900">{rx.patientName}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{rx.diagnosis}</p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t flex justify-between">
                      <span>{rx.medications.length} drug(s)</span>
                      <span>{rx.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prescription Preview Modal */}
      {previewRx && (
        <Modal
          isOpen={!!previewRx}
          onClose={() => setPreviewRx(null)}
          title="Digital Prescription Slip"
          subtitle={`Prescription #${previewRx.prescriptionNumber}`}
          maxWidth="2xl"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setPreviewRx(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print Rx Copy
              </Button>
            </>
          }
        >
          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 text-xs">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">{previewRx.hospitalName}</h3>
                <p className="text-xs text-slate-500">Empaneled Healthcare Clinical Network</p>
                <p className="text-xs font-semibold text-health-800 mt-1">
                  Doctor: {previewRx.doctorName} ({previewRx.doctorRegistrationNo})
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-health-900 text-sm block">{previewRx.prescriptionNumber}</span>
                <span className="text-slate-500">Date: {previewRx.date}</span>
              </div>
            </div>

            {/* Patient Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50 rounded-lg text-slate-700">
              <div>Patient: <strong>{previewRx.patientName}</strong></div>
              <div>Age/Gender: <strong>{previewRx.patientAge} / {previewRx.patientGender}</strong></div>
              <div>Dept: <strong>{previewRx.department}</strong></div>
              <div>Status: <strong>{previewRx.dispensingStatus}</strong></div>
            </div>

            <div className="text-slate-800">
              <div><strong>Chief Complaint:</strong> {previewRx.chiefComplaint}</div>
              <div><strong>Diagnosis:</strong> {previewRx.diagnosis}</div>
            </div>

            {/* Rx Drug Table */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">℞ Prescribed Medicines</h4>
              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2">Medicine</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Timing</th>
                      <th className="p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {previewRx.medications.map((m, i) => (
                      <tr key={i}>
                        <td className="p-2 font-bold text-slate-900">
                          {m.medicineName}
                          {m.instructions && <div className="text-[10px] text-slate-500 font-normal">{m.instructions}</div>}
                        </td>
                        <td className="p-2">{m.dosage}</td>
                        <td className="p-2 font-mono">{m.frequency}</td>
                        <td className="p-2">{m.timing}</td>
                        <td className="p-2">{m.durationDays} Days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Advice & Sign */}
            <div className="pt-3 border-t border-slate-200 flex items-end justify-between">
              <div className="space-y-1">
                <div><strong>General Advice:</strong> {previewRx.generalAdvice || 'Take rest and drink clean boiled water.'}</div>
                <div><strong>Follow Up:</strong> {previewRx.followUpDate || 'SOS'}</div>
              </div>
              <div className="text-right">
                <div className="w-24 h-8 border-b border-dashed border-slate-400 mb-1" />
                <span className="text-[10px] text-slate-500 block font-mono">{previewRx.doctorName}</span>
                <span className="text-[9px] text-emerald-600 font-bold block">✓ ABDM Verified Digital Sign</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
