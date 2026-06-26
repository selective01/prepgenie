"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, ChevronRight, Clock, HelpCircle, Zap, Loader2 } from "lucide-react";

const API        = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const QUESTIONS_COUNT = 20;
const MINS_PER_QUESTION = 2;
const TOTAL_TIME = QUESTIONS_COUNT * MINS_PER_QUESTION * 60; // 40 mins

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];

// ── types ─────────────────────────────────────────────────────────────────────

interface Question {
  text:       string;
  options:    string[];
  subject:    string;
  topic:      string;
  difficulty: string;
  // only present after submit
  correct?:     number;
  explanation?: string;
  userAnswer?:  number | null;
  isCorrect?:   boolean;
  submitted?:   boolean;
}

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
  const router       = useRouter();
  const { token, user } = useAuth();

  // quiz config state
  const [started,    setStarted]   = useState(false);
  // Override pattern — undefined means fall back to user's first subject
  const [subjectOverride, setSubjectOverride] = useState<string | undefined>(undefined);
  const defaultSubject = user?.subjects?.length
    ? (user.subjects[0] === "English" ? "Use of English" : user.subjects[0])
    : "Use of English";
  const subject = subjectOverride ?? defaultSubject;
  const [generating, setGenerating] = useState(false);
  const [genError,   setGenError]  = useState("");

  // quiz session state
  const [quizId,    setQuizId]    = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers,   setAnswers]   = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState<boolean[]>([]);
  const [current,   setCurrent]   = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_TIME);
  const [finishing, setFinishing] = useState(false);

  const q           = questions[current];
  const selected    = answers[current];
  const isSubmitted = submitted[current];

  // countdown
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft]);

  // auto-finish when timer hits 0
  useEffect(() => {
    if (started && timeLeft <= 0) finishQuiz();
  }, [timeLeft, started]);

  // ── generate quiz from API ─────────────────────────────────────────────────
  async function startQuiz() {
    setGenError("");
    setGenerating(true);
    try {
      const res  = await fetch(`${API}/api/quiz/generate`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, count: 20 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setQuizId(data.quizId);
      setQuestions(data.questions);
      setAnswers(Array(data.questions.length).fill(null));
      setSubmitted(Array(data.questions.length).fill(false));
      setCurrent(0);
      setTimeLeft(TOTAL_TIME);
      setStarted(true);
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : "Failed to generate quiz. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  // ── select answer ──────────────────────────────────────────────────────────
  function selectOption(i: number) {
    if (isSubmitted) return;
    setAnswers(prev => { const a = [...prev]; a[current] = i; return a; });
  }

  // ── submit current answer ─────────────────────────────────────────────────
  function submitAnswer() {
    if (selected === null) return;
    setSubmitted(prev => { const s = [...prev]; s[current] = true; return s; });
  }

  function goNext() {
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else finishQuiz();
  }

  function goPrev() {
    if (current > 0) setCurrent(c => c - 1);
  }

  // ── finish quiz: submit to API ────────────────────────────────────────────
  async function finishQuiz() {
    if (!quizId || finishing) return;
    setFinishing(true);
    try {
      const timeTaken = TOTAL_TIME - timeLeft;
      const res = await fetch(`${API}/api/quiz/submit`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ quizId, answers, timeTaken }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Store results in sessionStorage for the results page
      sessionStorage.setItem("quizResults", JSON.stringify(data));
      router.push("/quiz/results");
    } catch (err) {
      console.error("Finish quiz error:", err);
      // fallback — go to results with local data
      sessionStorage.setItem("quizResults", JSON.stringify({ questions, answers, submitted }));
      router.push("/quiz/results");
    } finally {
      setFinishing(false);
    }
  }

  // ── option styles ──────────────────────────────────────────────────────────
  function optionStyle(i: number): React.CSSProperties {
    const base: React.CSSProperties = {
      display: "flex", alignItems: "center", gap: "1rem",
      padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)",
      borderWidth: "1.5px", borderStyle: "solid", borderColor: "var(--border)",
      background: "white",
      cursor: isSubmitted ? "default" : "pointer",
      transition: "border-color .15s, background .15s",
      width: "100%", textAlign: "left", fontFamily: "'DM Sans',sans-serif",
    };
    if (!isSubmitted) {
      if (selected === i) return { ...base, borderColor: "var(--yellow-dark)", background: "var(--yellow-xlight)" };
      return base;
    }
    if (i === (q.correct ?? -1)) return { ...base, borderColor: "#22c55e", background: "#f0fdf4", cursor: "default" };
    if (selected === i) return { ...base, borderColor: "#ef4444", background: "#fef2f2", cursor: "default" };
    return { ...base, opacity: 0.5, cursor: "default" };
  }

  function dotStyle(i: number): React.CSSProperties {
    const isActive   = i === current;
    const isAnswered = answers[i] !== null;
    const isDone     = submitted[i];
    return {
      width: isActive ? 32 : 28, height: isActive ? 32 : 28,
      borderRadius: "50%", display: "grid", placeItems: "center",
      fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
      border: isActive ? "2px solid var(--navy)" : "1.5px solid var(--border)",
      background: isActive ? "var(--navy)" : isDone ? "var(--off-white)" : isAnswered ? "var(--yellow-light)" : "white",
      color: isActive ? "white" : "var(--navy)",
      transition: "all .15s", flexShrink: 0,
    };
  }

  const isLowTime = timeLeft < 60;
  const progress  = questions.length ? ((current + 1) / questions.length) * 100 : 0;

  // ── START SCREEN ──────────────────────────────────────────────────────────
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
            <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              The timer starts the moment you click Start Quiz.
            </p>

            {/* subject selector */}
            <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>
                Select Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubjectOverride(e.target.value)}
                style={{
                  width: "100%", padding: "0.72rem 0.9rem",
                  border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
                  color: "var(--navy)", background: "white", outline: "none",
                }}
              >
                {[...new Set((user?.subjects ?? []).map(s =>
                    s === "English" ? "Use of English" : s
                  ))].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* meta */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Questions", value: String(questions.length || QUESTIONS_COUNT) },
                { label: "Time Limit", value: `${QUESTIONS_COUNT * MINS_PER_QUESTION} min` },
                { label: "Subject",    value: subject   },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--off-white)", borderRadius: "var(--radius-sm)", padding: "0.85rem 0.5rem" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--muted)", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>

            {genError && (
              <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{genError}</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <button
                onClick={startQuiz}
                disabled={generating}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "var(--yellow)", color: "var(--navy)", border: "none",
                  borderRadius: 10, padding: "0.85rem", width: "100%",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.95rem",
                  cursor: generating ? "default" : "pointer", opacity: generating ? 0.7 : 1,
                }}
              >
                {generating
                  ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Generating quiz...</>
                  : <><Zap size={17} strokeWidth={2.5} /> Start Quiz</>
                }
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
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </AppShell>
    );
  }

  // ── QUIZ SCREEN ───────────────────────────────────────────────────────────
  if (!q) return null;

  return (
    <AppShell>
      {/* progress bar */}
      <div style={{ height: 4, background: "var(--border)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--yellow)", transition: "width .3s" }} />
      </div>

      <div style={{ padding: "1.5rem 2rem 2rem", maxWidth: 780, margin: "0 auto" }}>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--muted)" }}>
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 2 }}>
                <span style={{ background: "var(--off-white)", color: "var(--navy)", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 6 }}>
                  {q.subject}
                </span>
                {q.topic && <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Topic: {q.topic}</span>}
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--navy)" }}>
                Question <span style={{ color: "var(--yellow-dark)" }}>{current + 1}</span> of {questions.length}
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

        {/* dot map */}
        <div style={{
          background: "white", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
          padding: "0.85rem 1rem", marginBottom: "1.25rem",
          display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center",
        }}>
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={dotStyle(i)}>{i + 1}</button>
          ))}
        </div>

        {/* question card */}
        <div style={{ background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              border: `1.5px solid ${difficultyColor[q.difficulty] || "var(--muted)"}`,
              color: difficultyColor[q.difficulty] || "var(--muted)",
              borderRadius: 20, padding: "0.2rem 0.65rem",
              fontSize: "0.72rem", fontWeight: 700,
            }}>
              <Zap size={11} strokeWidth={2.5} /> {q.difficulty}
            </span>
            <button style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: "50%", width: 28, height: 28, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <HelpCircle size={14} color="var(--muted)" strokeWidth={2} />
            </button>
          </div>

          <div style={{ borderLeft: "3px solid var(--yellow-dark)", paddingLeft: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--navy)", lineHeight: 1.7 }}>{q.text}</p>
          </div>

          {/* options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => selectOption(i)} style={optionStyle(i)}>
                <span style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: isSubmitted && i === (q.correct ?? -1) ? "#22c55e"
                    : isSubmitted && selected === i ? "#ef4444"
                    : selected === i ? "var(--yellow-dark)" : "var(--off-white)",
                  color: (isSubmitted || selected === i) ? "white" : "var(--muted)",
                  display: "grid", placeItems: "center",
                  fontSize: "0.78rem", fontWeight: 800, transition: "background .15s",
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: "0.9rem", color: "var(--navy)", fontWeight: 500 }}>{opt}</span>
              </button>
            ))}
          </div>

          {/* explanation after submit */}
          {isSubmitted && q.explanation && (
            <div style={{ marginTop: "1.25rem", background: "var(--off-white)", borderRadius: "var(--radius-sm)", padding: "1rem", borderLeft: "3px solid var(--yellow-dark)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--yellow-dark)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                AI Tutor Explanation
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>{q.explanation}</p>
            </div>
          )}
        </div>

        {/* navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={goPrev} disabled={current === 0}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "white", border: "1.5px solid var(--border)", borderRadius: 10, padding: "0.75rem 1.25rem",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.88rem",
              color: current === 0 ? "var(--muted)" : "var(--navy)",
              cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} strokeWidth={2} /> Previous
          </button>

          <div style={{ display: "flex", gap: "0.65rem" }}>
            {!isSubmitted && selected !== null && (
              <button onClick={submitAnswer} style={{
                background: "var(--yellow)", color: "var(--navy)", border: "none",
                borderRadius: 10, padding: "0.75rem 1.5rem",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.88rem", cursor: "pointer",
              }}>
                Submit Answer
              </button>
            )}
            {(isSubmitted || selected === null) && (
              <button
                onClick={current === questions.length - 1 ? finishQuiz : goNext}
                disabled={finishing}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--navy)", color: "white", border: "none",
                  borderRadius: 10, padding: "0.75rem 1.5rem",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.88rem",
                  cursor: finishing ? "default" : "pointer",
                }}
              >
                {finishing
                  ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  : current === questions.length - 1 ? "Finish Quiz" : "Next"
                }
                {!finishing && <ChevronRight size={16} strokeWidth={2.5} />}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
}
