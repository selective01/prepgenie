"use client";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" style={{ padding:"5rem 5%", background:"var(--navy)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 25% 50%, rgba(245,194,0,.06) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(245,194,0,.04) 0%, transparent 50%)", pointerEvents:"none" }}/>

      <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
        <div className="reveal">
          <div className="section-label" style={{ justifyContent:"center", color:"var(--yellow)" }}>Get Started Today</div>
          <h2 className="section-title-white">
            Your JAMB Success <span style={{ color:"var(--yellow)", fontStyle:"italic" }}>Starts Here.</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,.6)", fontSize:".98rem", lineHeight:1.8, marginBottom:"2.5rem", maxWidth:520, margin:"0 auto 2.5rem" }}>
            Join 50,000+ students already preparing smarter. Create your free account today — no credit card required.
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/signup" className="btn-yellow" style={{ fontSize:".95rem", padding:".85rem 2.2rem" }}>
              Join With Us <ArrowRight size={16} strokeWidth={2}/>
            </a>
            <a href="#" className="btn-outline-white" style={{ fontSize:".95rem", padding:".85rem 2.2rem" }}>Become A Tutor →</a>
          </div>
          <p style={{ color:"rgba(255,255,255,.3)", fontSize:".78rem", marginTop:"1.2rem" }}>Free forever. No credit card. Upgrade anytime.</p>
        </div>
      </div>
    </section>
  );
}
