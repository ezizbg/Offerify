"use client";

import styles from "./Loader.module.scss";

interface LoaderProps {
  text?: string;
  size?: number;
}

export default function Loader({ text = "Generating", size = 44 }: LoaderProps) {
  const c  = size / 2;          // центр
  const r1 = c - 4;             // радиус внешней дуги
  const r2 = c - 12;            // радиус внутренней
  const circ = 2 * Math.PI * r1;

  return (
    <div className={styles.wrapper} role="status" aria-label={text}>
      <div className={styles.svgWrap} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="rgba(245,245,247,0.8)" />
              <stop offset="100%" stopColor="rgba(245,245,247,0.2)" />
            </linearGradient>
          </defs>

          {/* Фоновый трек */}
          <circle cx={c} cy={c} r={r1} stroke="rgba(255,255,255,0.06)" strokeWidth="2" />

          {/* Внешняя дуга */}
          <circle
            cx={c} cy={c} r={r1}
            stroke="url(#lg1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${circ * 0.72} ${circ * 0.28}`}
            className={styles.arcOuter}
          />

          {/* Внутренняя дуга — другая скорость */}
          <circle
            cx={c} cy={c} r={r2}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * r2 * 0.45} ${2 * Math.PI * r2 * 0.55}`}
            className={styles.arcInner}
          />

          {/* Центральная точка */}
          <circle cx={c} cy={c} r={2.5} fill="rgba(245,245,247,0.5)" className={styles.dot} />
        </svg>
      </div>

      {text && (
        <div className={styles.textWrap}>
          <span className={styles.text}>{text}</span>
          <span className={styles.dots} aria-hidden="true">
            <span /><span /><span />
          </span>
        </div>
      )}
    </div>
  );
}
