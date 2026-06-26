import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = [
  "/dashboard", "/tutor", "/quiz", "/study-plan",
  "/progress", "/settings", "/onboarding", "/my-subjects",
];
const AUTH_ONLY = ["/login", "/signup"];

// Decode JWT payload and check expiry (no signature verification — just client-side guard)
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Check expiry if present
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    // Must have an id field
    return !!payload.id;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawToken = request.cookies.get("pg_token")?.value
    ?? request.headers.get("authorization")?.replace("Bearer ", "");

  // Validate token — not just presence but also structure + expiry
  const token = rawToken && isTokenValid(rawToken) ? rawToken : null;

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isAuthOnly  = AUTH_ONLY.some(p => pathname.startsWith(p));

  // Redirect /subjects → /my-subjects for logged-in users
  if (pathname === "/subjects" && token) {
    return NextResponse.redirect(new URL("/my-subjects", request.url));
  }

  // Not logged in → redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in trying to access login/signup → redirect to dashboard
  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add no-cache headers to protected pages to prevent bfcache
  const response = NextResponse.next();
  if (isProtected && token) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
