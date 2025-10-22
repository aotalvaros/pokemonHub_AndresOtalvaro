import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: number[]
  addFavorite: (pokemonId: number) => void
  removeFavorite: (pokemonId: number) => void
  isFavorite: (pokemonId: number) => boolean
  toggleFavorite: (pokemonId: number) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = "pokemon_favorites"

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites)
        setFavorites(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error)
        setFavorites([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (pokemonId: number) => {
    setFavorites((prev) => {
      if (prev.includes(pokemonId)) return prev
      return [...prev, pokemonId]
    })
  }

  const removeFavorite = (pokemonId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== pokemonId))
  }

  const isFavorite = (pokemonId: number): boolean => {
    return favorites.includes(pokemonId)
  }

  const toggleFavorite = (pokemonId: number) => {
    if (isFavorite(pokemonId)) {
      removeFavorite(pokemonId)
    } else {
      addFavorite(pokemonId)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
