import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RealHealthcareFacility } from '../../services/realHospitalDiscoveryService';
import { Hospital } from '../../types/hospital';

interface FunctionalHospitalMapProps {
  userCoords: { lat: number; lng: number } | null;
  facilities: (RealHealthcareFacility | Hospital)[];
  activeFacilityId?: string;
  onSelectFacility: (facility: any) => void;
  onBookAppointment: (facility: any) => void;
  locationMode: 'gps' | 'manual' | 'default';
  isDemo?: boolean;
}

export const FunctionalHospitalMap: React.FC<FunctionalHospitalMapProps> = ({
  userCoords,
  facilities,
  activeFacilityId,
  onSelectFacility,
  onBookAppointment,
  locationMode,
  isDemo = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = userCoords 
        ? [userCoords.lat, userCoords.lng] 
        : [28.6139, 77.2090]; // New Delhi / National Center

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const boundsPoints: L.LatLngExpression[] = [];

    // 1. Add User Location Marker
    if (userCoords && userCoords.lat && userCoords.lng) {
      const userLatLng: [number, number] = [userCoords.lat, userCoords.lng];
      boundsPoints.push(userLatLng);

      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(16, 185, 129, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #059669; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const userMarker = L.marker(userLatLng, { icon: userIcon });
      userMarker.bindTooltip(
        isDemo ? 'Simulation Location (Demo)' : 'Your Current Location',
        { permanent: false, direction: 'top', className: 'text-xs font-semibold' }
      );
      userMarker.addTo(markersLayer);
    }

    // 2. Add Facility Markers
    facilities.forEach((fac: any) => {
      const lat = fac.coordinates?.lat;
      const lng = fac.coordinates?.lng;
      if (!lat || !lng) return;

      const latLng: [number, number] = [lat, lng];
      boundsPoints.push(latLng);

      const isActive = fac.id === activeFacilityId;
      const isPublic = fac.facilityType?.includes('Hospital') || fac.facilityType?.includes('Institute') || fac.facilityType?.includes('Government');

      const markerHtml = `
        <div style="
          position: relative;
          width: ${isActive ? '36px' : '30px'};
          height: ${isActive ? '36px' : '30px'};
          border-radius: 50%;
          background: ${isActive ? '#047857' : isPublic ? '#dc2626' : '#2563eb'};
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12M6 12h12"/></svg>
        </div>
      `;

      const hospitalIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker(latLng, { icon: hospitalIcon });

      const distLabel = fac.distanceKm !== undefined ? `${fac.distanceKm.toFixed(1)} km away` : '';
      const addressLabel = fac.address || `${fac.district || ''}, ${fac.state || ''}`;

      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 min-w-[200px] text-xs font-sans space-y-2';

      // Header Container
      const headerDiv = document.createElement('div');
      headerDiv.className = 'border-b border-slate-200 pb-1.5';

      const typeSpan = document.createElement('span');
      typeSpan.className = 'text-[10px] font-bold uppercase tracking-wider text-emerald-700 block';
      typeSpan.textContent = fac.facilityType || 'Healthcare Facility';
      headerDiv.appendChild(typeSpan);

      const nameH4 = document.createElement('h4');
      nameH4.className = 'font-bold text-sm text-slate-900 leading-tight';
      nameH4.textContent = fac.name;
      headerDiv.appendChild(nameH4);

      if (distLabel) {
        const distSpan = document.createElement('span');
        distSpan.className = 'text-xs font-semibold text-emerald-700 mt-0.5 inline-flex items-center gap-1';
        distSpan.innerHTML = '<svg class="w-3 h-3 text-emerald-600 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        distSpan.appendChild(document.createTextNode(distLabel));
        headerDiv.appendChild(distSpan);
      }
      popupContent.appendChild(headerDiv);

      // Address
      const addressP = document.createElement('p');
      addressP.className = 'text-[11px] text-slate-600 leading-snug';
      addressP.textContent = addressLabel;
      popupContent.appendChild(addressP);

      // Contact Number
      if (fac.contactNumber) {
        const contactP = document.createElement('p');
        contactP.className = 'text-[10px] text-slate-500 inline-flex items-center gap-1 mt-0.5';
        contactP.innerHTML = '<svg class="w-3 h-3 text-slate-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
        contactP.appendChild(document.createTextNode(fac.contactNumber));
        popupContent.appendChild(contactP);
      }

      // Action Button
      const btnDiv = document.createElement('div');
      btnDiv.className = 'pt-1.5 flex gap-1.5';
      const selectBtn = document.createElement('button');
      selectBtn.id = `popup-btn-select-${fac.id}`;
      selectBtn.className = 'w-full px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors shadow-sm';
      selectBtn.textContent = 'Book OPD Appointment';
      btnDiv.appendChild(selectBtn);
      popupContent.appendChild(btnDiv);

      marker.bindPopup(popupContent, { maxWidth: 280 });

      marker.on('click', () => {
        onSelectFacility(fac);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-select-${fac.id}`);
        if (btn) {
          btn.onclick = () => {
            onBookAppointment(fac);
          };
        }
      });

      marker.addTo(markersLayer);
    });

    // 3. Auto fit bounds
    if (boundsPoints.length > 0) {
      const bounds = L.latLngBounds(boundsPoints);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [facilities, userCoords, activeFacilityId, isDemo]);

  return (
    <div className="relative w-full h-[300px] sm:h-[420px] rounded-xl overflow-hidden border border-slate-300 shadow-subtle z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Legend Overlay - Responsive for mobile */}
      <div className="absolute bottom-2 left-2 right-2 sm:right-auto bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-md border border-slate-200 text-[10px] sm:text-[11px] text-slate-700 z-[1000] flex items-center justify-around sm:justify-start gap-2.5">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white inline-block"></span>
          <span>You</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-white inline-block"></span>
          <span>Hospitals</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 ring-2 ring-emerald-300 inline-block"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};
