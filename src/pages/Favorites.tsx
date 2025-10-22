import type React from "react"
import { useMemo } from "react"

import "../styles/homepage.css"
import { useFavorites } from "@context/FavoritesContext"
import { usePokemonContext } from "@context/PokemonContext"
import { useFavoritePokemons } from "@hooks/useFavoritePokemons"
import HeaderPokemon from "@components/HeaderPokemon"
import CardsPokemon from "@components/CardsPokemon"
import { IPokemon } from "@models/pokemon.interface"

export const Favorites: React.FC = () => {
  const { favorites } = useFavorites()
  const { pokemons: pokemonMap } = usePokemonContext()

  const pokemonsFromContext = useMemo(() => {
    const result: IPokemon[] = []
    favorites.forEach((id) => {
      const pokemon = pokemonMap.get(id)
      if (pokemon) {
        result.push(pokemon)
      }
    })
    return result
  }, [favorites, pokemonMap])

  const missingIds = useMemo(() => {
    return favorites.filter((id) => !pokemonMap.has(id))
  }, [favorites, pokemonMap])

  const { data: fetchedPokemons, isLoading } = useFavoritePokemons(missingIds)

  const favoritePokemons = useMemo(() => {
    const fromApi = fetchedPokemons?.pokemon_v2_pokemon || []
    console.log("🚀 ~ Favorites ~ fromApi:", fromApi)
    return [...pokemonsFromContext, ...fromApi].sort((a, b) => a.id - b.id)
  }, [pokemonsFromContext, fetchedPokemons])

  return (
    <div className="home-container">
        <HeaderPokemon showSearch={false} showSort={false} title="Favoritos" showBackButton={true} />
      <div className="favorites-content">
        {isLoading ? (
          <div className="loading-message">Cargando Pokemon...</div>
        ) : favorites.length === 0 ? (
          <div className="empty-favorites">
            <p className="empty-message">No tienes Pokemon favoritos aún</p>
            <p className="empty-hint">Agrega Pokemon a favoritos desde la página principal</p>
          </div>
        ) : (
          <CardsPokemon pokemons={favoritePokemons} />
        )}
      </div>
    </div>
  )
}
