import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Позволяет использовать SCSS модули без дополнительной настройки
  // Next.js 14 поддерживает их из коробки
  sassOptions: {
    // Путь к глобальным переменным SCSS, которые будут доступны в каждом модуле
    additionalData: `@use "app/variables" as *;`,
  },
};

export default nextConfig;
