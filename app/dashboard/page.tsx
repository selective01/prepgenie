"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import NotificationsPanel from "@/components/layout/NotificationsPanel";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import {
  Flame, Trophy, ClipboardList, CheckCircle2,
  MessageSquare, TrendingUp, Clock,
  Bell, Zap,
} from "lucide-react";

// ── mock data ────────────────────────────────────────────────────────────────
const stats = [
  { label: "Day Streak",  value: "0",  sub: "days",    icon: Flame,         iconColor: "#f97316" },
  { label: "Avg. Score",  value: "0%", sub: "overall", icon: Trophy,        iconColor: "#d4a800" },
  { label: "Goals Met",   value: "0",  sub: "total",   icon: CheckCircle2,  iconColor: "#4a90d9" },
  { label: "Ques. Done",  value: "0",  sub: "correct", icon: ClipboardList, iconColor: "#8b5cf6" },
];

const tasks: { subject: string; topic: string; duration: string; done: boolean }[] = [];

const subjectPerformance: { subject: string; pct: number }[] = [];

// ── helpers ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, iconColor }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconColor: string;
}) {
  return (
    <div style={{
      background: "white", borderRadius: "var(--radius)",
      padding: "1.25rem", boxShadow: "var(--shadow)",
      display: "flex", flexDirection: "column", gap: "0.5rem",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${iconColor}15`, display: "grid", placeItems: "center",
      }}>
        <Icon size={20} color={iconColor} strokeWidth={2} />
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>
        {value}
      </div>
      <div>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{sub}</div>
      </div>
    </div>
  );
}

function TaskRow({ subject, topic, duration, done, color = "#4a90d9" }: {
  subject: string; topic: string; duration: string; done: boolean; color?: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.75rem",
      padding: "0.85rem 1rem",
      background: "white", borderRadius: "var(--radius-sm)",
      boxShadow: "0 1px 4px rgba(13,27,62,.06)",
      opacity: done ? 0.55 : 1,
    }}>
      {/* checkbox */}
      <div style={{
        width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: "pointer",
        background: done ? "var(--navy)" : "white",
        border: done ? "none" : "2px solid var(--border)",
        display: "grid", placeItems: "center",
      }}>
        {done && <CheckCircle2 size={12} color="white" strokeWidth={3} />}
      </div>

      {/* colour dot */}
      <div style={{ width: 4, height: 36, borderRadius: 4, background: color, flexShrink: 0 }} />

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
          {subject}
        </div>
        <div style={{
          fontSize: "0.9rem", fontWeight: 600, color: "var(--navy)",
          textDecoration: done ? "line-through" : "none",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {topic}
        </div>
      </div>

      {/* duration */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--muted)", fontSize: "0.76rem", flexShrink: 0 }}>
        <Clock size={12} strokeWidth={2} />
        {duration}
      </div>
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, token } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const [dashData, setDashData] = useState<{
    stats: { currentStreak: number; avgScore: number; goalsMet: number; totalCorrect: number; daysToExam: number | null };
    todayTasks: { id: string; subject: string; topic: string; duration: string; done: boolean }[];
    subjectPerformance: { subject: string; avgScore: number }[];
  } | null>(null);

  useEffect(() => {
    const t = token || localStorage.getItem("pg_token");
    if (!t) return;
    fetch(`${API}/api/dashboard`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setDashData(d.data); })
      .catch(console.error);
  }, [token]);

  const focusTasks    = dashData?.todayTasks?.length ? dashData.todayTasks : tasks;
  const subjectPerf   = dashData?.subjectPerformance?.length ? dashData.subjectPerformance.map(s => ({ subject: s.subject, pct: s.avgScore })) : subjectPerformance;
  const statCards     = dashData ? [
    { label: "Day Streak",  value: String(dashData.stats.currentStreak),  sub: "days",    icon: Flame,         iconColor: "#f97316" },
    { label: "Avg. Score",  value: `${dashData.stats.avgScore}%`,          sub: "overall", icon: Trophy,        iconColor: "#d4a800" },
    { label: "Goals Met",   value: String(dashData.stats.goalsMet),       sub: "total",   icon: CheckCircle2,  iconColor: "#4a90d9" },
    { label: "Ques. Done",  value: String(dashData.stats.totalCorrect),   sub: "correct", icon: ClipboardList, iconColor: "#8b5cf6" },
  ] : stats;

  const daysLeft = dashData?.stats?.daysToExam
    ?? (user?.examDate ? Math.max(0, Math.ceil((new Date(user.examDate).getTime() - new Date().getTime()) / 86400000)) : null);

  return (
    <AppShell>
      <div style={{ padding: "2rem 2rem 2rem", maxWidth: 1100 }}>

        {/* ── TOP BAR ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              WELCOME BACK, {firstName.toUpperCase()}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "var(--navy)", lineHeight: 1.1 }}>
              Your Dashboard
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <NotificationsPanel />
            {/* Exam chip */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--navy)", color: "white", padding: "0.45rem 0.9rem", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600 }}>
              <Clock size={13} strokeWidth={2} />
              JAMB: {daysLeft !== null ? `${daysLeft} Days left` : "Set exam date"}
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.75rem" }} className="stat-grid">
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── TODAY'S FOCUS + QUICK ACTIONS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", marginBottom: "1.75rem", alignItems: "start" }} className="focus-grid">

          {/* Today's Focus */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>
                <CheckCircle2 size={18} color="var(--navy)" strokeWidth={2} />
                Today&apos;s Focus
              </div>
              <Link href="/study-plan" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--yellow-dark)", textDecoration: "none" }}>
                View All
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {focusTasks.length > 0
                ? focusTasks.map((t: { topic: string; subject: string; duration: string; done: boolean; color?: string }) => <TaskRow key={t.topic} {...t} />)
                : (
                  <div style={{ textAlign: "center", padding: "1.25rem", background: "var(--off-white)", borderRadius: "var(--radius-sm)" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.5rem" }}>No tasks yet.</p>
                    <Link href="/study-plan" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--yellow-dark)", textDecoration: "none" }}>
                      Generate your study plan →
                    </Link>
                  </div>
                )
              }
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.85rem" }}>
              <Zap size={18} color="var(--yellow-dark)" strokeWidth={2} />
              Quick Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/tutor" className="btn-navy" style={{ justifyContent: "flex-start", gap: "0.65rem", padding: "0.75rem 1rem", borderRadius: 10 }}>
                <MessageSquare size={16} strokeWidth={2} /> Start AI Tutor Session
              </Link>
              <Link href="/quiz" className="btn-yellow" style={{ justifyContent: "flex-start", gap: "0.65rem", padding: "0.75rem 1rem", borderRadius: 10 }}>
                <ClipboardList size={16} strokeWidth={2} /> Daily Quiz
              </Link>
              <Link href="/progress" style={{
                display: "flex", alignItems: "center", gap: "0.65rem",
                padding: "0.75rem 1rem", borderRadius: 10,
                border: "1.5px solid var(--border)", background: "white",
                color: "var(--navy)", textDecoration: "none",
                fontSize: "0.87rem", fontWeight: 700, transition: "all .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--navy)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <TrendingUp size={16} strokeWidth={2} /> Analysis
              </Link>
            </div>
          </div>
        </div>

        {/* ── SUBJECT PERFORMANCE ── */}
        <div style={{ background: "var(--navy)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
              <TrendingUp size={18} color="var(--yellow)" strokeWidth={2} />
              Subject Performance
            </div>
            <Link href="/progress" style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--yellow)", textDecoration: "none" }}>
              Detailed breakdown
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {subjectPerf.length > 0
              ? subjectPerf.map(({ subject, pct }) => (
                <div key={subject}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{subject}</span>
                    <span style={{ fontSize: "0.8rem", color: pct < 60 ? "#ef4444" : "var(--yellow)", fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,.12)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct < 60 ? "#ef4444" : "var(--yellow)", borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))
              : (
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,.45)", marginBottom: "0.5rem" }}>No quiz data yet.</p>
                  <Link href="/quiz" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--yellow)", textDecoration: "none" }}>
                    Take your first quiz →
                  </Link>
                </div>
              )
            }
          </div>
        </div>

        {/* ── SIGN OUT (mobile only) ── */}
        <div style={{ marginTop: "2rem" }} className="mobile-signout">
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#ef4444", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
            Sign Out
          </Link>
        </div>
      </div>

      <style>{`
        @media(max-width: 900px) {
          .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
          .focus-grid { grid-template-columns: 1fr !important; }
        }
        @media(max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        .mobile-signout { display: none; }
        @media(max-width: 768px) { .mobile-signout { display: block; } }
      `}</style>
    </AppShell>
  );
}
