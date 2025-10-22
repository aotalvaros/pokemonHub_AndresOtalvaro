"use client"

import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../utils/graphqlClient"
import { SEARCH_POKEMONS, SEARCH_POKEMONS_BY_ID } from "../constants/getPokemon"
import { IPokemon } from "@models/pokemon.interface"

interface SearchPokemonsResponse {
  pokemon_v2_pokemon: IPokemon[]
}

export const useSearchPokemons = (searchTerm: string, searchType: "name" | "number", enabled: boolean) => {
  const searchQuery = useQuery({
    queryKey: ["searchPokemons", searchTerm, searchType],
    queryFn: () => {
      if (searchType === "number") {
        const pokemonId = Number.parseInt(searchTerm.replace("#", ""), 10)
        return graphqlClient<SearchPokemonsResponse>(SEARCH_POKEMONS_BY_ID, {
          id: pokemonId,
        })
      } else {
        return graphqlClient<SearchPokemonsResponse>(SEARCH_POKEMONS, {
          name: `%${searchTerm}%`,
        })
      }
    },
    enabled: enabled && searchTerm.length >= 1,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })

  return {
    ...searchQuery,
    searchResults: searchQuery.data?.pokemon_v2_pokemon || [],
  }
}
