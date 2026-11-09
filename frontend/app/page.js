"use client";

import dynamic from "next/dynamic";

const FixTrackApp = dynamic(() => import("../src/App"), {
  ssr: false,
  loading: () => (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily: "system-ui, sans-serif"
    }}>
      <p>Loading FixTrack Platform...</p>
    </div>
  ),
});

export default function Home() {
  return <FixTrackApp />;
}
