"use client";
import styles from "./Sidebar.module.scss";

export type ToolId = "cover-letter" | "resume-analyzer" | "job-description";

interface SidebarProps {
  active: ToolId;
  onSelect: (tool: ToolId) => void;
}

const ScribeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const ScannerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ArchitectIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const NAV: { id: ToolId; label: string; sub: string; Icon: () => JSX.Element }[] = [
  { id: "cover-letter",    label: "Cover Letter",    sub: "Generate a tailored letter", Icon: ScribeIcon    },
  { id: "resume-analyzer", label: "Resume Check",   sub: "ATS analysis & gaps",        Icon: ScannerIcon   },
  { id: "job-description", label: "Job Description", sub: "Write the perfect posting",  Icon: ArchitectIcon },
];

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoName}>Offerify</span>
      </div>

      {/* Nav items */}
      <nav className={styles.nav}>
        {NAV.map(({ id, label, sub, Icon }) => (
          <button
            key={id}
            className={`${styles.item} ${active === id ? styles.itemActive : ""}`}
            onClick={() => onSelect(id)}
          >
            <span className={styles.itemIcon}><Icon /></span>
            <span className={styles.itemLabels}>
              <span className={styles.itemLabel}>{label}</span>
              <span className={styles.itemSub}>{sub}</span>
            </span>
            {active === id && <span className={styles.itemDot} aria-hidden="true" />}
          </button>
        ))}
      </nav>
    </aside>
  );
}
