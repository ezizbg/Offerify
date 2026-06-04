import styles from "./page.module.scss";
import Tabs from "@/components/Tabs/Tabs";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

export default function Home() {
  return (
    <div className={styles.root}>

      {/* ─── Header ─── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="/" className={styles.wordmark} aria-label="Offerify home">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={styles.logoMark}>
              <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.6"
                className={styles.logoCircle} />
              <path d="M6.5 10h7M10.5 7l3 3-3 3"
                stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"
                className={styles.logoArrow} />
            </svg>
            <span>Offerify</span>
          </a>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <a
              href="https://github.com/ezizbg/Offerify"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerBtn}
              aria-label="GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Powered by Claude AI</p>
          <h1 className={styles.heroTitle}>
            Your AI hiring suite.
          </h1>
          <p className={styles.heroSub}>
            Cover letters, resume analysis, and job descriptions —<br className={styles.heroBr} />
            generated in seconds, ready to send.
          </p>
        </div>
      </section>

      {/* ─── Tool ─── */}
      <main className={styles.tool}>
        <Tabs />
      </main>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Offerify &middot; Eziz Berdiyev &middot; {new Date().getFullYear()}
        </span>
      </footer>

    </div>
  );
}
