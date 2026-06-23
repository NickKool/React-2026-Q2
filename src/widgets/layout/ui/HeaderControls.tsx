'use client';

import { useTranslations } from 'next-intl'; 
import { useAppTheme } from '@/shared/model';
import { useRefreshPokemons } from '@/entities/pokemon';

export function HeaderControls() {
  const t = useTranslations('Common'); 
  const { theme, toggleTheme } = useAppTheme();
  const refreshPokemons = useRefreshPokemons();

  return (
    <>
      <button
        onClick={toggleTheme}
        className="px-4 py-1.5 text-sm font-semibold rounded-md border border-input-border transition-all cursor-pointer active:scale-95 bg-search-bg text-main-text hover:opacity-80"
      >
        {theme === 'light' ? t('dark') : t('light')}
      </button>
      
      <button
        onClick={refreshPokemons}
        className="px-4 py-1.5 text-sm font-semibold rounded-md border border-input-border transition-all cursor-pointer active:scale-95 bg-search-bg text-main-text hover:opacity-80"
      >
        {t('refresh cache')}
      </button>
    </>
  );
}
