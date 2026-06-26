"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Notification = {
  id: string;
  type: "info" | "success" | "warning";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_ICON = {
  info:    <Info size={15} color="#4a90d9" />,
  success: <CheckCircle size={15} color="#22c55e" />,
  warning: <AlertTriangle size={15} color="#f59e0b" />,
};

const TYPE_BG = {
  info:    "#eff6ff",
  success: "#f0fdf4",
  warning: "#fffbeb",
};

export default function NotificationsPanel() {
  const { token } = useAuth();
  const [open, setOpen]   = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function fetchNotifications() {
    const t = token || localStorage.getItem("pg_token");
    if (!t) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/notifications`, { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (data.success) {
        setNotifs(data.notifications);
        setUnread(data.unread);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(prev => !prev);
    if (!open) fetchNotifications();
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  }

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "0.4rem", display: "grid", placeItems: "center", borderRadius: 8 }}
      >
        <Bell size={20} color="var(--navy)" strokeWidth={2} />
        {unread > 0 && (
          <span style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, borderRadius: "50%", background: "#ef4444", color: "white", fontSize: "0.6rem", fontWeight: 700, display: "grid", placeItems: "center", fontFamily: "'DM Sans',sans-serif" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 0.5rem)", right: 0,
          width: 360, maxHeight: 480, overflowY: "auto",
          background: "white", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,.14)", border: "1px solid var(--border)",
          zIndex: 999,
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1rem", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "white", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)", fontFamily: "'DM Sans',sans-serif" }}>
              Notifications {unread > 0 && <span style={{ fontSize: "0.72rem", background: "#ef4444", color: "white", borderRadius: 20, padding: "1px 6px", marginLeft: 6 }}>{unread}</span>}
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#4a90d9", fontSize: "0.75rem", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "grid", placeItems: "center", padding: 2 }}>
                <X size={16} color="#6b7280" />
              </button>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280", fontSize: "0.85rem" }}>Loading...</div>
          ) : notifs.length === 0 ? (
            <div style={{ padding: "2.5rem 1rem", textAlign: "center" }}>
              <Bell size={32} color="#d1d5db" style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: 0 }}>No notifications yet</p>
            </div>
          ) : (
            notifs.map(n => (
              <div key={n.id} style={{
                padding: "0.85rem 1rem", borderBottom: "1px solid var(--border)",
                background: n.read ? "white" : TYPE_BG[n.type],
                transition: "background .2s",
              }}>
                <div style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                  <div style={{ marginTop: 2, flexShrink: 0 }}>{TYPE_ICON[n.type]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.4, fontFamily: "'DM Sans',sans-serif" }}>{n.message}</div>
                    <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 4 }}>{timeAgo(n.time)}</div>
                  </div>
                  {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4a90d9", flexShrink: 0, marginTop: 4 }} />}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
