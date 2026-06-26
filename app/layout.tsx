import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://prepgenie-tawny.vercel.app"),
  title: "PrepGenie – AI-Powered JAMB Preparation",
  description: "Ace your JAMB exams with AI-powered tutoring, smart practice questions, instant explanations, and personalized study plans. The smartest way to prepare for JAMB.",
  keywords: "JAMB preparation, JAMB practice, UTME, Nigeria exam prep, AI tutor, JAMB 2025",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "PrepGenie – AI-Powered JAMB Preparation",
    description: "Study smarter, pass faster. AI tutoring, smart quizzes, and personalized study plans for JAMB.",
    url: "https://prepgenie-tawny.vercel.app",
    siteName: "PrepGenie",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepGenie – AI-Powered JAMB Preparation",
    description: "Study smarter, pass faster. AI tutoring, smart quizzes, and personalized study plans for JAMB.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
