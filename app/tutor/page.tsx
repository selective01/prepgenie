"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import {
  Send, Paperclip, RotateCcw, MoreHorizontal,
  Zap, Lightbulb, BookOpen, X,
} from "lucide-react";

// ── types ─────────────────────────────────────────────────────────────────────

type Role = "ai" | "user";

interface Message {
  id: number;
  role: Role;
  subject: string;
  text: string;
  time: string;
}

// ── data ─────────────────────────────────────────────────────────────────────

const subjectChips = ["Chemistry", "Physics", "Biology", "English", "Maths"];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1, role: "ai", subject: "CHEMISTRY",
    text: "Hello! I'm your PrepGenie Tutor. I noticed you were studying 'Organic Chemistry' earlier. Do you want to continue where we left off, or should we tackle a new JAMB topic today?",
    time: "10:30 AM",
  },
  {
    id: 2, role: "user", subject: "CHEMISTRY",
    text: "Can you explain the difference between Alkanes and Alkenes in a simple way? I always get the bonding mixed up.",
    time: "10:32 AM",
  },
  {
    id: 3, role: "ai", subject: "CHEMISTRY",
    text: "Great question! Think of it by their bonds:\n\n• Alkanes (Saturated): Only single bonds (C–C). They are less reactive.\n• Alkenes (Unsaturated): Have at least one double bond (C=C). This makes them more reactive!\n\nRemember: 'A–N–E' is single, 'E–N–E' is double. Ready for a quick practice question on this?",
    time: "10:33 AM",
  },
];

const FREE_LIMIT = 20;
const USED = 12;

// ── typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.6rem 0.25rem" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "rgba(255,255,255,.6)",
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── message bubble ────────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isAI = msg.role === "ai";
  return (
    <div style={{
      display: "flex", flexDirection: isAI ? "row" : "row-reverse",
      alignItems: "flex-end", gap: "0.6rem", marginBottom: "1.25rem",
    }}>
      {isAI ? (
        <div style={{
          width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
          background: "var(--navy)", display: "grid", placeItems: "center",
          border: "2px solid var(--border)",
        }}>
          <Zap size={15} color="var(--yellow)" strokeWidth={2.5} />
        </div>
      ) : (
        <div style={{
          width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
          background: "var(--yellow)", display: "grid", placeItems: "center",
        }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--navy)" }}>AJ</span>
        </div>
      )}

      <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", alignItems: isAI ? "flex-start" : "flex-end" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em", color: "var(--muted)", marginBottom: "0.3rem" }}>
          {msg.subject}
        </span>
        <div style={{
          background: isAI ? "var(--navy)" : "var(--yellow-xlight)",
          color: isAI ? "white" : "var(--navy)",
          borderRadius: 16,
          borderBottomLeftRadius: isAI ? 4 : 16,
          borderBottomRightRadius: isAI ? 16 : 4,
          padding: "0.85rem 1.1rem",
          fontSize: "0.9rem", lineHeight: 1.75, whiteSpace: "pre-wrap",
        }}>
          {msg.text}
        </div>
        <span style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.3rem" }}>{msg.time}</span>
      </div>
    </div>
  );
}

// ── more options menu ─────────────────────────────────────────────────────────

function OptionsMenu({ onClose, onClear, onUpgrade }: {
  onClose: () => void;
  onClear: () => void;
  onUpgrade: () => void;
}) {
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 6px)", right: 0,
      background: "white", borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-md)", border: "1px solid var(--border)",
      minWidth: 190, zIndex: 200, overflow: "hidden",
    }}>
      {[
        { label: "Clear conversation", action: () => { onClear(); onClose(); } },
        { label: "Change subject",     action: onClose },
        { label: "Upgrade to Pro",     action: () => { onUpgrade(); onClose(); } },
        { label: "View history",       action: onClose },
      ].map(({ label, action }) => (
        <button key={label} onClick={action} style={{
          display: "block", width: "100%", textAlign: "left",
          padding: "0.65rem 1rem", background: "none", border: "none",
          fontSize: "0.85rem", color: "var(--navy)", cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
          borderBottom: "1px solid var(--border)",
          transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--off-white)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function TutorPage() {
  const router                      = useRouter();
  const [messages, setMessages]     = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]           = useState("");
  const [activeSubject, setActive]  = useState("Chemistry");
  const [isTyping, setIsTyping]     = useState(false);
  const [usedQueries, setUsed]      = useState(USED);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const bottomRef                   = useRef<HTMLDivElement>(null);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  const remaining = FREE_LIMIT - usedQueries;
  const limitHit  = remaining <= 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // close top menu on outside click
  useEffect(() => {
    if (!showTopMenu) return;
    const handler = () => setShowTopMenu(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showTopMenu]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }
  }

  function focusInput(text?: string) {
    if (text) setInput(text);
    setTimeout(() => {
      textareaRef.current?.focus();
      const el = textareaRef.current;
      if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }
    }, 0);
  }

  function sendMessage() {
    if (!input.trim() || limitHit) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: Date.now(), role: "user",
      subject: activeSubject.toUpperCase(),
      text: input.trim(), time: now,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setUsed(u => u + 1);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "ai",
        subject: activeSubject.toUpperCase(),
        text: "That's a great question! Let me break that down for you clearly. This is a common area where JAMB candidates lose marks, so understanding it thoroughly will give you an edge in the exam.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 2000);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function clearConversation() {
    setMessages([{
      id: Date.now(), role: "ai", subject: activeSubject.toUpperCase(),
      text: "Conversation cleared. What would you like to study?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  }

  function handleFileAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, {
      id: Date.now(), role: "user",
      subject: activeSubject.toUpperCase(),
      text: `📎 Attached: ${file.name}`,
      time: now,
    }]);
    e.target.value = "";
  }

  return (
    <AppShell>
      <div className="tutor-root" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── top bar ── */}
        <div style={{
          padding: "1rem 1.75rem", borderBottom: "1px solid var(--border)",
          background: "white", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "var(--off-white)", display: "grid", placeItems: "center",
            }}>
              <Zap size={17} color="var(--navy)" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>AI Tutor</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Studying {activeSubject}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="tutor-desktop-usage">
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "var(--off-white)", borderRadius: 10, padding: "0.5rem 1rem",
            }}>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Free Plan Usage
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)" }}>
                  {usedQueries}/{FREE_LIMIT} Queries Left
                </div>
              </div>
              <div style={{ width: 80, height: 6, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(usedQueries / FREE_LIMIT) * 100}%`, background: "var(--yellow-dark)", borderRadius: 4 }} />
              </div>
            </div>

            {/* top-bar more menu */}
            <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShowTopMenu(v => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "grid", placeItems: "center" }}
              >
                {showTopMenu
                  ? <X size={18} color="var(--navy)" strokeWidth={2} />
                  : <MoreHorizontal size={20} color="var(--muted)" strokeWidth={2} />
                }
              </button>
              {showTopMenu && (
                <OptionsMenu
                  onClose={() => setShowTopMenu(false)}
                  onClear={clearConversation}
                  onUpgrade={() => router.push("/settings")}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── subject header (desktop) ── */}
        <div style={{ padding: "1.5rem 2rem 0", background: "var(--off-white)", flexShrink: 0 }} className="tutor-subject-header">
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "rgba(74,144,217,.12)", margin: "0 auto 0.75rem",
              display: "grid", placeItems: "center",
            }}>
              <Zap size={22} color="#4a90d9" strokeWidth={2} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)", marginBottom: "0.3rem" }}>
              Studying {activeSubject}
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", maxWidth: 400, margin: "0 auto" }}>
              Ask anything about formulas, concepts, or exam strategies. Genie is tuned to your study plan and curriculum.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", marginBottom: "1.25rem" }}>
            {[
              { icon: Lightbulb, label: "Summarize key concepts" },
              { icon: BookOpen,  label: "Practice quiz items"   },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => focusInput(label)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  background: "white", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "0.55rem 1rem",
                  fontSize: "0.82rem", fontWeight: 500, color: "var(--navy)",
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                }}
              >
                <Icon size={14} strokeWidth={2} color="var(--muted)" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── message list ── */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "1.25rem 1.75rem",
          background: "var(--off-white)", display: "flex", flexDirection: "column",
        }}>
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <span style={{
              fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)",
              background: "var(--border)", padding: "0.25rem 0.75rem", borderRadius: 20,
            }}>TODAY</span>
          </div>

          {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}

          {isTyping && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: "var(--navy)", display: "grid", placeItems: "center",
                border: "2px solid var(--border)",
              }}>
                <Zap size={15} color="var(--yellow)" strokeWidth={2.5} />
              </div>
              <div style={{ background: "var(--navy)", borderRadius: 16, borderBottomLeftRadius: 4, padding: "0.5rem 0.85rem" }}>
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── input area ── */}
        <div style={{ background: "white", borderTop: "1px solid var(--border)", padding: "0.75rem 1.25rem 1rem", flexShrink: 0 }}>

          {/* free plan bar — mobile */}
          <div style={{ marginBottom: "0.6rem" }} className="tutor-mobile-usage">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 700, color: "var(--yellow-dark)" }}>
                <Zap size={12} strokeWidth={2.5} /> FREE PLAN USAGE
              </span>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)" }}>
                {usedQueries} / {FREE_LIMIT} queries left
              </span>
            </div>
            <div style={{ height: 4, background: "var(--border)", borderRadius: 4, overflow: "hidden", marginBottom: 3 }}>
              <div style={{ height: "100%", width: `${(usedQueries / FREE_LIMIT) * 100}%`, background: "var(--yellow)", borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Resets in 14 hours</span>
              <button
                onClick={() => router.push("/settings")}
                style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--yellow-dark)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans',sans-serif" }}
              >
                UPGRADE TO PRO &gt;
              </button>
            </div>
          </div>

          {/* subject chips */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.65rem", overflowX: "auto", paddingBottom: 2 }}>
            {subjectChips.map(s => (
              <button
                key={s}
                onClick={() => { setActive(s); focusInput(); }}
                style={{
                  padding: "0.35rem 0.85rem", borderRadius: 20, border: "none",
                  cursor: "pointer", flexShrink: 0,
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.78rem",
                  background: activeSubject === s ? "var(--navy)" : "var(--off-white)",
                  color: activeSubject === s ? "white" : "var(--muted)",
                  transition: "background .18s, color .18s",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* limit hit state */}
          {limitHit ? (
            <div style={{
              background: "var(--yellow-xlight)", border: "1.5px solid var(--yellow-dark)",
              borderRadius: "var(--radius-sm)", padding: "1rem", textAlign: "center",
            }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.5rem" }}>
                You&apos;ve used all {FREE_LIMIT} daily queries.
              </p>
              <button
                onClick={() => router.push("/settings")}
                style={{
                  background: "var(--yellow)", color: "var(--navy)", border: "none",
                  borderRadius: 8, padding: "0.6rem 1.5rem", fontWeight: 800,
                  fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Upgrade to Pro
              </button>
            </div>
          ) : (
            <div style={{ border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--off-white)", overflow: "hidden" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your subjects..."
                rows={1}
                style={{
                  width: "100%", background: "transparent", border: "none",
                  padding: "0.85rem 1rem 0",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
                  color: "var(--navy)", outline: "none", resize: "none",
                  maxHeight: 120, overflowY: "auto", lineHeight: 1.6,
                }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem 0.65rem" }}>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  {/* file attach */}
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={handleFileAttach} />
                  <button
                    title="Attach file"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, color: "var(--muted)", display: "grid", placeItems: "center" }}
                  >
                    <Paperclip size={17} strokeWidth={2} />
                  </button>

                  {/* clear chat */}
                  <button
                    title="Clear conversation"
                    onClick={clearConversation}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, color: "var(--muted)", display: "grid", placeItems: "center" }}
                  >
                    <RotateCcw size={17} strokeWidth={2} />
                  </button>

                  {/* more options */}
                  <button
                    title="More options"
                    onClick={() => {}}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, color: "var(--muted)", display: "grid", placeItems: "center" }}
                  >
                    <MoreHorizontal size={17} strokeWidth={2} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)" }} className="tutor-enter-hint">
                    Press Enter to send
                  </span>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: input.trim() ? "var(--navy)" : "var(--border)",
                      color: input.trim() ? "white" : "var(--muted)",
                      border: "none", borderRadius: 8, padding: "0.45rem 0.9rem",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                      fontSize: "0.82rem", cursor: input.trim() ? "pointer" : "default",
                      transition: "background .18s",
                    }}
                  >
                    Send <Send size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <p style={{ textAlign: "center", fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.6rem" }}>
            Genie can make mistakes. Verify important information with your textbooks.{" "}
            <button
              onClick={() => router.push("/")}
              style={{ color: "var(--yellow-dark)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: "0.68rem", fontFamily: "'DM Sans',sans-serif", padding: 0 }}
            >
              View Privacy Guidelines
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .tutor-root { height: 100vh; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .tutor-mobile-usage { display: none; }
        .tutor-enter-hint { display: inline; }
        @media(max-width: 768px) {
          .tutor-mobile-usage { display: block; }
          .tutor-desktop-usage { display: none !important; }
          .tutor-subject-header { display: none !important; }
          .tutor-enter-hint { display: none; }
        }
      `}</style>
    </AppShell>
  );
}
