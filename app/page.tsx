import styles from "./page.module.scss";
import Tabs from "@/components/Tabs/Tabs";

// Главная страница — Server Component по умолчанию в App Router
// Статический shell: шапка + навигация
// Интерактивная логика уехала в Client Components (Tabs и дочерние)
export default function Home() {
  return (
    <main className={styles.main}>
      {/* Шапка */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            {/* SVG логотип с анимацией */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.logoSvg}
              aria-hidden="true"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset="100"
                className={styles.logoCircle}
              />
              <path
                d="M11 18h14M18 11l7 7-7 7"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.logoArrow}
              />
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6c63ff" />
                  <stop offset="100%" stopColor="#4ecdc4" />
                </linearGradient>
              </defs>
            </svg>
            <span className={styles.logoText}>HR AI Assistant</span>
          </div>

          <div className={styles.headerBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Powered by Claude</span>
          </div>
        </div>
      </header>

      {/* Hero секция */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            AI Tools for
            <span className={styles.heroAccent}> Modern HR</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Generate cover letters, write job descriptions, and analyze resume fit —
            all powered by Claude AI with real-time streaming.
          </p>
        </div>
      </section>

      {/* Основная интерактивная часть — Client Component */}
      <section className={styles.content}>
        <Tabs />
      </section>

      {/* Футер */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>Offerify</span>
          <span className={styles.footerDivider}>·</span>
          <span className={styles.footerCopy}>© {new Date().getFullYear()} Eziz Berdiyev</span>
          <span className={styles.footerDivider}>·</span>
          <a
            href="https://github.com/ezizbg/Offerify"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
