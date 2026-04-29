"use client";
import { Check, X } from "lucide-react";
import { plans } from "@/lib/data";

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding:"5rem 5%", background:"var(--off-white)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div className="section-label" style={{ justifyContent:"center" }}>Our Pricing</div>
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-sub" style={{ margin:"0 auto" }}>Start free, upgrade when you are ready. No hidden fees.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem", alignItems:"start" }} className="pricing-grid">
          {plans.map((plan)=>(
            <div key={plan.name} className="reveal card" style={{ padding:"2rem", position:"relative", overflow:"hidden", background: plan.featured ? "var(--navy)" : "white" }}>
              {plan.featured && <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"var(--yellow)" }}/>}

              {plan.featured && (
                <div style={{ display:"inline-block", background:"var(--yellow)", color:"var(--navy)", padding:".25rem .8rem", borderRadius:4, fontSize:".72rem", fontWeight:800, marginBottom:"1rem" }}>Most Popular</div>
              )}

              <div style={{ display:"inline-block", background: plan.featured ? "rgba(245,194,0,.12)" : "var(--yellow-light)", color: plan.featured ? "var(--yellow)" : "var(--navy)", padding:".25rem .8rem", borderRadius:4, fontSize:".75rem", fontWeight:700, marginBottom:"1rem" }}>{plan.name}</div>

              <div style={{ marginBottom:"1rem" }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.4rem", fontWeight:800, color: plan.featured ? "white" : "var(--navy)" }}>{plan.price}</span>
                <span style={{ fontSize:".83rem", color: plan.featured ? "rgba(255,255,255,.5)" : "var(--muted)", marginLeft:".35rem" }}>/ {plan.period}</span>
              </div>

              <p style={{ fontSize:".87rem", color: plan.featured ? "rgba(255,255,255,.6)" : "var(--muted)", lineHeight:1.65, marginBottom:"1.5rem" }}>{plan.desc}</p>

              <a href="/signup" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", padding:".78rem", borderRadius:6, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".87rem", textDecoration:"none", marginBottom:"1.5rem", transition:"all .2s",
                background: plan.featured ? "var(--yellow)" : "var(--navy)", color: plan.featured ? "var(--navy)" : "white" }}
                onMouseEnter={e=>{e.currentTarget.style.opacity=".88";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="";}}>
                {plan.cta} →
              </a>

              <div style={{ display:"flex", flexDirection:"column", gap:".6rem" }}>
                {plan.features.map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:".55rem", fontSize:".84rem", color: plan.featured ? "rgba(255,255,255,.8)" : "var(--text)" }}>
                    <Check size={14} color="var(--yellow-dark)" strokeWidth={2.5} style={{ flexShrink:0, marginTop:2 }}/> {f}
                  </div>
                ))}
                {plan.excluded.map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:".55rem", fontSize:".84rem", color:"var(--muted)", opacity:.5 }}>
                    <X size={14} strokeWidth={2} style={{ flexShrink:0, marginTop:2 }}/> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.pricing-grid{grid-template-columns:1fr!important;max-width:440px;margin:0 auto;}}`}</style>
    </section>
  );
}
