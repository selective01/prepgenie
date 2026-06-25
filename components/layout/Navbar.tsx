"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, User, ChevronDown } from "lucide-react";

function LampLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="14.5" y="24" width="3" height="5" rx="1" fill="var(--navy)" opacity=".8"/>
      <rect x="11" y="28" width="10" height="2" rx="1" fill="var(--navy)" opacity=".8"/>
      <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="var(--navy)" opacity=".9"/>
      <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="var(--yellow)"/>
      <line x1="6" y1="15" x2="26" y2="15" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
      <ellipse cx="16" cy="17" rx="5" ry="1.5" fill="var(--yellow)" opacity=".25"/>
    </svg>
  );
}

const navLinks = [
  { label: "Home",     href: "#home",     dropdown: null },
  {
    label: "Courses", href: "#subjects", dropdown: [
      { label: "English Language",    href: "#subjects" },
      { label: "Mathematics",         href: "#subjects" },
      { label: "Physics",             href: "#subjects" },
      { label: "Chemistry",           href: "#subjects" },
      { label: "Biology",             href: "#subjects" },
      { label: "Economics",           href: "#subjects" },
      { label: "Government",          href: "#subjects" },
      { label: "Literature",          href: "#subjects" },
      { label: "View All Courses →",  href: "/subjects"  },
    ],
  },
  {
    label: "Features", href: "#features", dropdown: [
      { label: "AI Tutor Chat",           href: "#features" },
      { label: "Smart Quiz Generator",    href: "#features" },
      { label: "Personalized Study Plan", href: "#features" },
      { label: "Progress Tracking",       href: "#features" },
      { label: "Past Questions Bank",     href: "#features" },
    ],
  },
  { label: "Pricing", href: "#pricing", dropdown: null },
  {
    label: "Blog", href: "#blog", dropdown: [
      { label: "JAMB Study Guides",       href: "#blog" },
      { label: "Subject Tips & Tricks",   href: "#blog" },
      { label: "Student Success Stories", href: "#blog" },
      { label: "JAMB News & Updates",     href: "#blog" },
    ],
  },
  { label: "Contact", href: "#contact", dropdown: null },
];

function closeAll(
  setMenuOpen: (v: boolean) => void,
  setOpenItem: (v: string | null) => void
) {
  setMenuOpen(false);
  setOpenItem(null);
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleClose = () => closeAll(setMenuOpen, setOpenItem);

  return (
    <>
      {/* ── TOP CONTACT BAR ── */}
      <div style={{ background: "var(--navy)", padding: ".55rem 5%", position: "relative", overflow: "hidden", minHeight: 38, zIndex: 1001 }}>
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0,
          width: "38%",
          background: "var(--yellow)",
          clipPath: "polygon(80px 0%, 100% 0%, 100% 100%, 0% 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", position: "relative", zIndex: 1 }}>

          <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }} className="topbar-left">
            <a href="tel:+2348000000000" style={{ display: "flex", alignItems: "center", gap: ".45rem", color: "rgba(255,255,255,.75)", textDecoration: "none", fontSize: ".8rem", fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--yellow)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.75)")}>
              <Phone size={13} strokeWidth={2}/> +234 800 000 0000
            </a>
            <a href="mailto:hello@prepgenie.ng" style={{ display: "flex", alignItems: "center", gap: ".45rem", color: "rgba(255,255,255,.75)", textDecoration: "none", fontSize: ".8rem", fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--yellow)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.75)")}>
              <Mail size={13} strokeWidth={2}/> hello@prepgenie.ng
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", gap: ".4rem" }} className="topbar-socials">
              {[{ label: "f", href: "#" }, { label: "t", href: "#" }, { label: "in", href: "#" }].map(s => (
                <a key={s.label} href={s.href}
                  style={{ width: 26, height: 26, borderRadius: 4, background: "var(--navy)", color: "var(--yellow)", display: "grid", placeItems: "center", fontSize: ".65rem", fontWeight: 800, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--navy-mid)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--navy)")}>
                  {s.label}
                </a>
              ))}
            </div>

            <div style={{ width: 1, height: 16, background: "rgba(13,27,62,.3)" }} />

            <a href="/login"
              style={{ display: "flex", alignItems: "center", gap: ".4rem", color: "var(--navy)", textDecoration: "none", fontSize: ".8rem", fontWeight: 800, whiteSpace: "nowrap" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = ".7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              <User size={13} strokeWidth={2}/> Login / Register
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: "transparent", marginBottom: -28 }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 98,
          background: "white",
          boxShadow: scrolled ? "0 4px 24px rgba(13,27,62,.10)" : "0 1px 0 var(--border)",
          clipPath: "ellipse(54% 100% at 50% 0%)",
          zIndex: 0, pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 70, background: "white", zIndex: 0, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 5%", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>

          <a href="#home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <LampLogo />
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--navy)" }}>
              Prep<span style={{ color: "var(--yellow-dark)" }}>Genie</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul style={{ display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }} className="nav-desktop">
            {navLinks.map(l => (
              <li key={l.label} style={{ position: "relative" }} className="nav-item">
                <a href={l.href}
                  style={{ display: "flex", alignItems: "center", gap: ".25rem", textDecoration: "none", fontSize: ".88rem", fontWeight: 600, color: "var(--navy)", whiteSpace: "nowrap" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--yellow-dark)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--navy)")}>
                  {l.label}
                  {l.dropdown && <ChevronDown size={13} strokeWidth={2.5} className="nav-chevron"/>}
                </a>

                {l.dropdown && (
                  <div className="nav-dropdown">
                    <div style={{ position: "absolute", top: -6, left: 20, width: 12, height: 12, background: "white", transform: "rotate(45deg)", boxShadow: "-2px -2px 4px rgba(0,0,0,.06)" }}/>
                    {l.dropdown.map(item => {
                      const isViewAll = item.label.startsWith("View All");
                      return (
                        <a key={item.label} href={item.href}
                          style={{
                            display: "block", padding: ".55rem 1.1rem", fontSize: ".84rem",
                            fontWeight: isViewAll ? 700 : 500,
                            color: isViewAll ? "var(--yellow-dark)" : "var(--navy)",
                            textDecoration: "none", whiteSpace: "nowrap", borderRadius: 6,
                            transition: "background .15s",
                            marginTop: isViewAll ? ".3rem" : 0,
                            borderTop: isViewAll ? "1px solid var(--border)" : "none",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--yellow-light)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          {item.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <a href="/signup" className="btn-yellow nav-desktop" style={{ fontSize: ".85rem", padding: ".6rem 1.5rem" }}>
            CONTACT US →
          </a>

          <button
            onClick={() => {
              setMenuOpen(v => !v);
              setOpenItem(null);
            }}
            className="hamburger-btn"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4, zIndex: 1100 }}
            aria-label="Toggle menu">
            {menuOpen ? <X size={24} color="var(--navy)"/> : <Menu size={24} color="var(--navy)"/>}
          </button>
        </div>
      </nav>

      {/* ── MOBILE OVERLAY ── */}
      <div className={`mobile-overlay ${menuOpen ? "mobile-overlay--open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 5%", borderBottom: "1px solid var(--border)" }}>
          <a href="#home" onClick={handleClose} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <LampLogo />
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--navy)" }}>
              Prep<span style={{ color: "var(--yellow-dark)" }}>Genie</span>
            </span>
          </a>
          <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={24} color="var(--navy)"/>
          </button>
        </div>

        <div style={{ background: "var(--navy)", padding: ".6rem 5%", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <a href="tel:+2348000000000" style={{ display: "flex", alignItems: "center", gap: ".4rem", color: "rgba(255,255,255,.75)", textDecoration: "none", fontSize: ".75rem" }}>
            <Phone size={12} strokeWidth={2}/> +234 800 000 0000
          </a>
          <a href="mailto:hello@prepgenie.ng" style={{ display: "flex", alignItems: "center", gap: ".4rem", color: "rgba(255,255,255,.75)", textDecoration: "none", fontSize: ".75rem" }}>
            <Mail size={12} strokeWidth={2}/> hello@prepgenie.ng
          </a>
        </div>

        <div style={{ padding: "0 5%", flex: 1, overflowY: "auto" }}>
          {navLinks.map(l => (
            <div key={l.label}>
              <a
                href={l.dropdown ? undefined : l.href}
                onClick={() => {
                  if (l.dropdown) {
                    setOpenItem(openItem === l.label ? null : l.label);
                  } else {
                    handleClose();
                  }
                }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", color: "var(--navy)", fontWeight: 600, fontSize: "1rem", padding: "1rem 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                {l.label}
                {l.dropdown && (
                  <ChevronDown size={14} strokeWidth={2.5}
                    style={{ transition: "transform .2s", transform: openItem === l.label ? "rotate(180deg)" : "rotate(0deg)" }}/>
                )}
              </a>
              {l.dropdown && openItem === l.label && (
                <div style={{ paddingLeft: "1rem", paddingBottom: ".5rem", marginBottom: ".25rem" }}>
                  {l.dropdown.map(item => (
                    <a key={item.label} href={item.href}
                      onClick={handleClose}
                      style={{ display: "block", padding: ".45rem 0", fontSize: ".88rem", color: "var(--muted)", textDecoration: "none", fontWeight: 500 }}>
                      • {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: "1.2rem 5% 2rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <a href="/login"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".45rem", color: "var(--navy)", textDecoration: "none", fontSize: ".9rem", fontWeight: 700, padding: ".75rem", border: "1.5px solid var(--navy)", borderRadius: 8 }}>
            <User size={15} strokeWidth={2}/> Login / Register
          </a>
          <a href="/signup" className="btn-yellow" style={{ justifyContent: "center", fontSize: ".9rem", padding: ".82rem" }}>
            CONTACT US →
          </a>
        </div>
      </div>

      <style>{`
        @media(max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .topbar-left { display: none !important; }
          .topbar-socials { display: none !important; }
        }
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: white;
          z-index: 1100;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          will-change: transform;
        }
        .mobile-overlay--open {
          transform: translateX(0);
        }
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 2px);
          left: 50%;
          background: white;
          border-radius: 10px;
          padding: .5rem;
          min-width: 200px;
          box-shadow: 0 12px 40px rgba(13,27,62,.14), 0 2px 8px rgba(13,27,62,.08);
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-6px);
          transition: opacity .2s ease, transform .2s ease, visibility .2s;
          pointer-events: none;
          z-index: 200;
        }
        .nav-dropdown::before {
          content: '';
          position: absolute;
          top: -12px;
          left: 0;
          right: 0;
          height: 12px;
        }
        .nav-item:hover .nav-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }
        .nav-item:hover .nav-chevron {
          transform: rotate(180deg);
        }
        .nav-chevron {
          transition: transform .2s ease;
        }
      `}</style>
    </>
  );
}
