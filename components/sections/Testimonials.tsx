"use client";
import { useState } from "react";
import Image from "next/image";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { testimonials } from "@/lib/data";

const blogs = [
  {
    date: "10 Apr, 2026",
    title: "How to Score 300+ in JAMB: A Complete Study Guide",
    author: "PrepGenie Team",
    img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=80",
    excerpt: "Discover the strategies top-scoring students use — from daily practice routines to how they tackle tricky questions.",
  },
  {
    date: "02 Apr, 2026",
    title: "Top 5 JAMB English Mistakes and How to Avoid Them",
    author: "PrepGenie Team",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&q=80",
    excerpt: "English trips up more students than any other subject. Here are the most common errors and how to fix them fast.",
  },
  {
    date: "28 Mar, 2026",
    title: "JAMB Mathematics Made Simple: Key Topics to Focus On",
    author: "PrepGenie Team",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=700&q=80",
    excerpt: "You don't need to master every topic. Learn the high-yield areas that appear most often and score big on exam day.",
  },
];

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const visibleTestimonials = showAll ? testimonials : testimonials.slice(0, 1);

  return (
    <>
      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: "5rem 5%", background: "var(--off-white)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="section-title">What Students Say About PrepGenie</h2>
          </div>

          {/* Desktop: always show 4 in 2-col grid. Mobile: show 1 then expand */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="testi-grid">
            {testimonials.slice(0, 4).map((t, i) => (
              <div
                key={t.name}
                className={`reveal card testi-card testi-card-${i}`}
                style={{ padding: "2rem", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 60, background: "var(--yellow)", borderRadius: "0 0 60px 0", opacity: .15 }}/>
                <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 0, height: 0, borderLeft: "14px solid var(--yellow)", borderBottom: "14px solid transparent" }}/>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.2rem" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--yellow-light)", display: "grid", placeItems: "center", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".9rem", color: "var(--navy)", flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <p style={{ color: "var(--text)", fontSize: ".88rem", lineHeight: 1.75, fontStyle: "italic" }}>
                    &quot;{t.text}&quot;
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: ".95rem", color: "var(--navy)" }}>{t.name}</div>
                    <div style={{ fontSize: ".75rem", color: "var(--yellow-dark)", fontWeight: 600 }}>JAMB Score: {t.score}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} strokeWidth={0} fill={j < t.stars ? "var(--yellow)" : "#e2e8f0"}/>
                    ))}
                    <span style={{ fontSize: ".75rem", color: "var(--muted)", marginLeft: ".2rem" }}>({t.stars}.0)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile-only: show 1 + read more toggle */}
          <div className="testi-mobile">
            {visibleTestimonials.map((t) => (
              <div key={t.name} className="card" style={{ padding: "2rem", position: "relative", overflow: "hidden", marginBottom: "1rem" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 60, background: "var(--yellow)", borderRadius: "0 0 60px 0", opacity: .15 }}/>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.2rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--yellow-light)", display: "grid", placeItems: "center", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".85rem", color: "var(--navy)", flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <p style={{ color: "var(--text)", fontSize: ".86rem", lineHeight: 1.75, fontStyle: "italic" }}>
                    &quot;{t.text}&quot;
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: ".92rem", color: "var(--navy)" }}>{t.name}</div>
                    <div style={{ fontSize: ".73rem", color: "var(--yellow-dark)", fontWeight: 600 }}>JAMB Score: {t.score}</div>
                  </div>
                  <div style={{ display: "flex", gap: ".25rem" }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} strokeWidth={0} fill={j < t.stars ? "var(--yellow)" : "#e2e8f0"}/>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAll(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: ".5rem", margin: "0 auto", background: "var(--navy)", color: "white", border: "none", padding: ".7rem 1.6rem", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: ".85rem", cursor: "pointer" }}
            >
              {showAll ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown size={16}/> Read More Reviews</>}
            </button>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section id="blog" style={{ padding: "5rem 5%", background: "var(--white)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div className="reveal-left">
              <h2 className="section-title" style={{ marginBottom: 0 }}>Latest News & Blogs</h2>
            </div>
            <a href="#" className="btn-navy reveal-right">View All Posts →</a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="blog-grid">
            {blogs.map((b) => (
              <div key={b.title} className="reveal blog-card" style={{ borderRadius: "var(--radius)", overflow: "hidden", background: "white", position: "relative" }}>
                {/* Image */}
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                  <Image
                    src={b.img}
                    alt={b.title}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  {/* Date badge */}
                  <div style={{ position: "absolute", bottom: 10, left: 10, background: "var(--yellow)", color: "var(--navy)", fontSize: ".68rem", fontWeight: 800, padding: ".25rem .6rem", borderRadius: 4 }}>
                    {b.date}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "1.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".74rem", color: "var(--muted)", marginBottom: ".85rem" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {b.author}
                  </div>

                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "1rem", color: "var(--navy)", lineHeight: 1.35, marginBottom: ".65rem" }}>{b.title}</h3>
                  <p style={{ fontSize: ".8rem", color: "var(--muted)", lineHeight: 1.65, marginBottom: "1.1rem" }}>{b.excerpt}</p>

                  {/* Animated underline link — replaces hover card effect */}
                  <a href="#" className="blog-read-link">
                    Read More Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>

                {/* Bottom accent bar that grows on hover */}
                <div className="blog-accent-bar" style={{ height: 3, background: "var(--yellow)", position: "absolute", bottom: 0, left: 0, width: "0%", transition: "width 0.35s ease" }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ── TESTIMONIALS ── */
        .testi-grid { display: grid !important; }
        .testi-mobile { display: none !important; }

        @media(max-width: 768px) {
          .testi-grid { display: none !important; }
          .testi-mobile { display: block !important; }
        }

        /* ── SUBJECTS mobile: show only 4 ── */
        @media(max-width: 768px) {
          .subject-cards > div:nth-child(n+5) { display: none !important; }
          .subject-cards { grid-template-columns: repeat(2,1fr) !important; }
        }

        /* ── WHY CHOOSE US mobile: tighten decorative block ── */
        @media(max-width: 900px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .why-deco-block { display: none !important; }
        }

        /* ── BLOG cards: no transform hover, use accent bar instead ── */
        .blog-card { transition: none !important; }
        .blog-card:hover .blog-accent-bar { width: 100% !important; }

        .blog-read-link {
          display: inline-flex;
          align-items: center;
          gap: .4rem;
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: .82rem;
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
        }
        .blog-read-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: var(--yellow);
          transition: width 0.28s ease;
        }
        .blog-read-link:hover::after { width: 100%; }
        .blog-read-link:hover { color: var(--navy); }
        .blog-read-link svg { transition: transform 0.22s ease; }
        .blog-read-link:hover svg { transform: translateX(4px); }

        @media(max-width: 900px) {
          .blog-grid { grid-template-columns: 1fr !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
