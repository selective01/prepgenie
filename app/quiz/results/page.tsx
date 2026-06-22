"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { CheckCircle2, XCircle, MinusCircle, RotateCcw, PlusCircle, ChevronDown, ChevronUp, Lightbulb, Trophy } from "lucide-react";
import Link from "next/link";

// ── mock questions (same as quiz page) ───────────────────────────────────────

const QUESTIONS = [
  {
    id: 1, subject: "Biology", topic: "Cell Biology",
    text: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correct: 1,
    explanation: "The mitochondria generates most of the cell's ATP through cellular respiration, earning its nickname as the powerhouse of the cell.",
  },
  {
    id: 2, subject: "Chemistry", topic: "Organic Chemistry",
    text: "What is the primary function of Ribosomes?",
    options: ["Energy production", "Protein synthesis", "DNA replication", "Lipid storage"],
    correct: 1,
    explanation: "Ribosomes are responsible for synthesizing proteins by translating messenger RNA (mRNA) into polypeptide chains.",
  },
  {
    id: 3, subject: "Biology", topic: "Cell Biology",
    text: "Which of the following is found only in plant cells?",
    options: ["Mitochondria", "Ribosome", "Cell wall", "Nucleus"],
    correct: 2,
    explanation: "Cell walls are found only in plant cells (and fungi/bacteria). Animal cells have only a cell membrane.",
  },
  {
    id: 4, subject: "Biology", topic: "Cell Biology",
    text: "Who discovered the first living cell?",
    options: ["Louis Pasteur", "Robert Hooke", "Anton van Leeuwenhoek", "Charles Darwin"],
    correct: 2,
    explanation: "Anton van Leeuwenhoek was the first to observe living cells (microorganisms) using a microscope he built himself in the 1670s.",
  },
];

// Mock results: Q1 correct, Q2 wrong (answered 0), Q3 correct, Q4 skipped
const MOCK_ANSWERS  = [1, 0, 2, null];
const MOCK_SUBMITTED = [true, true, true, false];

// ── score dial ────────────────────────────────────────────────────────────────

function ScoreDial({ score }: { score: number }) {
  const r = 72;
  const circ = 2 * Math.PI * r;
  const dashRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;
    const offset = circ - (score / 100) * circ;
    el.style.transition = "stroke-dashoffset 1s ease";
    el.style.strokeDashoffset = String(offset);
  }, [score, circ]);

  return (
    <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>
      <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
        {/* track */}
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        {/* fill */}
        <circle
          ref={dashRef}
          cx="90" cy="90" r={r} fill="none"
          stroke="var(--yellow)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.4rem", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>
          {score}%
        </span>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
          SCORE
        </span>
      </div>
    </div>
  );
}

// ── question accordion row ────────────────────────────────────────────────────

function QuestionRow({ q, userAnswer, wasSubmitted, index }: {
  q: typeof QUESTIONS[0];
  userAnswer: number | null;
  wasSubmitted: boolean;
  index: number;
}) {
  const [open, setOpen] = useState(index === 1); // Q2 open by default (wrong)

  const isCorrect = wasSubmitted && userAnswer === q.correct;
  const isWrong   = wasSubmitted && userAnswer !== null && userAnswer !== q.correct;


  const borderColor = isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "var(--border)";
  const statusLabel = isCorrect ? "Correct" : isWrong ? "Wrong" : "Skipped";
  const StatusIcon  = isCorrect ? CheckCircle2 : isWrong ? XCircle : MinusCircle;
  const iconColor   = isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "var(--muted)";

  return (
    <div style={{
      border: `1.5px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)", overflow: "hidden",
      background: "white",
    }}>
      {/* header row */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.85rem 1rem", background: "none", border: "none", cursor: "pointer",
          textAlign: "left", gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", flexShrink: 0 }}>
            QUESTION {index + 1}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: isCorrect ? "#f0fdf4" : isWrong ? "#fef2f2" : "var(--off-white)",
            color: iconColor, borderRadius: 20, padding: "0.15rem 0.55rem",
            fontSize: "0.68rem", fontWeight: 800, flexShrink: 0,
          }}>
            <StatusIcon size={11} strokeWidth={2.5} /> {statusLabel}
          </span>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {q.text}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", background: "var(--off-white)", color: "var(--muted)", padding: "0.2rem 0.55rem", borderRadius: 6, fontWeight: 600 }}>
            {q.subject}
          </span>
          {open ? <ChevronUp size={16} color="var(--muted)" /> : <ChevronDown size={16} color="var(--muted)" />}
        </div>
      </button>

      {/* expanded detail */}
      {open && (
        <div style={{ padding: "0 1rem 1rem", borderTop: "1px solid var(--border)" }}>
          {isWrong && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.85rem", marginBottom: "0.85rem" }}>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Your Choice</div>
                <div style={{ background: "#fef2f2", border: "1px solid #ef4444", borderRadius: 6, padding: "0.5rem 0.75rem", fontSize: "0.85rem", color: "#ef4444", fontWeight: 600 }}>
                  {q.options[userAnswer!]}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Correct Answer</div>
                <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 6, padding: "0.5rem 0.75rem", fontSize: "0.85rem", color: "var(--navy)", fontWeight: 600 }}>
                  {q.options[q.correct]}
                </div>
              </div>
            </div>
          )}

          <div style={{ background: "var(--off-white)", borderRadius: "var(--radius-sm)", padding: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 800, color: "var(--yellow-dark)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
              <Lightbulb size={12} strokeWidth={2.5} /> AI Tutor Explanation
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: 1.7 }}>{q.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function QuizResultsPage() {
  const router = useRouter();

  // use mock data (in real app would read from sessionStorage/API)
  const answers   = MOCK_ANSWERS;
  const submitted = MOCK_SUBMITTED;

  const correct = answers.filter((a, i) => submitted[i] && a === QUESTIONS[i].correct).length;
  const wrong   = answers.filter((a, i) => submitted[i] && a !== null && a !== QUESTIONS[i].correct).length;
  const skipped = QUESTIONS.length - correct - wrong;
  const score   = Math.round((correct / QUESTIONS.length) * 100);

  const getMessage = () => {
    if (score >= 80) return { title: "Great Job, Alex!", sub: "Biology Mastery Level: Expert", desc: "You've mastered the basics of Cell Biology! Keep focusing on Mitochondria-related questions to hit 100%." };
    if (score >= 60) return { title: "Excellent Effort, Alex!", sub: "Good progress!", desc: "You've shown strong mastery in Biology and Literature. Let's brush up on those History dates." };
    return { title: "Keep Practising, Alex!", sub: "Room to grow!", desc: "Don't be discouraged — reviewing these explanations will help you improve next time." };
  };

  const msg = getMessage();

  return (
    <AppShell>
      <div style={{ padding: "2rem", maxWidth: 820, margin: "0 auto" }}>

        {/* ── score hero ── */}
        <div style={{
          background: "white", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", padding: "2rem",
          textAlign: "center", marginBottom: "1.25rem",
        }}>
          <ScoreDial score={score} />
          <div style={{ marginTop: "1.25rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--navy)", color: "white",
              borderRadius: 20, padding: "0.35rem 1rem",
              fontSize: "0.78rem", fontWeight: 800, marginBottom: "0.65rem",
            }}>
              <Trophy size={13} strokeWidth={2} color="var(--yellow)" /> {msg.title.toUpperCase()}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.4rem" }}>
              {msg.sub}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
              {msg.desc}
            </p>
          </div>
        </div>

        {/* ── stat cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Correct",  value: correct, icon: CheckCircle2, color: "#22c55e" },
            { label: "Wrong",    value: wrong,   icon: XCircle,      color: "#ef4444" },
            { label: "Skipped",  value: skipped, icon: MinusCircle,  color: "var(--muted)" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{
              background: "white", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)", padding: "1rem",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
            }}>
              <Icon size={22} color={color} strokeWidth={2} />
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--navy)" }}>{value}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── detailed analysis ── */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
            <h3 style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Detailed Analysis
            </h3>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{QUESTIONS.length} Questions</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {QUESTIONS.map((q, i) => (
              <QuestionRow
                key={q.id}
                q={q}
                userAnswer={answers[i]}
                wasSubmitted={submitted[i]}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* ── CTAs ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={() => router.push("/quiz")}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              justifyContent: "center", background: "var(--yellow)", color: "var(--navy)",
              border: "none", borderRadius: 10, padding: "0.9rem",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer",
            }}
          >
            <PlusCircle size={18} strokeWidth={2.5} /> Take New Quiz
          </button>
          <button
            onClick={() => router.push("/quiz")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none", cursor: "pointer",
              color: "var(--navy)", fontFamily: "'DM Sans',sans-serif",
              fontWeight: 600, fontSize: "0.88rem",
            }}
          >
            <RotateCcw size={16} strokeWidth={2} /> Retry Quiz
          </button>
          <Link href="/progress" style={{ fontSize: "0.82rem", color: "var(--yellow-dark)", fontWeight: 600, textDecoration: "none" }}>
            View My Progress →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
