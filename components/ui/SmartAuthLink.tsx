"use client";

type Props = {
  loggedInHref:  string;
  loggedOutHref: string;
  className?:    string;
  style?:        React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children:      React.ReactNode;
};

export default function SmartAuthLink({
  loggedInHref, loggedOutHref, className, style, onMouseEnter, onMouseLeave, children
}: Props) {
  // Read token directly — no useState, no useEffect, no cascading renders
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("pg_token");
  const href = isLoggedIn ? loggedInHref : loggedOutHref;

  return (
    <a href={href} className={className} style={style}
       onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </a>
  );
}
