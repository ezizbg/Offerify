import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Offerify — AI Hiring Suite",
  description:
    "Cover letters, job descriptions, and resume analysis powered by Claude AI. Results in seconds.",
  keywords: ["cover letter generator", "resume analyzer", "job description writer", "Claude AI", "HR tools"],
  authors: [{ name: "Eziz Berdiyev" }],
  openGraph: {
    title: "Offerify — AI Hiring Suite",
    description: "AI-powered hiring tools built with Next.js + Anthropic Claude",
    type: "website",
  },
};

// Prevents flash of wrong theme — runs synchronously before first paint
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t||s);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
