"use client";

import { useState } from "react";
import styles from "./Tabs.module.scss";
import type { TabMode, TabConfig } from "@/types";
import CoverLetterGenerator from "@/components/CoverLetterGenerator/CoverLetterGenerator";
import JobDescriptionWriter from "@/components/JobDescriptionWriter/JobDescriptionWriter";
import ResumeAnalyzer from "@/components/ResumeAnalyzer/ResumeAnalyzer";

// Конфигурация табов — добавить новый режим = добавить одну запись здесь
const TAB_CONFIG: TabConfig[] = [
  {
    id: "cover-letter",
    label: "Cover Letter",
    description: "Generate personalized cover letters",
    icon: "✍️",
  },
  {
    id: "job-description",
    label: "Job Description",
    description: "Write compelling job postings",
    icon: "📋",
  },
  {
    id: "resume-analyzer",
    label: "Resume Analyzer",
    description: "Check resume-to-job fit",
    icon: "🔍",
  },
];

// Таб-навигация — Client Component, управляет активным режимом
// Дочерние компоненты рендерятся через условный render, не через route
export default function Tabs() {
  const [activeTab, setActiveTab] = useState<TabMode>("cover-letter");

  return (
    <div className={styles.container}>
      {/* Таб-навигация */}
      <nav className={styles.nav} role="tablist" aria-label="HR Assistant tools">
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
              <span className={styles.tabIcon} aria-hidden="true">{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
              <span className={styles.tabDesc}>{tab.description}</span>
              {/* Активная линия под табом */}
              {isActive && <span className={styles.tabLine} aria-hidden="true" />}
            </button>
          );
        })}
      </nav>

      {/* Панели контента */}
      <div className={styles.panels}>
        <div
          role="tabpanel"
          id={`panel-cover-letter`}
          aria-labelledby={`tab-cover-letter`}
          hidden={activeTab !== "cover-letter"}
        >
          {activeTab === "cover-letter" && <CoverLetterGenerator />}
        </div>

        <div
          role="tabpanel"
          id={`panel-job-description`}
          aria-labelledby={`tab-job-description`}
          hidden={activeTab !== "job-description"}
        >
          {activeTab === "job-description" && <JobDescriptionWriter />}
        </div>

        <div
          role="tabpanel"
          id={`panel-resume-analyzer`}
          aria-labelledby={`tab-resume-analyzer`}
          hidden={activeTab !== "resume-analyzer"}
        >
          {activeTab === "resume-analyzer" && <ResumeAnalyzer />}
        </div>
      </div>
    </div>
  );
}
