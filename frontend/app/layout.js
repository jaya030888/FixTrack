import { Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../src/index.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "FixTrack · HerHack 2026",
  description: "Women's safety, SafeWalk guardian, SOS, and civic incident radar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: "var(--font-sans), 'Space Grotesk', sans-serif" }}>{children}</body>
    </html>
  );
}
