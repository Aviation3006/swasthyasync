import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FileText, Download, Eye, CheckCircle2, Search, Filter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const HospitalReports: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const sampleReports = [
    {
      id: 'REP-CBC-109',
      title: 'Complete Blood Count (CBC) Diagnostic Panel',
      patient: 'Rameshwar Patil (ABHA: 91-0492-1192-4412)',
      date: '2026-02-27',
      facility: 'Aundh District Hospital Central Laboratory',
      status: 'ABDM Verified',
      summary: 'Hemoglobin: 14.2 g/dL (Normal). Platelet count: 240,000 /mcL (Normal). WBC: 7,200 /mcL.',
      parameters: [
        { name: 'Hemoglobin', value: '14.2 g/dL', range: '13.0 - 17.0 g/dL', status: 'Normal' },
        { name: 'Total WBC Count', value: '7,200 /mcL', range: '4,000 - 11,000 /mcL', status: 'Normal' },
        { name: 'Platelets', value: '240,000 /mcL', range: '150,000 - 450,000 /mcL', status: 'Normal' },
      ]
    },
    {
      id: 'REP-LIP-204',
      title: 'Lipid Profile & Cardiovascular Biomarkers',
      patient: 'Sunita Sharma (ABHA: 91-8841-3920-5591)',
      date: '2026-02-25',
      facility: 'District Hospital Pathology Department',
      status: 'ABDM Verified',
      summary: 'Total Cholesterol: 185 mg/dL. HDL: 48 mg/dL. LDL: 110 mg/dL. Triglycerides: 135 mg/dL.',
      parameters: [
        { name: 'Total Cholesterol', value: '185 mg/dL', range: '< 200 mg/dL', status: 'Normal' },
        { name: 'HDL Cholesterol', value: '48 mg/dL', range: '> 40 mg/dL', status: 'Optimal' },
        { name: 'LDL Cholesterol', value: '110 mg/dL', range: '< 100 mg/dL', status: 'Borderline' },
      ]
    }
  ];

  const filtered = sampleReports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.diagnosticRepositoryTitle || "Diagnostic & Pathology Reports Repository"}
        subtitle={t.diagnosticRepositorySubtitle || "Review, verify, and digitally authorize clinical laboratory investigations and imaging scans."}
        breadcrumbs={[
          { label: t.portalHospital || 'Hospital Portal', path: '/hospital' },
          { label: t.navDiagnosticReports || 'Diagnostic Reports' }
        ]}
      />

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchRecordsPlaceholder || "Search diagnostic records, tests..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(r => (
              <Card key={r.id} hoverEffect className="flex flex-col justify-between">
                <CardHeader
                  icon={<FileText className="w-5 h-5 text-sky-600" />}
                  title={r.title}
                  subtitle={`${r.patient} • ${r.date}`}
                  action={<StatusBadge variant="success" size="sm">{t.verifiedAbdm || "ABDM Verified"}</StatusBadge>}
                />
                <CardContent className="space-y-3 pt-2">
                  <p className="text-xs text-slate-600">{r.summary}</p>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="xs"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedReport(r)}
                    >
                      {t.view || "Review"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => showSuccess('Report Dispatched', `Downloading ${r.title}`)}
                    >
                      {t.download || "Download"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={selectedReport.title}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
              <span className="font-bold text-sky-900 block mb-0.5">{selectedReport.patient}</span>
              <span className="text-sky-700 text-[11px]">{selectedReport.facility}</span>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">{t.clinicalSummary || "Clinical Diagnostic Summary"}</h4>
              <p className="text-slate-600 leading-relaxed">{selectedReport.summary}</p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="p-2.5 text-left">{t.key || "Parameter"}</th>
                    <th className="p-2.5 text-left">{t.observedValue || "Observed"}</th>
                    <th className="p-2.5 text-left">{t.referenceRange || "Ref Range"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedReport.parameters.map((p: any, i: number) => (
                    <tr key={i}>
                      <td className="p-2.5 font-medium text-slate-800">{p.name}</td>
                      <td className="p-2.5 font-bold text-slate-900">{p.value}</td>
                      <td className="p-2.5 text-slate-500">{p.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                {t.close || "Close"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
