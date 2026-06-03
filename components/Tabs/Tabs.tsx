"use client";

import { useState } from "react";
import styles from "./Tabs.module.scss";
import type { TabMode, TabConfig } from "@/types";
import CoverLetterGenerator from "@/components/CoverLetterGenerator/CoverLetterGenerator";
import JobDescriptionWriter from "@/components/JobDescriptionWriter/JobDescriptionWriter";
import ResumeAnalyzer from "@/components/ResumeAnalyzer/ResumeAnalyzer";

const TAB_CONFIG: TabConfig[] = [
  { id: "cover-letter",     label: "Cover Letter",     description: "Generate personalized cover letters", icon: "✍️" },
  { id: "job-description",  label: "Job Description",  description: "Write compelling job postings",        icon: "📋" },
  { id: "resume-analyzer",  label: "Resume Analyzer",  description: "Check resume-to-job fit",             icon: "🔍" },
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<TabMode>("cover-letter");

  // Индекс активного таба для CSS sliding indicator
  const activeIndex = TAB_CONFIG.findIndex((t) => t.id === activeTab);

  return (
    <div className={styles.container}>
      {/* Segmented control — iOS/macOS style */}
      <nav
        className={styles.nav}
        role="tablist"
        aria-label="HR Assistant tools"
        // Передаём индекс через CSS custom property — индикатор двигается через CSS
        style={{ "--active-index": activeIndex } as React.CSSProperties}
      >
        {/* Скользящий индикатор — позади кнопок, анимируется через CSS */}
        <span className={styles.slider} aria-hidden="true" />

        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Панели контента */}
      <div className={styles.panels}>
        {TAB_CONFIG.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
          >
            {activeTab === tab.id && (
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
