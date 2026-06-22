"use client";
import { useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import {
  User, Mail, Lock, ChevronRight, CalendarDays,
  Zap, Check, X, Moon, Sun,
  Camera, Trash2, Shield,
} from "lucide-react";

// ── data ─────────────────────────────────────────────────────────────────────

const ALL_SUBJECTS = [
  "Use of English", "Mathematics", "Physics", "Chemistry",
  "Biology", "Economics", "Government", "Literature",
  "History", "Geography", "Commerce", "Accounting",
];

const PLAN_FEATURES = [
  { feature: "Basic Quizzes",              free: "✓",         pro: "✓",           },
  { feature: "AI Tutor Support",           free: "5/day",     pro: "Unlimited",   },
  { feature: "Personalized Study Plan",    free: false,       pro: true,          },
  { feature: "Detailed Performance Analytics", free: false,   pro: true,          },
  { feature: "Daily AI Chats",             free: "5 messages",pro: "Unlimited",   },
  { feature: "Quiz Generation",            free: "2/week",    pro: "Unlimited",   },
];

// ── section wrapper ───────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }} className="settings-section">
      <div>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>{title}</h2>
        {subtitle && <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

// ── toggle switch ─────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
      background: on ? "var(--navy)" : "var(--border)",
      position: "relative", transition: "background .2s", flexShrink: 0,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "white",
        position: "absolute", top: 3,
        left: on ? 23 : 3, transition: "left .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.2)",
      }} />
    </button>
  );
}

// ── input field ───────────────────────────────────────────────────────────────

function Field({ label, value, icon: Icon, readOnly = false, note }: {
  label: string; value: string; icon: React.ElementType;
  readOnly?: boolean; note?: string;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.65rem",
        background: readOnly ? "var(--off-white)" : "white",
        border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
        padding: "0.72rem 0.9rem",
      }}>
        <Icon size={15} color="var(--muted)" strokeWidth={2} />
        <input
          defaultValue={value}
          readOnly={readOnly}
          style={{
            flex: 1, border: "none", background: "transparent", outline: "none",
            fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
            color: readOnly ? "var(--muted)" : "var(--navy)",
          }}
        />
      </div>
      {note && <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4 }}>{note}</p>}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser, logout } = useAuth();

  const [name]                      = useState(user?.name ?? "");
  const [examDate, setExamDate]     = useState(user?.examDate?.split("T")[0] ?? "");
  const [subjects, setSubjects]     = useState<string[]>(user?.subjects ?? []);
  const [notifications, setNotif]   = useState({ email: true, push: true, digest: false });
  const [theme, setTheme]           = useState<"light" | "dark">("light");
  const [showPassForm, setShowPass] = useState(false);

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(examDate).getTime() - new Date().getTime()) / 86400000
  ));

  function toggleSubject(s: string) {
    setSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 860, padding: "2rem 2rem 4rem" }}>

        {/* ── page header ── */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem" }}>
            Settings
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Manage your account preferences and study configurations.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* ── PROFILE ── */}
          <Section title="Profile" subtitle="Update your personal details and how others see you on the platform.">

            {/* avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "var(--yellow)", display: "grid", placeItems: "center",
                  border: "3px solid var(--border)",
                }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--navy)" }}>{user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) ?? "??"}</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 26, height: 26, borderRadius: "50%",
                    background: "var(--navy)", border: "2px solid white",
                    display: "grid", placeItems: "center", cursor: "pointer",
                  }}
                >
                  <Camera size={12} color="white" strokeWidth={2} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: 2 }}>Profile Picture</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.5rem" }}>PNG, JPG or GIF. Max 5MB.</div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", padding: 0 }}>
                    Upload new
                  </button>
                  <button style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", padding: 0 }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <Field label="Display Name"  value={name}                    icon={User} />
            <Field label="Email Address" value={user?.email ?? ""}       icon={Mail} readOnly note="Email cannot be changed after account verification." />

            {/* change password */}
            <button
              onClick={() => setShowPass(v => !v)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "0.75rem 0.9rem",
                background: "var(--off-white)", border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-sm)", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <Lock size={15} color="var(--muted)" strokeWidth={2} />
                <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--navy)" }}>Change Password</span>
              </div>
              <ChevronRight size={16} color="var(--muted)" strokeWidth={2} style={{ transform: showPassForm ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s" }} />
            </button>

            {showPassForm && (
              <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {["Current Password", "New Password", "Confirm New Password"].map(label => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.3rem" }}>{label}</label>
                    <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "0.72rem 0.9rem", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", outline: "none", background: "white", boxSizing: "border-box" }} />
                  </div>
                ))}
                <button style={{ background: "var(--navy)", color: "white", border: "none", borderRadius: 8, padding: "0.7rem 1.5rem", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", alignSelf: "flex-start" }}>
                  Update Password
                </button>
              </div>
            )}
          </Section>

          {/* ── EXAM SETTINGS ── */}
          <Section title="Exam Settings" subtitle="Customise your study focus areas and upcoming milestones.">

            {/* exam date */}
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>
              Target Exam Date
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "white", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.72rem 0.9rem", flex: 1, minWidth: 180 }}>
                <CalendarDays size={15} color="var(--muted)" strokeWidth={2} />
                <input
                  type="date" value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  style={{ border: "none", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "var(--navy)", background: "transparent", flex: 1 }}
                />
              </div>
              {examDate && (
                <span style={{ background: "var(--yellow-light)", color: "var(--yellow-dark)", fontSize: "0.78rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: 20 }}>
                  {daysLeft} Days Remaining
                </span>
              )}
            </div>

            {/* active subjects */}
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>
              Active Study Subjects
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.65rem" }}>
              {ALL_SUBJECTS.map(s => {
                const active = subjects.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSubject(s)}
                    style={{
                      padding: "0.35rem 0.85rem", borderRadius: 20, cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.78rem",
                      border: `1.5px solid ${active ? "var(--yellow-dark)" : "var(--border)"}`,
                      background: active ? "var(--yellow-light)" : "white",
                      color: active ? "var(--navy)" : "var(--muted)",
                      transition: "all .15s",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
              Your AI Tutor and Daily Tasks will be generated based on these subjects.
            </p>
            <button
              onClick={() => updateUser({ subjects, examDate: examDate || undefined })}
              style={{ background: "var(--navy)", color: "white", border: "none", borderRadius: 8, padding: "0.65rem 1.5rem", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
            >
              Save Changes
            </button>
          </Section>

          {/* ── SUBSCRIPTION ── */}
          <Section title="Subscription" subtitle="Manage your plan, billing history, and access premium features.">

            {/* plan badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--off-white)", borderRadius: "var(--radius-sm)", padding: "0.9rem 1rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--yellow)", display: "grid", placeItems: "center" }}>
                  <Zap size={16} color="var(--navy)" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--navy)" }}>PrepGenie Free</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Upgrade to unlock all features</div>
                </div>
              </div>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "var(--navy)", color: "white", padding: "0.2rem 0.6rem", borderRadius: 20 }}>FREE</span>
            </div>

            {/* plan comparison table */}
            <div style={{ marginBottom: "1.25rem", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", background: "var(--off-white)" }}>
                {["Feature", "Free", "Premium"].map((h, i) => (
                  <div key={h} style={{ padding: "0.65rem 1rem", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: i === 2 ? "var(--yellow-dark)" : "var(--muted)" }}>
                    {h}
                  </div>
                ))}
              </div>
              {PLAN_FEATURES.map(({ feature, free, pro }, i) => (
                <div key={feature} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "white" : "var(--off-white)" }}>
                  <div style={{ padding: "0.75rem 1rem", fontSize: "0.84rem", color: "var(--navy)", fontWeight: 500 }}>{feature}</div>
                  <div style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center" }}>
                    {free === false
                      ? <X size={14} color="#ef4444" strokeWidth={2.5} />
                      : free === true
                      ? <Check size={14} color="#22c55e" strokeWidth={2.5} />
                      : <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{free}</span>
                    }
                  </div>
                  <div style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center" }}>
                    {pro === false
                      ? <X size={14} color="#ef4444" strokeWidth={2.5} />
                      : pro === true
                      ? <Check size={14} color="#22c55e" strokeWidth={2.5} />
                      : <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)" }}>{pro}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            <button style={{
              width: "100%", padding: "0.82rem", background: "var(--yellow)", color: "var(--navy)",
              border: "none", borderRadius: 10, fontFamily: "'DM Sans',sans-serif",
              fontWeight: 800, fontSize: "0.95rem", cursor: "pointer",
            }}>
              Upgrade to PrepGenie Pro
            </button>
          </Section>

          {/* ── PREFERENCES ── */}
          <Section title="Preferences" subtitle="Control your notification settings and application theme.">

            {/* notifications */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.75rem" }}>Notifications</div>
              {[
                { key: "email",  label: "Email Notifications",      desc: "Receive study reminders and progress reports in your inbox." },
                { key: "push",   label: "Desktop Push",              desc: "Get real-time alerts for scheduled study sessions."          },
                { key: "digest", label: "Weekly Performance Digest", desc: "A summary of your weakest areas and streak milestones."       },
              ].map(({ key, label, desc }) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 0", borderBottom: "1px solid var(--border)", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--navy)", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{desc}</div>
                  </div>
                  <Toggle
                    on={notifications[key as keyof typeof notifications]}
                    onChange={() => setNotif(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                  />
                </div>
              ))}
            </div>

            {/* app appearance */}
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.75rem" }}>App Appearance</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {/* light mode */}
                <button
                  onClick={() => setTheme("light")}
                  style={{
                    padding: "1.25rem", borderRadius: "var(--radius-sm)", cursor: "pointer",
                    border: `2px solid ${theme === "light" ? "var(--yellow-dark)" : "var(--border)"}`,
                    background: theme === "light" ? "var(--yellow-xlight)" : "var(--off-white)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
                    transition: "all .18s",
                  }}
                >
                  <Sun size={24} color={theme === "light" ? "var(--yellow-dark)" : "var(--muted)"} strokeWidth={1.8} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: theme === "light" ? "var(--yellow-dark)" : "var(--muted)" }}>Light Mode</span>
                </button>

                {/* dark mode (coming soon) */}
                <div style={{ position: "relative" }}>
                  <button
                    disabled
                    style={{
                      width: "100%", padding: "1.25rem", borderRadius: "var(--radius-sm)",
                      border: "2px solid var(--border)", background: "#e5e7eb",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
                      cursor: "not-allowed", opacity: 0.7,
                    }}
                  >
                    <Moon size={24} color="var(--muted)" strokeWidth={1.8} />
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--muted)" }}>Dark Mode</span>
                  </button>
                  <span style={{ position: "absolute", top: 8, right: 8, background: "var(--yellow)", color: "var(--navy)", fontSize: "0.6rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: 4 }}>
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* ── DANGER ZONE ── */}
          <div style={{ paddingTop: "0.5rem", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: "0.5rem" }}>
              <Shield size={13} color="var(--muted)" strokeWidth={2} />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Secure Configuration Environment
              </span>
            </div>
            <button onClick={() => { if (confirm("Are you sure? This cannot be undone.")) logout(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Trash2 size={14} strokeWidth={2} /> Delete my PrepGenie Account
            </button>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.85rem" }}>
              PrepGenie v2.4.1 (Stable Build)<br />
              © 2024 PrepGenie Technologies Ltd.
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media(max-width: 700px) {
          .settings-section {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
