import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import { useTranslation } from '../../i18n/useTranslation';
import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Activity, 
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

interface ReportItem {
  id: string;
  title: string;
  category: 'Epidemic Bulletin' | 'Maternal & Child Health' | 'Bed Utilization' | 'Facility Quality Audit' | 'Immunization Progress';
  date: string;
  author: string;
  fileSize: string;
  status: 'Published' | 'Under Verification' | 'Archived';
  summary: string;
  highlights: string[];
}

export const DistrictReports: React.FC = () => {
  const { location: userLoc } = useUserLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showSuccess } = useToast();
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const reports: ReportItem[] = [
    {
      id: 'REP-2026-W08',
      title: 'Weekly Epidemiological Surveillance Bulletin (Week 8, 2026)',
      category: 'Epidemic Bulletin',
      date: '2026-02-23',
      author: 'District Surveillance Officer (DSO) Pune',
      fileSize: '2.4 MB',
      status: 'Published',
      summary: 'Aggregated IDSP viral fever and vector-borne surveillance data. Noted a 14% drop in Dengue NS1 positivity across Haveli and Khed.',
      highlights: [
        'Total fever cases screened: 14,820 across 28 hospitals and 96 PHCs',
        'Dengue confirmation rate: 4.2% (Down from 5.8% previous week)',
        'Zero cholera or acute diarrheal disease clusters detected'
      ]
    },
    {
      id: 'REP-2026-MCH-Q1',
      title: 'Maternal & Child Health Scorecard & Institutional Delivery Audit',
      category: 'Maternal & Child Health',
      date: '2026-02-15',
      author: 'Chief Medical Officer & District RCH Officer',
      fileSize: '4.1 MB',
      status: 'Published',
      summary: 'Quarterly institutional delivery metrics, high-risk pregnancy tracking, and ANC registration audit across 14 talukas.',
      highlights: [
        'Institutional delivery rate: 99.2% across government and empaneled private facilities',
        'High-Risk Pregnancy (HRP) identification rate reached 18.4% of total registrations',
        '100% IFA supplement distribution completed in all tribal sub-centres'
      ]
    },
    {
      id: 'REP-2026-BED-FEB',
      title: 'District Bed Occupancy & Critical Care Utilization Monthly Review',
      category: 'Bed Utilization',
      date: '2026-02-01',
      author: 'District Health Infrastructure Cell',
      fileSize: '1.8 MB',
      status: 'Published',
      summary: 'Operational review of ICU beds, oxygen availability, and general ward utilization across Aundh DH, Sassoon GH, and 4 SDHs.',
      highlights: [
        'Overall district bed occupancy: 78.4%',
        'Oxygen cylinder and PSA plant reserves at 100% operational capacity',
        'Average patient length of stay: 3.8 days'
      ]
    },
    {
      id: 'REP-2026-IMM-JAN',
      title: 'Universal Immunization Programme (UIP) Monthly Progress Scorecard',
      category: 'Immunization Progress',
      date: '2026-01-28',
      author: 'District Immunization Officer (DIO)',
      fileSize: '3.2 MB',
      status: 'Published',
      summary: 'Comprehensive evaluation of Mission Indradhanush zero-dose child tracking and full immunization coverage (FIC).',
      highlights: [
        'Full Immunization Coverage (FIC) reached 94.2% among infants under 1 year',
        'Measles-Rubella (MR) dose-2 coverage achieved 91.8%',
        'eVIN cold-chain maintenance maintained zero temperature excursion events'
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.districtGovernanceReports || "District Health Governance & Operational Reports"}
        subtitle={t.automatedBulletinsSubtitle || "Automated epidemiological bulletins, institutional audits, and statutory public health scorecards."}
        breadcrumbs={[
          { label: t.portalAdmin || 'District Admin', path: '/district-admin' },
          { label: t.navReports || 'Reports' }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => showSuccess('Download Started', 'Consolidated district health dossier downloading.')}
          >
            {t.downloadConsolidatedBulletin || "Download Consolidated Bulletin (PDF)"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <Card key={r.id} hoverEffect className="flex flex-col justify-between">
            <CardHeader
              icon={<FileText className="w-5 h-5 text-emerald-600" />}
              title={r.title}
              subtitle={`${r.category} • ${r.date}`}
              action={
                <StatusBadge variant="success" size="sm">
                  {r.status}
                </StatusBadge>
              }
            />
            <CardContent className="space-y-4 pt-2 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">{r.summary}</p>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Key Findings:</span>
                {r.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-mono">{r.fileSize} • PDF</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedReport(r)}
                  >
                    {t.view || "View"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5 text-emerald-700" />}
                    onClick={() => showSuccess('Download Dispatched', `Downloading ${r.title}`)}
                  >
                    {t.download || "Download"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={selectedReport.title}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
              <span className="font-bold">{t.authoringBody || "Authoring Body:"} </span>
              <span>{selectedReport.author} ({selectedReport.date})</span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">{t.plainLanguageExplanation || "Executive Overview"}</h4>
              <p className="text-slate-600 leading-relaxed">{selectedReport.summary}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-800">{t.detailedFindings || "Detailed Highlights"}</span>
              {selectedReport.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-700 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                {t.close || "Close"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => {
                  showSuccess('Download Complete', `${selectedReport.title} downloaded.`);
                  setSelectedReport(null);
                }}
              >
                {t.downloadRecord || "Download Full Report"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
