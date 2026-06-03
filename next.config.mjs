/** @type {import('next').NextConfig} */
const nextConfig = {
  // next.config.ts не поддерживается в Next.js 14 — используем .mjs
  // sassOptions.additionalData убран: каждый SCSS модуль импортирует
  // переменные явно через @use "app/variables" as * — это прозрачнее
};

export default nextConfig;
