import { describe, expect, it } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import { PokemonProvider, usePokemonContext } from "../../context/PokemonContext";
import type { ReactNode } from "react";
import type { IPokemon } from "../../models/pokemon.interface";

// Mock Pokemon data with correct IPokemon interface
const mockPokemon1: IPokemon = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  pokemon_v2_pokemontypes: [
    {
      pokemon_v2_type: {
        name: "grass"
      }
    },
    {
      pokemon_v2_type: {
        name: "poison"
      }
    }
  ],
  pokemon_v2_pokemonsprites: [
    {
      sprites: {
        back_shiny: "https://example.com/bulbasaur-back-shiny.png",
        back_female: null,
        front_shiny: "https://example.com/bulbasaur-front-shiny.png",
        back_default: "https://example.com/bulbasaur-back.png",
        front_female: null,
        front_default: "https://example.com/bulbasaur-front.png",
        back_shiny_female: null,
        front_shiny_female: null,
        other: {
          home: {
            front_shiny: "https://example.com/bulbasaur-home-shiny.png",
            front_female: null,
            front_default: "https://example.com/bulbasaur-home.png",
            front_shiny_female: null
          },
          showdown: {
            back_shiny: "https://example.com/bulbasaur-showdown-back-shiny.png",
            back_female: null,
            front_shiny: "https://example.com/bulbasaur-showdown-front-shiny.png",
            back_default: "https://example.com/bulbasaur-showdown-back.png",
            front_female: null,
            front_default: "https://example.com/bulbasaur-showdown-front.png",
            back_shiny_female: null,
            front_shiny_female: null
          },
          dream_world: {
            front_female: null,
            front_default: "https://example.com/bulbasaur-dream.png"
          },
          "official-artwork": {
            front_shiny: "https://example.com/bulbasaur-artwork-shiny.png",
            front_default: "https://example.com/bulbasaur-artwork.png"
          }
        }
      }
    }
  ],
  pokemon_v2_pokemonmoves: [
    {
      pokemon_v2_move: {
        name: "tackle"
      }
    },
    {
      pokemon_v2_move: {
        name: "vine-whip"
      }
    }
  ],
  pokemon_v2_pokemonspecy: {
    pokemon_v2_pokemonspeciesflavortexts: [
      {
        flavor_text: "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON."
      }
    ]
  },
  pokemon_v2_pokemonstats: [
    {
      base_stat: 45,
      pokemon_v2_stat: {
        name: "hp"
      }
    },
    {
      base_stat: 49,
      pokemon_v2_stat: {
        name: "attack"
      }
    },
    {
      base_stat: 49,
      pokemon_v2_stat: {
        name: "defense"
      }
    }
  ]
};

const mockPokemon2: IPokemon = {
  id: 2,
  name: "ivysaur",
  height: 10,
  weight: 130,
  pokemon_v2_pokemontypes: [
    {
      pokemon_v2_type: {
        name: "grass"
      }
    },
    {
      pokemon_v2_type: {
        name: "poison"
      }
    }
  ],
  pokemon_v2_pokemonsprites: [
    {
      sprites: {
        back_shiny: "https://example.com/ivysaur-back-shiny.png",
        back_female: null,
        front_shiny: "https://example.com/ivysaur-front-shiny.png",
        back_default: "https://example.com/ivysaur-back.png",
        front_female: null,
        front_default: "https://example.com/ivysaur-front.png",
        back_shiny_female: null,
        front_shiny_female: null,
        other: {
          home: {
            front_shiny: "https://example.com/ivysaur-home-shiny.png",
            front_female: null,
            front_default: "https://example.com/ivysaur-home.png",
            front_shiny_female: null
          },
          showdown: {
            back_shiny: "https://example.com/ivysaur-showdown-back-shiny.png",
            back_female: null,
            front_shiny: "https://example.com/ivysaur-showdown-front-shiny.png",
            back_default: "https://example.com/ivysaur-showdown-back.png",
            front_female: null,
            front_default: "https://example.com/ivysaur-showdown-front.png",
            back_shiny_female: null,
            front_shiny_female: null
          },
          dream_world: {
            front_female: null,
            front_default: "https://example.com/ivysaur-dream.png"
          },
          "official-artwork": {
            front_shiny: "https://example.com/ivysaur-artwork-shiny.png",
            front_default: "https://example.com/ivysaur-artwork.png"
          }
        }
      }
    }
  ],
  pokemon_v2_pokemonmoves: [
    {
      pokemon_v2_move: {
        name: "tackle"
      }
    },
    {
      pokemon_v2_move: {
        name: "vine-whip"
      }
    },
    {
      pokemon_v2_move: {
        name: "razor-leaf"
      }
    }
  ],
  pokemon_v2_pokemonspecy: {
    pokemon_v2_pokemonspeciesflavortexts: [
      {
        flavor_text: "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs."
      }
    ]
  },
  pokemon_v2_pokemonstats: [
    {
      base_stat: 60,
      pokemon_v2_stat: {
        name: "hp"
      }
    },
    {
      base_stat: 62,
      pokemon_v2_stat: {
        name: "attack"
      }
    },
    {
      base_stat: 63,
      pokemon_v2_stat: {
        name: "defense"
      }
    }
  ]
};

const mockPokemon3: IPokemon = {
  id: 3,
  name: "venusaur",
  height: 20,
  weight: 1000,
  pokemon_v2_pokemontypes: [
    {
      pokemon_v2_type: {
        name: "grass"
      }
    },
    {
      pokemon_v2_type: {
        name: "poison"
      }
    }
  ],
  pokemon_v2_pokemonsprites: [
    {
      sprites: {
        back_shiny: "https://example.com/venusaur-back-shiny.png",
        back_female: null,
        front_shiny: "https://example.com/venusaur-front-shiny.png",
        back_default: "https://example.com/venusaur-back.png",
        front_female: null,
        front_default: "https://example.com/venusaur-front.png",
        back_shiny_female: null,
        front_shiny_female: null,
        other: {
          home: {
            front_shiny: "https://example.com/venusaur-home-shiny.png",
            front_female: null,
            front_default: "https://example.com/venusaur-home.png",
            front_shiny_female: null
          },
          showdown: {
            back_shiny: "https://example.com/venusaur-showdown-back-shiny.png",
            back_female: null,
            front_shiny: "https://example.com/venusaur-showdown-front-shiny.png",
            back_default: "https://example.com/venusaur-showdown-back.png",
            front_female: null,
            front_default: "https://example.com/venusaur-showdown-front.png",
            back_shiny_female: null,
            front_shiny_female: null
          },
          dream_world: {
            front_female: null,
            front_default: "https://example.com/venusaur-dream.png"
          },
          "official-artwork": {
            front_shiny: "https://example.com/venusaur-artwork-shiny.png",
            front_default: "https://example.com/venusaur-artwork.png"
          }
        }
      }
    }
  ],
  pokemon_v2_pokemonmoves: [
    {
      pokemon_v2_move: {
        name: "tackle"
      }
    },
    {
      pokemon_v2_move: {
        name: "vine-whip"
      }
    },
    {
      pokemon_v2_move: {
        name: "razor-leaf"
      }
    },
    {
      pokemon_v2_move: {
        name: "solar-beam"
      }
    }
  ],
  pokemon_v2_pokemonspecy: {
    pokemon_v2_pokemonspeciesflavortexts: [
      {
        flavor_text: "The flower on its back catches the sun's rays. The larger the flower, the more fragrant it becomes."
      }
    ]
  },
  pokemon_v2_pokemonstats: [
    {
      base_stat: 80,
      pokemon_v2_stat: {
        name: "hp"
      }
    },
    {
      base_stat: 82,
      pokemon_v2_stat: {
        name: "attack"
      }
    },
    {
      base_stat: 83,
      pokemon_v2_stat: {
        name: "defense"
      }
    }
  ]
};

describe("PokemonContext", () => {
  describe("PokemonProvider", () => {
    it("should render children correctly", () => {
      const TestComponent = () => <div>Test Child</div>;
      
      const { getByText } = render(
        <PokemonProvider>
          <TestComponent />
        </PokemonProvider>
      );

      expect(getByText("Test Child")).toBeDefined();
    });

    it("should initialize with empty Map", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      expect(result.current.pokemons).toBeInstanceOf(Map);
      expect(result.current.pokemons.size).toBe(0);
    });

    it("should provide context value with all required functions", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      expect(result.current.pokemons).toBeInstanceOf(Map);
      expect(typeof result.current.addPokemons).toBe("function");
      expect(typeof result.current.getPokemon).toBe("function");
    });
  });

  describe("usePokemonContext hook", () => {
    it("should throw error when used outside of PokemonProvider", () => {
      expect(() => {
        renderHook(() => usePokemonContext());
      }).toThrow("usePokemonContext must be used within PokemonProvider");
    });

    it("should return context when used within PokemonProvider", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      expect(result.current).toBeDefined();
      expect(result.current.pokemons).toBeInstanceOf(Map);
    });
  });

  describe("addPokemons functionality", () => {
    it("should add single pokemon correctly", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      act(() => {
        result.current.addPokemons([mockPokemon1]);
      });

      expect(result.current.pokemons.size).toBe(1);
      expect(result.current.pokemons.get(1)).toEqual(mockPokemon1);
    });

    it("should add multiple pokemons correctly", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      act(() => {
        result.current.addPokemons([mockPokemon1, mockPokemon2, mockPokemon3]);
      });

      expect(result.current.pokemons.size).toBe(3);
      expect(result.current.pokemons.get(1)).toEqual(mockPokemon1);
      expect(result.current.pokemons.get(2)).toEqual(mockPokemon2);
      expect(result.current.pokemons.get(3)).toEqual(mockPokemon3);
    });

    it("should handle empty array", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      act(() => {
        result.current.addPokemons([]);
      });

      expect(result.current.pokemons.size).toBe(0);
    });

    it("should update existing pokemon when adding duplicate", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      act(() => {
        result.current.addPokemons([mockPokemon1]);
      });

      const updatedPokemon1 = { ...mockPokemon1, name: "updated-bulbasaur" };

      act(() => {
        result.current.addPokemons([updatedPokemon1]);
      });

      expect(result.current.pokemons.size).toBe(1);
      expect(result.current.pokemons.get(1)?.name).toBe("updated-bulbasaur");
    });

    it("should preserve existing pokemons when adding new ones", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      act(() => {
        result.current.addPokemons([mockPokemon1]);
      });

      act(() => {
        result.current.addPokemons([mockPokemon2]);
      });

      expect(result.current.pokemons.size).toBe(2);
      expect(result.current.pokemons.get(1)).toEqual(mockPokemon1);
      expect(result.current.pokemons.get(2)).toEqual(mockPokemon2);
    });
  });

  describe("getPokemon functionality", () => {
    it("should return pokemon when it exists", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      act(() => {
        result.current.addPokemons([mockPokemon1, mockPokemon2]);
      });

      const pokemon1 = result.current.getPokemon(1);
      const pokemon2 = result.current.getPokemon(2);

      expect(pokemon1).toEqual(mockPokemon1);
      expect(pokemon2).toEqual(mockPokemon2);
    });

    it("should return undefined when pokemon does not exist", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      const nonExistentPokemon = result.current.getPokemon(999);

      expect(nonExistentPokemon).toBeUndefined();
    });

    it("should return undefined for pokemon that was never added", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      act(() => {
        result.current.addPokemons([mockPokemon1]);
      });

      const existingPokemon = result.current.getPokemon(1);
      const nonExistentPokemon = result.current.getPokemon(2);

      expect(existingPokemon).toEqual(mockPokemon1);
      expect(nonExistentPokemon).toBeUndefined();
    });
  });

  describe("callback stability", () => {
    it("should maintain stable references for addPokemons", () => {
      const { result, rerender } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      const initialAddPokemons = result.current.addPokemons;

      rerender();

      expect(result.current.addPokemons).toBe(initialAddPokemons);
    });

    it("should update getPokemon reference when pokemons change", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      const initialGetPokemon = result.current.getPokemon;

      act(() => {
        result.current.addPokemons([mockPokemon1]);
      });

      // getPokemon should have a new reference due to pokemons dependency
      expect(result.current.getPokemon).not.toBe(initialGetPokemon);
    });
  });

  describe("integration tests", () => {
    it("should handle multiple operations correctly", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      // Add initial pokemons
      act(() => {
        result.current.addPokemons([mockPokemon1, mockPokemon2]);
      });

      expect(result.current.pokemons.size).toBe(2);
      expect(result.current.getPokemon(1)).toEqual(mockPokemon1);
      expect(result.current.getPokemon(2)).toEqual(mockPokemon2);

      // Add more pokemons
      act(() => {
        result.current.addPokemons([mockPokemon3]);
      });

      expect(result.current.pokemons.size).toBe(3);
      expect(result.current.getPokemon(3)).toEqual(mockPokemon3);

      // Verify all pokemons are still accessible
      expect(result.current.getPokemon(1)).toEqual(mockPokemon1);
      expect(result.current.getPokemon(2)).toEqual(mockPokemon2);
      expect(result.current.getPokemon(3)).toEqual(mockPokemon3);
    });

    it("should maintain Map structure throughout operations", () => {
      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      expect(result.current.pokemons).toBeInstanceOf(Map);

      act(() => {
        result.current.addPokemons([mockPokemon1]);
      });

      expect(result.current.pokemons).toBeInstanceOf(Map);

      act(() => {
        result.current.addPokemons([mockPokemon2, mockPokemon3]);
      });

      expect(result.current.pokemons).toBeInstanceOf(Map);
      expect(result.current.pokemons.size).toBe(3);
    });

    it("should handle pokemons with optional properties", () => {
      const pokemonWithoutOptionalProps: IPokemon = {
        id: 4,
        name: "charmander",
        height: 6,
        weight: 85,
        pokemon_v2_pokemontypes: [
          {
            pokemon_v2_type: {
              name: "fire"
            }
          }
        ],
        pokemon_v2_pokemonsprites: [
          {
            sprites: {
              back_shiny: "https://example.com/charmander-back-shiny.png",
              back_female: null,
              front_shiny: "https://example.com/charmander-front-shiny.png",
              back_default: "https://example.com/charmander-back.png",
              front_female: null,
              front_default: "https://example.com/charmander-front.png",
              back_shiny_female: null,
              front_shiny_female: null
            }
          }
        ],
        pokemon_v2_pokemonmoves: [
          {
            pokemon_v2_move: {
              name: "scratch"
            }
          }
        ]
        // Optional properties omitted
      };

      const { result } = renderHook(() => usePokemonContext(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <PokemonProvider>{children}</PokemonProvider>
        ),
      });

      act(() => {
        result.current.addPokemons([pokemonWithoutOptionalProps]);
      });

      expect(result.current.pokemons.size).toBe(1);
      expect(result.current.getPokemon(4)).toEqual(pokemonWithoutOptionalProps);
      expect(result.current.getPokemon(4)?.pokemon_v2_pokemonspecy).toBeUndefined();
      expect(result.current.getPokemon(4)?.pokemon_v2_pokemonstats).toBeUndefined();
    });
  });
});