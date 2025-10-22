import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PokemonDetail } from "../components/PokemonDetail"
import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../utils/graphqlClient"
import { GET_POKEMON } from "../constants/getPokemon"
import { usePokemonContext } from "../context/PokemonContext"
import { transformPokemonData } from "../utils/transformPokemonData"
import { IPokemon } from "../models/pokemon.interface"
import { NumberPokemontosee } from "../constants/numberPokemontosee"
import '../styles/pokemondetailpage.css'

interface GetPokemonResponse {
  pokemon_v2_pokemon: IPokemon[]
}

export const PokemonDetailPage: React.FC = () => {
 const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const pokemonId = Number.parseInt(id || "1", 10)

  const { getPokemon, addPokemons } = usePokemonContext()
  const cachedPokemon = getPokemon(pokemonId)

  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: () => graphqlClient<GetPokemonResponse>(GET_POKEMON, { id: pokemonId }),
    enabled: !cachedPokemon,
    staleTime: 1000 * 60 * 5,
  })

  if (data?.pokemon_v2_pokemon[0] && !cachedPokemon) {
    addPokemons([data.pokemon_v2_pokemon[0]])
  }

  const pokemon = cachedPokemon || data?.pokemon_v2_pokemon[0]

  const handleBack = () => {
    navigate("/")
  }

  const handlePrevious = () => {
    if (pokemonId > 1) {
      navigate(`/pokemon/${pokemonId - 1}`)
    }
  }

  const handleNext = () => {
    if (pokemonId < NumberPokemontosee.HOME_POKEMONS) {
      navigate(`/pokemon/${pokemonId + 1}`)
    }
  }

  if (isLoading && !cachedPokemon) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Pokémon...</p>
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="error-container">
        <p>Error loading Pokémon</p>
        <button onClick={handleBack}>Go back</button>
      </div>
    )
  }

  const transformedPokemon = transformPokemonData(pokemon)

  return (
   <PokemonDetail
      {...transformedPokemon}
      onBack={handleBack}
      onPrevious={pokemonId > 1 ? handlePrevious : undefined}
      onNext={pokemonId < NumberPokemontosee.HOME_POKEMONS ? handleNext : undefined}
    />
  )
}
