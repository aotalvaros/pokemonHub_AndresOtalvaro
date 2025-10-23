import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../utils/graphqlClient"
import { useEffect } from "react"

import { usePokemonContext } from "../context/PokemonContext"
import { GET_POKEMONS_WITH_COUNT_BY_NAME, GET_POKEMONS_WITH_COUNT_BY_ID } from "../constants/getPokemon"
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

  const queryString = sortBy === "name" ? GET_POKEMONS_WITH_COUNT_BY_NAME : GET_POKEMONS_WITH_COUNT_BY_ID

  const query = useQuery({
    queryKey: ["paginatedPokemons", page, sortBy],
    queryFn: () =>
      graphqlClient<GetPokemonsResponse>(queryString, {
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

  const pokemonData = query.data?.pokemon_v2_pokemon || []

  const totalCount = query.data?.pokemon_v2_pokemon_aggregate?.aggregate?.count || 0
  const totalPages = Math.ceil(totalCount / NumberPokemontosee.HOME_POKEMONS)

  return {
    ...query,
    pokemonData,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
  }
}
