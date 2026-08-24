import React, { useState, useEffect } from 'react';
import { recordService } from '../../services/recordService';
import { patientService } from '../../services/patientService';
import { MedicalRecord, RecordType } from '../../types/records';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  ShieldCheck, 
  Building2, 
  User, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  FileCheck2, 
  Eye, 
  Paperclip,
  ExternalLink,
  Pill,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SearchInput } from '../../components/forms/SearchInput';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuth } from '../../context/AuthContext';

export const PatientRecords: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { showSuccess, showInfo } = useToast();
  const patient = patientService.getPatientForUser(user);

  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    const currentPatient = patientService.getPatientForUser(user);
    setRecords(recordService.getRecordsByPatient(currentPatient.id));
    const unsub = recordService.subscribe((list) => {
      setRecords(list.filter((r) => r.patientId === currentPatient.id));
    });
    return unsub;
  }, [user]);

  const tabs = [
    { id: 'All', label: t.allRecords, count: records.length },
    { id: 'Lab Report', label: t.labReports, count: records.filter((r) => r.recordType === 'Lab Report').length },
    { id: 'Medical Visit', label: t.opdVisits, count: records.filter((r) => r.recordType === 'Medical Visit').length },
    { id: 'Prescription', label: t.prescriptions, count: records.filter((r) => r.recordType === 'Prescription').length },
    { id: 'Radiology / Scan', label: t.scansXRays, count: records.filter((r) => r.recordType === 'Radiology / Scan').length },
    { id: 'Immunization', label: t.immunization, count: records.filter((r) => r.recordType === 'Immunization').length },
  ];

  const filteredRecords = records.filter((rec) => {
    const matchesTab = activeTab === 'All' || rec.recordType === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.diagnosis && rec.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handlePrint = (recTitle: string) => {
    showSuccess('Download Ready', `Simulated printable PDF for "${recTitle}" generated.`);
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.medicalRecordsTitle}
        subtitle={t.ehrSubtitle}
        breadcrumbs={[
          { label: t.portalPatient, path: '/patient' },
          { label: t.navRecords }
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => showInfo('EHR Export', 'Downloading complete consolidated longitudinal health summary...')}
          >
            {t.exportAllRecords}
          </Button>
        }
      />

      {/* Tabs & Search Filter */}
      <div className="space-y-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          variant="underline"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t.searchRecordsPlaceholder}
            />
          </div>
          <span className="text-xs text-slate-500 self-start sm:self-auto">
            {t.showingRecords} <strong className="text-slate-800">{filteredRecords.length}</strong> {t.recordsCount}
          </span>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((rec) => (
            <Card
              key={rec.id}
              hoverEffect
              className="flex flex-col justify-between cursor-pointer border-slate-200 hover:border-health-400"
              onClick={() => setSelectedRecord(rec)}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      variant={
                        rec.recordType === 'Lab Report'
                          ? 'teal'
                          : rec.recordType === 'Prescription'
                          ? 'purple'
                          : rec.recordType === 'Radiology / Scan'
                          ? 'warning'
                          : 'info'
                      }
                      size="sm"
                    >
                      {rec.recordType}
                    </StatusBadge>
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(rec.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>

                <div className="pt-3 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-health-700 leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {rec.summary}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {rec.doctorName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {rec.hospitalName}
                    </span>
                  </div>

                  {rec.diagnosis && (
                    <div className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                      <span className="font-semibold text-slate-700">Diagnosis: </span>
                      <span className="text-slate-600">{rec.diagnosis}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-health-700 font-semibold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {t.viewDetails}
                </span>
                <span className="text-[11px] text-slate-400">
                  {rec.attachments ? `${rec.attachments.length} attachment(s)` : 'EHR Note'}
                </span>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-2 py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">{t.noRecordsFound}</p>
            <p className="text-xs text-slate-400 mt-1">{t.noRecordsFoundDesc}</p>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={selectedRecord.title}
          subtitle={`${selectedRecord.recordType} • ${selectedRecord.hospitalName}`}
          maxWidth="2xl"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedRecord(null)}>
                {t.close}
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => handlePrint(selectedRecord.title)}
              >
                {t.printSavePdf}
              </Button>
            </>
          }
        >
          <div className="space-y-5 text-slate-800">
            {/* Header meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">{t.dateOfService}:</span>
                <span className="font-semibold">{selectedRecord.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{t.treatingDoctor}:</span>
                <span className="font-semibold">{selectedRecord.doctorName}</span>
                <span className="text-[10px] text-slate-400 block">{selectedRecord.doctorRegistrationNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{t.departmentFacility}:</span>
                <span className="font-semibold">{selectedRecord.department}</span>
              </div>
            </div>

            {/* Clinical Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.clinicalOverview}</h4>
              <p className="text-sm text-slate-700 leading-relaxed p-3 rounded-lg bg-slate-50 border border-slate-200">
                {selectedRecord.summary}
              </p>
            </div>

            {/* Findings & Notes */}
            {selectedRecord.findings && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.detailedFindings}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {selectedRecord.findings}
                </p>
              </div>
            )}

            {/* Biomarkers Table if present */}
            {selectedRecord.biomarkers && selectedRecord.biomarkers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>{t.biomarkers}</span>
                  <span className="text-[10px] font-normal text-slate-500">Standard Calibration Units</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold">
                      <tr>
                        <th className="px-3.5 py-2.5">Test Parameter</th>
                        <th className="px-3.5 py-2.5">Observed Value</th>
                        <th className="px-3.5 py-2.5">Reference Range</th>
                        <th className="px-3.5 py-2.5">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selectedRecord.biomarkers.map((b, i) => (
                        <tr key={i} className="hover:bg-slate-50/60">
                          <td className="px-3.5 py-2.5 font-medium text-slate-900">
                            {b.name}
                            {b.nameMarathi && <span className="block text-[10px] text-slate-400">{b.nameMarathi}</span>}
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-800">
                            {b.value} {b.unit}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-500">{b.referenceRange}</td>
                          <td className="px-3.5 py-2.5">
                            <StatusBadge
                              variant={b.status === 'Normal' ? 'success' : b.status === 'High' ? 'warning' : 'error'}
                              size="sm"
                            >
                              {b.status === 'Normal' ? t.normal : b.status}
                            </StatusBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Digital Signature & Verification Hash */}
            <div className="p-3 bg-slate-900 text-slate-300 rounded-xl text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-emerald-400 font-sans font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Digitally Signed ABDM Document
                </span>
                <span className="text-[10px] uppercase">SHA-256 Validated</span>
              </div>
              <div className="text-[10px] text-slate-400 break-all">
                {selectedRecord.digitalSignatureHash}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
