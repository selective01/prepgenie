"use client";
import { useState } from "react";
import { faqs } from "@/lib/data";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding:"6rem 5%", background:"var(--white)" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>

        <div className="reveal" style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <h2 className="section-title">Questions? <span className="accent">We Have Answers.</span></h2>
          <p className="section-sub" style={{ margin:"0 auto" }}>Everything you need to know about PrepGenie before getting started.</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="reveal"
                style={{ borderRadius:"var(--radius-sm)", background: isOpen ? "var(--green-xlight)" : "var(--off-white)", overflow:"hidden", transition:"background .25s" }}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width:"100%", padding:"1.2rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", background:"none", border:"none", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:".92rem", color:"var(--navy)", textAlign:"left" }}>
                  {faq.q}
                  <span style={{ fontSize:"1.2rem", color:"var(--green-dark)", flexShrink:0, transition:"transform .3s", display:"inline-block", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                </button>
                <div style={{ maxHeight: isOpen ? 200 : 0, overflow:"hidden", transition:"max-height .4s ease, padding .3s ease", padding: isOpen ? "0 1.5rem 1.2rem" : "0 1.5rem", fontSize:".88rem", color:"var(--muted)", lineHeight:1.75 }}>
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
