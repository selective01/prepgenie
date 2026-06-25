"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronRight, ChevronLeft, BookOpen, Calculator,
  Atom, FlaskConical, Leaf, Globe, DollarSign,
  BookMarked, Clock, Target, Check,
} from "lucide-react";

// ── subject bank ──────────────────────────────────────────────────────────────

const SCIENCE_SUBJECTS = [
  { id: "english",   label: "Use of English", icon: BookOpen,  locked: true  },
  { id: "maths",     label: "Mathematics", icon: Calculator,   locked: false },
  { id: "physics",   label: "Physics",     icon: Atom,         locked: false },
  { id: "chemistry", label: "Chemistry",   icon: FlaskConical, locked: false },
  { id: "biology",   label: "Biology",     icon: Leaf,         locked: false },
  { id: "geography", label: "Geography",   icon: Globe,        locked: false },
  { id: "economics", label: "Economics",   icon: DollarSign,   locked: false },
  { id: "agric",     label: "Agriculture", icon: Leaf,         locked: false },
];

const ART_SUBJECTS = [
  { id: "english",     label: "English",             icon: BookOpen,  locked: true  },
  { id: "literature",  label: "Literature",           icon: BookMarked,locked: false },
  { id: "government",  label: "Government",           icon: Globe,     locked: false },
  { id: "economics",   label: "Economics",            icon: DollarSign,locked: false },
  { id: "history",     label: "History",              icon: BookMarked,locked: false },
  { id: "geography",   label: "Geography",            icon: Globe,     locked: false },
  { id: "commerce",    label: "Commerce",             icon: DollarSign,locked: false },
  { id: "accounting",  label: "Accounting",           icon: Calculator,locked: false },
  { id: "crs",         label: "Christian R.S.",       icon: BookOpen,  locked: false },
  { id: "irs",         label: "Islamic R.S.",         icon: BookOpen,  locked: false },
  { id: "french",      label: "French",               icon: Globe,     locked: false },
  { id: "yoruba",      label: "Yoruba",               icon: Globe,     locked: false },
  { id: "igbo",        label: "Igbo",                 icon: Globe,     locked: false },
  { id: "hausa",       label: "Hausa",                icon: Globe,     locked: false },
];

const studyHours = [
  { label: "1 hour",   value: 1 },
  { label: "2 hours",  value: 2 },
  { label: "3 hours+", value: 3 },
];

// ── page ──────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const [step,         setStep]       = useState(1);
  const [isPremium,    setIsPremium]  = useState(false);
  const [track,        setTrack]      = useState<"science" | "art" | null>(null);
  const [selected,     setSelected]   = useState<string[]>(["english"]);
  const [examDate,     setExamDate]   = useState("");
  const [targetScore,  setTargetScore]= useState(280);
  const [hours,        setHours]      = useState(2);
  const [error,        setError]      = useState("");

  const TOTAL_STEPS  = 5;
  const FREE_LIMIT   = 2; // English + 1 more
  const subjectList  = track === "art" ? ART_SUBJECTS : SCIENCE_SUBJECTS;
  const maxSubjects  = isPremium ? Infinity : FREE_LIMIT;

  function toggleSubject(id: string) {
    if (id === "english") return;
    setError("");
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= maxSubjects) {
        setError(`Free plan: English + 1 subject only. Upgrade to Premium to select more.`);
        return prev;
      }
      return [...prev, id];
    });
  }

  async function next() {
    setError("");

    if (step === 1) { setStep(2); return; }

    if (step === 2) {
      if (!track) { setError("Please choose a track to continue."); return; }
      // reset subjects when track changes (keep english)
      setSelected(["english"]);
      setStep(3); return;
    }

    if (step === 3) {
      if (selected.filter(s => s !== "english").length === 0) {
        setError("Please select at least one subject besides English.");
        return;
      }
      setStep(4); return;
    }

    if (step === 4) {
      if (!examDate) { setError("Please set your target exam date."); return; }
      setStep(5); return;
    }

    // step 5 — finish
    const subjectLabels = selected.map(id => {
      const all = [...SCIENCE_SUBJECTS, ...ART_SUBJECTS];
      return all.find(s => s.id === id)?.label ?? id;
    });

    await updateUser({
      subjects:         subjectLabels,
      examDate:         examDate || undefined,
      targetScore,
      studyHoursPerDay: hours,
    });
    router.push("/dashboard");
  }

  function back() {
    setError("");
    if (step > 1) setStep(s => s - 1);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'DM Sans',sans-serif" }}>

      {/* card */}
      <div style={{ width: "100%", maxWidth: 560, background: "white", borderRadius: "var(--radius)", boxShadow: "0 8px 40px rgba(13,27,62,.1)", overflow: "hidden" }}>

        {/* ── header ── */}
        <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid var(--border)" }}>
          {/* logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--navy)", display: "grid", placeItems: "center" }}>
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <rect x="14.5" y="24" width="3" height="5" rx="1" fill="var(--yellow)" opacity=".9"/>
                <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="var(--yellow)" opacity=".9"/>
                <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="var(--yellow)"/>
                <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)" }}>
              Prep<span style={{ color: "var(--yellow-dark)" }}>Genie</span>
            </span>
          </div>

          {/* step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const n = i + 1;
              const done   = n < step;
              const active = n === step;
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 6, flex: n < TOTAL_STEPS ? 1 : "none" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center",
                    background: done ? "var(--navy)" : active ? "var(--yellow)" : "var(--off-white)",
                    border: `2px solid ${done ? "var(--navy)" : active ? "var(--yellow-dark)" : "var(--border)"}`,
                    fontSize: "0.75rem", fontWeight: 800,
                    color: done ? "white" : active ? "var(--navy)" : "var(--muted)",
                    flexShrink: 0, transition: "all .25s",
                  }}>
                    {done ? <Check size={12} strokeWidth={3} /> : n}
                  </div>
                  {n < TOTAL_STEPS && <div style={{ flex: 1, height: 2, background: done ? "var(--navy)" : "var(--border)", transition: "background .25s" }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── content ── */}
        <div style={{ padding: "1.75rem 2rem", minHeight: 340 }}>

          {/* ── STEP 1: plan ── */}
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>
                Choose your plan
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Start free or unlock the full PrepGenie experience from day one.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {/* Free */}
                <button onClick={() => setIsPremium(false)} style={{
                  padding: "1.1rem 1.25rem", borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left",
                  border: `2px solid ${!isPremium ? "var(--navy)" : "var(--border)"}`,
                  background: !isPremium ? "var(--off-white)" : "white", transition: "all .18s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--navy)" }}>Free Plan</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--navy)" }}>₦0<span style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--muted)" }}>/mo</span></span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.7 }}>
                    English + 1 subject · 5 AI messages/day · 2 quizzes/week · Basic study plan
                  </div>
                </button>

                {/* Premium */}
                <button onClick={() => setIsPremium(true)} style={{
                  padding: "1.1rem 1.25rem", borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left",
                  position: "relative", overflow: "hidden",
                  border: `2px solid ${isPremium ? "var(--yellow-dark)" : "var(--border)"}`,
                  background: isPremium ? "var(--navy)" : "white", transition: "all .18s",
                }}>
                  {isPremium && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--yellow)" }} />}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.95rem", color: isPremium ? "white" : "var(--navy)" }}>PrepGenie Pro</span>
                      <span style={{ background: "var(--yellow)", color: "var(--navy)", fontSize: "0.6rem", fontWeight: 800, padding: "0.1rem 0.5rem", borderRadius: 4 }}>POPULAR</span>
                    </div>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: "1.15rem", color: isPremium ? "var(--yellow)" : "var(--navy)" }}>₦2,500<span style={{ fontSize: "0.72rem", fontWeight: 500, color: isPremium ? "rgba(255,255,255,.5)" : "var(--muted)" }}>/mo</span></span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: isPremium ? "rgba(255,255,255,.7)" : "var(--muted)", lineHeight: 1.7 }}>
                    All subjects · Unlimited AI messages · Unlimited quizzes · Full analytics & performance reports
                  </div>
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: science or art ── */}
          {step === 2 && (
            <>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>
                What&apos;s your track?
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                This determines which subjects your AI tutor focuses on.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  {
                    id: "science" as const,
                    label: "Science",
                    desc: "Mathematics, Physics, Chemistry, Biology, and more",
                    icon: "⚗️",
                  },
                  {
                    id: "art" as const,
                    label: "Art",
                    desc: "Literature, Government, Economics, History, and more",
                    icon: "📚",
                  },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTrack(t.id); setError(""); }}
                    style={{
                      padding: "1.5rem 1rem", borderRadius: "var(--radius-sm)", cursor: "pointer",
                      textAlign: "center", border: `2px solid ${track === t.id ? "var(--yellow-dark)" : "var(--border)"}`,
                      background: track === t.id ? "var(--yellow-xlight)" : "white",
                      transition: "all .18s", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "2.5rem" }}>{t.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--navy)" }}>{t.label}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.5 }}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── STEP 3: subjects ── */}
          {step === 3 && (
            <>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>
                What are you studying?
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
                Select the subjects you want your AI tutor to focus on.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem", marginBottom: "0.75rem" }}>
                {subjectList.map(s => {
                  const isSelected = selected.includes(s.id);
                  const atLimit    = !isSelected && !s.locked && selected.length >= maxSubjects;
                  const Icon       = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSubject(s.id)}
                      disabled={atLimit}
                      style={{
                        padding: "0.75rem 0.5rem", borderRadius: "var(--radius-sm)",
                        border: `2px solid ${s.locked ? "var(--navy)" : isSelected ? "var(--yellow-dark)" : "var(--border)"}`,
                        background: s.locked ? "var(--navy)" : isSelected ? "var(--yellow-xlight)" : "white",
                        cursor: s.locked || atLimit ? "not-allowed" : "pointer",
                        opacity: atLimit ? 0.4 : 1,
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                        transition: "all .15s",
                      }}
                    >
                      <Icon size={18} color={s.locked ? "var(--yellow)" : isSelected ? "var(--yellow-dark)" : "var(--muted)"} strokeWidth={2} />
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: s.locked ? "white" : "var(--navy)", textAlign: "center", lineHeight: 1.2 }}>
                        {s.label}{s.locked ? " 🔒" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  English is compulsory for all JAMB candidates.
                </p>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: selected.length >= maxSubjects && !isPremium ? "#ef4444" : "var(--muted)" }}>
                  {selected.length}/{isPremium ? "∞" : maxSubjects}
                  {selected.length >= maxSubjects && !isPremium && " — limit reached"}
                </span>
              </div>
            </>
          )}

          {/* ── STEP 4: exam date ── */}
          {step === 4 && (
            <>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>
                When is your exam?
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                Your study plan and daily tasks will be built around this date.
              </p>

              <input
                type="date"
                value={examDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => { setExamDate(e.target.value); setError(""); }}
                style={{
                  width: "100%", padding: "0.85rem 1rem",
                  border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "1rem",
                  color: "var(--navy)", outline: "none", boxSizing: "border-box" as const,
                }}
              />
              {examDate && (
                <div style={{ marginTop: "0.75rem", background: "var(--yellow-xlight)", borderRadius: 8, padding: "0.6rem 1rem", fontSize: "0.82rem", color: "var(--yellow-dark)", fontWeight: 700 }}>
                  📅 {Math.max(0, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / 86400000))} days until your JAMB exam
                </div>
              )}
            </>
          )}

          {/* ── STEP 5: goals ── */}
          {step === 5 && (
            <>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>
                Set your goals
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                Your AI tutor will calibrate everything around your target.
              </p>

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
                        flex: 1, padding: "0.7rem 0", borderRadius: "var(--radius-sm)",
                        border: `2px solid ${hours === h.value ? "var(--yellow-dark)" : "var(--border)"}`,
                        background: hours === h.value ? "var(--yellow-light)" : "white",
                        color: hours === h.value ? "var(--navy)" : "var(--muted)",
                        fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.85rem",
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
          padding: "1rem 2rem 1.5rem", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
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
          ) : <div />}

          <button
            onClick={next}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--yellow)", color: "var(--navy)", border: "none",
              borderRadius: 8, padding: "0.78rem 1.5rem",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
              fontSize: "0.88rem", cursor: "pointer",
              flex: step === 1 ? 1 : "none", justifyContent: "center",
            }}
          >
            {step === 5 ? "Start Learning" : "Next Step"}
            <ChevronRight size={17} strokeWidth={2.5} />
          </button>
        </div>

        {step === 1 && (
          <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--muted)", padding: "0 2rem 1.25rem" }}>
            By continuing, you agree to our{" "}
            <a href="#" style={{ color: "var(--yellow-dark)", textDecoration: "none" }}>Terms of Service</a>{" "}
            and{" "}
            <a href="#" style={{ color: "var(--yellow-dark)", textDecoration: "none" }}>Privacy Policy</a>.
          </p>
        )}
      </div>
    </div>
  );
}
