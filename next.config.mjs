import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin(); 

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.100.13'],
  turbopack: {
    resolveAlias: {
      '@/*': './src/*',
      '@/features': path.resolve(__dirname, './src/features'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/i18n': path.resolve(__dirname, './src/i18n'),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://githubusercontent.com', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pokeapi.co/api/v2/', 
        pathname: '/**',
      },
    ],
  },
};

// Экспортируем конфигурацию, обязательно обернув её в плагин локализации
export default withNextIntl(nextConfig);
