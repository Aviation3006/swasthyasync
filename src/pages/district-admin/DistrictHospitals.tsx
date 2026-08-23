import { useAuth } from '../../context/AuthContext';
import { useUserLocation } from '../../context/UserLocationContext';
import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospitalService';
import { Hospital, FacilityType } from '../../types/hospital';
import { 
  Building2, 
  Search, 
  MapPin, 
  PhoneCall, 
  Bed, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Users
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Modal } from '../../components/common/Modal';
import { Tabs } from '../../components/common/Tabs';

export const DistrictHospitals: React.FC = () => {
  const { location: userLoc } = useUserLocation();
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>(hospitalService.getAllHospitals());
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedTaluka, setSelectedTaluka] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    const unsub = hospitalService.subscribeHospitals((list) => setHospitals(list));
    return unsub;
  }, []);

  const talukas = ['All', 'Haveli', 'Baramati', 'Shirur', 'Junnar', 'Khed', 'Maval'];

  const filteredHospitals = hospitals.filter((h) => {
    const matchesTaluka = selectedTaluka === 'All' || h.taluka === selectedTaluka;
    const matchesType = activeTab === 'All' || h.facilityType === activeTab;
    return matchesTaluka && matchesType;
  });

  const columns: Column<Hospital>[] = [
    {
      header: 'Hospital Name / Location',
      cell: (h) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 leading-snug">{h.name}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {h.taluka || h.district || "Local Area"}, {userLoc?.district || "District"}
          </div>
        </div>
      )
    },
    {
      header: 'Facility Type',
      cell: (h) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {h.facilityType}
        </span>
      )
    },
    {
      header: 'Bed Occupancy',
      cell: (h) => {
        const total = h.beds.generalTotal + h.beds.icuTotal + h.beds.oxygenTotal;
        const occupied = h.beds.generalOccupied + h.beds.icuOccupied + h.beds.oxygenOccupied;
        const pct = Math.round((occupied / total) * 100);

        return (
          <div className="space-y-1 min-w-[120px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">{occupied}/{total} Beds</span>
              <span className={pct > 85 ? 'text-rose-600 font-bold' : 'text-slate-600'}>{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${pct > 85 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: 'ICU Saturation',
      cell: (h) => (
        <span className="text-xs font-mono font-bold text-slate-800">
          {h.beds.icuOccupied} / {h.beds.icuTotal}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (h) => (
        <StatusBadge
          variant={h.operationalStatus === 'Normal' ? 'success' : 'warning'}
          size="sm"
        >
          {h.operationalStatus}
        </StatusBadge>
      )
    },
    {
      header: 'Action',
      className: 'text-right',
      cell: (h) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedHospital(h);
          }}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Inspect
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="District Hospital & Facility Network"
        subtitle={`Operational bed monitoring, doctor allocation and infrastructure capacity across ${userLoc?.district || "the district"}`}
        breadcrumbs={[
          { label: 'District Admin', path: '/district-admin' },
          { label: 'Hospitals' }
        ]}
      />

      <div className="space-y-4">
        <Tabs
          tabs={[
            { id: 'All', label: 'All Facilities', count: hospitals.length },
            { id: 'District Hospital', label: 'District Hospitals', count: hospitals.filter((h) => h.facilityType === 'District Hospital').length },
            { id: 'Sub-District Hospital', label: 'Sub-District Hospitals', count: hospitals.filter((h) => h.facilityType === 'Sub-District Hospital').length },
            { id: 'Rural Hospital', label: 'Rural Hospitals', count: hospitals.filter((h) => h.facilityType === 'Rural Hospital').length },
            { id: 'Community Health Centre (CHC)', label: 'CHCs', count: hospitals.filter((h) => h.facilityType === 'Community Health Centre (CHC)').length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Filter by Taluka:</span>
          <select
            value={selectedTaluka}
            onChange={(e) => setSelectedTaluka(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1 bg-white text-slate-800"
          >
            {talukas.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All Talukas' : `${t} Taluka`}</option>
            ))}
          </select>
        </div>

        <DataTable
          data={filteredHospitals}
          columns={columns}
          keyExtractor={(h) => h.id}
          searchPlaceholder="Search facility by name, location, or department..."
          onRowClick={(h) => setSelectedHospital(h)}
        />
      </div>

      {/* Hospital Inspection Modal */}
      {selectedHospital && (
        <Modal
          isOpen={!!selectedHospital}
          onClose={() => setSelectedHospital(null)}
          title={selectedHospital.name}
          subtitle={`${selectedHospital.facilityType} • ${selectedHospital.taluka} Taluka`}
          maxWidth="2xl"
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedHospital(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 border rounded-xl space-y-1">
              <span className="text-slate-500 block">Address & Helpline:</span>
              <p className="font-bold text-slate-900">{selectedHospital.address}</p>
              <p className="text-health-800 font-medium">Emergency: {selectedHospital.emergencyHelpline}</p>
            </div>

            {/* Bed Breakdown */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-2">Bed Capacity Breakdown</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-white border rounded-lg">
                  <span className="text-[10px] text-slate-500">General Beds</span>
                  <div className="font-bold text-slate-900">{selectedHospital.beds.generalOccupied} / {selectedHospital.beds.generalTotal}</div>
                </div>
                <div className="p-2.5 bg-white border rounded-lg">
                  <span className="text-[10px] text-slate-500">ICU Beds</span>
                  <div className="font-bold text-amber-700">{selectedHospital.beds.icuOccupied} / {selectedHospital.beds.icuTotal}</div>
                </div>
                <div className="p-2.5 bg-white border rounded-lg">
                  <span className="text-[10px] text-slate-500">Oxygen Beds</span>
                  <div className="font-bold text-sky-700">{selectedHospital.beds.oxygenOccupied} / {selectedHospital.beds.oxygenTotal}</div>
                </div>
                <div className="p-2.5 bg-white border rounded-lg">
                  <span className="text-[10px] text-slate-500">Maternity Beds</span>
                  <div className="font-bold text-emerald-700">{selectedHospital.beds.maternityOccupied} / {selectedHospital.beds.maternityTotal}</div>
                </div>
              </div>
            </div>

            {/* Departments */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-2">Departments & OPD Load</h4>
              <div className="space-y-1.5">
                {selectedHospital.departments.map((d) => (
                  <div key={d.id} className="p-2.5 bg-slate-50 border rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{d.name}</span>
                      <span className="text-slate-500 text-[11px] block">Head: {d.headDoctor}</span>
                    </div>
                    <span className="font-semibold text-health-800 bg-health-50 px-2 py-0.5 rounded border border-health-200">
                      {d.waitingQueueCount} Waiting in Queue
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
