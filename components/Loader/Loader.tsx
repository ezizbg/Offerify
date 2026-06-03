"use client";

import styles from "./Loader.module.scss";

interface LoaderProps {
  /** Текст под спиннером */
  text?: string;
  /** Размер спиннера в px */
  size?: number;
}

// SVG спиннер с двумя вращающимися дугами
// Анимация через CSS — GPU-ускоренная, не влияет на layout
export default function Loader({ text = "Generating...", size = 48 }: LoaderProps) {
  const center = size / 2;
  const radius = center - 4;
  // Длина окружности: 2πr — используется для stroke-dasharray/offset анимации
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={styles.wrapper} role="status" aria-label={text}>
      <div className={styles.svgWrapper} style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
        >
          <defs>
            {/* Градиент для внешней дуги */}
            <linearGradient id="spinGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6c63ff" />
              <stop offset="100%" stopColor="#4ecdc4" />
            </linearGradient>
            {/* Инвертированный градиент для внутренней дуги */}
            <linearGradient id="spinGradient2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Фоновый трек */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2.5"
          />

          {/* Внешняя вращающаяся дуга */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#spinGradient1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            className={styles.arcOuter}
          />

          {/* Внутренняя дуга — вращается в обратную сторону */}
          <circle
            cx={center}
            cy={center}
            r={radius - 8}
            stroke="url(#spinGradient2)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${(circumference - 48) * 0.5} ${(circumference - 48) * 0.5}`}
            className={styles.arcInner}
          />

          {/* Центральная точка */}
          <circle
            cx={center}
            cy={center}
            r={3}
            fill="#6c63ff"
            className={styles.dot}
          />
        </svg>
      </div>

      {text && (
        <div className={styles.textWrapper}>
          <span className={styles.text}>{text}</span>
          {/* Три точки — анимированный индикатор загрузки */}
          <span className={styles.dots} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>
      )}
    </div>
  );
}
