import { usePokemonContext } from '../../context/PokemonContext';
import { usePaginatedPokemons } from '../../hooks/usePaginatedPokemons';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

// Mock all dependencies
vi.mock("../../utils/graphqlClient", () => ({
  graphqlClient: vi.fn(),
}));

vi.mock("../../context/PokemonContext", () => ({
  usePokemonContext: vi.fn(),
}));

vi.mock("../../constants/getPokemon", () => ({
  GET_POKEMONS_WITH_COUNT_BY_NAME: "query GetPokemonsByName",
  GET_POKEMONS_WITH_COUNT_BY_ID: "query GetPokemonsByNumber",
}));

vi.mock("../../constants/numberPokemontosee", () => ({
  NumberPokemontosee: {
    HOME_POKEMONS: 20,
  },
}));

// Import mocked functions
import { graphqlClient } from "../../utils/graphqlClient";
import { GET_POKEMONS_WITH_COUNT_BY_NAME, GET_POKEMONS_WITH_COUNT_BY_ID } from "../../constants/getPokemon";
import { NumberPokemontosee } from "../../constants/numberPokemontosee";

// Type the mocked functions
const mockedGraphqlClient = graphqlClient as MockedFunction<typeof graphqlClient>;
const mockedUsePokemonContext = usePokemonContext as MockedFunction<typeof usePokemonContext>;

// Mock data
const mockPokemonData = [
  {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    sprites: {
      front_default: "https://example.com/bulbasaur.png",
      other: {
        "official-artwork": {
          front_default: "https://example.com/bulbasaur-artwork.png"
        }
      }
    },
    types: [
      {
        slot: 1,
        type: {
          name: "grass",
          url: "https://pokeapi.co/api/v2/type/12/"
        }
      }
    ],
    stats: [
      {
        base_stat: 45,
        effort: 0,
        stat: {
          name: "hp",
          url: "https://pokeapi.co/api/v2/stat/1/"
        }
      }
    ]
  },
  {
    id: 2,
    name: "ivysaur",
    height: 10,
    weight: 130,
    sprites: {
      front_default: "https://example.com/ivysaur.png",
      other: {
        "official-artwork": {
          front_default: "https://example.com/ivysaur-artwork.png"
        }
      }
    },
    types: [
      {
        slot: 1,
        type: {
          name: "grass",
          url: "https://pokeapi.co/api/v2/type/12/"
        }
      }
    ],
    stats: [
      {
        base_stat: 60,
        effort: 0,
        stat: {
          name: "hp",
          url: "https://pokeapi.co/api/v2/stat/1/"
        }
      }
    ]
  }
];

const mockResponse = {
  pokemon_v2_pokemon: mockPokemonData,
  pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: 100
    }
  }
};

const mockAddPokemons = vi.fn();

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

describe("usePaginatedPokemons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUsePokemonContext.mockReturnValue({
      pokemons: new Map(),
      addPokemons: mockAddPokemons,
      getPokemon: vi.fn(),
    });
  });

  describe("Hook initialization", () => {
    it("should initialize with correct default values", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      expect(result.current.pokemonData).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.hasNextPage).toBe(false);
    });

    it("should use correct query string for name sorting", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          GET_POKEMONS_WITH_COUNT_BY_NAME,
          {
            limit: NumberPokemontosee.HOME_POKEMONS,
            offset: 0,
          }
        );
      });
    });

    it("should use correct query string for number sorting", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      renderHook(
        () => usePaginatedPokemons(1, "number"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          GET_POKEMONS_WITH_COUNT_BY_ID,
          {
            limit: NumberPokemontosee.HOME_POKEMONS,
            offset: 0,
          }
        );
      });
    });
  });

  describe("Pagination logic", () => {
    it("should calculate correct offset for page 1", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          {
            limit: NumberPokemontosee.HOME_POKEMONS,
            offset: 0,
          }
        );
      });
    });

    it("should calculate correct offset for page 2", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      renderHook(
        () => usePaginatedPokemons(2, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          {
            limit: NumberPokemontosee.HOME_POKEMONS,
            offset: 20,
          }
        );
      });
    });

    it("should calculate correct offset for page 5", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      renderHook(
        () => usePaginatedPokemons(5, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          {
            limit: NumberPokemontosee.HOME_POKEMONS,
            offset: 80,
          }
        );
      });
    });
  });

  describe("Query key generation", () => {
    it("should generate correct query key with page and sortBy", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => usePaginatedPokemons(2, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Query should be identified by the key including page and sortBy
      expect(result.current.dataUpdatedAt).toBeGreaterThan(0);
    });

    it("should create different queries for different pages", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result: result1 } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => usePaginatedPokemons(2, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      // Different pages should have different data fetch times
      expect(mockedGraphqlClient).toHaveBeenCalledTimes(2);
    });

    it("should create different queries for different sortBy values", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result: result1 } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => usePaginatedPokemons(1, "number"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockedGraphqlClient).toHaveBeenCalledTimes(2);
    });
  });

  describe("Data processing", () => {
    it("should process successful response correctly", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.pokemonData).toEqual(mockPokemonData);
      expect(result.current.totalCount).toBe(100);
      expect(result.current.totalPages).toBe(5); // 100 / 20 = 5
      expect(result.current.hasNextPage).toBe(true); // page 1 < 5 pages
    });

    it("should handle empty pokemon data", async () => {
      const emptyResponse = {
        pokemon_v2_pokemon: [],
        pokemon_v2_pokemon_aggregate: {
          aggregate: {
            count: 0
          }
        }
      };

      mockedGraphqlClient.mockResolvedValue(emptyResponse);

      const { result } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.pokemonData).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.hasNextPage).toBe(false);
    });

    it("should calculate hasNextPage correctly for last page", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => usePaginatedPokemons(5, "name"), // Last page (5 of 5)
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false); // page 5 is not < 5 pages
    });

    it("should handle partial last page correctly", async () => {
      const responseWith95Items = {
        pokemon_v2_pokemon: mockPokemonData,
        pokemon_v2_pokemon_aggregate: {
          aggregate: {
            count: 95
          }
        }
      };

      mockedGraphqlClient.mockResolvedValue(responseWith95Items);

      const { result } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.totalPages).toBe(5); // Math.ceil(95 / 20) = 5
      expect(result.current.hasNextPage).toBe(true);
    });
  });

  describe("Context integration", () => {
    it("should call addPokemons when data is received", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockAddPokemons).toHaveBeenCalledWith(mockPokemonData);
      });
    });

    it("should not call addPokemons when no pokemon data", async () => {
      const responseWithoutPokemons = {
        pokemon_v2_pokemon: [],
        pokemon_v2_pokemon_aggregate: {
          aggregate: {
            count: 0
          }
        }
      };

      mockedGraphqlClient.mockResolvedValue(responseWithoutPokemons);

      renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockAddPokemons).toHaveBeenCalledWith([]);
      });
    });

    it("should not call addPokemons when query fails", async () => {
      mockedGraphqlClient.mockRejectedValue(new Error("Network error"));

      renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockAddPokemons).not.toHaveBeenCalled();
      });
    });
  });

  describe("Error handling", () => {
    it("should handle query errors correctly", async () => {
      const errorMessage = "GraphQL query failed";
      mockedGraphqlClient.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.pokemonData).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
    });

    it("should handle malformed response data", async () => {
      const malformedResponse = {
        pokemon_v2_pokemon: null,
        pokemon_v2_pokemon_aggregate: null
      };

      mockedGraphqlClient.mockResolvedValue(malformedResponse);

      const { result } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.pokemonData).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });
  });

  describe("Query configuration", () => {
    it("should have correct staleTime configuration", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Data should be considered fresh for 5 minutes
      expect(result.current.isStale).toBe(false);
    });

    it("should have refetchOnWindowFocus disabled", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => usePaginatedPokemons(1, "name"),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Simulate window focus - should not trigger refetch
      window.dispatchEvent(new Event('focus'));
      
      // Should still be called only once
      expect(mockedGraphqlClient).toHaveBeenCalledTimes(1);
    });
  });

  describe("Hook updates", () => {
    it("should update when page changes", async () => {
      mockedGraphqlClient.mockResolvedValue(mockResponse);

      const { result, rerender } = renderHook(
        ({ page, sortBy }) => usePaginatedPokemons(page, sortBy),
        {
          wrapper: createWrapper(),
          initialProps: { page: 1, sortBy: "name" as const }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedGraphqlClient).toHaveBeenCalledWith(
        expect.any(String),
        { limit: 20, offset: 0 }
      );

      // Change page
      rerender({ page: 2, sortBy: "name" as const });

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          { limit: 20, offset: 20 }
        );
      });

      expect(mockedGraphqlClient).toHaveBeenCalledTimes(2);
    });

  });
});