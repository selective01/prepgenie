import Image from "next/image";
import Link from "next/link";
import { subjects } from "@/lib/subjects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, ChevronRight } from "lucide-react";

export const metadata = {
  title: "All Subjects – PrepGenie",
  description: "Browse all JAMB subjects available on PrepGenie.",
};

export default function SubjectsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--off-white)", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: "var(--navy)", padding: "3.5rem 5% 4rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginBottom: "1.4rem" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,.5)", fontSize: ".82rem", textDecoration: "none", fontWeight: 500 }}>Home</Link>
              <ChevronRight size={14} color="rgba(255,255,255,.3)" />
              <span style={{ color: "var(--yellow)", fontSize: ".82rem", fontWeight: 600 }}>All Subjects</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "white", marginBottom: ".75rem" }}>
              Explore JAMB Subjects
            </h1>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".95rem", maxWidth: 520 }}>
              Choose a subject to browse its topics and start practising with thousands of past questions.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2.5rem 5% 5rem" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.8rem", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontSize: ".88rem", color: "var(--muted)", fontWeight: 500 }}>
              Showing <strong style={{ color: "var(--navy)" }}>{subjects.length}</strong> subjects
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.4rem" }} className="subjects-index-grid">
            {subjects.map(subject => (
              <div key={subject.slug}
                className="subject-index-card"
                style={{ background: "white", borderRadius: "var(--radius)", overflow: "hidden", transition: "transform .25s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>

                {/* Image */}
                <div style={{ position: "relative", height: 180 }}>
                  <Image
                    src={subject.img}
                    alt={subject.name}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.55)", color: "white", fontSize: ".72rem", fontWeight: 700, padding: ".3rem .65rem", borderRadius: 5, display: "flex", alignItems: "center", gap: ".3rem", backdropFilter: "blur(4px)" }}>
                    <BookOpen size={11} strokeWidth={2.5} />
                    {subject.topicList.length} Topics
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "1.1rem 1.2rem 1.3rem" }}>
                  <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".96rem", color: "var(--navy)", marginBottom: ".3rem" }}>
                    {subject.name}
                  </h2>
                  <p style={{ fontSize: ".78rem", color: "var(--muted)", marginBottom: ".3rem" }}>{subject.count}</p>
                  <p style={{ fontSize: ".78rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.5 }}>{subject.description}</p>

                  <Link href={`/subjects/${subject.slug}`}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", padding: ".46rem 1rem", borderRadius: 6, background: subject.accent, color: "white", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".78rem", textDecoration: "none", transition: "opacity .2s" }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.opacity = ".85")}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.opacity = "1")}>
                    View Subject →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media(max-width:900px){ .subjects-index-grid{ grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:560px){ .subjects-index-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
