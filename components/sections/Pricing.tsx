"use client";
import { useState } from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { plans } from "@/lib/data";

export default function Pricing() {
  const [active, setActive] = useState(1); // start on the featured card

  return (
    <section id="pricing" style={{ padding:"5rem 5%", background:"var(--off-white)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:"3rem" }}>
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-sub" style={{ margin:"0 auto" }}>Start free, upgrade when you are ready. No hidden fees.</p>
        </div>

        {/* ── DESKTOP: 3-column grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem", alignItems:"start" }} className="pricing-grid">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* ── MOBILE: swipeable slider ── */}
        <div className="pricing-slider">
          {/* card */}
          <div style={{ overflow:"hidden", borderRadius:"var(--radius)", width:"100%" }}>
            <div style={{
              display:"flex",
              width:`${plans.length * 100}%`,
              transform:`translateX(calc(-${(active / plans.length) * 100}%))`,
              transition:"transform .35s cubic-bezier(.4,0,.2,1)",
            }}>
              {plans.map((plan) => (
                <div key={plan.name} style={{ width:`${100 / plans.length}%`, flexShrink:0, padding:"0 4px", boxSizing:"border-box" }}>
                  <PricingCard plan={plan} />
                </div>
              ))}
            </div>
          </div>

          {/* dots + arrows */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"1rem", marginTop:"1.5rem" }}>
            <button
              onClick={() => setActive(a => Math.max(0, a - 1))}
              disabled={active === 0}
              style={{
                width:36, height:36, borderRadius:"50%", border:"1.5px solid var(--border)",
                background:"white", display:"grid", placeItems:"center", cursor:"pointer",
                opacity: active === 0 ? 0.35 : 1,
              }}
            >
              <ChevronLeft size={16} color="var(--navy)" strokeWidth={2} />
            </button>

            <div style={{ display:"flex", gap:8 }}>
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? 20 : 8, height:8, borderRadius:4,
                    background: i === active ? "var(--navy)" : "var(--border)",
                    border:"none", cursor:"pointer", transition:"all .25s",
                    padding:0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setActive(a => Math.min(plans.length - 1, a + 1))}
              disabled={active === plans.length - 1}
              style={{
                width:36, height:36, borderRadius:"50%", border:"1.5px solid var(--border)",
                background:"white", display:"grid", placeItems:"center", cursor:"pointer",
                opacity: active === plans.length - 1 ? 0.35 : 1,
              }}
            >
              <ChevronRight size={16} color="var(--navy)" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .pricing-slider { display: none; }
        #pricing .card:hover { transform: none !important; box-shadow: var(--shadow) !important; }
        @media(max-width: 900px) {
          .pricing-grid  { display: none !important; }
          .pricing-slider { display: block; }
        }
      `}</style>
    </section>
  );
}

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  return (
    <div className="reveal card" style={{ padding:"2rem", position:"relative", overflow:"hidden", background: plan.featured ? "var(--navy)" : "white" }}>
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
        onMouseEnter={e=>{e.currentTarget.style.opacity=".88";e.currentTarget.style.transform="";}}
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
  );
}
