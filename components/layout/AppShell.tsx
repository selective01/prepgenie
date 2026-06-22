import AppSidebar from "@/components/layout/AppSidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell" style={{ display: "flex", minHeight: "100vh", background: "var(--off-white)" }}>
      <AppSidebar />

      {/* Main content — offset by sidebar width on desktop */}
      <main style={{ flex: 1, marginLeft: 220, minHeight: "100vh" }} className="app-main">
        {children}
      </main>

      <style>{`
        @media(max-width: 768px) {
          .app-main {
            margin-left: 0 !important;
            padding-bottom: 80px; /* space for bottom nav */
          }
        }
      `}</style>
    </div>
  );
}
