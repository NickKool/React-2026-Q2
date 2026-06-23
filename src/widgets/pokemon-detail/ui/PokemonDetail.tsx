'use client'; 

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image'; 
import { usePokemonDetailsQuery } from '@/entities/pokemon';
import { Spinner } from '@/shared/ui';

export function PokemonDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('details') || undefined;

  const [isReady, setIsReady] = useState(false);

  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = usePokemonDetailsQuery(isReady ? id : undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner />
      </div>
    );
  }

  if (isError || !pokemon) {
    const errorMsg = error instanceof Error ? error.message : 'Loading error';
    return <div className="text-red-500 p-4 text-center">{errorMsg}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 text-main-text">
      <div className="w-48 h-48 relative mb-4">
        <Image 
          src={pokemon.image} 
          alt={pokemon.name} 
          width={192} 
          height={192} 
          className="w-full h-full object-contain"
          unoptimized 
        />
      </div>
      <h2 className="text-2xl font-bold capitalize mb-2">{pokemon.name}</h2>
      <p className="text-sub-text text-sm text-center">
        <span className="font-bold text-main-text">Capabilities:</span> {pokemon.description}
      </p>
    </div>
  );
}
