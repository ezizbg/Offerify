"use client";

import { useState } from "react";
import styles from "./Tabs.module.scss";
import type { TabMode } from "@/types";
import CoverLetterGenerator from "@/components/CoverLetterGenerator/CoverLetterGenerator";
import JobDescriptionWriter from "@/components/JobDescriptionWriter/JobDescriptionWriter";
import ResumeAnalyzer from "@/components/ResumeAnalyzer/ResumeAnalyzer";

const TABS: { id: TabMode; label: string; icon: React.ReactNode }[] = [
  {
    id: "cover-letter",
    label: "Cover Letter",
    icon: (
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 7l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "resume-analyzer",
    label: "Resume Check",
    icon: (
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M7 9h4M9 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "job-description",
    label: "Job Description",
    icon: (
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Tabs() {
  const [active, setActive] = useState<TabMode>("cover-letter");

  return (
    <div className={styles.container}>
      {/* ─── Tab bar ─── */}
      <div className={styles.tabBar} role="tablist" aria-label="HR Assistant tools">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              onClick={() => setActive(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Panel ─── */}
      <div className={styles.panel}>
        {TABS.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={active !== tab.id}
          >
            {active === tab.id && (
              <>
                {tab.id === "cover-letter"    && <CoverLetterGenerator />}
                {tab.id === "resume-analyzer" && <ResumeAnalyzer />}
                {tab.id === "job-description" && <JobDescriptionWriter />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
