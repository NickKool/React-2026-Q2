'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'ru' ? 'en' : 'ru';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-3 py-1.5 text-sm font-semibold rounded-md border border-input-border transition-all cursor-pointer active:scale-95 bg-search-bg text-main-text hover:opacity-80"
    >
      {locale === 'ru' ? 'EN' : 'RU'}
    </button>
  );
}
