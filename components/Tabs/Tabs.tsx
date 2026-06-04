"use client";

import { useState } from "react";
import styles from "./Tabs.module.scss";
import type { TabMode } from "@/types";
import CoverLetterGenerator from "@/components/CoverLetterGenerator/CoverLetterGenerator";
import JobDescriptionWriter from "@/components/JobDescriptionWriter/JobDescriptionWriter";
import ResumeAnalyzer from "@/components/ResumeAnalyzer/ResumeAnalyzer";

// SVG иконки — чище чем emoji
const Icons = {
  "cover-letter": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 7l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "job-description": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "resume-analyzer": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 9h4M9 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

const TABS: { id: TabMode; label: string; desc: string }[] = [
  { id: "cover-letter",    label: "Cover Letter",     desc: "Personalized letters in seconds" },
  { id: "job-description", label: "Job Description",  desc: "Write compelling job postings" },
  { id: "resume-analyzer", label: "Resume Analyzer",  desc: "ATS fit score & recommendations" },
];

export default function Tabs() {
  const [active, setActive] = useState<TabMode>("cover-letter");

  return (
    <div className={styles.container}>
      {/* ─── Три карточки-таба ─── */}
      <div className={styles.cards} role="tablist" aria-label="HR Assistant tools">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
              onClick={() => setActive(tab.id)}
            >
              <span className={`${styles.cardIcon} ${isActive ? styles.cardIconActive : ""}`}>
                {Icons[tab.id]}
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardLabel}>{tab.label}</span>
                <span className={styles.cardDesc}>{tab.desc}</span>
              </span>
              {/* Активный индикатор */}
              {isActive && <span className={styles.cardDot} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* ─── Контент-панель ─── */}
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
                {tab.id === "job-description" && <JobDescriptionWriter />}
                {tab.id === "resume-analyzer" && <ResumeAnalyzer />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
