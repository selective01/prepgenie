import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PrepGenie – AI-Powered JAMB Preparation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#0D1B3E",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(245,194,0,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(74,144,217,0.08) 0%, transparent 40%)",
          display: "flex",
        }} />

        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: "#F5C200", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect x="15.2" y="18" width="1.6" height="7" rx="0.8" fill="#0D1B3E"/>
              <rect x="12" y="24.5" width="8" height="1.5" rx="0.75" fill="#0D1B3E"/>
              <path d="M9 18 L13.5 9 L18.5 9 L23 18 Z" fill="#0D1B3E"/>
            </svg>
          </div>
          <span style={{ fontSize: 56, fontWeight: 800, color: "white", letterSpacing: -1 }}>
            Prep<span style={{ color: "#F5C200" }}>Genie</span>
          </span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28, color: "rgba(255,255,255,0.75)",
          letterSpacing: 0.5, marginBottom: 48, display: "flex",
        }}>
          Study Smarter. Pass Faster.
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["AI Tutor", "Smart Quizzes", "Study Plans", "Progress Tracking"].map(f => (
            <div key={f} style={{
              background: "rgba(245,194,0,0.12)",
              border: "1px solid rgba(245,194,0,0.3)",
              borderRadius: 100, padding: "10px 22px",
              fontSize: 18, color: "#F5C200", fontWeight: 600,
              display: "flex",
            }}>{f}</div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 5, background: "#F5C200", display: "flex",
        }} />
      </div>
    ),
    { ...size }
  );
}
