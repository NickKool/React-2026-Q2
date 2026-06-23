'use client'; 

import { useEffect, useSyncExternalStore } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation'; 
import { SearchBar } from '@/widgets/search-bar';
import { PokemonList } from '@/widgets/pokemon-list';
import { Pagination } from '@/shared/ui/pagination';
import { usePokemonsQuery } from '@/entities/pokemon';

const ITEMS_PER_PAGE = 20;

interface MainPageProps {
  serverSearchTerm: string;
  serverPage: number;
  children?: React.ReactNode; 
}

export function MainPage({ serverSearchTerm, serverPage, children }: MainPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const currentPage = parseInt(searchParams.get('page') || String(serverPage), 10);
  const currentSearchTerm = searchParams.get('q') || serverSearchTerm;
  
  const pokemonIdFromUrl = params.id as string | undefined;
  const isDetailOpen = !!pokemonIdFromUrl || !!searchParams.get('details');


  const { data, isLoading, isError, error } = usePokemonsQuery(
    currentSearchTerm,
    currentPage,
    ITEMS_PER_PAGE
  );

  const isOnline = useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine, 
    () => true 
  );

  let errorMsg: string | null = null;
  if (isError || !isOnline) {
    if (!isOnline) {
      errorMsg = 'No internet connection. Cannot display or refresh data.';
    } else {
      errorMsg = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  const pokemons = !isOnline ? [] : data?.pokemons || [];
  const totalCount = !isOnline ? 0 : data?.totalCount || 0;

  useEffect(() => {
    const savedTermInStorage = localStorage.getItem('pokemonSearchTerm') || '';
    const urlQuery = searchParams.get('q');

    if (urlQuery === null && savedTermInStorage.trim() !== '') {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('q', savedTermInStorage);
      currentParams.set('page', '1');
      router.replace(`${pathname}?${currentParams.toString()}`);
    }
  }, [searchParams, pathname, router]);

  const handleSearch = (term: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('q', term);
    currentParams.set('page', '1');
    localStorage.setItem('pokemonSearchTerm', term); 
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('page', String(newPage));
    router.push(`${pathname}?${currentParams.toString()}`);
  };
  const handleCloseDetail = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete('details'); // Удаляем флаг деталей, если он был
    router.push(`/?${currentParams.toString()}`);
  };

  return (
    <main className="w-full max-w-7xl mx-auto min-h-screen flex flex-col p-4 sm:p-8">
      <div className="bg-search-bg w-full rounded-md p-3 mb-6">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start grow relative">
        <div
          className={`transition-all duration-300 w-full ${isDetailOpen ? 'lg:w-1/2' : 'lg:w-full'}`}
        >
          <div className="bg-search-bg w-full rounded-md p-3 min-h-75">
            <PokemonList pokemons={pokemons} isLoading={isLoading} error={errorMsg} />

            {!isLoading && !errorMsg && pokemons.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>

        {isDetailOpen && (
          <div className="w-full lg:w-1/2 bg-search-bg border border-input-border rounded-md p-4 relative min-h-75 shadow-xl transition-colors duration-200">
            <button
              onClick={handleCloseDetail}
              className="group absolute top-3 right-3 bg-input-bg border border-input-border w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <div className="relative w-3 h-3">
                <span className="absolute inset-0 m-auto h-0.5 w-full bg-sub-text group-hover:bg-main-text rotate-45 transition-colors" />
                <span className="absolute inset-0 m-auto h-0.5 w-full bg-sub-text group-hover:bg-main-text -rotate-45 transition-colors" />
              </div>
            </button>
            
            {children || <div className="text-sub-text text-center mt-10">Loading details...</div>}
          </div>
        )}
      </div>

      <div className="mt-4 self-center"></div>
    </main>
  );
}
