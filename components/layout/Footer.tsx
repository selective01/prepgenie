"use client";
import { Phone, Mail, MapPin } from "lucide-react";

function LampLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <rect x="14.5" y="24" width="3" height="5" rx="1" fill="rgba(255,255,255,.5)"/>
      <rect x="11" y="28" width="10" height="2" rx="1" fill="rgba(255,255,255,.5)"/>
      <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="rgba(255,255,255,.5)"/>
      <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="var(--yellow)"/>
      <line x1="6" y1="15" x2="26" y2="15" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const quickLinks = ["JAMB English","JAMB Mathematics","JAMB Physics","JAMB Chemistry","JAMB Biology","Mock Exams"];
const resources   = ["Community","Support","Video Guides","Documentation","Study Tips","JAMB Updates"];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background:"var(--navy)", color:"rgba(255,255,255,.55)", position:"relative" }}>

      {/* Wave top — mirrors Hero bottom wave, white into navy */}
      <div style={{ position:"relative", overflow:"hidden", lineHeight:0, marginTop:-2 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display:"block", width:"100%", height:50 }}>
          <path d="M0,40 C360,10 1080,60 1440,30 L1440,0 L0,0 Z" fill="white"/>
        </svg>
      </div>

      {/* Top contact bar */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,.08)", padding:"2rem 5%" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"2rem" }} className="footer-contact-bar">
          {[
            { icon:Phone,   label:"Call us any time:",   value:"+234 800 000 0000" },
            { icon:Mail,    label:"Email us 24/7:",       value:"hello@prepgenie.ng" },
            { icon:MapPin,  label:"Our location:",        value:"Lagos, Nigeria" },
          ].map(({icon:Icon,label,value})=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(245,194,0,.12)", border:"1px solid rgba(245,194,0,.2)", display:"grid", placeItems:"center", flexShrink:0 }}>
                <Icon size={18} color="var(--yellow)" strokeWidth={1.8}/>
              </div>
              <div>
                <div style={{ fontSize:".75rem", color:"rgba(255,255,255,.4)", marginBottom:".2rem" }}>{label}</div>
                <div style={{ fontSize:".9rem", color:"white", fontWeight:600 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div style={{ padding:"3.5rem 5% 2rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.5fr", gap:"3rem", marginBottom:"3rem" }} className="footer-grid">

          {/* Brand */}
          <div>
            <a href="#" style={{ display:"inline-flex", alignItems:"center", gap:10, textDecoration:"none", marginBottom:"1rem" }}>
              <LampLogo/>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.2rem", color:"white" }}>
                Prep<span style={{ color:"var(--yellow)" }}>Genie</span>
              </span>
            </a>
            <p style={{ fontSize:".86rem", lineHeight:1.75, maxWidth:240, marginBottom:"1.5rem" }}>
              Nigeria&apos;s most effective AI-powered JAMB preparation platform. Built to help every student score higher.
            </p>
            <div style={{ fontWeight:700, fontSize:".8rem", color:"white", letterSpacing:".05em", marginBottom:".8rem" }}>FOLLOW US ON:</div>
            <div style={{ display:"flex", gap:".6rem" }}>
              {["f","t","in"].map(s=>(
                <a key={s} href="#" style={{ width:34, height:34, borderRadius:"50%", border:"1px solid rgba(255,255,255,.15)", display:"grid", placeItems:"center", textDecoration:"none", color:"rgba(255,255,255,.5)", fontSize:".7rem", fontWeight:700, transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="var(--yellow)";e.currentTarget.style.color="var(--navy)";e.currentTarget.style.borderColor="var(--yellow)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,.5)";e.currentTarget.style.borderColor="rgba(255,255,255,.15)";}}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".9rem", color:"white", marginBottom:"1.2rem", paddingBottom:".6rem", borderBottom:"2px solid var(--yellow)" }}>Quick Links</h4>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:".55rem" }}>
              {quickLinks.map(l=>(
                <li key={l} style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                  <span style={{ color:"var(--yellow)", fontSize:".7rem" }}>•</span>
                  <a href="#" style={{ textDecoration:"none", color:"rgba(255,255,255,.5)", fontSize:".84rem", transition:"color .2s" }}
                    onMouseEnter={e=>(e.currentTarget.style.color="var(--yellow)")}
                    onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.5)")}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".9rem", color:"white", marginBottom:"1.2rem", paddingBottom:".6rem", borderBottom:"2px solid var(--yellow)" }}>Resources</h4>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:".55rem" }}>
              {resources.map(l=>(
                <li key={l} style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                  <span style={{ color:"var(--yellow)", fontSize:".7rem" }}>•</span>
                  <a href="#" style={{ textDecoration:"none", color:"rgba(255,255,255,.5)", fontSize:".84rem", transition:"color .2s" }}
                    onMouseEnter={e=>(e.currentTarget.style.color="var(--yellow)")}
                    onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.5)")}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".9rem", color:"white", marginBottom:"1.2rem", paddingBottom:".6rem", borderBottom:"2px solid var(--yellow)" }}>Get In Touch!</h4>
            <p style={{ fontSize:".84rem", lineHeight:1.7, marginBottom:"1.2rem" }}>Subscribe to our newsletter for the latest JAMB updates and study tips.</p>
            <div style={{ display:"flex", gap:0 }}>
              <input type="email" placeholder="Your email address" style={{ flex:1, padding:".65rem 1rem", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.15)", borderRight:"none", borderRadius:"6px 0 0 6px", color:"white", fontSize:".83rem", fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
              <button className="btn-yellow" style={{ borderRadius:"0 6px 6px 0", padding:".65rem 1rem", fontSize:".8rem", whiteSpace:"nowrap" }}>Subscribe →</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"2rem", borderTop:"1px solid rgba(255,255,255,.07)", fontSize:".8rem", flexWrap:"wrap", gap:"1rem" }}>
          <span>Copyright © {year} <a href="#" style={{ color:"var(--yellow)", textDecoration:"none" }}>PrepGenie</a> All Rights Reserved.</span>
          <div style={{ display:"flex", gap:"1.5rem" }}>
            <a href="#" style={{ color:"rgba(255,255,255,.5)", textDecoration:"none", transition:"color .2s" }} onMouseEnter={e=>(e.currentTarget.style.color="var(--yellow)")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.5)")}>Privacy Policy</a>
            <a href="#" style={{ color:"rgba(255,255,255,.5)", textDecoration:"none", transition:"color .2s" }} onMouseEnter={e=>(e.currentTarget.style.color="var(--yellow)")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.5)")}>Terms & Condition</a>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:1024px){ .footer-grid{grid-template-columns:1fr 1fr!important;} }
        @media(max-width:700px){ .footer-grid{grid-template-columns:1fr!important;} .footer-contact-bar{grid-template-columns:1fr!important;} }
      `}</style>
    </footer>
  );
}
