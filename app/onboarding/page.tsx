"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Check, ChevronRight, ChevronLeft, BookOpen, Calculator,
  Atom, FlaskConical, Leaf, Globe, DollarSign, BookMarked,
  Clock, Target, Zap, CheckCircle,
} from "lucide-react";

// ── data ─────────────────────────────────────────────────────────────────────

const subjects = [
  { id: "english",    label: "English (Compulsory)", icon: BookOpen,      locked: true  },
  { id: "maths",      label: "Mathematics",          icon: Calculator,    locked: false },
  { id: "physics",    label: "Physics",              icon: Atom,          locked: false },
  { id: "chemistry",  label: "Chemistry",            icon: FlaskConical,  locked: false },
  { id: "biology",    label: "Biology",              icon: Leaf,          locked: false },
  { id: "government", label: "Government",           icon: Globe,         locked: false },
  { id: "economics",  label: "Economics",            icon: DollarSign,    locked: false },
  { id: "literature", label: "Literature",           icon: BookMarked,    locked: false },
];

const studyHours = [
  { label: "1 hour",   value: 1 },
  { label: "2 hours",  value: 2 },
  { label: "3 hours+", value: 3 },
];


// ── subject card ──────────────────────────────────────────────────────────────

function SubjectCard({
  subject, selected, onClick,
}: {
  subject: typeof subjects[0];
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = subject.icon;
  return (
    <button
      onClick={onClick}
      disabled={subject.locked}
      style={{
        position: "relative",
        background: selected ? "var(--yellow-light)" : "white",
        border: `2px solid ${selected ? "var(--yellow-dark)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        padding: "1.25rem 0.75rem 1rem",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "0.65rem",
        cursor: subject.locked ? "default" : "pointer",
        transition: "border-color .18s, background .18s",
        width: "100%",
      }}
    >
      {/* check badge */}
      {selected && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 20, height: 20, borderRadius: "50%",
          background: "var(--yellow-dark)",
          display: "grid", placeItems: "center",
        }}>
          <Check size={11} strokeWidth={3} color="white" />
        </div>
      )}

      {/* icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: selected ? "rgba(212,168,0,.15)" : "var(--off-white)",
        display: "grid", placeItems: "center",
      }}>
        <Icon size={22} color={selected ? "var(--yellow-dark)" : "var(--muted)"} strokeWidth={1.8} />
      </div>

      <span style={{
        fontSize: "0.82rem", fontWeight: 700,
        color: "var(--navy)", textAlign: "center", lineHeight: 1.3,
      }}>
        {subject.label}
      </span>
    </button>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [step, setStep]             = useState(1);
  const [selected, setSelected]     = useState<string[]>(["english"]);
  const [examDate, setExamDate]     = useState("");
  const [targetScore, setTargetScore] = useState(280);
  const [hours, setHours]           = useState(2);
  const [error, setError]           = useState("");

  const daysLeft = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / 86400000))
    : null;

  function toggleSubject(id: string) {
    if (id === "english") return;
    setError("");
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  }

  async function next() {
    if (step === 1 && selected.filter(s => s !== "english").length === 0) {
      setError("Please select at least one subject besides English.");
      return;
    }
    if (step === 2 && !examDate) {
      setError("Please set your exam date.");
      return;
    }
    setError("");
    if (step < 3) { setStep(s => s + 1); return; }
    // save onboarding data to the user profile
    await updateUser({
      subjects:         selected,
      examDate:         examDate || undefined,
      targetScore:      targetScore,
      studyHoursPerDay: hours,
    });
    router.push("/dashboard");
  }

  function back() {
    setError("");
    setStep(s => s - 1);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)", display: "flex", flexDirection: "column" }}>

      {/* ── minimal header ── */}
      <header style={{
        padding: "1rem 5%", display: "flex", alignItems: "center",
        justifyContent: "space-between", background: "white",
        borderBottom: "1px solid var(--border)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--yellow)", display: "grid", placeItems: "center" }}>
            <Zap size={15} color="var(--navy)" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)" }}>
            Prep<span style={{ color: "var(--yellow-dark)" }}>Genie</span>
          </span>
        </Link>
        <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Step {step} of 3</span>
      </header>

      {/* ── centered wizard ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "2.5rem 5% 3rem" }}>
        <div style={{
          width: "100%", maxWidth: 620,
          background: "white", borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)", overflow: "hidden",
        }}>

          {/* top tab bar (desktop style) */}
          <div style={{
            display: "flex", borderBottom: "1px solid var(--border)",
            padding: "0 2rem",
          }}>
            {["Subjects", "Timeline", "Goals"].map((label, i) => {
              const num = i + 1;
              const active = num === step;
              const done = num < step;
              return (
                <div key={label} style={{
                  padding: "1rem 1.25rem",
                  fontSize: "0.78rem", fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: active ? "var(--yellow-dark)" : done ? "var(--navy)" : "var(--muted)",
                  borderBottom: active ? "2px solid var(--yellow-dark)" : "2px solid transparent",
                  marginBottom: -1, cursor: "default",
                }}>
                  {label}
                </div>
              );
            })}
          </div>

          {/* content */}
          <div style={{ padding: "2rem" }}>

            {/* ── STEP 1: subjects ── */}
            {step === 1 && (
              <>
                <h2 style={{
                  fontFamily: "'Playfair Display',serif", fontSize: "1.6rem",
                  fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem",
                }}>
                  What are you studying?
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                  Select the subjects you want your AI tutor to focus on for your JAMB preparation.
                </p>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}>
                  {subjects.map(s => (
                    <SubjectCard
                      key={s.id}
                      subject={s}
                      selected={selected.includes(s.id)}
                      onClick={() => toggleSubject(s.id)}
                    />
                  ))}
                </div>

                {/* mandatory note */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.65rem",
                  background: "var(--off-white)", borderRadius: "var(--radius-sm)",
                  padding: "0.85rem 1rem", marginBottom: "1.25rem",
                }}>
                  <CheckCircle size={16} color="var(--muted)" strokeWidth={2} />
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5 }}>
                    English is automatically selected as it&apos;s mandatory for all JAMB candidates.
                  </span>
                </div>
              </>
            )}

            {/* ── STEP 2: timeline ── */}
            {step === 2 && (
              <>
                <h2 style={{
                  fontFamily: "'Playfair Display',serif", fontSize: "1.6rem",
                  fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem",
                }}>
                  When is your exam?
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                  Set your target JAMB exam date so we can build the right study plan for you.
                </p>

                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
                  Target Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => { setExamDate(e.target.value); setError(""); }}
                  style={{
                    width: "100%", padding: "0.8rem 1rem",
                    border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
                    fontSize: "0.95rem", fontFamily: "'DM Sans',sans-serif",
                    color: "var(--navy)", background: "var(--off-white)",
                    outline: "none", marginBottom: "1.25rem",
                  }}
                />

                {/* countdown */}
                {daysLeft !== null && (
                  <div style={{
                    background: "var(--navy)", borderRadius: "var(--radius)",
                    padding: "1.5rem", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                      Days to prepare
                    </div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "3.5rem", fontWeight: 800, color: "var(--yellow)", lineHeight: 1 }}>
                      {daysLeft}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,.6)", marginTop: "0.4rem" }}>
                      {daysLeft > 60 ? "Great — plenty of time to prepare well." :
                       daysLeft > 30 ? "Stay focused — every day counts." :
                       "Crunch time — let's make every session count."}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── STEP 3: goals ── */}
            {step === 3 && (
              <>
                <h2 style={{
                  fontFamily: "'Playfair Display',serif", fontSize: "1.6rem",
                  fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem",
                }}>
                  Set your goals
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                  Tell us what you&apos;re aiming for — your AI tutor will calibrate everything around it.
                </p>

                {/* score target */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", display: "flex", alignItems: "center", gap: 6 }}>
                      <Target size={15} color="var(--navy)" strokeWidth={2} /> Target JAMB Score
                    </label>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--yellow-dark)" }}>
                      {targetScore}
                    </span>
                  </div>
                  <input
                    type="range" min={180} max={400} step={5}
                    value={targetScore}
                    onChange={e => setTargetScore(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--yellow-dark)", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--muted)", marginTop: 4 }}>
                    <span>180</span><span>400</span>
                  </div>
                </div>

                {/* study hours */}
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
                    <Clock size={15} color="var(--navy)" strokeWidth={2} /> Daily Study Time
                  </label>
                  <div style={{ display: "flex", gap: "0.65rem" }}>
                    {studyHours.map(h => (
                      <button
                        key={h.value}
                        onClick={() => setHours(h.value)}
                        style={{
                          flex: 1, padding: "0.7rem 0",
                          borderRadius: "var(--radius-sm)",
                          border: `2px solid ${hours === h.value ? "var(--yellow-dark)" : "var(--border)"}`,
                          background: hours === h.value ? "var(--yellow-light)" : "white",
                          color: hours === h.value ? "var(--navy)" : "var(--muted)",
                          fontFamily: "'DM Sans',sans-serif",
                          fontWeight: 700, fontSize: "0.85rem",
                          cursor: "pointer", transition: "all .18s",
                        }}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* error */}
            {error && (
              <p style={{ fontSize: "0.82rem", color: "#ef4444", marginTop: "0.75rem", fontWeight: 500 }}>
                {error}
              </p>
            )}
          </div>

          {/* ── footer ── */}
          <div style={{
            padding: "1rem 2rem 1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            gap: "1rem",
          }}>
            {step > 1 ? (
              <button onClick={back} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "transparent", border: "1.5px solid var(--border)",
                borderRadius: 8, padding: "0.7rem 1.25rem",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                fontSize: "0.88rem", color: "var(--navy)", cursor: "pointer",
              }}>
                <ChevronLeft size={16} strokeWidth={2} /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={next}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--yellow)", color: "var(--navy)",
                border: "none", borderRadius: 8,
                padding: "0.78rem 1.5rem",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                fontSize: "0.88rem", cursor: "pointer", whiteSpace: "nowrap",
                flex: step === 1 ? 1 : "none",
                justifyContent: "center",
              }}
            >
              {step === 3 ? "Finish Setup" : "Next Step"}
              <ChevronRight size={17} strokeWidth={2.5} />
            </button>
          </div>

          {/* terms note (step 1 only) */}
          {step === 1 && (
            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--muted)", padding: "0 2rem 1.25rem" }}>
              By continuing, you agree to our{" "}
              <Link href="#" style={{ color: "var(--yellow-dark)", textDecoration: "none" }}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" style={{ color: "var(--yellow-dark)", textDecoration: "none" }}>Privacy Policy</Link>.
            </p>
          )}
        </div>

        {/* help link */}
        <p style={{ marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--muted)" }}>
          Need help setting up?{" "}
          <Link href="#" style={{ color: "var(--yellow-dark)", fontWeight: 600, textDecoration: "none" }}>
            Talk to a guide
          </Link>
        </p>
      </div>

      {/* ── footer ── */}
      <footer style={{
        padding: "1rem 5%", borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "0.5rem",
      }}>
        <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>© 2024 PrepGenie. Your Intelligent Study Companion.</span>
        <div style={{ display: "flex", gap: "1.25rem" }}>
          {["Privacy Policy", "Terms of Service", "Help Center"].map(l => (
            <Link key={l} href="#" style={{ fontSize: "0.72rem", color: "var(--muted)", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </footer>

      <style>{`
        @media(max-width: 600px) {
        }
        input[type="range"]::-webkit-slider-thumb { cursor: pointer; }
      `}</style>
    </div>
  );
}
