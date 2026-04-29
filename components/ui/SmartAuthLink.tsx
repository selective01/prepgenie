"use client";
import { useEffect, useState } from "react";

type Props = {
  loggedInHref: string;
  loggedOutHref: string;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
};

export default function SmartAuthLink({ loggedInHref, loggedOutHref, className, style, onMouseEnter, onMouseLeave, children }: Props) {
  const [href, setHref] = useState(loggedOutHref);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setHref(loggedInHref);
  }, [loggedInHref]);

  return (
    <a href={href} className={className} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </a>
  );
}
