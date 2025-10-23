import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../utils/graphqlClient"
import { useEffect } from "react"

import { usePokemonContext } from "../context/PokemonContext"
import { GET_POKEMONS_WITH_COUNT } from "../constants/getPokemon"
import { IPokemon } from "@models/pokemon.interface"
import { NumberPokemontosee } from "@constants/numberPokemontosee"

interface GetPokemonsResponse {
   pokemon_v2_pokemon: IPokemon[]
  pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: number
    }
  }
}

export const usePaginatedPokemons = (page: number, sortBy: "name" | "number") => {
  const { addPokemons } = usePokemonContext()
  const offset = (page - 1) * NumberPokemontosee.HOME_POKEMONS

  const query = useQuery({
    queryKey: ["paginatedPokemons", page, sortBy],
    queryFn: () =>
      graphqlClient<GetPokemonsResponse>(GET_POKEMONS_WITH_COUNT, {
        limit: NumberPokemontosee.HOME_POKEMONS,
        offset,
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.data?.pokemon_v2_pokemon) {
      addPokemons(query.data.pokemon_v2_pokemon)
    }
  }, [query.data, addPokemons])

  const sortedData = query.data?.pokemon_v2_pokemon
    ? [...query.data.pokemon_v2_pokemon].sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name)
        }
        return a.id - b.id
      })
    : []

  const totalCount = query.data?.pokemon_v2_pokemon_aggregate?.aggregate?.count || 0
  const totalPages = Math.ceil(totalCount / NumberPokemontosee.HOME_POKEMONS)

  return {
    ...query,
    pokemonData: sortedData,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
  }
}
