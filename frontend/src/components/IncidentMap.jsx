import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, MapPin, ShieldAlert, AlertCircle } from 'lucide-react';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored markers based on incident severity
const getMarkerIcon = (severity) => {
  const color = 
    severity === 'critical' ? '#dc2626' :
    severity === 'high' ? '#ea580c' :
    severity === 'medium' ? '#ca8a04' : '#16a34a';

  const html = `
    <div style="
      background-color: ${color};
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-pin',
    html: html,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
};

// Component to dynamically re-center map when location changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function IncidentMap({ incidents = [], selectedLocation, onSelectLocation }) {
  const defaultCenter = [12.9716, 77.5946]; // Default to Bangalore center

  const center = selectedLocation && selectedLocation.lat
    ? [selectedLocation.lat, selectedLocation.lng]
    : incidents.length > 0 && incidents[0].latitude
    ? [incidents[0].latitude, incidents[0].longitude]
    : defaultCenter;

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={center} />

        {incidents.map((incident) => {
          if (!incident.latitude || !incident.longitude) return null;
          return (
            <Marker 
              key={incident.id} 
              position={[incident.latitude, incident.longitude]} 
              icon={getMarkerIcon(incident.severity)}
            >
              <Popup>
                <div style={{ minWidth: '160px', padding: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <AlertTriangle size={14} color="#e11d48" />
                    <strong style={{ textTransform: 'capitalize' }}>
                      {incident.type?.replace('_', ' ') || 'Incident'}
                    </strong>
                  </div>
                  <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#475569' }}>
                    {incident.address || `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`}
                  </p>
                  <div style={{ marginTop: '6px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: incident.severity === 'critical' ? '#dc2626' : '#d97706' }}>
                      {incident.severity?.toUpperCase()}
                    </span>
                    <span style={{ color: '#94a3b8' }}>{incident.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

