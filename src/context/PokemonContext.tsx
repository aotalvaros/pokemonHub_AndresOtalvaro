import type React from "react"
import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { IPokemon } from "../models/pokemon.interface"

interface PokemonContextType {
  pokemons: Map<number, IPokemon>
  addPokemons: (newPokemons: IPokemon[]) => void
  getPokemon: (id: number) => IPokemon | undefined
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined)

export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Usamos Map para acceso O(1) por ID
  const [pokemons, setPokemons] = useState<Map<number, IPokemon>>(new Map())

  const addPokemons = useCallback((newPokemons: IPokemon[]) => {
    setPokemons((prev) => {
      const updated = new Map(prev)
      newPokemons.forEach((pokemon) => {
        updated.set(pokemon.id, pokemon)
      })
      return updated
    })
  }, [])

  const getPokemon = useCallback(
    (id: number): IPokemon | undefined => {
      return pokemons.get(id)
    },
    [pokemons],
  )

  return <PokemonContext.Provider value={{ pokemons, addPokemons, getPokemon }}>{children}</PokemonContext.Provider>
}

export const usePokemonContext = () => {
  const context = useContext(PokemonContext)
  if (!context) {
    throw new Error("usePokemonContext must be used within PokemonProvider")
  }
  return context
}
