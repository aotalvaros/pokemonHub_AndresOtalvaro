import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../utils/graphqlClient"
import type { IPokemon } from "src/models/pokemon.interface"

interface GetPokemonResponse {
  pokemon_v2_pokemon: IPokemon[]
}

const GET_POKEMON = `
  query GetPokemon($id: Int!) {
    pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
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
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonmoves(limit: 2) {
        pokemon_v2_move {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) {
          flavor_text
        }
      }
    }
  }
`

// Mapeo de colores por tipo
const typeColors: Record<string, string> = {
  grass: "#74CB48",
  poison: "#A43E9E",
  fire: "#F57D31",
  water: "#6493EB",
  bug: "#A7B723",
  normal: "#AAA67F",
  electric: "#F9CF30",
  ground: "#DEC16B",
  fairy: "#E69EAC",
  fighting: "#C12239",
  psychic: "#FB5584",
  rock: "#B69E31",
  ghost: "#70559B",
  ice: "#9AD6DF",
  dragon: "#7037FF",
  dark: "#75574C",
  steel: "#B7B9D0",
  flying: "#A891EC",
}

export const usePokemon = (id: number) => {
  const pokeQuery = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => graphqlClient<GetPokemonResponse>(GET_POKEMON, { id }),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  })

  const pokemon = pokeQuery.data?.pokemon_v2_pokemon[0]

  if (!pokemon) {
    return {
      ...pokeQuery,
      pokemon: null,
    }
  }

  const sprites = pokemon.pokemon_v2_pokemonsprites[0]?.sprites
  const imageUrl =
    sprites?.other?.["official-artwork"]?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`

  // Obtener tipos y color principal
  const types = pokemon.pokemon_v2_pokemontypes.map((t) => ({
    name: t.pokemon_v2_type.name,
    color: typeColors[t.pokemon_v2_type.name] || "#AAA67F",
  }))

  const themeColor = types[0]?.color || "#74CB48"

  // Obtener descripción
  // const description =
  //   pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text
  //     ?.replace(/\f/g, " ")
  //     ?.replace(/\n/g, " ") || "No description available."

  // Mapear stats
  const statNames: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  }

  // const stats =
  //   pokemon.pokemon_v2_pokemonstats?.map((s) => ({
  //     name: statNames[s.pokemon_v2_stat.name] || s.pokemon_v2_stat.name.toUpperCase(),
  //     value: s.base_stat,
  //     maxValue: 255,
  //   })) || []

  // Obtener movimientos
  // const moves = pokemon.pokemon_v2_pokemonmoves?.slice(0, 2).map((m) => m.pokemon_v2_move.name.replace(/-/g, " ")) || []

  return {
    ...pokeQuery,
    pokemon: {
      id: pokemon.id,
      name: pokemon.name,
      image: imageUrl,
      types,
      weight: pokemon.weight,
      height: pokemon.height,
      moves: [],
      description: "",
      stats: [],
      themeColor,
    },
  }
}
