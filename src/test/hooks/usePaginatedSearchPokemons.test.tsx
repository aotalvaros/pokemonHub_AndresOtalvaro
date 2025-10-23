import { usePaginatedSearchPokemons } from '../../hooks/usePaginatedSearchPokemons';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";


vi.mock("../../utils/graphqlClient", () => ({
  graphqlClient: vi.fn(),
}));

vi.mock("../../constants/getPokemon", () => ({
  SEARCH_POKEMONS_PAGINATED: "query SearchPokemonsByName",
  SEARCH_POKEMONS_BY_ID_PAGINATED: "query SearchPokemonsByNumber",
  SEARCH_POKEMONS_BY_TYPE_PAGINATED: "query SearchPokemonsByType",
}));

vi.mock("../../constants/numberPokemontosee", () => ({
  NumberPokemontosee: {
    HOME_POKEMONS: 20,
  },
}));


import { graphqlClient } from "../../utils/graphqlClient";
import {
  SEARCH_POKEMONS_PAGINATED,
  SEARCH_POKEMONS_BY_ID_PAGINATED,
  SEARCH_POKEMONS_BY_TYPE_PAGINATED,
} from "../../constants/getPokemon";
import { NumberPokemontosee } from "../../constants/numberPokemontosee";


const mockedGraphqlClient = graphqlClient as MockedFunction<typeof graphqlClient>;

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
    id: 4,
    name: "charmander",
    height: 6,
    weight: 85,
    sprites: {
      front_default: "https://example.com/charmander.png",
      other: {
        "official-artwork": {
          front_default: "https://example.com/charmander-artwork.png"
        }
      }
    },
    types: [
      {
        slot: 1,
        type: {
          name: "fire",
          url: "https://pokeapi.co/api/v2/type/10/"
        }
      }
    ],
    stats: [
      {
        base_stat: 39,
        effort: 0,
        stat: {
          name: "hp",
          url: "https://pokeapi.co/api/v2/stat/1/"
        }
      }
    ]
  }
];

const mockSearchResponse = {
  pokemon_v2_pokemon: mockPokemonData,
  pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: 50
    }
  }
};

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

describe("usePaginatedSearchPokemons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Hook initialization", () => {
    it("should initialize with correct default values when enabled is false", () => {
      const { result } = renderHook(
        () => usePaginatedSearchPokemons("bulbasaur", "name", 1, false),
        { wrapper: createWrapper() }
      );

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.hasNextPage).toBe(false);
    });

    it("should start loading when enabled is true", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result } = renderHook(
        () => usePaginatedSearchPokemons("bulbasaur", "name", 1, true),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.searchResults).toEqual([]);
    });
  });

  describe("Search by name", () => {
    it("should use correct query and variables for name search", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("bulbasaur", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          SEARCH_POKEMONS_PAGINATED,
          {
            name: "%bulbasaur%",
            limit: NumberPokemontosee.HOME_POKEMONS,
            offset: 0
          }
        );
      });
    });

    it("should wrap search term with wildcards for name search", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("char", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            name: "%char%"
          })
        );
      });
    });

    it("should handle special characters in name search", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("mr. mime", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            name: "%mr. mime%"
          })
        );
      });
    });
  });

  describe("Search by number", () => {
    it("should use correct query and variables for number search", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("1", "number", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          SEARCH_POKEMONS_BY_ID_PAGINATED,
          {
            id: 1,
            limit: NumberPokemontosee.HOME_POKEMONS,
            offset: 0
          }
        );
      });
    });

    it("should parse number with hash prefix", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("#025", "number", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            id: 25
          })
        );
      });
    });

    it("should handle number without hash prefix", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("150", "number", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            id: 150
          })
        );
      });
    });

    it("should handle invalid number input", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("abc", "number", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            id: NaN
          })
        );
      });
    });
  });

  describe("Search by type", () => {
    it("should use correct query and variables for type search", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("fire", "type", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          SEARCH_POKEMONS_BY_TYPE_PAGINATED,
          {
            typeName: "fire",
            limit: NumberPokemontosee.HOME_POKEMONS,
            offset: 0
          }
        );
      });
    });

    it("should convert type name to lowercase", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("WATER", "type", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            typeName: "water"
          })
        );
      });
    });

    it("should handle mixed case type names", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("ElEcTrIc", "type", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            typeName: "electric"
          })
        );
      });
    });
  });

  describe("Pagination logic", () => {
    it("should calculate correct offset for page 1", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            offset: 0
          })
        );
      });
    });

    it("should calculate correct offset for page 2", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("test", "name", 2, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            offset: 20
          })
        );
      });
    });

    it("should calculate correct offset for page 5", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("test", "name", 5, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            offset: 80
          })
        );
      });
    });
  });

  describe("Query key generation", () => {
    it("should generate unique query keys for different search terms", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result: result1 } = renderHook(
        () => usePaginatedSearchPokemons("bulbasaur", "name", 1, true),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => usePaginatedSearchPokemons("charmander", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockedGraphqlClient).toHaveBeenCalledTimes(2);
    });

    it("should generate unique query keys for different search types", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result: result1 } = renderHook(
        () => usePaginatedSearchPokemons("fire", "name", 1, true),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => usePaginatedSearchPokemons("fire", "type", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockedGraphqlClient).toHaveBeenCalledTimes(2);
    });

    it("should generate unique query keys for different pages", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result: result1 } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 2, true),
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
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.searchResults).toEqual(mockPokemonData);
      expect(result.current.totalCount).toBe(50);
      expect(result.current.totalPages).toBe(3); 
      expect(result.current.hasNextPage).toBe(true); 
    });

    it("should handle empty search results", async () => {
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
        () => usePaginatedSearchPokemons("nonexistent", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.hasNextPage).toBe(false);
    });

    it("should calculate hasNextPage correctly for last page", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 3, true), 
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false); 
    });

    it("should handle partial last page correctly", async () => {
      const responseWith35Items = {
        pokemon_v2_pokemon: mockPokemonData,
        pokemon_v2_pokemon_aggregate: {
          aggregate: {
            count: 35
          }
        }
      };

      mockedGraphqlClient.mockResolvedValue(responseWith35Items);

      const { result } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.totalPages).toBe(2);
      expect(result.current.hasNextPage).toBe(true);
    });
  });

  describe("Enabled/disabled states", () => {
    it("should make query when enabled is true", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("bulbasaur", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalled();
      });
    });

    it("should update when enabled changes from false to true", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result, rerender } = renderHook(
        ({ enabled }) => usePaginatedSearchPokemons("bulbasaur", "name", 1, enabled),
        {
          wrapper: createWrapper(),
          initialProps: { enabled: false }
        }
      );

      expect(mockedGraphqlClient).not.toHaveBeenCalled();

      rerender({ enabled: true });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedGraphqlClient).toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should handle query errors correctly", async () => {
      const errorMessage = "Search query failed";
      mockedGraphqlClient.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.searchResults).toEqual([]);
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
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });

    it("should handle missing aggregate data", async () => {
      const responseWithoutAggregate = {
        pokemon_v2_pokemon: mockPokemonData,
        pokemon_v2_pokemon_aggregate: {
          aggregate: null
        }
      };

      mockedGraphqlClient.mockResolvedValue(responseWithoutAggregate);

      const { result } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.searchResults).toEqual(mockPokemonData);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });
  });

  describe("Query configuration", () => {
    it("should have correct staleTime configuration", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isStale).toBe(false);
    });

    it("should have refetchOnWindowFocus disabled", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result } = renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      window.dispatchEvent(new Event('focus'));
      
      expect(mockedGraphqlClient).toHaveBeenCalledTimes(1);
    });
  });

  describe("Hook updates", () => {
    it("should update when search term changes", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result, rerender } = renderHook(
        ({ searchTerm }) => usePaginatedSearchPokemons(searchTerm, "name", 1, true),
        {
          wrapper: createWrapper(),
          initialProps: { searchTerm: "bulbasaur" }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedGraphqlClient).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ name: "%bulbasaur%" })
      );

      rerender({ searchTerm: "charmander" });

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ name: "%charmander%" })
        );
      });

      expect(mockedGraphqlClient).toHaveBeenCalledTimes(2);
    });


    it("should update when page changes", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      const { result, rerender } = renderHook(
        ({ page }) => usePaginatedSearchPokemons("test", "name", page, true),
        {
          wrapper: createWrapper(),
          initialProps: { page: 1 }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedGraphqlClient).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ offset: 0 })
      );

      rerender({ page: 2 });

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ offset: 20 })
        );
      });

      expect(mockedGraphqlClient).toHaveBeenCalledTimes(2);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty search term", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("", "name", 1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ name: "%%" })
        );
      });
    });

    it("should handle zero page number", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("test", "name", 0, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ offset: -20 }) 
        );
      });
    });

    it("should handle negative page number", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("test", "name", -1, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ offset: -40 })
        );
      });
    });

    it("should handle very large page numbers", async () => {
      mockedGraphqlClient.mockResolvedValue(mockSearchResponse);

      renderHook(
        () => usePaginatedSearchPokemons("test", "name", 1000, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedGraphqlClient).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ offset: 19980 })
        );
      });
    });
  });

});
