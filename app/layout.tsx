import type { Metadata } from "next";
import "./globals.scss";

// Метаданные — важны для SEO и превью в LinkedIn/GitHub
export const metadata: Metadata = {
  title: "HR AI Assistant — Cover Letters, Job Descriptions & Resume Analysis",
  description:
    "AI-powered tools for HR professionals and job seekers. Generate cover letters, write job descriptions, and analyze resume-to-job fit with Claude AI.",
  keywords: ["HR tools", "AI cover letter", "resume analyzer", "job description writer", "Claude AI"],
  authors: [{ name: "Eziz Berdyev" }],
  openGraph: {
    title: "HR AI Assistant",
    description: "AI-powered HR tools built with Next.js 14 + Anthropic Claude",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Root Layout — оборачивает всё приложение
// В App Router layout.tsx НЕ перерендеривается при навигации — только children меняется
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts через link — быстрее чем next/font для сторонних шрифтов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
