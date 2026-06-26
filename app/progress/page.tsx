"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import {
  TrendingUp, AlertCircle, Flame, CalendarDays,
  ChevronRight, Download, SlidersHorizontal, ArrowRight,
} from "lucide-react";

// ── mock data ─────────────────────────────────────────────────────────────────

const SCORE_7D = [
  { day: "Mon", score: 48 },
  { day: "Tue", score: 55 },
  { day: "Wed", score: 52 },
  { day: "Thu", score: 61 },
  { day: "Fri", score: 67 },
  { day: "Sat", score: 72 },
  { day: "Sun", score: 78 },
];

const SCORE_30D = [
  { day: "W1",  score: 42 },
  { day: "W2",  score: 51 },
  { day: "W3",  score: 58 },
  { day: "W4",  score: 65 },
  { day: "W5",  score: 62 },
  { day: "W6",  score: 70 },
  { day: "W7",  score: 75 },
];

const SUBJECTS = [
  { name: "Mathematics",  score: 78, icon: "∑" },
  { name: "Physics",      score: 64, icon: "⚛" },
  { name: "English",      score: 82, icon: "A" },
  { name: "Biology",      score: 42, icon: "🧬" },
];

const WEAK_AREAS: { topic: string; subject: string; accuracy: number; lastQuiz: string }[] = [];

const STREAK_DAYS = 0;
const TOTAL_DAYS  = 0;
const PREP_SCORE  = 0;

// Generate 90-day heatmap data (mock — last 12 days active in a pattern)
function generateHeatmap() {
  const cells: boolean[] = Array(90).fill(false);
  // simulate activity pattern matching the design
  const activePattern = [
    0,1,2,3,4,5,6,7,8,9,10,11,         // last 12 days (streak)
    14,15,16,18,19,21,22,23,25,26,      // some days before
    28,29,31,32,34,35,36,38,39,40,      // more sparse
    42,43,45,47,49,50,52,54,56,58,60,62 // further back
  ];
  activePattern.forEach(i => { if (i < 90) cells[89 - i] = true; });
  return cells;
}
const HEATMAP: boolean[] = Array(90).fill(false);

// ── mini chart ────────────────────────────────────────────────────────────────

function ScoreChart({ data }: { data: { day: string; score: number }[] }) {
  const max    = 100;
  const W      = 500;
  const H      = 160;
  const padX   = 40;
  const padY   = 20;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const points = data.map((d, i) => ({
    x: data.length === 1 ? padX + chartW / 2 : padX + (i / (data.length - 1)) * chartW,
    y: padY + chartH - (d.score / max) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      {/* y-axis labels */}
      {[0, 25, 50, 75, 100].map(v => {
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={v}>
            <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="#e4e8f0" strokeWidth="1" strokeDasharray="4,4" />
            <text x={padX - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#6b7280">{v}%</text>
          </g>
        );
      })}

      {/* area fill */}
      <path d={areaPath} fill="rgba(245,194,0,0.15)" />

      {/* line */}
      <path d={linePath} fill="none" stroke="#0d1b3e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--yellow)" stroke="var(--navy)" strokeWidth="1.5" />
      ))}

      {/* x-axis labels */}
      {data.map((d, i) => (
        <text key={i} x={points[i].x} y={H - 2} textAnchor="middle" fontSize="10" fill="#6b7280">{d.day}</text>
      ))}
    </svg>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const router  = useRouter();
  const { token } = useAuth();
  const [range, setRange] = useState<"7" | "30">("7");
  const [dataLoading, setDataLoading] = useState(true);
  const [apiData, setApiData] = useState<{
    totalQuizzes: number; avgScore: number; currentStreak: number;
    totalCorrect: number; totalWrong: number;
    subjectBreakdown: { subject: string; avgScore: number; quizzes: number }[];
    weakAreas: { subject: string; topic: string; lastAccuracy: number }[];
    recentHistory: { score: number; takenAt: string; subject: string }[];
    streakDays: { date: string; studied: boolean }[];
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/progress`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setApiData(d.data); })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [token]);
  // build chart data from real quiz history or fall back to mock
  const chartData = apiData?.recentHistory?.length
    ? apiData.recentHistory.map((h, i) => ({
        day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i % 7],
        score: h.score,
      }))
    : (range === "7" ? SCORE_7D : SCORE_30D);

  const data   = chartData;
  const latest = data[data.length - 1]?.score ?? 0;
  const prev   = data[data.length - 2]?.score ?? 0;
  const change = latest - prev;

  // use real subject data or fall back to mock
  const subjectData = apiData?.subjectBreakdown?.length
    ? apiData.subjectBreakdown.map(s => ({ name: s.subject, score: s.avgScore, icon: "📚" }))
    : SUBJECTS;

  const weakAreasData = apiData?.weakAreas?.length
    ? apiData.weakAreas.map(w => ({ topic: w.topic, subject: w.subject, accuracy: 15, lastQuiz: `${w.lastAccuracy}%` }))
    : WEAK_AREAS;

  const streakDays  = apiData?.currentStreak ?? STREAK_DAYS;
  const totalDays   = apiData?.streakDays?.length ?? TOTAL_DAYS;
  const prepScore   = apiData ? Math.round((apiData.avgScore / 100) * 400 + (apiData.totalCorrect * 2)) : PREP_SCORE;

  // build heatmap from real streak days
  const heatmap = apiData?.streakDays
    ? (() => {
        const cells = Array(90).fill(false);
        const today = new Date();
        apiData.streakDays.forEach(d => {
          const diff = Math.floor((today.getTime() - new Date(d.date).getTime()) / 86400000);
          if (diff >= 0 && diff < 90) cells[89 - diff] = d.studied;
        });
        return cells;
      })()
    : HEATMAP;


  function exportReport() {
    const rows: (string | number)[][] = [
      ["PrepGenie Progress Report"],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [""],
      ["OVERALL SUMMARY"],
      ["Total Quizzes",  apiData?.totalQuizzes ?? 0],
      ["Average Score",  `${apiData?.avgScore ?? 0}%`],
      ["Total Correct",  apiData?.totalCorrect ?? 0],
      ["Total Wrong",    apiData?.totalWrong ?? 0],
      ["Current Streak", `${apiData?.currentStreak ?? 0} days`],
      [""],
      ["SUBJECT BREAKDOWN"],
      ["Subject", "Avg Score", "Quizzes Taken"],
      ...subjectData.map(s => [s.name, `${s.score}%`, apiData?.subjectBreakdown?.find(b => b.subject === s.name)?.quizzes ?? 0]),
      [""],
      ["WEAK AREAS (below 60%)"],
      ["Topic", "Subject", "Last Accuracy"],
      ...weakAreasData.map(w => [w.topic, w.subject, w.lastQuiz]),
      [""],
      ["RECENT QUIZ HISTORY"],
      ["Subject", "Score", "Date"],
      ...(apiData?.recentHistory ?? []).map(h => [
        h.subject, `${h.score}%`, new Date(h.takenAt).toLocaleDateString(),
      ]),
    ];
    const csv  = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `PrepGenie_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      {dataLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--navy)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Loading your progress...</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
      <div style={{ padding: "2rem 2rem 3rem" }}>

        {/* ── header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>
              Progress Tracker
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Analysing your preparation journey. You are in the top 15% of students studying for JAMB.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "0.5rem 0.9rem", fontSize: "0.78rem", fontWeight: 600, color: "var(--navy)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              <SlidersHorizontal size={14} strokeWidth={2} /> Filter Subjects
            </button>
            <button onClick={exportReport} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--navy)", border: "none", borderRadius: 8, padding: "0.5rem 0.9rem", fontSize: "0.78rem", fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              <Download size={14} strokeWidth={2} /> Export Report
            </button>
          </div>
        </div>

        {/* ── range toggle ── */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem" }}>
          {(["7", "30"] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: "0.4rem 1rem", borderRadius: 8,
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.8rem",
              cursor: "pointer",
              background: range === r ? "var(--navy)" : "white",
              color: range === r ? "white" : "var(--muted)",
              border: range === r ? "none" : "1px solid var(--border)",
            } as React.CSSProperties}>
              {r} Days
            </button>
          ))}
        </div>

        {/* ── top row: chart + subject proficiency ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", marginBottom: "1.25rem" }} className="progress-top-grid">

          {/* score chart */}
          <div style={{ background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--navy)", marginBottom: 2 }}>Score Performance</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Your average quiz accuracy over time</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: change >= 0 ? "#f0fdf4" : "#fef2f2", borderRadius: 20, padding: "0.3rem 0.75rem" }}>
                <TrendingUp size={13} color={change >= 0 ? "#22c55e" : "#ef4444"} strokeWidth={2} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: change >= 0 ? "#22c55e" : "#ef4444" }}>
                  {change >= 0 ? "+" : ""}{change}%
                </span>
              </div>
            </div>
            <ScoreChart data={data} />
          </div>

          {/* subject proficiency */}
          <div style={{ background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "1.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--navy)", marginBottom: 4 }}>Subject Mastery</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1.25rem" }}>Performance across core subjects</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {subjectData.map(({ name, score }) => {
                const isWeak = score < 60;
                return (
                  <div key={name}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--navy)" }}>{name}</span>
                      <span style={{ fontSize: "0.88rem", fontWeight: 800, color: isWeak ? "#ef4444" : "var(--navy)" }}>{score}%</span>
                    </div>
                    <div style={{ height: 7, background: "var(--off-white)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${score}%`, background: isWeak ? "#ef4444" : "var(--navy)", borderRadius: 4, transition: "width .6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── bottom row: weak areas + heatmap ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="progress-bottom-grid">

          {/* weak areas */}
          <div id="critical-gaps" style={{ background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle size={17} color="#ef4444" strokeWidth={2} />
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--navy)" }}>Critical Gaps</span>
              </div>
              <button style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--yellow-dark)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                View All
              </button>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1.1rem" }}>Focus on these to boost your overall score</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {weakAreasData.map(({ topic, subject, accuracy, lastQuiz }) => (
                <div key={topic} style={{
                  border: "1.5px solid #ef4444", borderRadius: "var(--radius-sm)",
                  padding: "0.85rem 1rem",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 3 }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, background: "var(--off-white)", color: "var(--muted)", padding: "0.1rem 0.5rem", borderRadius: 4 }}>{subject}</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>↗ {accuracy} mins</span>
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--navy)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topic}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Last Quiz: {lastQuiz} accuracy</div>
                  </div>
                  <button
                    onClick={() => router.push("/quiz")}
                    style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "var(--yellow-dark)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.78rem", flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    Practise Now <ChevronRight size={13} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => document.getElementById("critical-gaps")?.scrollIntoView({ behavior: "smooth" })}
              style={{ display: "flex", alignItems: "center", gap: 5, marginTop: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--yellow-dark)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.82rem" }}
            >
              View Full Analysis <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>

          {/* consistency heatmap */}
          <div style={{ background: "var(--navy)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Flame size={17} color="var(--yellow)" strokeWidth={2} />
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "white" }}>90-Day Streak</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--yellow)" }}>
                {streakDays} DAYS
              </span>
            </div>

            {/* stats row */}
            <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <CalendarDays size={13} color="rgba(255,255,255,.4)" strokeWidth={2} />
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.5)" }}>Total Days: {totalDays}</span>
              </div>
            </div>

            {/* heatmap grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: 4, marginBottom: "0.85rem" }}>
              {heatmap.map((active, i) => (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: 4,
                  background: active ? "var(--yellow)" : "rgba(255,255,255,.08)",
                  transition: "background .2s",
                }} />
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,.4)" }}>Less</span>
                {[0.08, 0.2, 0.4, 0.7, 1].map((o, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: 3, background: `rgba(245,194,0,${o})` }} />
                ))}
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,.4)" }}>More</span>
              </div>
            </div>

            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.4)", fontStyle: "italic", marginBottom: "1.25rem" }}>
              Consistency is the key to retention. Don&apos;t break the chain!
            </p>

            {/* rank */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,.1)" }}>
              <div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Current Rank</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "white" }}>Consistency Master</div>
              </div>
              <button style={{ background: "rgba(255,255,255,.1)", border: "none", borderRadius: 8, padding: "0.45rem 0.9rem", fontSize: "0.78rem", fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                Leaderboard
              </button>
            </div>
          </div>
        </div>

        {/* ── prep score ── */}
        <div style={{
          background: "white", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", padding: "1.25rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Prep Score</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.2rem", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>
              {prepScore}
            </div>
          </div>
          <button
            onClick={() => router.push("/quiz")}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--yellow)", border: "none", cursor: "pointer",
              display: "grid", placeItems: "center",
            }}
          >
            <ArrowRight size={20} color="var(--navy)" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width: 900px) {
          .progress-top-grid { grid-template-columns: 1fr !important; }
          .progress-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppShell>
  );
}
