"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { subjects as ALL_SUBJECTS } from "@/lib/subjects";
import {
  BookOpen, ClipboardList, TrendingUp, Plus,
  Lock, Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const NAME_TO_SLUG: Record<string, string> = {
  "English":                 "english-language",
  "Use of English":          "english-language",
  "English Language":        "english-language",
  "Mathematics":             "mathematics",
  "Physics":                 "physics",
  "Chemistry":               "chemistry",
  "Biology":                 "biology",
  "Government":              "government",
  "Economics":               "economics",
  "Literature":              "literature-in-english",
  "Geography":               "geography",
  "History":                 "history",
  "Commerce":                "commerce",
  "Accounting":              "accounting",
  "Agriculture":             "agriculture",
};

const SUBJECT_ICONS: Record<string, string> = {
  "english-language":       "📖",
  "mathematics":            "📐",
  "physics":                "⚛️",
  "chemistry":              "⚗️",
  "biology":                "🌿",
  "government":             "🏛️",
  "economics":              "📊",
  "literature-in-english":  "📚",
  "geography":              "🌍",
  "history":                "🏺",
  "commerce":               "💼",
  "accounting":             "🧮",
  "agriculture":            "🌾",
};

export default function MySubjectsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [progressData, setProgressData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      const t = token || localStorage.getItem("pg_token");
      if (!t || !user?.subjects?.length) { setLoading(false); return; }

      try {
        const r = await fetch(`${API}/api/progress`, { headers: { Authorization: `Bearer ${t}` } });
        const d = await r.json();
        if (d.success && d.data.subjectBreakdown) {
          const map: Record<string, number> = {};
          d.data.subjectBreakdown.forEach((s: { subject: string; avgScore: number }) => {
            map[s.subject] = s.avgScore;
          });
          setProgressData(map);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [token, user?.subjects?.length]);

  const userSubjects = user?.subjects ?? [];
  const isPremium    = user?.plan === "premium";

  const mySubjectCards = (() => {
    const seen = new Set<string>();
    return userSubjects
      .map(name => {
        const slug  = NAME_TO_SLUG[name] ?? name.toLowerCase().replace(/\s+/g, "-");
        const data  = ALL_SUBJECTS.find(s => s.slug === slug);
        const score = progressData[name] ?? progressData["Use of English"] ?? null;
        const icon  = SUBJECT_ICONS[slug] ?? "📖";
        const isCompulsory = ["Use of English", "English", "English Language"].includes(name);
        // Use display name — prefer "Use of English" for the compulsory slot
        const displayName = isCompulsory ? "Use of English" : name;
        return { name: displayName, slug, data, score, icon, isCompulsory };
      })
      .filter(s => {
        // deduplicate by slug
        if (seen.has(s.slug)) return false;
        seen.add(s.slug);
        return true;
      });
  })();

  return (
    <AppShell>
      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>

        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem" }}>
              My Subjects
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              {userSubjects.length} subject{userSubjects.length !== 1 ? "s" : ""} · {isPremium ? "Premium Plan" : "Free Plan"}
            </p>
          </div>
          <button
            onClick={() => router.push("/settings")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--off-white)", border: "1.5px solid var(--border)",
              borderRadius: 8, padding: "0.55rem 1rem",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
              fontSize: "0.82rem", color: "var(--navy)", cursor: "pointer",
            }}
          >
            <Plus size={14} strokeWidth={2} /> Add / Change Subjects
          </button>
        </div>

        {/* content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>Loading your subjects...</div>
        ) : userSubjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>
              No subjects selected yet
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
              Go to Settings to select your JAMB subjects.
            </p>
            <button
              onClick={() => router.push("/settings")}
              style={{ background: "var(--yellow)", color: "var(--navy)", border: "none", borderRadius: 8, padding: "0.75rem 1.5rem", fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "0.88rem", cursor: "pointer" }}
            >
              Go to Settings
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>

            {mySubjectCards.map(({ name, slug, data, score, icon, isCompulsory }) => (
              <div key={slug} style={{ background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>

                {/* header */}
                <div style={{ padding: "1.25rem", background: "linear-gradient(135deg, var(--navy) 0%, #1a3a7a 100%)", position: "relative" }}>
                  <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>{icon}</span>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: "0.2rem" }}>
                    {name}
                  </h3>
                  {data && (
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.5)" }}>
                      {data.topicList.length} topics · {data.count}
                    </p>
                  )}
                  {isCompulsory && (
                    <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 3, background: "var(--yellow)", color: "var(--navy)", fontSize: "0.6rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: 4 }}>
                      <Lock size={8} strokeWidth={3} /> Compulsory
                    </div>
                  )}
                </div>

                {/* score bar */}
                <div style={{ padding: "0.85rem 1.1rem", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Your Score
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: score === null ? "var(--muted)" : score < 60 ? "#ef4444" : "var(--navy)" }}>
                      {score === null ? "No data yet" : `${score}%`}
                    </span>
                  </div>
                  <div style={{ height: 5, background: "var(--off-white)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${score ?? 0}%`, background: score === null ? "var(--border)" : score < 60 ? "#ef4444" : "var(--navy)", borderRadius: 4, transition: "width .6s ease" }} />
                  </div>
                </div>

                {/* actions */}
                <div style={{ padding: "0.85rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Link
                    href={`/quiz?subject=${encodeURIComponent(name)}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                      background: "var(--yellow)", color: "var(--navy)", borderRadius: 8,
                      padding: "0.62rem 1rem", fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 700, fontSize: "0.8rem", textDecoration: "none",
                    }}
                  >
                    <ClipboardList size={14} strokeWidth={2} /> Practice Quiz
                  </Link>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      href="/tutor"
                      style={{
                        flex: 1, display: "flex", alignItems: "center", gap: 5, justifyContent: "center",
                        background: "var(--off-white)", border: "1px solid var(--border)",
                        borderRadius: 8, padding: "0.5rem 0.5rem",
                        fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                        fontSize: "0.75rem", color: "var(--navy)", textDecoration: "none",
                      }}
                    >
                      <Zap size={12} strokeWidth={2} /> Ask Genie
                    </Link>

                    {data ? (
                      <Link
                        href={`/subjects/${data.slug}`}
                        style={{
                          flex: 1, display: "flex", alignItems: "center", gap: 5, justifyContent: "center",
                          background: "var(--off-white)", border: "1px solid var(--border)",
                          borderRadius: 8, padding: "0.5rem 0.5rem",
                          fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                          fontSize: "0.75rem", color: "var(--navy)", textDecoration: "none",
                        }}
                      >
                        <BookOpen size={12} strokeWidth={2} /> Topics
                      </Link>
                    ) : (
                      <Link
                        href="/progress"
                        style={{
                          flex: 1, display: "flex", alignItems: "center", gap: 5, justifyContent: "center",
                          background: "var(--off-white)", border: "1px solid var(--border)",
                          borderRadius: 8, padding: "0.5rem 0.5rem",
                          fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                          fontSize: "0.75rem", color: "var(--navy)", textDecoration: "none",
                        }}
                      >
                        <TrendingUp size={12} strokeWidth={2} /> Progress
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* upgrade prompt for free users */}
            {!isPremium && (
              <div style={{
                background: "var(--navy)", borderRadius: "var(--radius)",
                border: "2px dashed rgba(245,194,0,.3)",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "2rem", textAlign: "center", gap: "0.75rem",
                minHeight: 200,
              }}>
                <div style={{ fontSize: "2rem" }}>🔓</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1rem", color: "white" }}>
                  Unlock More Subjects
                </h3>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,.55)", lineHeight: 1.6 }}>
                  Free plan: English + 1 subject.<br />
                  Upgrade to Premium for all subjects.
                </p>
                <button
                  onClick={() => router.push("/settings")}
                  style={{
                    background: "var(--yellow)", color: "var(--navy)", border: "none",
                    borderRadius: 8, padding: "0.65rem 1.25rem",
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
                    fontSize: "0.82rem", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <Zap size={14} strokeWidth={2.5} /> Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
