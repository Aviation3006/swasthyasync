import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Activity, 
  Eye, 
  Filter 
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

interface ReportItem {
  id: string;
  title: string;
  category: 'Epidemiology' | 'Hospital Performance' | 'Maternal & Child Health' | 'Supply & Inventory';
  period: 'Weekly' | 'Monthly' | 'Quarterly';
  generatedDate: string;
  summary: string;
  author: string;
}

export const DistrictReports: React.FC = () => {
  const { location: userLoc } = useUserLocation();
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  const reportsList: ReportItem[] = [
    {
      id: 'rep-01',
      title: 'Weekly Epidemiological Surveillance Bulletin - Week 34 (August 2026)',
      category: 'Epidemiology',
      period: 'Weekly',
      generatedDate: '2026-08-22',
      summary: 'Surveillance of acute vector-borne clusters in Haveli and Khed talukas. Dengue NS1 positivity increased by 8.4%. Water sample bacteriological testing completed across 140 villages.',
      author: `District Epidemiologist & IDSP Unit, ${userLoc?.district || 'District'}`
    },
    {
      id: 'rep-02',
      title: 'Comprehensive Hospital Bed Occupancy & Critical Care Utilization Review',
      category: 'Hospital Performance',
      period: 'Monthly',
      generatedDate: '2026-08-15',
      summary: 'Detailed operational audit of 28 empaneled hospitals. Average general bed turnover rate is 3.8 days. Sassoon General Hospital reached 93.3% ICU bed occupancy.',
      author: `District Hospital Cell, ${userLoc?.district || 'District'} Health Administration`
    },
    {
      id: 'rep-03',
      title: 'Maternal & Child Health (MCH) Scorecard & Janani Suraksha Yojana Audit',
      category: 'Maternal & Child Health',
      period: 'Monthly',
      generatedDate: '2026-08-10',
      summary: `Institutional delivery rate achieved 99.4% across ${userLoc?.district || 'the'} district. Pregnant women received specialized ANC checkups under PMSMA drives.`,
      author: 'Child Health & RCH Officer'
    },
    {
      id: 'rep-04',
      title: 'District Essential Medicine Depot & Vaccine Buffer Stock Status',
      category: 'Supply & Inventory',
      period: 'Weekly',
      generatedDate: '2026-08-21',
      summary: 'Analysis of 180 essential drug formulations. Buffer stock transfer of Anti-Rabies Immunoglobulin (400 vials) dispatched to Baramati depot.',
      author: 'Central District Pharmacy Depot'
    }
  ];

  const filteredReports = reportsList.filter((r) => {
    if (activeTab === 'All') return true;
    return r.category === activeTab;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="District Health Governance & Operational Reports"
        subtitle="Automated epidemiological bulletins, institutional audits, and statutory public health scorecards"
        breadcrumbs={[
          { label: 'District Admin', path: '/district-admin' },
          { label: 'Reports' }
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => showSuccess('Export Generated', 'District health bulletin archive downloaded.')}
          >
            Download Consolidated Bulletin
          </Button>
        }
      />

      <Tabs
        tabs={[
          { id: 'All', label: 'All Reports', count: reportsList.length },
          { id: 'Epidemiology', label: 'Epidemiology (IDSP)', count: reportsList.filter((r) => r.category === 'Epidemiology').length },
          { id: 'Hospital Performance', label: 'Hospital Performance', count: reportsList.filter((r) => r.category === 'Hospital Performance').length },
          { id: 'Maternal & Child Health', label: 'Maternal & Child (RCH)', count: reportsList.filter((r) => r.category === 'Maternal & Child Health').length },
          { id: 'Supply & Inventory', label: 'Medicine & Stock', count: reportsList.filter((r) => r.category === 'Supply & Inventory').length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((r) => (
          <Card
            key={r.id}
            hoverEffect
            className="flex flex-col justify-between cursor-pointer border-slate-200 hover:border-health-400"
            onClick={() => setSelectedReport(r)}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <StatusBadge
                  variant={
                    r.category === 'Epidemiology'
                      ? 'error'
                      : r.category === 'Hospital Performance'
                      ? 'info'
                      : r.category === 'Maternal & Child Health'
                      ? 'success'
                      : 'warning'
                  }
                  size="sm"
                >
                  {r.category}
                </StatusBadge>
                <span className="text-xs text-slate-500 font-medium">Generated: {r.generatedDate}</span>
              </div>

              <div className="pt-3 space-y-2">
                <h3 className="text-base font-bold text-slate-900 leading-snug">{r.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{r.summary}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Authoring Body: <strong>{r.author}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-health-700 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Read Full Bulletin
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{r.period} Digest</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={selectedReport.title}
          subtitle={`Issued by ${selectedReport.author} on ${selectedReport.generatedDate}`}
          maxWidth="2xl"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print Report
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 bg-slate-50 border rounded-xl space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[10px] block">Executive Summary</span>
              <p className="text-xs leading-relaxed text-slate-800">{selectedReport.summary}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold uppercase text-slate-900 text-[11px]">Key Governance Highlights & Directives:</h4>
              <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                <li>Active surveillance teams deployed across all 14 Taluka health headquarters.</li>
                <li>Daily bed occupancy and stock inventories synced with State Integrated Health Management Portal.</li>
                <li>ASHA and Anganwadi community workers instructed to conduct doorstep screening in high-risk zones.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
