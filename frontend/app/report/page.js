"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function ReportPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function locate() {
    setGeoError("");
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setGeoError(err.message || "Could not get your location."),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  useEffect(() => {
    locate();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!file || !coords) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const form = new FormData();
      form.append("photo", file);
      form.append("latitude", coords.lat);
      form.append("longitude", coords.lng);
      const res = await fetch(`${API_URL}/report`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      setResult(data.incident);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="wrap">
      <h1>Report an issue</h1>
      <form onSubmit={submit} className="stack">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          hidden
        />
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          {file ? "Change photo" : "Take or pick a photo"}
        </button>

        {preview && <img src={preview} alt="Preview" className="preview" />}

        <p className="muted">
          {coords
            ? `Location: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
            : geoError || "Getting your location…"}
        </p>
        {geoError && (
          <button type="button" className="btn secondary" onClick={locate}>
            Retry location
          </button>
        )}

        <button className="btn" disabled={!file || !coords || busy}>
          {busy ? "Submitting…" : "Submit report"}
        </button>
      </form>

      {error && <p className="msg err">{error}</p>}
      {result && (
        <p className="msg ok">
          Report submitted: <b>{result.type}</b>, severity <b>{result.severity}</b>.{" "}
          <Link href="/map">See it on the map</Link>
        </p>
      )}
    </main>
  );
}
