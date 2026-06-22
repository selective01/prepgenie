"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function setCookie(token: string) {
  document.cookie = `pg_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function removeCookie() {
  document.cookie = "pg_token=; path=/; max-age=0";
}

// ── types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id:               string;
  name:             string;
  email:            string;
  plan:             "free" | "premium";
  subjects:         string[];
  examDate:         string | null;
  targetScore:      number;
  studyHoursPerDay: number;
}

interface AuthContextValue {
  user:      AuthUser | null;
  token:     string | null;
  loading:   boolean;
  error:     string | null;
  login:     (email: string, password: string) => Promise<void>;
  register:  (name: string, email: string, password: string) => Promise<void>;
  logout:    () => void;
  updateUser:(data: Partial<AuthUser>) => Promise<void>;
  clearError:() => void;
}

// ── context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);  // true on mount while we check localStorage
  const [error,   setError]   = useState<string | null>(null);

  // ── restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("pg_token");
    if (!stored) { setLoading(false); return; }

    // verify the token is still valid by calling /me
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setToken(stored);
          setUser(data.user);
        } else {
          localStorage.removeItem("pg_token");
        }
      })
      .catch(() => localStorage.removeItem("pg_token"))
      .finally(() => setLoading(false));
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem("pg_token", data.token);
      setCookie(data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem("pg_token", data.token);
      setCookie(data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("pg_token");
    removeCookie();
    setToken(null);
    setUser(null);
  }, []);

  // ── update user ───────────────────────────────────────────────────────────
  const updateUser = useCallback(async (data: Partial<AuthUser>) => {
    if (!token) return;
    const res  = await fetch(`${API}/api/auth/update`, {
      method:  "PUT",
      headers: {
        "Content-Type":  "application/json",
        Authorization:   `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) setUser(json.user);
  }, [token]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
