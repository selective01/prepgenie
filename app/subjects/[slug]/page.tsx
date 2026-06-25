import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSubject, subjects } from "@/lib/subjects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Clock, BookOpen, BarChart2, ChevronRight } from "lucide-react";

export function generateStaticParams() {
  return subjects.map(s => ({ slug: s.slug }));
}

const difficultyColor: Record<string, string> = {
  Beginner: "#059669",
  Intermediate: "#d97706",
  Advanced: "#dc2626",
};

export default function SubjectPage({ params }: { params: { slug: string } }) {
  const subject = getSubject(params.slug);
  if (!subject) notFound();

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--off-white)", minHeight: "100vh" }}>

        {/* ── Page Header ── */}
        <div style={{ background: "var(--navy)", padding: "3.5rem 5% 4rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginBottom: "1.4rem", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,.5)", fontSize: ".82rem", textDecoration: "none", fontWeight: 500 }}>Home</Link>
              <ChevronRight size={14} color="rgba(255,255,255,.3)" />
              <Link href="/#subjects" style={{ color: "rgba(255,255,255,.5)", fontSize: ".82rem", textDecoration: "none", fontWeight: 500 }}>Subjects</Link>
              <ChevronRight size={14} color="rgba(255,255,255,.3)" />
              <span style={{ color: "var(--yellow)", fontSize: ".82rem", fontWeight: 600 }}>{subject.name}</span>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "white", marginBottom: ".75rem" }}>
              {subject.name}
            </h1>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".95rem", maxWidth: 520 }}>{subject.description}</p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "2rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
              {[
                { label: "Topics", value: subject.topicList.length },
                { label: "Questions", value: subject.count },
                { label: "JAMB Relevant", value: "100%" },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ color: "var(--yellow)", fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 800 }}>{stat.value}</div>
                  <div style={{ color: "rgba(255,255,255,.55)", fontSize: ".78rem", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2.5rem 5% 5rem" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.8rem", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontSize: ".88rem", color: "var(--muted)", fontWeight: 500 }}>
              Showing <strong style={{ color: "var(--navy)" }}>{subject.topicList.length}</strong> topics in {subject.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <span style={{ fontSize: ".82rem", color: "var(--muted)", fontWeight: 500 }}>Sort By:</span>
              <select style={{ fontSize: ".82rem", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, color: "var(--navy)", background: "white", padding: ".35rem .75rem", borderRadius: 6, border: "1px solid var(--border)", cursor: "pointer", outline: "none" }}>
                <option>Default</option>
                <option>Beginner First</option>
                <option>Most Questions</option>
              </select>
            </div>
          </div>

          {/* Cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.4rem" }} className="topic-grid">
            {subject.topicList.map(topic => (
              <div key={topic.id} className="topic-card topic-card-hover" style={{ background: "white", borderRadius: "var(--radius)", overflow: "hidden", transition: "transform .25s" }}>

                {/* Thumbnail */}
                <div style={{ position: "relative", height: 180 }}>
                  <Image
                    src={topic.img}
                    alt={topic.title}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  {/* Duration pill */}
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(13,27,62,.75)", color: "white", fontSize: ".72rem", fontWeight: 700, padding: ".3rem .65rem", borderRadius: 5, display: "flex", alignItems: "center", gap: ".3rem", backdropFilter: "blur(4px)" }}>
                    <Clock size={11} strokeWidth={2.5} />
                    {topic.duration}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "1.1rem 1.2rem 1.3rem" }}>
                  <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".96rem", color: "var(--navy)", marginBottom: ".7rem", lineHeight: 1.35 }}>
                    {topic.title}
                  </h3>

                  {/* Meta row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".76rem", color: "var(--muted)", fontWeight: 500 }}>
                      <BookOpen size={13} strokeWidth={2} color="var(--muted)" />
                      {topic.questions} Questions
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".76rem", fontWeight: 600, color: difficultyColor[topic.difficulty] }}>
                      <BarChart2 size={13} strokeWidth={2} color={difficultyColor[topic.difficulty]} />
                      {topic.difficulty}
                    </span>
                  </div>

                  {/* CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: "1.05rem", color: subject.accent }}>
                      Free
                    </span>
                    <Link href="/signup"
                      style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", background: subject.accent, color: "white", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".78rem", padding: ".44rem 1rem", borderRadius: 6, textDecoration: "none", transition: "opacity .2s" }}
                      >
                      Start Practice →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media(max-width:900px){ .topic-grid{ grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:560px){ .topic-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
