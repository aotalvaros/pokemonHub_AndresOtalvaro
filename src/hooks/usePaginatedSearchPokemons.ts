import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../utils/graphqlClient"
import {
  SEARCH_POKEMONS_PAGINATED,
  SEARCH_POKEMONS_BY_ID_PAGINATED,
  SEARCH_POKEMONS_BY_TYPE_PAGINATED,
} from "../constants/getPokemon"
import { IPokemon } from "@models/pokemon.interface"
import { NumberPokemontosee } from "@constants/numberPokemontosee"

interface SearchPokemonsResponse {
  pokemon_v2_pokemon: IPokemon[],
   pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: number
    }
  }
}

export const usePaginatedSearchPokemons = (
  searchTerm: string,
  searchType: "name" | "number" | "type",
  page: number,
  enabled: boolean,
) => {
  const offset = (page - 1) * NumberPokemontosee.HOME_POKEMONS

  const getQueryAndVariables = () => {
    if (searchType === "name") {
      return {
        query: SEARCH_POKEMONS_PAGINATED,
        variables: { name: `%${searchTerm}%`, limit: NumberPokemontosee.HOME_POKEMONS, offset },
      }
    } else if (searchType === "number") {
      const pokemonId = Number.parseInt(searchTerm.replace("#", ""))
      return {
        query: SEARCH_POKEMONS_BY_ID_PAGINATED,
        variables: { id: pokemonId, limit: NumberPokemontosee.HOME_POKEMONS, offset },
      }
    } else {
      return {
        query: SEARCH_POKEMONS_BY_TYPE_PAGINATED,
        variables: { typeName: searchTerm.toLowerCase(), limit: NumberPokemontosee.HOME_POKEMONS, offset },
      }
    }
  }

  const { query, variables } = getQueryAndVariables()

  const searchQuery = useQuery({
    queryKey: ["paginatedSearch", searchTerm, searchType, page],
    queryFn: () => graphqlClient<SearchPokemonsResponse>(query, variables),
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const totalCount = searchQuery.data?.pokemon_v2_pokemon_aggregate?.aggregate?.count || 0
  const totalPages = Math.ceil(totalCount / NumberPokemontosee.HOME_POKEMONS)

  return {
     ...searchQuery,
    searchResults: searchQuery.data?.pokemon_v2_pokemon || [],
    totalPages,
    totalCount,
    hasNextPage: page < totalPages
  }
}