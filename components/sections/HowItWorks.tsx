"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { stats } from "@/lib/data";
import { ArrowRight } from "lucide-react";

const CARD_BG = "#EEF2FF";

const courses = [
  {
    subject: "English Language",
    weeks: "04 Weeks",
    rating: 4.7,
    lessons: 12,
    students: "500+",
    level: "All Levels",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80",
    imgPosition: "center top",
  },
  {
    subject: "Mathematics",
    weeks: "06 Weeks",
    rating: 4.8,
    lessons: 15,
    students: "450+",
    level: "Beginner",
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&q=80",
    imgPosition: "center center",
  },
  {
    subject: "Physics",
    weeks: "05 Weeks",
    rating: 4.6,
    lessons: 14,
    students: "380+",
    level: "Beginner",
    img: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=700&q=80",
    imgPosition: "center center",
  },
];

function CourseCard({ c }: { c: typeof courses[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 8;
      const rotY = dx * 8;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
      card.style.boxShadow = "0 28px 64px rgba(13,27,62,0.20), 0 8px 24px rgba(13,27,62,0.12)";
      const shine = card.querySelector(".card-shine") as HTMLElement;
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${(dx + 1) * 50}% ${(dy + 1) * 50}%, rgba(255,255,255,0.22) 0%, transparent 65%)`;
        shine.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
      card.style.boxShadow = "none";
      const shine = card.querySelector(".card-shine") as HTMLElement;
      if (shine) shine.style.opacity = "0";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        borderRadius: "var(--radius)",
        overflow: "hidden",
        background: CARD_BG,
        position: "relative",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        willChange: "transform",
        cursor: "pointer",
      }}
    >
      {/* Shine overlay */}
      <div
        className="card-shine"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.2s",
          borderRadius: "var(--radius)",
        }}
      />

      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
        <Image
          src={c.img}
          alt={c.subject}
          fill
          style={{ objectFit: "cover", objectPosition: c.imgPosition, transition: "transform 0.45s ease" }}
          className="course-img"
          unoptimized
        />
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, background: "var(--navy)", color: "white", padding: ".3rem .75rem", borderRadius: 4, fontSize: ".72rem", fontWeight: 700, display: "flex", alignItems: "center", gap: ".35rem" }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5"/>
            <path d="M6 3v3l2 1" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {c.weeks}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "1.4rem", background: CARD_BG }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".3rem", marginBottom: ".7rem" }}>
          {Array.from({ length: 5 }).map((_, j) => (
            <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill={j < Math.floor(c.rating) ? "var(--yellow)" : "#d1d5db"}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
          <span style={{ fontSize: ".74rem", color: "var(--muted)", fontWeight: 600 }}>({c.rating})</span>
        </div>

        <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1rem", color: "var(--navy)", marginBottom: ".75rem", lineHeight: 1.3 }}>
          Ace {c.subject} — Complete JAMB Preparation
        </h3>

        <div style={{ display: "flex", gap: "1.2rem", fontSize: ".74rem", color: "var(--muted)", marginBottom: "1rem", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            {c.lessons} Lessons
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            {c.students} Students
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            {c.level}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: ".75rem", borderTop: "1.5px solid rgba(13,27,62,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--yellow)", display: "grid", placeItems: "center", fontSize: ".62rem", fontWeight: 800, color: "var(--navy)" }}>AI</div>
            <span style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--navy)" }}>PrepGenie AI</span>
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: ".9rem", color: "var(--yellow-dark)" }}>FREE</span>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <>
      {/* ── POPULAR COURSES ── */}
      <section id="how-it-works" style={{ padding: "5rem 5%", background: "var(--white)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div className="reveal-left">
              <div className="section-label">Popular Courses</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Our Popular JAMB Courses</h2>
            </div>
            <a href="/signup" className="btn-navy reveal-right" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
              View All Courses <ArrowRight size={15} strokeWidth={2.2}/>
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="courses-grid">
            {courses.map((c, i) => (
              <div key={c.subject} className="course-entry" style={{ animationDelay: `${i * 0.18}s` }}>
                <CourseCard c={c} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: "var(--navy)", padding: "3.5rem 5%", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(245,194,0,.08)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(245,194,0,.05)", pointerEvents: "none" }}/>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem", textAlign: "center" }} className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className="reveal">
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.4rem", fontWeight: 800, color: "white", marginBottom: ".3rem" }}>
                <span style={{ color: "var(--yellow)" }}>{s.value.replace(/\+/, "")}</span>{s.value.includes("+") ? "+" : ""}
              </div>
              <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.6)", fontWeight: 600 }}>
                {s.label.split(" ").map((w, i) => i === 0 ? <strong key={i} style={{ color: "rgba(255,255,255,.9)", fontWeight: 700 }}>{w} </strong> : w + " ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA OFFER BANNER ── */}
      <div style={{ background: "var(--navy-light)", padding: "4.5rem 5%", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", width: 80, height: 80, borderRadius: "50%", border: "3px solid rgba(245,194,0,.3)", opacity: .5 }}/>
        <div style={{ position: "absolute", right: 60, top: "30%", width: 20, height: 20, borderRadius: "50%", background: "var(--yellow)", opacity: .4 }}/>
        <div className="reveal" style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="section-label" style={{ justifyContent: "center", color: "var(--yellow)" }}>Are You Ready For This Offer</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: "1rem" }}>
            20% Off For First <span style={{ color: "var(--yellow)" }}>500 Students</span> For All JAMB Subjects
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".95rem", marginBottom: "2rem", lineHeight: 1.7 }}>
            Get unlimited access to 10,000+ past questions, AI explanations, and timed mock exams across all JAMB subjects.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/signup" className="btn-yellow" style={{ fontSize: ".95rem", padding: ".82rem 2rem" }}>Join With Us →</a>
            <a href="/signup" className="btn-outline-white" style={{ fontSize: ".95rem", padding: ".82rem 2rem" }}>Become A Tutor →</a>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .courses-grid{ grid-template-columns: 1fr !important; }
          .stats-grid{ grid-template-columns: repeat(2,1fr) !important; }
        }

        .course-entry {
          opacity: 0;
          transform: translateY(48px) scale(0.97);
          animation: courseReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes courseReveal {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .course-img {
          transition: transform 0.45s ease !important;
        }

        div:hover > div > .course-img,
        div:hover .course-img {
          transform: scale(1.07) !important;
        }
      `}</style>
    </>
  );
}
