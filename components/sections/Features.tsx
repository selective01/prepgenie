"use client";
import Image from "next/image";
import { subjects } from "@/lib/subjects";
import { useEffect, useRef } from "react";
import SmartAuthLink from "@/components/ui/SmartAuthLink";

function SubjectsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    const NAVY   = "13,27,62";
    const YELLOW = "245,194,0";

    // Floating 3D-style orbs
    type Orb = {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      r: number; color: string;
    };

    const orbs: Orb[] = [];
    const COUNT = 55;

    function init() {
      W = canvas!.width  = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
      orbs.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const isYellow = i % 7 === 0;
        orbs.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: Math.random() * 400 + 50,          // depth 50–450
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          vz: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2.5 + 1.5,
          color: isYellow ? YELLOW : NAVY,
        });
      }
    }

    function project(orb: Orb): { sx: number; sy: number; scale: number } {
      const focal = 500;
      const scale = focal / (focal + orb.z);
      const cx = W / 2, cy = H / 2;
      return {
        sx: cx + (orb.x - cx) * scale,
        sy: cy + (orb.y - cy) * scale,
        scale,
      };
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Sort back-to-front for painter's order
      const sorted = [...orbs].sort((a, b) => b.z - a.z);

      // Draw connecting lines between nearby projected points
      for (let i = 0; i < sorted.length; i++) {
        const pi = project(sorted[i]);
        for (let j = i + 1; j < sorted.length; j++) {
          const pj = project(sorted[j]);
          const dx = pi.sx - pj.sx, dy = pi.sy - pj.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.12 * pi.scale;
            ctx!.beginPath();
            ctx!.moveTo(pi.sx, pi.sy);
            ctx!.lineTo(pj.sx, pj.sy);
            ctx!.strokeStyle = `rgba(${NAVY},${alpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      // Draw orbs
      for (const orb of sorted) {
        const { sx, sy, scale } = project(orb);
        const radius = Math.max(0.5, orb.r * scale);
        const alpha = 0.12 + scale * 0.25;

        // Outer glow
        const grad = ctx!.createRadialGradient(sx, sy, 0, sx, sy, radius * 3);
        grad.addColorStop(0, `rgba(${orb.color},${alpha})`);
        grad.addColorStop(1, `rgba(${orb.color},0)`);
        ctx!.beginPath();
        ctx!.arc(sx, sy, radius * 3, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();

        // Core dot
        ctx!.beginPath();
        ctx!.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${orb.color},${Math.min(alpha * 2.5, 0.55)})`;
        ctx!.fill();
      }
    }

    function update() {
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.z += orb.vz;

        if (orb.x < 0 || orb.x > W)  orb.vx *= -1;
        if (orb.y < 0 || orb.y > H)  orb.vy *= -1;
        if (orb.z < 50 || orb.z > 450) orb.vz *= -1;
      }
    }

    function loop() {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    }

    init();
    loop();

    const ro = new ResizeObserver(() => { init(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
    />
  );
}


const whyFeatures = [
  { title:"World Class Questions",   desc:"Verified past questions from 2000–2024 across all JAMB subjects." },
  { title:"AI-Powered Explanations", desc:"Understand every answer with detailed AI explanations tailored for JAMB." },
  { title:"Flexible Study Plans",    desc:"Study at your own pace with personalized daily practice schedules." },
  { title:"Affordable Access",       desc:"Free tier available. Pro plans starting at just ₦2,500/month." },
];

export default function Features() {
  return (
    <>
      {/* ── SUBJECTS / CATEGORIES ── */}
      <section id="subjects" style={{ padding:"5rem 5%", background:"var(--white)", position:"relative", overflow:"hidden" }}>
        <SubjectsCanvas />
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 2fr", gap:"3rem", alignItems:"start", position:"relative", zIndex:1 }} className="subjects-grid">

          <div className="reveal-left">
            <h2 className="section-title">Explore Top<br/>JAMB Subjects</h2>
            <p className="section-sub" style={{ marginBottom:"2rem" }}>Choose your subjects and start practicing with thousands of past questions today.</p>
            <SmartAuthLink loggedInHref="/subjects" loggedOutHref="/signup" className="btn-navy">
              View All Subjects →
            </SmartAuthLink>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem" }} className="subject-cards reveal-right">
            {subjects.slice(0, 6).map(({ name, slug, count, topicList, img, accent }, idx) => (
              <div key={slug}
                className={idx >= 4 ? "subject-card subject-card-hide-mobile" : "subject-card"}
                style={{ background:"#EEF2FF", borderRadius:"var(--radius)", overflow:"hidden", transition:"transform .28s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                {/* Image */}
                <div style={{ position:"relative", height:130 }}>
                  <Image src={img} alt={name} fill style={{ objectFit:"cover" }} unoptimized />
                  <div style={{ position:"absolute", top:10, left:10, background:"rgba(0,0,0,.52)", color:"white", fontSize:".68rem", fontWeight:700, padding:".22rem .55rem", borderRadius:4, backdropFilter:"blur(4px)" }}>
                    {topicList.length} Topics
                  </div>
                </div>
                {/* Body */}
                <div style={{ padding:"1rem 1.1rem 1.2rem", background:"#EEF2FF" }}>
                  <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".9rem", color:"var(--navy)", marginBottom:".2rem" }}>{name}</h3>
                  <p style={{ fontSize:".74rem", color:"var(--muted)", marginBottom:".85rem" }}>{count}</p>
                  <SmartAuthLink
                    loggedInHref={`/subjects/${slug}`}
                    loggedOutHref="/signup"
                    style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:"100%", padding:".44rem 1rem", borderRadius:6, background:accent, color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".75rem", textDecoration:"none", transition:"opacity .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = ".82")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    View Subject →
                  </SmartAuthLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="features" style={{ padding:"5rem 5%", background:"var(--off-white)", overflow:"hidden" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }} className="why-grid">

          {/* Left — real image with overlapping stat cards */}
          <div className="reveal-left" style={{ position:"relative" }}>

            {/* Decorative bg block */}
            <div className="why-deco-block" style={{ position:"absolute", top:24, left:-20, width:"70%", height:"80%", background:"var(--yellow-light)", borderRadius:"var(--radius)", zIndex:0 }} />

            {/* Main image */}
            <div style={{ borderRadius:"var(--radius)", overflow:"hidden", aspectRatio:"4/3", position:"relative", zIndex:1 }}>
              <Image
                src="/images/students-studying.png"
                alt="Students studying together"
                fill
                style={{ objectFit:"cover", objectPosition:"center" }}
                priority
              />
            </div>

            {/* Floating stat — bottom left */}
            <div style={{ position:"absolute", bottom:20, left:-16, zIndex:2, background:"var(--navy)", borderRadius:14, padding:"1rem 1.4rem", color:"white", animation:"floatY 5s ease-in-out infinite" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:800, color:"var(--yellow)" }}>50k+</div>
              <div style={{ fontSize:".72rem", fontWeight:700, letterSpacing:".06em", opacity:.75, textTransform:"uppercase" }}>Students Active</div>
            </div>

            {/* Floating stat — top right */}
            <div style={{ position:"absolute", top:10, right:-16, zIndex:2, background:"white", borderRadius:14, padding:".9rem 1.2rem", animation:"floatY 5s 2.5s ease-in-out infinite" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", fontWeight:800, color:"var(--navy)" }}>98%</div>
              <div style={{ fontSize:".7rem", fontWeight:600, color:"var(--muted)", letterSpacing:".04em" }}>Pass Rate</div>
            </div>
          </div>

          {/* Right content */}
          <div className="reveal-right">
            <h2 className="section-title">Thousands Of Students Around Nigeria Ready To Score Higher.</h2>
            <p className="section-sub" style={{ marginBottom:"2rem" }}>
              PrepGenie combines a comprehensive past questions database with AI-powered explanations to help every JAMB candidate reach their full potential.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2rem" }}>
              {whyFeatures.map((f, i) => (
                <div key={f.title}
                  className="why-card"
                  style={{
                    background:"white",
                    borderRadius:"var(--radius-sm)",
                    padding:"1.2rem",
                    display:"flex",
                    alignItems:"flex-start",
                    gap:".75rem",
                    animation:`fadeUp .6s ${0.1 + i * 0.1}s ease both`,
                  }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:"var(--yellow)", display:"grid", placeItems:"center", flexShrink:0, marginTop:2 }}>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l3.5 3.5L11 1" stroke="var(--navy)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".88rem", color:"var(--navy)", marginBottom:".25rem" }}>{f.title}</h4>
                    <p style={{ fontSize:".8rem", color:"var(--muted)", lineHeight:1.6 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="/signup" className="btn-yellow" style={{ fontSize:".92rem" }}>Get Started Free →</a>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:1100px){ .subjects-grid{ grid-template-columns:1fr !important; } }
        @media(max-width:900px){ .subject-cards{ grid-template-columns:repeat(2,1fr) !important; } .why-grid{ grid-template-columns:1fr !important; } }
        @media(max-width:768px){ .subject-card-hide-mobile{ display:none !important; } }
        @media(max-width:480px){ .subject-cards{ grid-template-columns:1fr !important; } }
        .why-card{ transition: none; }
      `}</style>
    </>
  );
}
