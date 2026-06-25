"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import {
  Trophy, CalendarDays, Clock, ChevronRight,
  Flag, CheckCircle2, Circle, Zap, MoreHorizontal,
} from "lucide-react";

// ── mock data ─────────────────────────────────────────────────────────────────

// Generate real week days starting from this Monday
function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const labels = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label, date: d.getDate() };
  });
}

const weekDays = getWeekDays();
const TODAY_JS = new Date().getDay(); // 0=Sun
const TODAY_INDEX = TODAY_JS === 0 ? 6 : TODAY_JS - 1; // convert to 0=Mon

const subjectColors: Record<string, string> = {
  Chemistry:   "#4a90d9",
  Mathematics: "#ef4444",
  Biology:     "#22c55e",
  English:     "#8b5cf6",
  Physics:     "#f97316",
};

interface Task {
  id: number | string;
  subject: string;
  topic: string;
  duration: string;
  difficulty: "High" | "Medium" | "Low";
  done: boolean;
  day?: number;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, subject: "Chemistry",   topic: "Organic Chemistry: Alkanes & Alkenes", duration: "45 mins", difficulty: "Medium", done: true  },
  { id: 2, subject: "Mathematics", topic: "Calculus: Differentiation Basics",      duration: "60 mins", difficulty: "High",   done: false },
  { id: 3, subject: "Biology",     topic: "The Cell: Structure and Functions",      duration: "30 mins", difficulty: "Low",    done: false },
  { id: 4, subject: "English",     topic: "Reading Comprehension: Passage Analysis",duration: "40 mins", difficulty: "Medium", done: false },
];

const milestones = [
  { label: "REG",  name: "Registration",      date: "APR 10", done: true,  icon: Flag          },
  { label: "PREP", name: "Pre-Mock Intensive", date: "MAY 10", done: true,  icon: CheckCircle2  },
  { label: "MOCK", name: "Mock Exam",          date: "JUNE 02",done: false, icon: Circle        },
  { label: "D-DAY",name: "Exam Day",           date: "JUNE 20",done: false, icon: Trophy        },
];

const difficultyStyle: Record<string, { bg: string; color: string }> = {
  High:   { bg: "#fef2f2", color: "#ef4444" },
  Medium: { bg: "#fffbeb", color: "#d4a800" },
  Low:    { bg: "#f0fdf4", color: "#22c55e" },
};

// ── components ────────────────────────────────────────────────────────────────

function TaskCard({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const color = subjectColors[task.subject] ?? "var(--muted)";
  const diff  = difficultyStyle[task.difficulty];

  return (
    <div style={{
      background: "white", borderRadius: "var(--radius-sm)",
      border: "1px solid var(--border)", padding: "0.9rem 1rem",
      display: "flex", alignItems: "flex-start", gap: "0.85rem",
      opacity: task.done ? 0.6 : 1,
    }}>
      {/* checkbox */}
      <button
        onClick={onToggle}
        style={{
          width: 20, height: 20, borderRadius: 5, flexShrink: 0,
          marginTop: 2, cursor: "pointer",
          background: task.done ? "var(--navy)" : "white",
          border: task.done ? "none" : "2px solid var(--border)",
          display: "grid", placeItems: "center",
        }}
      >
        {task.done && <CheckCircle2 size={12} color="white" strokeWidth={3} />}
      </button>

      {/* colour bar */}
      <div style={{ width: 3, alignSelf: "stretch", borderRadius: 4, background: color, flexShrink: 0 }} />

      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
          {task.subject}
        </div>
        <div style={{
          fontSize: "0.9rem", fontWeight: 600, color: "var(--navy)",
          textDecoration: task.done ? "line-through" : "none",
          marginBottom: 4,
        }}>
          {task.topic}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.72rem", color: "var(--muted)" }}>
            <Clock size={11} strokeWidth={2} /> {task.duration}
          </span>
        </div>
      </div>

      {/* difficulty + menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, background: diff.bg, color: diff.color, borderRadius: 20, padding: "0.15rem 0.55rem" }}>
          {task.difficulty}
        </span>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--muted)", display: "grid", placeItems: "center" }}>
          <MoreHorizontal size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function StudyPlanPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [tasks, setTasks]         = useState<Task[]>(INITIAL_TASKS);
  const [activeDay, setActiveDay] = useState(TODAY_INDEX);
  const [loading, setLoading]     = useState(true);
  const [planId, setPlanId]       = useState<string | null>(null);
  const [milestoneData, setMilestoneData] = useState(milestones);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/plan`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPlanId(data.plan.id);
          const today = new Date().getDay(); // 0=Sun, convert to 0=Mon
          const todayIndex = today === 0 ? 6 : today - 1;
          setActiveDay(todayIndex);
          const apiTasks: Task[] = data.plan.dailyTasks.map((t: {id: string; subject: string; topic: string; duration: string; difficulty: "High"|"Medium"|"Low"; day: number; done: boolean}) => ({
            id: t.id, subject: t.subject, topic: t.topic,
            duration: t.duration, difficulty: t.difficulty, done: t.done, day: t.day,
          }));
          if (apiTasks.length) setTasks(apiTasks);
          if (data.plan.milestones?.length) setMilestoneData(data.plan.milestones.map((m: {label:string;name:string;date:string;done:boolean}) => ({
            ...m, icon: milestones.find(x => x.label === m.label)?.icon || CheckCircle2,
          })));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const hasDayData  = tasks.some(t => t.day !== undefined);
  const dayTasks    = hasDayData
    ? tasks.filter(t => t.day === activeDay)
    : tasks; // fallback: show all tasks if plan has no day data
  const completed   = tasks.filter(t => t.done).length;
  const daysToExam  = user?.examDate
    ? Math.max(0, Math.ceil((new Date(user.examDate).getTime() - new Date().getTime()) / 86400000))
    : null;
  const total      = tasks.length;
  const progress   = Math.round((completed / total) * 100);
  const currentMilestone = milestones.find(m => !m.done) ?? milestones[milestones.length - 1];

  async function toggleTask(id: string | number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    if (!token || !planId) return;
    try {
      await fetch(`${API}/api/plan/task/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) { console.error("Toggle task error:", err); }
  }

  return (
    <AppShell>
      <div style={{ paddingBottom: "2rem" }}>

        {/* ── countdown banner ── */}
        <div style={{
          background: "var(--navy)", padding: "1.5rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              TARGET EXAM COUNTDOWN
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "var(--yellow)", lineHeight: 1 }}>
                {daysToExam ?? "--"}
              </span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.1rem,3vw,1.8rem)", fontWeight: 700, color: "rgba(255,255,255,.7)" }}>
                Days
              </span>
              <span style={{ fontSize: "1rem", color: "rgba(255,255,255,.5)", fontWeight: 500 }}>Remaining</span>
            </div>
          </div>

          {/* daily progress */}
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", marginBottom: 6 }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Daily Progress</span>
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--yellow)" }}>{progress}%</span>
            </div>
            <div style={{ width: 160, height: 6, background: "rgba(255,255,255,.15)", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--yellow)", borderRadius: 4, transition: "width .4s" }} />
            </div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.4)" }}>
              {completed} of {total} tasks completed today
            </div>
          </div>
        </div>

        <div style={{ padding: "1.5rem 2rem 0" }}>

          {/* ── weekly schedule ── */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>
                <CalendarDays size={18} strokeWidth={2} color="var(--navy)" />
                This Week&apos;s Plan
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "var(--yellow-dark)", fontFamily: "'DM Sans',sans-serif" }}>
                View Month <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>

            <div style={{
              background: "white", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)", padding: "1rem",
              display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.25rem",
            }}>
              {weekDays.map((d, i) => {
                const isToday  = i === TODAY_INDEX;
                const isActive = i === activeDay;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 4, padding: "0.65rem 0.25rem", borderRadius: 10,
                      border: "none", cursor: "pointer",
                      background: isActive ? "var(--yellow)" : "transparent",
                      transition: "background .18s",
                    }}
                  >
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: isActive ? "var(--navy)" : "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {d.label}
                    </span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 800, color: isActive ? "var(--navy)" : "var(--navy)" }}>
                      {d.date}
                    </span>
                    {isToday && (
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: isActive ? "var(--navy)" : "var(--yellow)" }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── today's focus ── */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--navy)" }}>
                  Today&apos;s Goals
                </h2>
                <span style={{ background: "var(--off-white)", color: "var(--muted)", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 20 }}>
                  {total - completed} Pending
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--navy)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Sort By Difficulty
                </button>
                <button style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "0.4rem 0.85rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--navy)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Filter Subjects
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {dayTasks.map(task => (
                <TaskCard key={String(task.id)} task={task} onToggle={() => toggleTask(task.id)} />
              ))}
            </div>

            {/* regenerate if no tasks */}
            {!loading && dayTasks.length === 0 && (
              <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--muted)", fontSize: "0.88rem" }}>
                No tasks for this day.{" "}
                <button
                  onClick={async () => {
                    if (!token) return;
                    const res = await fetch(`${API}/api/plan/generate`, { method: "POST", headers: { Authorization: `Bearer ${token}` }});
                    const data = await res.json();
                    if (data.success) {
                      const apiTasks: Task[] = data.plan.dailyTasks.map((t: {id: string; subject: string; topic: string; duration: string; difficulty: "High"|"Medium"|"Low"; day: number; done: boolean}) => ({
                        id: t.id, subject: t.subject, topic: t.topic, duration: t.duration, difficulty: t.difficulty, done: t.done, day: t.day,
                      }));
                      setTasks(apiTasks);
                    }
                  }}
                  style={{ color: "var(--yellow-dark)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem" }}
                >
                  Regenerate plan
                </button>
              </div>
            )}

            {/* add topic */}
            <button
              onClick={() => router.push("/quiz")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                width: "100%", marginTop: "0.75rem",
                background: "none", border: "1.5px dashed var(--border)",
                borderRadius: "var(--radius-sm)", padding: "0.85rem",
                cursor: "pointer", color: "var(--muted)",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.85rem",
              }}
            >
              <Zap size={15} strokeWidth={2} /> Add Topic to Plan
            </button>
          </div>

          {/* ── learning milestones ── */}
          <div style={{
            background: "white", borderRadius: "var(--radius)",
            border: "1px solid var(--border)", padding: "1.5rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Flag size={17} color="var(--navy)" strokeWidth={2} />
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>Learning Milestones</span>
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22c55e", background: "#f0fdf4", padding: "0.2rem 0.65rem", borderRadius: 20 }}>
                On Track
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
              You&apos;re making steady progress toward your June 20th Goal.
            </p>

            {/* timeline */}
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

              {/* connector line */}
              <div style={{ position: "absolute", top: 20, left: "10%", right: "10%", height: 3, background: "var(--border)", zIndex: 0 }}>
                <div style={{
                  height: "100%", background: "var(--yellow)",
                  width: `${(milestones.filter(m => m.done).length / (milestones.length - 1)) * 100}%`,
                  transition: "width .6s ease",
                }} />
              </div>

              {milestoneData.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", zIndex: 1, flex: 1 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: m.done ? "var(--navy)" : "white",
                      border: m.done ? "none" : "2px solid var(--border)",
                      display: "grid", placeItems: "center",
                      boxShadow: "0 2px 8px rgba(13,27,62,.1)",
                    }}>
                      <Icon size={18} color={m.done ? "white" : "var(--muted)"} strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--navy)", textAlign: "center" }}>{m.label}</span>
                    <span style={{ fontSize: "0.65rem", color: "var(--muted)", textAlign: "center" }}>{m.date}</span>
                  </div>
                );
              })}
            </div>

            {/* current milestone */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)",
            }}>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                  Current Milestone
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--navy)" }}>{currentMilestone.name}</div>
              </div>
              <span style={{ background: "var(--navy)", color: "white", fontSize: "0.75rem", fontWeight: 700, padding: "0.3rem 0.85rem", borderRadius: 20 }}>
                Phase {milestones.filter(m => m.done).length + 1}/{milestones.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
