'use client';

import { useTranslations } from 'next-intl'; 
import { Link } from '@/i18n/navigation'; 

export function NotFoundPage() {
  const t = useTranslations('NotFoundPage'); 
  
  return (
    <div className="text-center p-16 text-main-text flex flex-col items-center gap-4">
      <h1 className="text-6xl font-extrabold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold">{t('title')}</h2>
      <p className="text-sub-text">{t('description')}</p>

      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-search-bg border border-input-border rounded text-input-focus hover:opacity-80 transition cursor-pointer active:scale-95"
      >
        {t('goHome')}
      </Link>
    </div>
  );
}
