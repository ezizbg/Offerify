"use client";
import { useState } from "react";
import styles from "./page.module.scss";
import Sidebar, { ToolId } from "@/components/Sidebar/Sidebar";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import CoverLetterGenerator from "@/components/CoverLetterGenerator/CoverLetterGenerator";
import ResumeAnalyzer from "@/components/ResumeAnalyzer/ResumeAnalyzer";
import JobDescriptionWriter from "@/components/JobDescriptionWriter/JobDescriptionWriter";

const MOBILE_LABELS: Record<ToolId, string> = {
  "cover-letter":    "Cover Letter",
  "resume-analyzer": "Resume Check",
  "job-description": "Job Description",
};

const MobileTabIcon: Record<ToolId, React.ReactNode> = {
  "cover-letter": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  "resume-analyzer": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  "job-description": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
};

const TOOLS: ToolId[] = ["cover-letter", "resume-analyzer", "job-description"];

export default function Home() {
  const [tool, setTool] = useState<ToolId>("cover-letter");

  return (
    <div className={styles.app}>

      {/* ─── Sidebar ─── */}
      <Sidebar active={tool} onSelect={setTool} />

      {/* ─── Content ─── */}
      <div className={styles.content}>

        {/* Top bar — just the project name */}
        <header className={styles.topBar}>
          <a href="/" className={styles.wordmark} aria-label="Offerify home">
            Offerify
          </a>
          <div className={styles.topActions}>
            <ThemeToggle />
            <a
              href="https://github.com/ezizbg/Offerify"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerBtn}
              aria-label="GitHub"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
          </div>
        </header>

        {/* Mobile tab bar — centered, hidden on desktop */}
        <nav className={styles.mobileNav} aria-label="Tools">
          {TOOLS.map((id) => (
            <button
              key={id}
              className={`${styles.mobileTab} ${tool === id ? styles.mobileTabActive : ""}`}
              onClick={() => setTool(id)}
            >
              <span className={styles.mobileTabIcon}>{MobileTabIcon[id]}</span>
              <span>{MOBILE_LABELS[id]}</span>
            </button>
          ))}
        </nav>

        {/* Tool panel */}
        <main className={styles.main}>
          <div className={styles.panel} key={tool}>
            {tool === "cover-letter"    && <CoverLetterGenerator />}
            {tool === "resume-analyzer" && <ResumeAnalyzer />}
            {tool === "job-description" && <JobDescriptionWriter />}
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.footerText}>
            Offerify &middot; Eziz Berdiyev &middot; {new Date().getFullYear()}
          </span>
        </footer>
      </div>

    </div>
  );
}
