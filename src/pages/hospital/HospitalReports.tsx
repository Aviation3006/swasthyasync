import React, { useState, useEffect } from 'react';
import { recordService } from '../../services/recordService';
import { MedicalRecord } from '../../types/records';
import { useToast } from '../../context/ToastContext';
import { 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Printer, 
  UserCheck, 
  Building2, 
  Calendar,
  Filter
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Modal } from '../../components/common/Modal';
import { Tabs } from '../../components/common/Tabs';

export const HospitalReports: React.FC = () => {
  const { showSuccess } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>(recordService.getAllRecords());
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Lab' | 'Radiology'>('All');

  useEffect(() => {
    const unsub = recordService.subscribe((list) => setRecords(list));
    return unsub;
  }, []);

  const handleVerifyReport = (recId: string) => {
    showSuccess('Report Verified & Signed', 'Document has been stamped with your digital signature.');
    if (selectedRecord && selectedRecord.id === recId) {
      setSelectedRecord({ ...selectedRecord, isVerified: true });
    }
  };

  const filteredRecords = records.filter((r) => {
    if (activeTab === 'Lab') return r.recordType === 'Lab Report';
    if (activeTab === 'Radiology') return r.recordType === 'Radiology / Scan';
    return true;
  });

  const columns: Column<MedicalRecord>[] = [
    {
      header: 'Report Title / Date',
      cell: (r) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 leading-snug">{r.title}</div>
          <div className="text-xs text-slate-500">{r.date} • {r.department}</div>
        </div>
      )
    },
    {
      header: 'Patient ID',
      cell: (r) => (
        <span className="font-mono text-xs font-semibold text-slate-700">{r.patientId}</span>
      )
    },
    {
      header: 'Category',
      cell: (r) => (
        <StatusBadge
          variant={r.recordType === 'Lab Report' ? 'teal' : r.recordType === 'Radiology / Scan' ? 'warning' : 'neutral'}
          size="sm"
        >
          {r.recordType}
        </StatusBadge>
      )
    },
    {
      header: 'Verification',
      cell: (r) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" /> ABDM Verified
        </span>
      )
    },
    {
      header: 'Action',
      className: 'text-right',
      cell: (r) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRecord(r);
          }}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Review
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Diagnostic & Pathology Reports Repository"
        subtitle="Review, verify, and digitally authorize clinical laboratory investigations and imaging scans"
        breadcrumbs={[
          { label: 'Hospital Portal', path: '/hospital' },
          { label: 'Diagnostic Reports' }
        ]}
      />

      <Tabs
        tabs={[
          { id: 'All', label: 'All Diagnostic Reports', count: records.length },
          { id: 'Lab', label: 'Pathology & Biochemistry', count: records.filter((r) => r.recordType === 'Lab Report').length },
          { id: 'Radiology', label: 'Radiology & Scans', count: records.filter((r) => r.recordType === 'Radiology / Scan').length }
        ]}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
        variant="underline"
      />

      <DataTable
        data={filteredRecords}
        columns={columns}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Search reports by title, patient, or department..."
        onRowClick={(r) => setSelectedRecord(r)}
      />

      {/* Review Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={selectedRecord.title}
          subtitle={`Patient ID: ${selectedRecord.patientId} • Date: ${selectedRecord.date}`}
          maxWidth="2xl"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserCheck className="w-4 h-4" />}
                onClick={() => handleVerifyReport(selectedRecord.id)}
              >
                Sign Off & Authorize
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border rounded-xl">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">Clinical Summary</span>
              <p className="text-slate-800 text-xs mt-1 leading-relaxed">{selectedRecord.summary}</p>
            </div>

            {selectedRecord.biomarkers && (
              <div className="border rounded-xl overflow-hidden">
                <table className="min-w-full divide-y text-xs text-left">
                  <thead className="bg-slate-50 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Parameter</th>
                      <th className="p-2.5">Observed</th>
                      <th className="p-2.5">Ref Range</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {selectedRecord.biomarkers.map((b, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-bold">{b.name}</td>
                        <td className="p-2.5 font-bold">{b.value} {b.unit}</td>
                        <td className="p-2.5 text-slate-500">{b.referenceRange}</td>
                        <td className="p-2.5">
                          <StatusBadge variant={b.status === 'Normal' ? 'success' : 'warning'} size="sm">
                            {b.status}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
