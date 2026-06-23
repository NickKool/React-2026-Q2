import { NextResponse } from 'next/server';
import { PokemonApi } from '@/entities/pokemon/api/PokemonApi'; 

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  const originParam = searchParams.get('origin') || 'http://localhost:3000';

  if (!idsParam) {
    return new NextResponse('No ids provided', { status: 400 });
  }

  const ids: string[] = idsParam.split(',');
  
  try {
    const pokemonResponses = await Promise.all(
      ids.map((pokemonId: string) => PokemonApi.getByName(pokemonId))
    );

    const validPokemons = pokemonResponses
      .map((response) => response.results[0])
      .filter(Boolean);

    const headers = ['ID', 'Name', 'Description', 'Detail URL'];
    
    const rows: string[] = validPokemons.map((pokemon) => {
      const id = pokemon.id;
      const name = pokemon.name || 'Unknown';
      
      const abilitiesStr = pokemon.abilities.map((a) => a.ability.name).join(', ');
      const description = abilitiesStr || 'A Pokémon discovered in the wild';
      
      const detailUrl = `${originParam}/pokemon/${id}`;

      return [
        id, 
        `"${name}"`, 
        `"${description.replace(/"/g, '""')}"`, 
        `"${detailUrl}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const BOM = '\uFEFF'; 

    const fileCount = validPokemons.length;
    return new NextResponse(BOM + csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileCount}_items.csv"`,
      },
    });
  } catch {
    return new NextResponse('Server Error generating CSV', { status: 500 });
  }
}
