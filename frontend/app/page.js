import Link from "next/link";

export default function Home() {
  return (
    <main className="wrap">
      <h1>HerHack</h1>
      <p>Report civic hazards and see them on the map.</p>
      <nav className="row">
        <Link className="btn" href="/report">Report an issue</Link>
        <Link className="btn secondary" href="/map">View map</Link>
      </nav>
    </main>
  );
}
