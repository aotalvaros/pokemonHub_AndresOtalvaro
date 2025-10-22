"use client"

import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../utils/graphqlClient"
import { useEffect } from "react"
import type { IPokemon } from "../models/pokemon.interface"
import { usePokemonContext } from "../context/PokemonContext"
import { GET_POKEMONS } from '../constants/getPokemon';

interface GetPokemonsResponse {
  pokemon_v2_pokemon: IPokemon[]
}

export const usePokemons = (limit: number, offset = 0) => {
  const { addPokemons } = usePokemonContext()

  const pokeQuery = useQuery({
    queryKey: ["pokemons", { limit, offset }],
    queryFn: () => graphqlClient<GetPokemonsResponse>(GET_POKEMONS, { limit, offset }),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (pokeQuery.data?.pokemon_v2_pokemon) {
      addPokemons(pokeQuery.data.pokemon_v2_pokemon)
    }
  }, [pokeQuery.data, addPokemons])

  return {
    ...pokeQuery,
    pokemonData: pokeQuery.data?.pokemon_v2_pokemon || [],
  }
}
