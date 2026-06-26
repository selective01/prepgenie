"use client";
import { useState, useRef, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  User, Mail, Lock, ChevronRight, CalendarDays,
  Check, X, Bell, Moon, Sun,
  Camera, Trash2, Shield, ArrowLeft,
} from "lucide-react";

// ── data ─────────────────────────────────────────────────────────────────────

const ALL_SUBJECTS = [
  "Use of English", "Mathematics", "Physics", "Chemistry",
  "Biology", "Economics", "Government", "Literature",
  "History", "Geography", "Commerce", "Accounting",
];

const PLAN_FEATURES = [
  { feature: "Basic Quizzes",                  free: "✓",          pro: "✓"         },
  { feature: "AI Tutor Support",               free: "5/day",      pro: "Unlimited" },
  { feature: "Personalized Study Plan",        free: false,        pro: true        },
  { feature: "Detailed Performance Analytics", free: false,        pro: true        },
  { feature: "Daily AI Chats",                 free: "5 messages", pro: "Unlimited" },
  { feature: "Quiz Generation",                free: "2/week",     pro: "Unlimited" },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function LampIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <rect x="14.5" y="24" width="3" height="5" rx="1" fill="currentColor" opacity=".8"/>
      <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="currentColor" opacity=".9"/>
      <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="currentColor"/>
      <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
    </svg>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
      background: on ? "var(--navy)" : "var(--border)", position: "relative", transition: "background .2s", flexShrink: 0,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "white",
        position: "absolute", top: 3, left: on ? 23 : 3, transition: "left .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.2)",
      }} />
    </button>
  );
}

function Field({ label, value, onChange, icon: Icon, readOnly = false, note, type = "text" }: {
  label: string; value: string; onChange?: (v: string) => void;
  icon: React.ElementType; readOnly?: boolean; note?: string; type?: string;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>{label}</label>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.65rem",
        background: readOnly ? "var(--off-white)" : "white",
        border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
        padding: "0.72rem 0.9rem",
      }}>
        <Icon size={15} color="var(--muted)" strokeWidth={2} />
        <input
          type={type} value={value} readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
          style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: readOnly ? "var(--muted)" : "var(--navy)" }}
        />
      </div>
      {note && <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4 }}>{note}</p>}
    </div>
  );
}

// ── save button ───────────────────────────────────────────────────────────────

function SaveButton({ dirty, saving, saved, onClick, fullWidth = false }: { dirty: boolean; saving: boolean; saved: boolean; onClick: () => void; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={!dirty || saving}
      style={{
        background: saved ? "#22c55e" : dirty ? "var(--navy)" : "#e5e7eb",
        color: dirty || saved ? "white" : "#9ca3af",
        border: "none", borderRadius: 10,
        padding: "0.75rem 1.5rem",
        width: fullWidth ? "100%" : undefined,
        fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.88rem",
        cursor: dirty && !saving ? "pointer" : "default",
        transition: "background .25s", marginTop: "1rem",
        boxShadow: dirty && !saved ? "0 2px 8px rgba(13,27,62,.2)" : "none",
      }}
    >
      {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
    </button>
  );
}

// ── menu row (mobile) ─────────────────────────────────────────────────────────

function MenuRow({ icon: Icon, label, value, onClick, danger = false }: {
  icon: React.ElementType; label: string; value?: string;
  onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "0.85rem",
        width: "100%", padding: "0.9rem 0", background: "none", border: "none",
        borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left",
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, background: danger ? "#fef2f2" : "var(--off-white)", display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon size={16} color={danger ? "#ef4444" : "var(--navy)"} strokeWidth={2} />
      </div>
      <span style={{ flex: 1, fontSize: "0.92rem", fontWeight: 500, color: danger ? "#ef4444" : "var(--navy)" }}>{label}</span>
      {value && <span style={{ fontSize: "0.82rem", color: "var(--muted)", marginRight: 4 }}>{value}</span>}
      {!danger && <ChevronRight size={16} color="var(--muted)" strokeWidth={2} />}
    </button>
  );
}

// ── sub-page wrapper ──────────────────────────────────────────────────────────

function SubPage({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div style={{ padding: "0 1.25rem 2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 0", marginBottom: "1.25rem", borderBottom: "1px solid var(--border)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "grid", placeItems: "center", padding: "0.25rem", marginLeft: "-0.25rem" }}>
          <ArrowLeft size={22} color="var(--navy)" strokeWidth={2} />
        </button>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router        = useRouter();
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const { user, token, updateUser, updateNotifications, updateProfilePic, deleteAccount } = useAuth();

  // mobile sub-section navigation
  const [section, setSection] = useState<string | null>(null);

  // profile state — undefined means "not yet edited by user, fall back to user data"
  const [nameOverride, setNameOverride]     = useState<string | undefined>(undefined);
  const [examDateOverride, setExamDateOverride] = useState<string | undefined>(undefined);
  const [subjectsOverride, setSubjectsOverride] = useState<string[] | undefined>(undefined);

  // derive current display values
  const name     = nameOverride     ?? user?.name     ?? "";
  const examDate = examDateOverride ?? user?.examDate?.split("T")[0] ?? "";
  const subjects: string[] = subjectsOverride ?? (
    user?.subjects?.includes("Use of English") ? (user.subjects ?? []) : ["Use of English", ...(user?.subjects ?? [])]
  );

  // dirty flags — only dirty if user has explicitly edited
  const nameChanged = nameOverride !== undefined && nameOverride !== user?.name;
  const examDirty   = examDateOverride !== undefined || subjectsOverride !== undefined;



  // password state
  const [curPass, setCurPass]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confPass, setConfPass] = useState("");

  // prefs state — sync from user data
  const [notifications, setNotif] = useState({ email: user?.notifications?.email ?? true, push: user?.notifications?.push ?? true, digest: user?.notifications?.digest ?? false });
  const [theme, setTheme]         = useState<"light" | "dark">("light");

  // save feedback
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const isPremium   = user?.plan === "premium";
  const maxSubjects = isPremium ? Infinity : 3;

  function toggleSubject(s: string) {
    if (s === "Use of English") return;
    setSubjectsOverride(prev => {
      const current = prev ?? subjects;
      if (current.includes(s)) return current.filter(x => x !== s);
      if (current.length >= maxSubjects) return current;
      return [...current, s];
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    console.log("[Upload] file selected:", file?.name, file?.size);
    if (!file) return;
    setUploadErr("");

    // Resize/compress large images before upload
    const MAX_SIZE = 800; // max width/height in px
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;
            if (width > MAX_SIZE || height > MAX_SIZE) {
              if (width > height) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE; }
              else { width = Math.round(width * MAX_SIZE / height); height = MAX_SIZE; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
          };
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      console.log("[Upload] base64 length:", base64.length);
      const t = token || localStorage.getItem("pg_token");
      console.log("[Upload] token present:", !!t);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/profile-picture`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify({ profilePicture: base64 }),
      });
      const data = await res.json();
      console.log("[Upload] response:", data);

      if (data.success) {
        updateProfilePic(base64); // sync to context
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setUploadErr(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("[Upload] error:", err);
      setUploadErr("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function doSave(key: string, data: object) {
    setSaving(true); setSaved(null);
    await updateUser(data as Parameters<typeof updateUser>[0]);
    setSaving(false); setSaved(key);
    setTimeout(() => setSaved(null), 3000);
    // reset overrides — user context is now updated
    if (key === "profile") setNameOverride(undefined);
    if (key === "exam") { setExamDateOverride(undefined); setSubjectsOverride(undefined); }
  }

  const daysLeft = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / 86400000))
    : null;

  // ── DESKTOP layout ────────────────────────────────────────────────────────
  const DesktopLayout = (
    <div style={{ maxWidth: 860, padding: "2rem 2rem 4rem", display: "flex", flexDirection: "column", gap: "2rem" }}>

      <div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem" }}>Settings</h1>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Manage your account preferences and study configurations.</p>
      </div>

      {/* Profile */}
      {[{
        title: "Profile", subtitle: "Update your personal details.",
        content: (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative" }}>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--border)", display: "block" }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--yellow)", display: "grid", placeItems: "center", border: "3px solid var(--border)" }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--navy)" }}>
                      {user?.name?.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0,2) ?? "??"}
                    </span>
                  </div>
                )}
                <button onClick={() => fileInputRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "var(--navy)", border: "2px solid white", display: "grid", placeItems: "center", cursor: "pointer" }}>
                  <Camera size={12} color="white" strokeWidth={2} />
                </button>
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: 2 }}>Profile Picture</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.5rem" }}>PNG, JPG or GIF. Max 5MB.</div>
                {uploadErr && <p style={{ fontSize: "0.72rem", color: "#ef4444", margin: "0 0 0.35rem" }}>{uploadErr}</p>}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", background: "none", border: "none", cursor: uploading ? "wait" : "pointer", fontFamily: "'DM Sans',sans-serif", padding: 0 }}>{uploading ? "Uploading..." : "Upload new"}</button>
                  <button onClick={async () => {
                    const t = token || localStorage.getItem("pg_token");
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/profile-picture`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
                      body: JSON.stringify({ profilePicture: null }),
                    });
                    updateProfilePic("");
                  }} style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", padding: 0 }}>Remove</button>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>Display Name</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "white", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.72rem 0.9rem" }}>
                <User size={15} color="var(--muted)" strokeWidth={2} />
                <input value={name} onChange={e => { setNameOverride(e.target.value); }} style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "var(--navy)" }} />
              </div>
            </div>
            <Field label="Email Address" value={user?.email ?? ""} icon={Mail} readOnly note="Email cannot be changed after account verification." />
            <SaveButton dirty={nameChanged} saving={saving} saved={saved === "profile"} onClick={() => doSave("profile", { name })} />
          </>
        )
      }, {
        title: "Exam Settings", subtitle: "Customise your study focus areas.",
        content: (
          <>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>Target Exam Date</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "white", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.72rem 0.9rem", flex: 1, minWidth: 180 }}>
                <CalendarDays size={15} color="var(--muted)" strokeWidth={2} />
                <input type="date" value={examDate} onChange={e => { setExamDateOverride(e.target.value); }} style={{ border: "none", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "var(--navy)", background: "transparent", flex: 1 }} />
              </div>
              {daysLeft !== null && <span style={{ background: "var(--yellow-light)", color: "var(--yellow-dark)", fontSize: "0.78rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: 20 }}>{daysLeft} Days Remaining</span>}
            </div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>Active Study Subjects</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
              {ALL_SUBJECTS.map(s => {
                const active = subjects.includes(s);
                const locked = s === "Use of English";
                const atLimit = !active && !locked && subjects.length >= maxSubjects;
                return (
                  <button key={s} onClick={() => toggleSubject(s)} disabled={locked || atLimit} title={locked ? "Compulsory for JAMB" : atLimit ? `Free plan: max ${maxSubjects} subjects` : undefined}
                    style={{ padding: "0.35rem 0.85rem", borderRadius: 20, cursor: locked || atLimit ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.78rem", border: `1.5px solid ${locked ? "var(--navy)" : active ? "var(--yellow-dark)" : "var(--border)"}`, background: locked ? "var(--navy)" : active ? "var(--yellow-light)" : "white", color: locked ? "white" : active ? "var(--navy)" : "var(--muted)", transition: "all .15s", opacity: atLimit ? 0.45 : 1 }}>
                    {s}{locked ? " 🔒" : ""}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", margin: 0 }}>AI Tutor and Daily Tasks are generated based on these subjects.</p>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: subjects.length >= maxSubjects && !isPremium ? "#ef4444" : "var(--muted)", whiteSpace: "nowrap", marginLeft: "1rem" }}>
                {subjects.length}/{isPremium ? "∞" : maxSubjects}
                {!isPremium && subjects.length >= maxSubjects && " — Upgrade for more"}
              </span>
            </div>
            <SaveButton dirty={examDirty} saving={saving} saved={saved === "exam"} onClick={() => doSave("exam", { subjects, examDate: examDate || undefined })} />
          </>
        )
      }, {
        title: "Subscription", subtitle: "Manage your plan and billing.",
        content: (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--off-white)", borderRadius: "var(--radius-sm)", padding: "0.9rem 1rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--yellow)", display: "grid", placeItems: "center" }}><svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                  <rect x="14.5" y="24" width="3" height="5" rx="1" fill="var(--navy)" opacity=".8"/>
                  <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="var(--navy)" opacity=".9"/>
                  <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="var(--navy)"/>
                  <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
                </svg></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--navy)" }}>{isPremium ? "PrepGenie Premium" : "PrepGenie Free"}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{isPremium ? "All features unlocked" : "Upgrade to unlock all features"}</div>
                </div>
              </div>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "var(--navy)", color: "white", padding: "0.2rem 0.6rem", borderRadius: 20 }}>{isPremium ? "PRO" : "FREE"}</span>
            </div>
            <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", background: "var(--off-white)" }}>
                {["Feature", "Free", "Premium"].map((h, i) => <div key={h} style={{ padding: "0.65rem 1rem", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: i === 2 ? "var(--yellow-dark)" : "var(--muted)" }}>{h}</div>)}
              </div>
              {PLAN_FEATURES.map(({ feature, free, pro }, i) => (
                <div key={feature} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "white" : "var(--off-white)" }}>
                  <div style={{ padding: "0.75rem 1rem", fontSize: "0.84rem", color: "var(--navy)", fontWeight: 500 }}>{feature}</div>
                  <div style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center" }}>{free === false ? <X size={14} color="#ef4444" strokeWidth={2.5} /> : free === true ? <Check size={14} color="#22c55e" strokeWidth={2.5} /> : <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{free}</span>}</div>
                  <div style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center" }}>{pro === false ? <X size={14} color="#ef4444" strokeWidth={2.5} /> : pro === true ? <Check size={14} color="#22c55e" strokeWidth={2.5} /> : <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)" }}>{pro}</span>}</div>
                </div>
              ))}
            </div>
            {!isPremium && <button style={{ width: "100%", padding: "0.82rem", background: "var(--yellow)", color: "var(--navy)", border: "none", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}>Upgrade to PrepGenie Pro</button>}
          </>
        )
      }, {
        title: "Preferences", subtitle: "Control notifications and appearance.",
        content: (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.75rem" }}>Notifications</div>
              {[{ key: "email", label: "Email Notifications", desc: "Study reminders and progress reports." }, { key: "push", label: "Desktop Push", desc: "Real-time alerts for study sessions." }, { key: "digest", label: "Weekly Digest", desc: "Summary of weak areas and streaks." }].map(({ key, label, desc }) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 0", borderBottom: "1px solid var(--border)", gap: "1rem" }}>
                  <div><div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--navy)", marginBottom: 2 }}>{label}</div><div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{desc}</div></div>
                  <Toggle on={notifications[key as keyof typeof notifications]} onChange={() => { const updated = { ...notifications, [key]: !notifications[key as keyof typeof notifications] }; setNotif(updated); updateNotifications(updated); }} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.75rem" }}>App Appearance</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[{ mode: "light" as const, Icon: Sun, label: "Light Mode" }, { mode: "dark" as const, Icon: Moon, label: "Dark Mode" }].map(({ mode, Icon, label }) => (
                <div key={mode} style={{ position: "relative" }}>
                  <button onClick={() => mode === "light" && setTheme("light")} disabled={mode === "dark"} style={{ width: "100%", padding: "1.25rem", borderRadius: "var(--radius-sm)", cursor: mode === "dark" ? "not-allowed" : "pointer", border: `2px solid ${theme === mode ? "var(--yellow-dark)" : "var(--border)"}`, background: theme === mode ? "var(--yellow-xlight)" : mode === "dark" ? "#e5e7eb" : "var(--off-white)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.5rem", opacity: mode === "dark" ? 0.7 : 1 }}>
                    <Icon size={24} color={theme === mode ? "var(--yellow-dark)" : "var(--muted)"} strokeWidth={1.8} />
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: theme === mode ? "var(--yellow-dark)" : "var(--muted)" }}>{label}</span>
                  </button>
                  {mode === "dark" && <span style={{ position: "absolute", top: 8, right: 8, background: "var(--yellow)", color: "var(--navy)", fontSize: "0.6rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: 4 }}>Soon</span>}
                </div>
              ))}
            </div>
          </>
        )
      }].map(({ title, subtitle, content }) => (
        <div key={title} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "2rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }} className="settings-section">
          <div><h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>{title}</h2><p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>{subtitle}</p></div>
          <div>{content}</div>
        </div>
      ))}

      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: "0.5rem" }}>
          <Shield size={13} color="var(--muted)" strokeWidth={2} />
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Secure Configuration Environment</span>
        </div>
        <button onClick={async () => { if (confirm("This will permanently delete your account and all data. Are you sure?")) await deleteAccount(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Trash2 size={14} strokeWidth={2} /> Delete my PrepGenie Account
        </button>
        <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.85rem" }}>PrepGenie v2.4.1 (Stable Build)<br />© 2024 PrepGenie Technologies Ltd.</div>
      </div>
    </div>
  );

  // ── MOBILE sub-sections ───────────────────────────────────────────────────

  const MobileProfile = (
    <SubPage title="Profile" onBack={() => setSection(null)}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1rem 0 1.5rem" }}>
        <div style={{ position: "relative" }}>
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--border)", display: "block" }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--yellow)", display: "grid", placeItems: "center", border: "3px solid var(--border)" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--navy)" }}>
                {user?.name?.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0,2) ?? "??"}
              </span>
            </div>
          )}
          <button onClick={() => fileInputRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "var(--navy)", border: "2px solid white", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <Camera size={12} color="white" strokeWidth={2} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
        </div>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--navy)" }}>{user?.name}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{user?.email}</div>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>Display Name</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "white", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.72rem 0.9rem" }}>
          <User size={15} color="var(--muted)" strokeWidth={2} />
          <input value={name} onChange={e => { setNameOverride(e.target.value); }} style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "var(--navy)" }} />
        </div>
      </div>
      <Field label="Email Address" value={user?.email ?? ""} icon={Mail} readOnly note="Cannot be changed after verification." />
      <SaveButton dirty={nameChanged} saving={saving} saved={saved === "profile"} onClick={() => doSave("profile", { name })} fullWidth />
    </SubPage>
  );

  const MobilePassword = (
    <SubPage title="Change Password" onBack={() => setSection(null)}>
      {["Current Password", "New Password", "Confirm New Password"].map((label, i) => (
        <div key={label} style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>{label}</label>
          <input type="password" placeholder="••••••••" onChange={e => { if (i === 0) setCurPass(e.target.value); if (i === 1) setNewPass(e.target.value); if (i === 2) setConfPass(e.target.value); }}
            style={{ width: "100%", padding: "0.72rem 0.9rem", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", outline: "none", background: "white", boxSizing: "border-box" as const }} />
        </div>
      ))}
      <SaveButton dirty={!!(curPass && newPass && confPass)} saving={saving} saved={saved === "password"} fullWidth onClick={() => { if (newPass !== confPass) { alert("Passwords don't match"); return; } doSave("password", {}); }} />
    </SubPage>
  );

  const MobileExam = (
    <SubPage title="Exam Settings" onBack={() => setSection(null)}>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>Target Exam Date</label>
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "white", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.72rem 0.9rem", marginBottom: "0.75rem" }}>
        <CalendarDays size={15} color="var(--muted)" strokeWidth={2} />
        <input type="date" value={examDate} onChange={e => { setExamDateOverride(e.target.value); }} style={{ border: "none", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "var(--navy)", background: "transparent", flex: 1 }} />
      </div>
      {daysLeft !== null && <div style={{ background: "var(--yellow-light)", color: "var(--yellow-dark)", fontSize: "0.78rem", fontWeight: 700, padding: "0.4rem 0.75rem", borderRadius: 8, marginBottom: "1.25rem", display: "inline-block" }}>{daysLeft} Days Remaining</div>}
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>Study Subjects</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
        {ALL_SUBJECTS.map(s => {
          const active = subjects.includes(s); const locked = s === "Use of English";
          const atLimit = !active && !locked && subjects.length >= maxSubjects;
          return (
            <button key={s} onClick={() => toggleSubject(s)} disabled={locked || atLimit}
              style={{ padding: "0.35rem 0.85rem", borderRadius: 20, cursor: locked || atLimit ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.78rem", border: `1.5px solid ${locked ? "var(--navy)" : active ? "var(--yellow-dark)" : "var(--border)"}`, background: locked ? "var(--navy)" : active ? "var(--yellow-light)" : "white", color: locked ? "white" : active ? "var(--navy)" : "var(--muted)", opacity: atLimit ? 0.45 : 1 }}>
              {s}{locked ? " 🔒" : ""}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: "0.72rem", color: subjects.length >= maxSubjects && !isPremium ? "#ef4444" : "var(--muted)", marginBottom: "1rem" }}>
        {subjects.length}/{isPremium ? "∞" : maxSubjects} subjects {!isPremium && subjects.length >= maxSubjects && "— Upgrade for more"}
      </div>
      <SaveButton dirty={examDirty} saving={saving} saved={saved === "exam"} onClick={() => doSave("exam", { subjects, examDate: examDate || undefined })} fullWidth />
    </SubPage>
  );

  const MobileSubscription = (
    <SubPage title="Subscription" onBack={() => setSection(null)}>
      <div style={{ background: "var(--navy)", borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--yellow)", display: "grid", placeItems: "center" }}><svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <rect x="14.5" y="24" width="3" height="5" rx="1" fill="var(--navy)" opacity=".8"/>
                  <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="var(--navy)" opacity=".9"/>
                  <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="var(--navy)"/>
                  <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
                </svg></div>
        <div>
          <div style={{ fontWeight: 700, color: "white" }}>{isPremium ? "PrepGenie Premium" : "PrepGenie Free"}</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,.55)" }}>{isPremium ? "All features unlocked" : "Upgrade to unlock everything"}</div>
        </div>
      </div>
      {PLAN_FEATURES.map(({ feature, free, pro }) => (
        <div key={feature} style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--navy)" }}>{feature}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>{typeof free === "boolean" ? (free ? "✓" : "✗") : free}</span>
        </div>
      ))}
      {!isPremium && <button style={{ width: "100%", padding: "0.85rem", background: "var(--yellow)", color: "var(--navy)", border: "none", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", marginTop: "1.25rem" }}>Upgrade to PrepGenie Pro</button>}
    </SubPage>
  );

  const MobileNotifications = (
    <SubPage title="Notifications" onBack={() => setSection(null)}>
      {[{ key: "email", label: "Email Notifications", desc: "Study reminders and progress reports in your inbox." }, { key: "push", label: "Desktop Push", desc: "Real-time alerts for scheduled study sessions." }, { key: "digest", label: "Weekly Performance Digest", desc: "A summary of your weakest areas and streak milestones." }].map(({ key, label, desc }) => (
        <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid var(--border)", gap: "1rem" }}>
          <div><div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--navy)", marginBottom: 2 }}>{label}</div><div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{desc}</div></div>
          <Toggle on={notifications[key as keyof typeof notifications]} onChange={() => { const updated = { ...notifications, [key]: !notifications[key as keyof typeof notifications] }; setNotif(updated); updateNotifications(updated); }} />
        </div>
      ))}
    </SubPage>
  );

  const MobileAppearance = (
    <SubPage title="Appearance" onBack={() => setSection(null)}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
        {[{ mode: "light" as const, Icon: Sun, label: "Light Mode" }, { mode: "dark" as const, Icon: Moon, label: "Dark Mode" }].map(({ mode, Icon, label }) => (
          <div key={mode} style={{ position: "relative" }}>
            <button onClick={() => mode === "light" && setTheme("light")} disabled={mode === "dark"} style={{ width: "100%", padding: "1.5rem 1rem", borderRadius: "var(--radius-sm)", cursor: mode === "dark" ? "not-allowed" : "pointer", border: `2px solid ${theme === mode ? "var(--yellow-dark)" : "var(--border)"}`, background: theme === mode ? "var(--yellow-xlight)" : mode === "dark" ? "#e5e7eb" : "var(--off-white)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.6rem", opacity: mode === "dark" ? 0.7 : 1 }}>
              <Icon size={28} color={theme === mode ? "var(--yellow-dark)" : "var(--muted)"} strokeWidth={1.8} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: theme === mode ? "var(--yellow-dark)" : "var(--muted)" }}>{label}</span>
            </button>
            {mode === "dark" && <span style={{ position: "absolute", top: 8, right: 8, background: "var(--yellow)", color: "var(--navy)", fontSize: "0.6rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: 4 }}>Soon</span>}
          </div>
        ))}
      </div>
    </SubPage>
  );

  // ── MOBILE main menu ──────────────────────────────────────────────────────

  const MobileMenu = (
    <div style={{ padding: "1.25rem" }}>
      {/* user card */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "1rem 0 1.25rem", borderBottom: "1px solid var(--border)", marginBottom: "0.5rem" }}>
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid var(--border)" }} />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--yellow)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)" }}>
              {user?.name?.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0,2) ?? "..."}
            </span>
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--navy)" }}>{user?.name}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{user?.email}</div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: isPremium ? "var(--yellow-dark)" : "var(--muted)", marginTop: 2 }}>{isPremium ? "Premium Plan" : "Free Plan"}</div>
        </div>
      </div>

      {/* Account */}
      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "0.75rem 0 0.25rem" }}>Account</div>
      <MenuRow icon={User}         label="Manage Profile"     onClick={() => setSection("profile")} />
      <MenuRow icon={Lock}         label="Password & Security" onClick={() => setSection("password")} />
      <MenuRow icon={CalendarDays} label="Exam Settings"       value={daysLeft !== null ? `${daysLeft}d left` : "Not set"} onClick={() => setSection("exam")} />

      {/* Preferences */}
      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "0.75rem 0 0.25rem" }}>Preferences</div>
      <MenuRow icon={LampIcon}     label="Subscription"        value={isPremium ? "Pro" : "Free"} onClick={() => setSection("subscription")} />
      <MenuRow icon={Bell}         label="Notifications"        onClick={() => setSection("notifications")} />
      <MenuRow icon={Sun}          label="Appearance"           value="Light" onClick={() => setSection("appearance")} />

      {/* Danger */}
      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "0.75rem 0 0.25rem" }}>Account Actions</div>
      <MenuRow icon={Trash2} label="Delete Account" onClick={async () => { if (confirm("This will permanently delete your account and all data. Are you sure?")) await deleteAccount(); }} danger />

      <div style={{ textAlign: "center", fontSize: "0.68rem", color: "var(--muted)", marginTop: "2rem", paddingBottom: "1rem" }}>
        PrepGenie v2.4.1 · © 2024 PrepGenie Technologies Ltd.
      </div>
    </div>
  );

  const mobileContent: Record<string, React.ReactNode> = {
    profile: MobileProfile, password: MobilePassword, exam: MobileExam,
    subscription: MobileSubscription, notifications: MobileNotifications, appearance: MobileAppearance,
  };

  return (
    <AppShell>
      {/* Single shared file input — avoids duplicate ref bug */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      {/* Desktop */}
      <div className="settings-desktop">{DesktopLayout}</div>

      {/* Mobile */}
      <div className="settings-mobile">
        {section ? mobileContent[section] : MobileMenu}
      </div>

      <style>{`
        .settings-desktop { display: block; }
        .settings-mobile  { display: none; }
        @media(max-width: 768px) {
          .settings-desktop { display: none; }
          .settings-mobile  { display: block; }
        }
        @media(max-width: 700px) {
          .settings-section { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}</style>
    </AppShell>
  );
}
