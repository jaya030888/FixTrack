"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { API_URL } from "@/lib/api";

const COLORS = { low: "#22c55e", medium: "#eab308", high: "#ef4444", critical: "#ef4444" };

function Fit({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length) {
      map.fitBounds(
        points.map((p) => [p.latitude, p.longitude]),
        { padding: [40, 40], maxZoom: 15 }
      );
    }
  }, [points, map]);
  return null;
}

export default function MapView() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/incidents`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load incidents"))))
      .then(setIncidents)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      {error && (
        <div className="msg err" style={{ position: "absolute", zIndex: 1000, top: 8, left: 8 }}>
          {error}
        </div>
      )}
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Fit points={incidents} />
        {incidents.map((i) => (
          <CircleMarker
            key={i.id}
            center={[i.latitude, i.longitude]}
            radius={11}
            pathOptions={{
              color: "#fff",
              weight: 2,
              fillColor: COLORS[i.severity] || COLORS.medium,
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <b>{i.type}</b> ({i.severity})
                <br />
                Status: {i.status}
                <br />
                Confirmed: {i.confirmed_count}
                {i.photo && (
                  <img src={i.photo} alt={i.type} style={{ width: "100%", marginTop: 6, borderRadius: 6 }} />
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
