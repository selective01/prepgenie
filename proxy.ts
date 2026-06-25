import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED = [
  "/dashboard",
  "/tutor",
  "/quiz",
  "/study-plan",
  "/progress",
  "/settings",
  "/onboarding",
  "/my-subjects",
];

// Routes only for unauthenticated users (redirect to dashboard if logged in)
const AUTH_ONLY = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("pg_token")?.value
    ?? request.headers.get("authorization")?.replace("Bearer ", "");

  // Check if the path is protected
  const isProtected = PROTECTED.some(path => pathname.startsWith(path));
  const isAuthOnly  = AUTH_ONLY.some(path => pathname.startsWith(path));

  // Not logged in trying to access protected route → redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in trying to access login/signup → redirect to dashboard
  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
