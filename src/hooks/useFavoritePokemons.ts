import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../utils/graphqlClient"
import type { IPokemon } from "@models/pokemon.interface"
import { gql } from "graphql-request"

interface GetPokemonsByIdsResponse {
  pokemon_v2_pokemon: IPokemon[]
}

const GET_POKEMONS_BY_IDS = gql`
  query GetPokemonsByIds($ids: [Int!]!) {
    pokemon_v2_pokemon(where: { id: { _in: $ids } }) {
      id
      name
      height
      weight
      base_experience
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemonabilities {
        pokemon_v2_ability {
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemonspeciesflavortexts(limit: 1, where: { language_id: { _eq: 9 } }) {
          flavor_text
        }
      }
    }
  }
`

export const useFavoritePokemons = (favoriteIds: number[]) => {
  return useQuery({
    queryKey: ["favoritePokemons", favoriteIds],
    queryFn: () => graphqlClient<GetPokemonsByIdsResponse>(GET_POKEMONS_BY_IDS, { ids: favoriteIds }),
    enabled: favoriteIds.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}
