"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { ChevronLeft, ChevronRight, Clock, HelpCircle, Zap } from "lucide-react";

// ── mock data ─────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    subject: "Physics",
    topic: "Mechanics • Kinematics",
    difficulty: "Hard",
    text: "A car accelerates uniformly from rest to a speed of 20 m/s in 5 seconds. What is the distance covered by the car during this time interval?",
    options: ["25 meters", "50 meters", "100 meters", "200 meters"],
    correct: 1,
    explanation: "Using s = ½at², where a = 20/5 = 4 m/s². Distance = ½ × 4 × 25 = 50 meters. Alternatively, s = (u+v)/2 × t = (0+20)/2 × 5 = 50 m.",
  },
  {
    id: 2,
    subject: "Chemistry",
    topic: "Organic Chemistry",
    difficulty: "Medium",
    text: "Which of the following describes the primary difference between Alkanes and Alkenes?",
    options: [
      "Alkanes have double bonds; Alkenes have single bonds",
      "Alkanes have single bonds (saturated); Alkenes have at least one double bond (unsaturated)",
      "Alkanes are more reactive than Alkenes",
      "Alkenes cannot undergo combustion reactions",
    ],
    correct: 1,
    explanation: "Alkanes are saturated hydrocarbons with only single C–C bonds, making them less reactive. Alkenes contain at least one C=C double bond, making them unsaturated and more reactive.",
  },
  {
    id: 3,
    subject: "Mathematics",
    topic: "Calculus II",
    difficulty: "Hard",
    text: "Which of the following describes the relationship between a function's derivative and its local extrema in a continuous interval?",
    options: [
      "A local maximum occurs only if the second derivative is positive at that point.",
      "If f′(c) = 0 and f′′(c) < 0, then f has a local maximum at x = c.",
      "The derivative must be undefined at all points where a local minimum exists.",
      "Local extrema can only exist where the function is strictly increasing.",
    ],
    correct: 1,
    explanation: "By the Second Derivative Test: if f′(c) = 0 and f′′(c) < 0, the function has a local maximum at c. A negative second derivative indicates the curve is concave down at that point.",
  },
  {
    id: 4,
    subject: "Biology",
    topic: "Cell Biology",
    difficulty: "Easy",
    text: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correct: 1,
    explanation: "The mitochondria generates most of the cell's ATP through cellular respiration, earning its nickname as the powerhouse of the cell.",
  },
  {
    id: 5,
    subject: "Biology",
    topic: "Cell Biology",
    difficulty: "Medium",
    text: "What is the primary function of Ribosomes?",
    options: ["Energy production", "Protein synthesis", "DNA replication", "Lipid storage"],
    correct: 1,
    explanation: "Ribosomes are responsible for synthesizing proteins by translating messenger RNA (mRNA) into polypeptide chains.",
  },
];

const TOTAL_TIME = 15 * 60; // 15 minutes in seconds

// ── helpers ───────────────────────────────────────────────────────────────────

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const difficultyColor: Record<string, string> = {
  Hard:   "#d4a800",
  Medium: "#4a90d9",
  Easy:   "#22c55e",
};

// ── page ──────────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const router = useRouter();
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState<boolean[]>(Array(QUESTIONS.length).fill(false));
  const [started, setStarted]   = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const q = QUESTIONS[current];
  const selected = answers[current];
  const isSubmitted = submitted[current];

  // countdown — only runs after quiz is started
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft]);

  function selectOption(i: number) {
    if (isSubmitted) return;
    setAnswers(prev => { const a = [...prev]; a[current] = i; return a; });
  }

  function submitAnswer() {
    if (selected === null) return;
    setSubmitted(prev => { const s = [...prev]; s[current] = true; return s; });
  }

  function goNext() {
    if (current < QUESTIONS.length - 1) setCurrent(c => c + 1);
    else finishQuiz();
  }

  function goPrev() {
    if (current > 0) setCurrent(c => c - 1);
  }

  function finishQuiz() {
    // pass answers + submitted to results via sessionStorage (mock)
    sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
    sessionStorage.setItem("quizSubmitted", JSON.stringify(submitted));
    router.push("/quiz/results");
  }

  // option style
  function optionStyle(i: number) {
    const base: React.CSSProperties = {
      display: "flex", alignItems: "center", gap: "1rem",
      padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)",
      border: "1.5px solid var(--border)", background: "white",
      cursor: isSubmitted ? "default" : "pointer",
      transition: "border-color .15s, background .15s",
      width: "100%", textAlign: "left",
      fontFamily: "'DM Sans',sans-serif",
    };
    if (!isSubmitted) {
      if (selected === i) return { ...base, borderColor: "var(--yellow-dark)", background: "var(--yellow-xlight)" };
      return base;
    }
    if (i === q.correct) return { ...base, borderColor: "#22c55e", background: "#f0fdf4", cursor: "default" };
    if (selected === i && i !== q.correct) return { ...base, borderColor: "#ef4444", background: "#fef2f2", cursor: "default" };
    return { ...base, opacity: 0.5, cursor: "default" };
  }

  function dotStyle(i: number): React.CSSProperties {
    const isActive = i === current;
    const isAnswered = answers[i] !== null;
    const isDone = submitted[i];
    return {
      width: isActive ? 32 : 28, height: isActive ? 32 : 28,
      borderRadius: "50%", display: "grid", placeItems: "center",
      fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
      border: isActive ? "2px solid var(--navy)" : "1.5px solid var(--border)",
      background: isActive ? "var(--navy)" : isDone ? "var(--off-white)" : isAnswered ? "var(--yellow-light)" : "white",
      color: isActive ? "white" : "var(--navy)",
      transition: "all .15s",
      flexShrink: 0,
    };
  }

  const isLowTime = timeLeft < 60;
  const progress = ((current + 1) / QUESTIONS.length) * 100;

  // ── start screen ──
  if (!started) {
    return (
      <AppShell>
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{
            background: "white", borderRadius: "var(--radius)",
            border: "1px solid var(--border)", padding: "2.5rem 2rem",
            maxWidth: 480, width: "100%", textAlign: "center",
          }}>
            {/* logo */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "1.25rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--navy)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <rect x="14.5" y="24" width="3" height="5" rx="1" fill="white" opacity=".7"/>
                  <rect x="11" y="28" width="10" height="2" rx="1" fill="white" opacity=".7"/>
                  <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="white" opacity=".8"/>
                  <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="#F5C200"/>
                  <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
                  <ellipse cx="16" cy="17" rx="5" ry="1.5" fill="#F5C200" opacity=".2"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--navy)" }}>
                Prep<span style={{ color: "var(--yellow-dark)" }}>Genie</span>
              </span>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>
              Ready to Start?
            </h1>
            <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              You&apos;re about to begin a JAMB-style quiz. The timer will start the moment you click Start Quiz.
            </p>

            {/* quiz meta */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem", marginBottom: "2rem" }}>
              {[
                { label: "Questions", value: String(QUESTIONS.length) },
                { label: "Time Limit", value: `${TOTAL_TIME / 60} mins` },
                { label: "Subjects",   value: [...new Set(QUESTIONS.map(q => q.subject))].length + " subjects" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--off-white)", borderRadius: "var(--radius-sm)", padding: "0.85rem 0.5rem" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>{value.split(" ")[0]}</div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* subjects list */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center", marginBottom: "2rem" }}>
              {[...new Set(QUESTIONS.map(q => q.subject))].map(s => (
                <span key={s} style={{ background: "var(--navy)", color: "white", fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: 20 }}>
                  {s}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <button
                onClick={() => setStarted(true)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "var(--yellow)", color: "var(--navy)", border: "none",
                  borderRadius: 10, padding: "0.85rem", width: "100%",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer",
                }}
              >
                Start Quiz
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  background: "none", border: "1.5px solid var(--border)", borderRadius: 10,
                  padding: "0.75rem", width: "100%", cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "var(--muted)",
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* progress bar */}
      <div style={{ height: 4, background: "var(--border)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--yellow)", transition: "width .3s" }} />
      </div>

      <div style={{ padding: "1.5rem 2rem 2rem", maxWidth: 780, margin: "0 auto" }}>

        {/* ── header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={() => router.push("/dashboard")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "grid", placeItems: "center", color: "var(--muted)" }}
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 2 }}>
                <span style={{ background: "var(--off-white)", color: "var(--navy)", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 6 }}>
                  {q.subject}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Topic: {q.topic.split("•")[1]?.trim() ?? q.topic}</span>
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--navy)" }}>
                Question <span style={{ color: "var(--yellow-dark)" }}>{current + 1}</span> of {QUESTIONS.length}
              </div>
            </div>
          </div>

          {/* timer */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            background: isLowTime ? "#fef2f2" : "var(--off-white)",
            border: `1.5px solid ${isLowTime ? "#ef4444" : "var(--border)"}`,
            borderRadius: 10, padding: "0.45rem 0.85rem",
          }}>
            <Clock size={14} color={isLowTime ? "#ef4444" : "var(--muted)"} strokeWidth={2} />
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: isLowTime ? "#ef4444" : "var(--navy)", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* ── question dot map ── */}
        <div style={{
          background: "white", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
          padding: "0.85rem 1rem", marginBottom: "1.25rem",
          display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center",
        }}>
          {QUESTIONS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={dotStyle(i)}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* ── question card ── */}
        <div style={{
          background: "white", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", padding: "1.5rem",
          marginBottom: "1rem",
        }}>
          {/* difficulty + hint */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              border: `1.5px solid ${difficultyColor[q.difficulty]}`,
              color: difficultyColor[q.difficulty],
              borderRadius: 20, padding: "0.2rem 0.65rem",
              fontSize: "0.72rem", fontWeight: 700,
            }}>
              <Zap size={11} strokeWidth={2.5} /> {q.difficulty}
            </span>
            <button style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: "50%", width: 28, height: 28, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <HelpCircle size={14} color="var(--muted)" strokeWidth={2} />
            </button>
          </div>

          {/* question text */}
          <div style={{ borderLeft: "3px solid var(--yellow-dark)", paddingLeft: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--navy)", lineHeight: 1.7 }}>
              {q.text}
            </p>
          </div>

          {/* options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => selectOption(i)} style={optionStyle(i)}>
                <span style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: isSubmitted && i === q.correct ? "#22c55e"
                    : isSubmitted && selected === i && i !== q.correct ? "#ef4444"
                    : selected === i ? "var(--yellow-dark)" : "var(--off-white)",
                  color: (isSubmitted && i === q.correct) || (isSubmitted && selected === i) || selected === i ? "white" : "var(--muted)",
                  display: "grid", placeItems: "center",
                  fontSize: "0.78rem", fontWeight: 800,
                  transition: "background .15s",
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: "0.9rem", color: "var(--navy)", fontWeight: 500 }}>{opt}</span>
              </button>
            ))}
          </div>

          {/* AI explanation (after submit) */}
          {isSubmitted && (
            <div style={{
              marginTop: "1.25rem", background: "var(--off-white)",
              borderRadius: "var(--radius-sm)", padding: "1rem",
              borderLeft: "3px solid var(--yellow-dark)",
            }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--yellow-dark)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                AI Tutor Explanation
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>{q.explanation}</p>
            </div>
          )}
        </div>

        {/* ── navigation ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={goPrev}
            disabled={current === 0}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "white", border: "1.5px solid var(--border)",
              borderRadius: 10, padding: "0.75rem 1.25rem",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
              fontSize: "0.88rem", color: current === 0 ? "var(--muted)" : "var(--navy)",
              cursor: current === 0 ? "default" : "pointer",
              opacity: current === 0 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} strokeWidth={2} /> Previous Question
          </button>

          <div style={{ display: "flex", gap: "0.65rem" }}>
            {!isSubmitted && selected !== null && (
              <button
                onClick={submitAnswer}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--yellow)", color: "var(--navy)",
                  border: "none", borderRadius: 10, padding: "0.75rem 1.5rem",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                  fontSize: "0.88rem", cursor: "pointer",
                }}
              >
                Submit Answer
              </button>
            )}

            {(isSubmitted || selected === null) && (
              <button
                onClick={current === QUESTIONS.length - 1 ? finishQuiz : goNext}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--navy)", color: "white",
                  border: "none", borderRadius: 10, padding: "0.75rem 1.5rem",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                  fontSize: "0.88rem", cursor: "pointer",
                }}
              >
                {current === QUESTIONS.length - 1 ? "Finish Quiz" : "Next"}
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
