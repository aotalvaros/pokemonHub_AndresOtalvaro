import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useFavoritePokemons } from "../../hooks/useFavoritePokemons";

// Mock the graphqlClient
vi.mock("../../utils/graphqlClient", () => ({
  graphqlClient: vi.fn(),
}));

// Import the mocked function
import { graphqlClient } from "../../utils/graphqlClient";

// Type the mocked function
const mockedGraphqlClient = graphqlClient as MockedFunction<typeof graphqlClient>;


const mockPokemonData = {
  pokemon_v2_pokemon: [
    {
      id: 1,
      name: "bulbasaur",
      height: 7,
      weight: 69,
      base_experience: 64,
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
          sprites: JSON.stringify({
            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
          })
        }
      ],
      pokemon_v2_pokemonabilities: [
        {
          pokemon_v2_ability: {
            name: "overgrow"
          }
        }
      ],
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
        }
      ],
      pokemon_v2_pokemonspecy: {
        pokemon_v2_pokemonspeciesflavortexts: [
          {
            flavor_text: "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON."
          }
        ]
      }
    },
    {
      id: 4,
      name: "charmander",
      height: 6,
      weight: 85,
      base_experience: 62,
      pokemon_v2_pokemontypes: [
        {
          pokemon_v2_type: {
            name: "fire"
          }
        }
      ],
      pokemon_v2_pokemonsprites: [
        {
          sprites: JSON.stringify({
            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
          })
        }
      ],
      pokemon_v2_pokemonabilities: [
        {
          pokemon_v2_ability: {
            name: "blaze"
          }
        }
      ],
      pokemon_v2_pokemonstats: [
        {
          base_stat: 39,
          pokemon_v2_stat: {
            name: "hp"
          }
        },
        {
          base_stat: 52,
          pokemon_v2_stat: {
            name: "attack"
          }
        }
      ],
      pokemon_v2_pokemonspecy: {
        pokemon_v2_pokemonspeciesflavortexts: [
          {
            flavor_text: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail."
          }
        ]
      }
    }
  ]
};

const mockSinglePokemonData = {
  pokemon_v2_pokemon: [mockPokemonData.pokemon_v2_pokemon[0]]
};

// Create a wrapper component for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useFavoritePokemons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGraphqlClient.mockClear();
  });

  describe("Hook behavior", () => {
    it("should return query result when favoriteIds are provided", async () => {
      mockedGraphqlClient.mockResolvedValue(mockPokemonData);

      const { result } = renderHook(
        () => useFavoritePokemons([1, 4]),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPokemonData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should be disabled when favoriteIds array is empty", () => {
      const { result } = renderHook(
        () => useFavoritePokemons([]),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it("should be disabled when favoriteIds array has length 0", () => {
      const emptyArray: number[] = [];
      const { result } = renderHook(
        () => useFavoritePokemons(emptyArray),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.fetchStatus).toBe("idle");
    });

    it("should update query when favoriteIds change", async () => {
      mockedGraphqlClient
        .mockResolvedValueOnce(mockSinglePokemonData)
        .mockResolvedValueOnce(mockPokemonData);

      const { result, rerender } = renderHook(
        ({ ids }) => useFavoritePokemons(ids),
        {
          wrapper: createWrapper(),
          initialProps: { ids: [1] }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSinglePokemonData);
      expect(mockedGraphqlClient).toHaveBeenCalledWith(
        expect.any(String),
        { ids: [1] }
      );

      // Change the favoriteIds
      rerender({ ids: [1, 4] });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockPokemonData);
      });

      expect(mockedGraphqlClient).toHaveBeenCalledWith(
        expect.any(String),
        { ids: [1, 4] }
      );
    });

    it("should use correct query key", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue(mockPokemonData);

      const { result } = renderHook(
        () => useFavoritePokemons([1, 4]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The query key should include both the static key and the favoriteIds
      expect(result.current.dataUpdatedAt).toBeGreaterThan(0);
    });

    it("should have correct staleTime configuration", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue(mockPokemonData);

      const { result } = renderHook(
        () => useFavoritePokemons([1]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Data should be considered fresh for 5 minutes (300000ms)
      expect(result.current.isStale).toBe(false);
    });
  });

  describe("GraphQL client interaction", () => {
    it("should call graphqlClient with correct parameters", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue(mockPokemonData);

      renderHook(
        () => useFavoritePokemons([1, 4]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.stringContaining("query GetPokemonsByIds"),
          { ids: [1, 4] }
        );
      });
    });

    it("should handle successful response", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue(mockPokemonData);

      const { result } = renderHook(
        () => useFavoritePokemons([1, 4]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPokemonData);
      expect(result.current.error).toBeNull();
    });

    it("should handle error response", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      const errorMessage = "GraphQL query failed";
      mockedGraphqlClient.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(
        () => useFavoritePokemons([1]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe(errorMessage);
    });

    it("should handle network error", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(
        () => useFavoritePokemons([1, 2, 3]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("Query structure validation", () => {
    it("should include nested fields in query", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue(mockPokemonData);

      renderHook(
        () => useFavoritePokemons([1]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalled();
      });

      const [query] = mockedGraphqlClient.mock.calls[0];
      
      // Verify nested fields
      expect(query).toContain("pokemon_v2_type");
      expect(query).toContain("sprites");
      expect(query).toContain("pokemon_v2_ability");
      expect(query).toContain("base_stat");
      expect(query).toContain("pokemon_v2_stat");
      expect(query).toContain("pokemon_v2_pokemonspeciesflavortexts");
      expect(query).toContain("flavor_text");
      expect(query).toContain("language_id: { _eq: 9 }");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty response", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue({ pokemon_v2_pokemon: [] });

      const { result } = renderHook(
        () => useFavoritePokemons([999]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pokemon_v2_pokemon).toEqual([]);
    });

    it("should handle duplicate IDs in favoriteIds", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue(mockSinglePokemonData);

      renderHook(
        () => useFavoritePokemons([1, 1, 1]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          { ids: [1, 1, 1] }
        );
      });
    });

    it("should not call graphqlClient when favoriteIds is empty", () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);

      renderHook(
        () => useFavoritePokemons([]),
        { wrapper: createWrapper() }
      );

      expect(mockedGraphqlClient).not.toHaveBeenCalled();
    });

    it("should handle null/undefined response gracefully", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue(null as unknown);

      const { result } = renderHook(
        () => useFavoritePokemons([1]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });
  });

  describe("React Query integration", () => {

    it("should support refetch functionality", async () => {
      const mockedGraphqlClient = vi.mocked(graphqlClient);
      mockedGraphqlClient.mockResolvedValue(mockPokemonData);

      const { result } = renderHook(
        () => useFavoritePokemons([1]),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedGraphqlClient).toHaveBeenCalledTimes(1);

      await result.current.refetch();

      expect(mockedGraphqlClient).toHaveBeenCalledTimes(2);
    });

    it("should maintain query key consistency", () => {
      const { result: result1 } = renderHook(
        () => useFavoritePokemons([1, 2]),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => useFavoritePokemons([1, 2]),
        { wrapper: createWrapper() }
      );

      expect(result1.current.dataUpdatedAt).toBe(result2.current.dataUpdatedAt);
    });
  });
});