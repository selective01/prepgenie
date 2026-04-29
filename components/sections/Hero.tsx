"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" style={{ position:"relative", background:"var(--navy)", minHeight:"88vh", display:"flex", alignItems:"center", overflow:"hidden" }}>

      {/* Background image overlay */}
      <div style={{ position:"absolute", inset:0, background:"rgba(13,27,62,0.82)", zIndex:1 }}/>

      {/* Solid navy base */}
      <div style={{ position:"absolute", inset:0, background:"#0d1b3e", zIndex:0 }}/>

      {/* Decorative dot grid */}
      <div style={{ position:"absolute", bottom:40, right:60, zIndex:2, opacity:.25 }}>
        {Array.from({length:5}).map((_,r)=>(
          <div key={r} style={{ display:"flex", gap:10, marginBottom:10 }}>
            {Array.from({length:6}).map((_,c)=>(
              <div key={c} style={{ width:5, height:5, borderRadius:"50%", background:"var(--yellow)" }}/>
            ))}
          </div>
        ))}
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"6rem 5%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center", position:"relative", zIndex:2, width:"100%" }} className="hero-grid">

        {/* LEFT */}
        <div>
          {/* Promo badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:".75rem", marginBottom:"1.5rem", animation:"fadeIn .8s ease both" }}>
            <span style={{ background:"var(--yellow)", color:"var(--navy)", padding:".3rem .8rem", borderRadius:4, fontWeight:800, fontSize:".8rem" }}>20% OFF</span>
            <span style={{ color:"rgba(255,255,255,.85)", fontWeight:600, fontSize:".88rem", letterSpacing:".06em", textTransform:"uppercase" }}>Learn From Today</span>
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.4rem,5vw,3.8rem)", fontWeight:800, lineHeight:1.1, color:"white", marginBottom:"1.5rem", animation:"fadeUp .8s .15s ease both" }}>
            PrepGenie Leads To A<br/>
            <span style={{ color:"var(--yellow)", fontStyle:"italic" }}>Brighter Future.</span>
          </h1>

          <p style={{ fontSize:".98rem", color:"rgba(255,255,255,.65)", lineHeight:1.8, marginBottom:"2.2rem", maxWidth:480, animation:"fadeUp .8s .3s ease both" }}>
            Practice with 10,000+ JAMB past questions, get instant AI explanations, and walk into your exam fully prepared. Join 50,000+ Nigerian students already scoring higher.
          </p>

          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", animation:"fadeUp .8s .45s ease both" }}>
            <a href="/signup" className="btn-yellow" style={{ fontSize:".95rem", padding:".82rem 2rem" }}>
              Get Started <ArrowRight size={16} strokeWidth={2}/>
            </a>
            <a href="#features" className="btn-outline-white" style={{ fontSize:".95rem", padding:".82rem 2rem" }}>
              Learn More
            </a>
          </div>
        </div>

        {/* RIGHT — circular image */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", position:"relative", animation:"fadeIn 1s .4s ease both" }}>
          {/* Large circle bg */}
          <div style={{ width:420, height:420, borderRadius:"50%", background:"rgba(245,194,0,.12)", border:"2px solid rgba(245,194,0,.2)", overflow:"hidden", position:"relative" }}>
            <Image
              src="/images/cbt_exam.png"
              alt="Students taking CBT exam"
              fill
              style={{ objectFit:"cover", objectPosition:"center top" }}
              priority
            />
          </div>

          {/* White wave shape behind circle */}
          <div style={{ position:"absolute", bottom:-2, right:-40, width:200, height:200, background:"var(--yellow)", borderRadius:"50% 0 50% 50%", opacity:.12, zIndex:-1 }}/>

          {/* Floating stat card */}
          <div style={{ position:"absolute", bottom:-10, left:-10, background:"white", borderRadius:12, padding:"1rem 1.4rem", boxShadow:"var(--shadow-md)", animation:"floatY 5s ease-in-out infinite" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:800, color:"var(--navy)" }}>50k+</div>
            <div style={{ fontSize:".78rem", color:"var(--muted)", fontWeight:500 }}>Active Students</div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, overflow:"hidden", lineHeight:0, zIndex:3 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display:"block", width:"100%", height:50 }}>
          <path d="M0,40 C360,10 1080,60 1440,30 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </div>

      <style>{`
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;text-align:center;}.hero-grid>div:last-child{display:none;}}
      `}</style>
    </section>
  );
}
