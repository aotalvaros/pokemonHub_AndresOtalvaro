import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '../utils/graphqlClient';
import { useEffect, useState } from 'react';
import { Pokemon } from 'src/models/pokemon.interface';

interface GetPokemonsResponse {
  pokemon_v2_pokemon: Pokemon[];
}

const GET_POKEMONS = `
  query GetPokemons($limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: {id: asc}) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

export const usePokemons = (limit: number, offset: number = 0) => {

    const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

    const pokeQuery = useQuery({
        queryKey: ['pokemons', { limit, offset }],
        queryFn: () => graphqlClient<GetPokemonsResponse>(GET_POKEMONS, { limit, offset }),
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            if (!pokeQuery.data) return;
            const detailedData = await Promise.all(
                pokeQuery.data.pokemon_v2_pokemon.map(async (pokemon) => {
                    // Aquí podrías hacer más consultas si necesitas más detalles
                    return pokemon;
                })
            );
            setPokemonData(detailedData);
        }

        fetchPokemonDetails();
    },[pokeQuery.data])

  return {
    ...pokeQuery,
    pokemonData
  };
};