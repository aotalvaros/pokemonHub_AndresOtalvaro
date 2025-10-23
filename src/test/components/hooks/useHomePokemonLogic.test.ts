import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from "@testing-library/react";
import { usePaginatedPokemons } from '../../../hooks/usePaginatedPokemons';
import { IPokemon } from "@models/pokemon.interface";
import { usePaginatedSearchPokemons } from '../../../hooks/usePaginatedSearchPokemons';
import { useHomePokemonLogic } from '../../../components/hooks/useHomePokemonLogic';

vi.mock("../../../hooks/usePaginatedPokemons")
vi.mock("../../../hooks/usePaginatedSearchPokemons")

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@assets/index', () => ({
  default: {
    tagIcon: '/mock-tag-icon.svg',
    sortIcon: '/mock-sort-icon.svg',
    textFormatIcon: '/mock-text-format-icon.svg',
  }
}));

describe('useHomePokemonLogic', () => {
  
    const mockData: IPokemon[] = [
        { id: 1, name: 'Bulbasaur'} as IPokemon,
        { id: 2, name: 'Ivysaur'} as IPokemon,
    ]

    const mockSearchData: IPokemon[] = [
        { id: 25, name: 'Pikachu'} as IPokemon,
    ]

  beforeEach(() => {
    vi.mocked(usePaginatedPokemons).mockReturnValue({
        isLoading: false,
        pokemonData: mockData,
        totalPages: 5,
    } as unknown as ReturnType<typeof usePaginatedPokemons>);

    vi.mocked(usePaginatedSearchPokemons).mockReturnValue({
        isLoading: false,
        searchResults: mockSearchData,
        totalPages: 2,
    } as unknown as ReturnType<typeof usePaginatedSearchPokemons>);

  });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        expect(result.current.sortBy).toBe('name');
        expect(result.current.searchTerm).toBe('');
        expect(result.current.searchInputValue).toBe('');
        expect(result.current.currentPage).toBe(1);
        expect(result.current.displayPokemons).toEqual(mockData);
        expect(result.current.totalPages).toBe(5);
        expect(result.current.isLoading).toBe(false);
    });

    it('should call hooks with correct initial parameters', () => {
        renderHook(() => useHomePokemonLogic());

        expect(vi.mocked(usePaginatedPokemons)).toHaveBeenCalledWith(1, 'name');
        expect(vi.mocked(usePaginatedSearchPokemons)).toHaveBeenCalledWith('', 'name', 1, false);
    });

    it('should handle sort change correctly', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        act(() => {
            result.current.handleSortChange('number');
        });

        expect(result.current.sortBy).toBe('number');
        expect(result.current.searchTerm).toBe('');
        expect(result.current.searchInputValue).toBe('');
        expect(result.current.currentPage).toBe(1);
    });

    it('should handle search change correctly', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        act(() => {
            result.current.handleSearchChange('pikachu');
        });

        expect(result.current.searchTerm).toBe('pikachu');
        expect(result.current.currentPage).toBe(1);
        expect(result.current.displayPokemons).toEqual(mockSearchData);
        expect(result.current.totalPages).toBe(2);
    });

    it('should handle input change correctly', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        act(() => {
            result.current.handleInputChange('typing...');
        });

        expect(result.current.searchInputValue).toBe('typing...');
        expect(result.current.searchTerm).toBe('');
    });

    it('should handle clear search correctly', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        // Set some search state first
        act(() => {
            result.current.handleSearchChange('test');
            result.current.handleInputChange('test input');
            result.current.handlePageChange(3);
        });

        // Clear search
        act(() => {
            result.current.handleClearSearch();
        });

        expect(result.current.searchTerm).toBe('');
        expect(result.current.searchInputValue).toBe('');
        expect(result.current.currentPage).toBe(1);
    });

    it('should handle page change correctly', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        act(() => {
            result.current.handlePageChange(3);
        });

        expect(result.current.currentPage).toBe(3);
        expect(vi.mocked(usePaginatedPokemons)).toHaveBeenCalledWith(3, 'name');
    });

    it('should switch between normal and search data when search is active', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        // Initially showing normal data
        expect(result.current.displayPokemons).toEqual(mockData);
        expect(result.current.totalPages).toBe(5);

        // Search with 1+ characters should show search data
        act(() => {
            result.current.handleSearchChange('p');
        });

        expect(result.current.displayPokemons).toEqual(mockSearchData);
        expect(result.current.totalPages).toBe(2);
        expect(vi.mocked(usePaginatedSearchPokemons)).toHaveBeenCalledWith('p', 'name', 1, true);
    });

    it('should handle different sort types correctly', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        // Test type sort
        act(() => {
            result.current.handleSortChange('type');
        });

        expect(vi.mocked(usePaginatedPokemons)).toHaveBeenCalledWith(1, 'number');
        expect(vi.mocked(usePaginatedSearchPokemons)).toHaveBeenCalledWith('', 'type', 1, false);

        // Test number sort
        act(() => {
            result.current.handleSortChange('number');
        });

        expect(vi.mocked(usePaginatedPokemons)).toHaveBeenCalledWith(1, 'number');
        expect(vi.mocked(usePaginatedSearchPokemons)).toHaveBeenCalledWith('', 'number', 1, false);
    });

    it('should use correct loading state based on search activity', () => {
        // Mock loading states
        vi.mocked(usePaginatedPokemons).mockReturnValue({
            isLoading: true,
            pokemonData: mockData,
            totalPages: 5,
        } as unknown as ReturnType<typeof usePaginatedPokemons>);

        vi.mocked(usePaginatedSearchPokemons).mockReturnValue({
            isLoading: true,
            searchResults: mockSearchData,
            totalPages: 2,
        } as unknown as ReturnType<typeof usePaginatedSearchPokemons>);

        const { result } = renderHook(() => useHomePokemonLogic());

        // Should use isLoadingAll when not searching
        expect(result.current.isLoading).toBe(true);

        // Should use isSearching when searching
        act(() => {
            result.current.handleSearchChange('test');
        });

        expect(result.current.isLoading).toBe(true);
    });

    it('should reset search when changing sort', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        // Set search state
        act(() => {
            result.current.handleSearchChange('pikachu');
            result.current.handleInputChange('input value');
        });

        expect(result.current.searchTerm).toBe('pikachu');
        expect(result.current.searchInputValue).toBe('input value');

        // Change sort should clear search
        act(() => {
            result.current.handleSortChange('type');
        });

        expect(result.current.searchTerm).toBe('');
        expect(result.current.searchInputValue).toBe('');
        expect(result.current.sortBy).toBe('type');
    });

    it('should return navigate function', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        expect(result.current.navigate).toBe(mockNavigate);
    });

    it('should handle empty search correctly', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        // Search with empty string should not activate search
        act(() => {
            result.current.handleSearchChange('');
        });

        expect(result.current.displayPokemons).toEqual(mockData);
        expect(result.current.totalPages).toBe(5);
        expect(vi.mocked(usePaginatedSearchPokemons)).toHaveBeenCalledWith('', 'name', 1, false);
    });

    it('should handle page reset when searching', () => {
        const { result } = renderHook(() => useHomePokemonLogic());

        // Go to page 3
        act(() => {
            result.current.handlePageChange(3);
        });

        expect(result.current.currentPage).toBe(3);

        // Search should reset page to 1
        act(() => {
            result.current.handleSearchChange('test');
        });

        expect(result.current.currentPage).toBe(1);
    });

});