"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Mode = "login" | "signup";

export default function AuthCard({ mode }: { mode: Mode }) {
  const [showPass, setShowPass] = useState(false);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [localErr, setLocalErr] = useState("");

  const router   = useRouter();
  const isLogin  = mode === "login";
  const { login, register, loading, error, clearError } = useAuth();

  async function handleSubmit() {
    setLocalErr("");
    clearError();

    // basic client-side validation
    if (!email || !password) { setLocalErr("Please fill in all fields."); return; }
    if (!isLogin && !name)   { setLocalErr("Please enter your full name."); return; }
    if (password.length < 6) { setLocalErr("Password must be at least 6 characters."); return; }

    try {
      if (isLogin) {
        await login(email, password);
        router.push("/dashboard");
      } else {
        await register(name, email, password);
        router.push("/onboarding");
      }
    } catch {
      // error is already set in context
    }
  }

  const displayError = localErr || error;

  return (
    <>
      <div className="auth-page">
        <div className="auth-bg-split">
          <div className="auth-bg-left" />
          <div className="auth-bg-right" />
        </div>

        <div className="auth-shell">
          <div className="auth-card">

            {/* ── LEFT — Image panel ── */}
            <div className="auth-visual-wrap">
              <div className="auth-visual">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=85"
                  alt="PrepGenie students"
                  fill priority
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  unoptimized
                />
                <div className="auth-visual-overlay" />
                <div className="auth-visual-top">
                  <div>
                    <h3>Your Progress, Our Priority</h3>
                    <p>Ace your JAMB with confidence.</p>
                  </div>
                  <div className="auth-visual-top-right">
                    <span>{isLogin ? "New here?" : "Already have an account?"}</span>
                    <button type="button" onClick={() => router.push(isLogin ? "/signup" : "/login")}>
                      {isLogin ? "Join Us" : "Login"}
                    </button>
                  </div>
                </div>
                <div className="auth-visual-bottom">
                  <div className="auth-brand-row">
                    <div className="auth-brand-circle">
                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                        <rect x="14.5" y="24" width="3" height="5" rx="1" fill="#F5C200" opacity=".9"/>
                        <rect x="11" y="28" width="10" height="2" rx="1" fill="#F5C200" opacity=".9"/>
                        <rect x="15.2" y="15" width="1.6" height="10" rx=".8" fill="#F5C200" opacity=".9"/>
                        <path d="M5 15 L13.5 6 L18.5 6 L27 15 Z" fill="#F5C200"/>
                        <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                      </svg>
                    </div>
                    <div>
                      <div className="auth-brand-name">PrepGenie</div>
                      <div className="auth-brand-sub">Practice. Learn. Succeed.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT — Form panel ── */}
            <div className="auth-form-panel">
              <div className="auth-slant" />
              <div className="auth-form-inner">
                <div className="auth-header-row">
                  <Link href="/" className="auth-logo">
                    Prep<span style={{ color: "#d4a800" }}>Genie</span>
                  </Link>
                  <div style={{ width: 48 }} />
                </div>

                <div className="auth-center-block">
                  <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>
                  <p className="auth-subtitle">
                    {isLogin
                      ? "Login to continue your learning journey"
                      : "Create your account and continue your JAMB preparation"}
                  </p>

                  <div className="auth-form-box">
                    {!isLogin && (
                      <input
                        type="text"
                        placeholder="Full name"
                        className="auth-input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    )}

                    <input
                      type="email"
                      placeholder="Email"
                      className="auth-input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />

                    <div className="auth-password-wrap">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        className="auth-input auth-password-input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      />
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowPass(v => !v)}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {isLogin && (
                      <div className="auth-forgot-wrap">
                        <Link href="/forgot-password" className="auth-forgot-link">
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    {/* error message */}
                    {displayError && (
                      <p style={{ color: "#ef4444", fontSize: "0.78rem", marginBottom: "0.5rem", textAlign: "center" }}>
                        {displayError}
                      </p>
                    )}

                    <button
                      type="button"
                      className="auth-cta-btn"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading
                        ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                        : isLogin ? "Login" : "Create Account"
                      }
                    </button>

                    <p className="auth-switch-text">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() => router.push(isLogin ? "/signup" : "/login")}
                      >
                        {isLogin ? "Sign up" : "Login"}
                      </button>
                    </p>

                    <div className="auth-socials">
                      <FaFacebookF size={18} />
                      <FaTwitter size={18} />
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: #e4e6ea;
          padding: 20px;
          font-family: 'DM Sans', Inter, sans-serif;
        }
        .auth-bg-split {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 50% 50%;
        }
        .auth-bg-left {
          background-image: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=85');
          background-size: cover;
          background-position: center;
          filter: brightness(0.45);
          clip-path: polygon(0 0, 96% 0, 84% 100%, 0 100%);
        }
        .auth-bg-right { background: #e4e6ea; }
        .auth-shell {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 1;
        }
        .auth-card {
          width: min(96vw, 1100px);
          height: min(70vh, 600px);
          min-height: 500px;
          border-radius: 28px;
          background: #f4f5f7;
          display: grid;
          grid-template-columns: 50% 50%;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
          overflow: hidden;
          position: relative;
        }
        .auth-visual-wrap { position: relative; padding: 8px 0 8px 8px; z-index: 1; }
        .auth-visual {
          position: relative;
          width: 100%; height: 100%;
          border-radius: 22px 0 0 22px;
          overflow: hidden;
          clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
        }
        .auth-visual-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(8,10,20,0.1) 0%, rgba(8,10,20,0.25) 50%, rgba(8,10,20,0.55) 100%);
        }
        .auth-visual-top {
          position: absolute; top: 24px; left: 24px; right: 24px;
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 16px; color: #fff; z-index: 2;
        }
        .auth-visual-top h3 { font-size: 1rem; font-weight: 700; line-height: 1.2; margin: 0 0 6px; }
        .auth-visual-top p { font-size: 0.88rem; color: rgba(255,255,255,0.85); margin: 0; }
        .auth-visual-top-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .auth-visual-top-right span { font-size: 0.84rem; color: rgba(255,255,255,0.85); white-space: nowrap; }
        .auth-visual-top-right button {
          height: 38px; padding: 0 18px; border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.85);
          background: transparent; color: #fff; font-weight: 700; font-size: 0.84rem; cursor: pointer;
        }
        .auth-visual-bottom {
          position: absolute; left: 24px; right: 24px; bottom: 22px;
          display: flex; align-items: center; justify-content: space-between; color: #fff; z-index: 2;
        }
        .auth-brand-row { display: flex; align-items: center; gap: 12px; }
        .auth-brand-circle { width: 50px; height: 50px; border-radius: 50%; background: #fff; display: grid; place-items: center; }
        .auth-brand-name { font-size: 1.1rem; font-weight: 800; line-height: 1.1; }
        .auth-brand-sub { margin-top: 4px; color: rgba(255,255,255,0.75); font-size: 0.84rem; }
        .auth-form-panel { position: relative; background: #f4f5f7; overflow: hidden; z-index: 2; }
        .auth-slant {
          position: absolute; left: -55px; top: 0; width: 110px; height: 100%;
          background: #f4f5f7; transform: skewX(-11deg); z-index: 1;
        }
        .auth-form-inner {
          position: relative; z-index: 2; height: 100%;
          padding: 26px 32px 26px 52px;
          display: flex; flex-direction: column;
        }
        .auth-header-row { display: flex; align-items: center; justify-content: space-between; }
        .auth-logo {
          text-decoration: none; color: #0d1b3e; font-weight: 800;
          font-size: 1.7rem; letter-spacing: -0.04em; font-family: 'Playfair Display', serif;
        }
        .auth-center-block {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center; text-align: center;
        }
        .auth-center-block h1 {
          margin: 0; font-size: 2.6rem; line-height: 1.05;
          letter-spacing: -0.05em; color: #0d1b3e; font-weight: 800;
          font-family: 'Playfair Display', serif;
        }
        .auth-subtitle { margin: 12px 0 0; color: #6b7280; font-size: 0.9rem; }
        .auth-form-box { width: 100%; max-width: 300px; margin-top: 24px; }
        .auth-input {
          width: 100%; height: 35px; border-radius: 8px;
          border: 1.5px solid #d6dbe3; background: #fff;
          padding: 0 16px; font-size: 0.9rem; color: #1f2937;
          outline: none; box-sizing: border-box; margin-bottom: 14px;
          font-family: 'DM Sans', sans-serif; transition: border-color .2s;
        }
        .auth-input:focus { border-color: #0d1b3e; }
        .auth-password-wrap { position: relative; margin-bottom: 6px; }
        .auth-password-input { padding-right: 44px; margin-bottom: 0; }
        .auth-eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          border: none; background: transparent; color: #6b7280; cursor: pointer; display: flex; padding: 0;
        }
        .auth-forgot-wrap { display: flex; justify-content: flex-end; margin-bottom: 16px; }
        .auth-forgot-link { text-decoration: none; color: #d4a800; font-weight: 500; font-size: 0.75rem; }
        .auth-cta-btn {
          width: 100%; height: 35px; border-radius: 999px; border: none;
          background: #F5C200; color: #0d1b3e; font-size: 1rem; font-weight: 800;
          cursor: pointer; margin-top: 16px; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s;
        }
        .auth-cta-btn:hover:not(:disabled) { background: #d4a800; }
        .auth-cta-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .auth-switch-text { margin: 18px 0 0; text-align: center; font-size: 0.88rem; color: #6b7280; }
        .auth-switch-btn {
          border: none; background: transparent; color: #0d1b3e;
          font-weight: 700; font-size: 0.88rem; cursor: pointer; padding: 0; text-decoration: underline;
        }
        .auth-socials {
          display: flex; justify-content: center; align-items: center;
          gap: 20px; margin-top: 20px; color: #0d1b3e;
        }
        .auth-socials svg { cursor: pointer; opacity: .75; transition: opacity .2s; }
        .auth-socials svg:hover { opacity: 1; }

        @media (max-width: 900px) {
          .auth-page { padding: 0; align-items: flex-start; background: #f4f5f7; }
          .auth-bg-split { display: none; }
          .auth-card {
            width: 100%; max-width: 100%; height: auto; min-height: 100vh;
            border-radius: 0; grid-template-columns: 1fr; grid-template-rows: 28vh auto; box-shadow: none;
          }
          .auth-visual-wrap { padding: 0; grid-row: 1; }
          .auth-visual { border-radius: 0; clip-path: none; min-height: 28vh; }
          .auth-visual-top { display: none; }
          .auth-visual-bottom { bottom: 30px; left: 16px; right: 16px; }
          .auth-brand-circle { width: 40px; height: 40px; }
          .auth-brand-name { font-size: 0.95rem; }
          .auth-brand-sub { font-size: 0.75rem; margin-top: 2px; }
          .auth-form-panel { grid-row: 2; border-radius: 24px 24px 0 0; margin-top: -20px; position: relative; z-index: 3; background: #f4f5f7; }
          .auth-slant { display: none; }
          .auth-form-inner { padding: 24px 20px 32px; }
          .auth-form-box { max-width: 100%; }
          .auth-center-block { align-items: center; }
          .auth-center-block h1 { font-size: 2rem; }
          .auth-header-row { display: none; }
          .auth-input { height: 44px; border-radius: 12px; font-size: 0.95rem; margin-bottom: 12px; padding: 0 14px; }
          .auth-password-wrap { position: relative; display: block; }
          .auth-password-input { padding-right: 42px; margin-bottom: 12px; }
          .auth-eye-btn { position: absolute; right: 12px; top: 22px; transform: translateY(-50%); }
          .auth-cta-btn { height: 48px; font-size: 1rem; margin-top: 10px; }
        }
      `}</style>
    </>
  );
}
