"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, BookOpen, MessageSquare, ClipboardList,
  BookMarked, TrendingUp, Settings, LogOut, Menu, X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { label: "Subjects",   href: "/my-subjects", icon: BookOpen        },
  { label: "AI Tutor",   href: "/tutor",      icon: MessageSquare   },
  { label: "Quiz",       href: "/quiz",       icon: ClipboardList   },
  { label: "Study Plan", href: "/study-plan", icon: BookMarked      },
  { label: "Progress",   href: "/progress",   icon: TrendingUp      },
  { label: "Settings",   href: "/settings",   icon: Settings        },
];

const bottomNavItems = [
  { label: "Home",     href: "/dashboard",  icon: LayoutDashboard },
  { label: "Plan",     href: "/study-plan", icon: BookMarked      },
  { label: "Tutor",    href: "/tutor",      icon: MessageSquare   },
  { label: "Stats",    href: "/progress",   icon: TrendingUp      },
  { label: "Settings", href: "/settings",   icon: Settings        },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const initials = user?.name?.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "...";

  // prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="app-sidebar" style={{
        width: 220, minHeight: "100vh", background: "var(--navy)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--navy)", border: "1.5px solid rgba(245,194,0,.3)", display: "grid", placeItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect x="14.5" y="24" width="3" height="5" rx="1" fill="white" opacity=".8"/>
              <rect x="11" y="28" width="10" height="2" rx="1" fill="white" opacity=".8"/>
              <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="white" opacity=".9"/>
              <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="var(--yellow)"/>
              <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
              <ellipse cx="16" cy="17" rx="5" ry="1.5" fill="var(--yellow)" opacity=".25"/>
            </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.15rem", color: "white" }}>
              Prep<span style={{ color: "var(--yellow)" }}>Genie</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.65rem 0.75rem", borderRadius: 8, textDecoration: "none",
                color: active ? "white" : "rgba(255,255,255,.55)",
                background: active ? "rgba(255,255,255,.1)" : "transparent",
                fontWeight: active ? 600 : 500, fontSize: "0.88rem",
                transition: "all .18s",
                borderLeft: active ? "3px solid var(--yellow)" : "3px solid transparent",
              }}>
                <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--yellow)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--navy)" }}>{initials}</span>
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "white", lineHeight: 1.2 }}>{user?.name ?? "User"}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.45)" }}>Free Plan</div>
            </div>
          </div>
          <button onClick={() => { logout(); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,.45)", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>
            <LogOut size={14} strokeWidth={2} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="app-bottom-nav" style={{
        display: "none", position: "fixed", bottom: 0, left: 0, right: 0,
        background: "white", borderTop: "1px solid var(--border)",
        zIndex: 100, padding: "0.5rem 0",
      }}>
        {bottomNavItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, textDecoration: "none", padding: "0.25rem 0",
              color: active ? "var(--navy)" : "var(--muted)",
            }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: "0.65rem", fontWeight: active ? 700 : 400 }}>{label}</span>
            </Link>
          );
        })}

        {/* Menu button — opens full drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "0.25rem 0", background: "none", border: "none", cursor: "pointer",
            color: "var(--muted)",
          }}
        >
          <Menu size={20} strokeWidth={1.8} />
          <span style={{ fontSize: "0.65rem", fontWeight: 400 }}>Menu</span>
        </button>
      </nav>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
            zIndex: 200, display: "none",
          }}
          className="drawer-overlay"
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`app-drawer ${drawerOpen ? "app-drawer--open" : ""}`}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: 260, background: "var(--navy)",
          zIndex: 201, display: "flex", flexDirection: "column",
          transform: "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Drawer header */}
        <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--navy)", border: "1.5px solid rgba(245,194,0,.3)", display: "grid", placeItems: "center" }}>
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <rect x="14.5" y="24" width="3" height="5" rx="1" fill="white" opacity=".8"/>
              <rect x="11" y="28" width="10" height="2" rx="1" fill="white" opacity=".8"/>
              <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="white" opacity=".9"/>
              <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="var(--yellow)"/>
              <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
            </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.05rem", color: "white" }}>
              Prep<span style={{ color: "var(--yellow)" }}>Genie</span>
            </span>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "grid", placeItems: "center" }}
          >
            <X size={20} color="rgba(255,255,255,.6)" strokeWidth={2} />
          </button>
        </div>

        {/* Drawer nav */}
        <nav style={{ flex: 1, padding: "0.85rem 0.75rem", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} onClick={() => setDrawerOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 0.75rem", borderRadius: 8, textDecoration: "none",
                color: active ? "white" : "rgba(255,255,255,.6)",
                background: active ? "rgba(255,255,255,.1)" : "transparent",
                fontWeight: active ? 600 : 500, fontSize: "0.9rem",
                borderLeft: active ? "3px solid var(--yellow)" : "3px solid transparent",
              }}>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer user */}
        <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--yellow)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--navy)" }}>{initials}</span>
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "white" }}>{user?.name ?? "User"}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.45)" }}>Free Plan</div>
            </div>
          </div>
          <button onClick={() => { logout(); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,.45)", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>
            <LogOut size={14} strokeWidth={2} /> Sign Out
          </button>
        </div>
      </div>

      <style>{`
        @media(max-width: 768px) {
          .app-sidebar { display: none !important; }
          .app-bottom-nav { display: flex !important; }
          .drawer-overlay { display: block !important; }
        }
        .app-drawer--open { transform: translateX(0) !important; }
      `}</style>
    </>
  );
}
