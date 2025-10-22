import { SortOption } from "@components/SortMenu";
import { usePokemons } from "@hooks/usePokemons";
import { useSearchPokemons } from "@hooks/useSearchPokemons";
import { useMemo, useState } from "react";

const INITIAL_POKEMON_LIMIT = 20;
const SEARCH_MIN_LENGTH = 3;

export const useHomePokemonLogic = () => {
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("")
  const searchType = sortBy === "name" ? "name" : "number"

  const { isLoading: isLoadingAll, pokemonData } = usePokemons(INITIAL_POKEMON_LIMIT, 0);
  const { isLoading: isSearching, searchResults } = useSearchPokemons(
    searchTerm, 
    searchType,
    searchTerm.length >= SEARCH_MIN_LENGTH,
  );

  const displayPokemons = useMemo(() => {
    const dataToSort = searchTerm.length >= SEARCH_MIN_LENGTH ? searchResults : pokemonData;

    if (!dataToSort || dataToSort.length === 0) return [];

    const sorted = [...dataToSort];
    
    return sortBy === "name" 
      ? sorted.sort((a, b) => a.name.localeCompare(b.name))
      : sorted.sort((a, b) => a.id - b.id);
  }, [pokemonData, searchResults, sortBy, searchTerm]);

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm("")
    setSearchInputValue("")
  };

  const handleInputChange = (value: string) => {
    setSearchInputValue(value)
  }

  const isLoading = searchTerm.length >= SEARCH_MIN_LENGTH ? isSearching : isLoadingAll;
  const hasSearchTerm = Boolean(searchTerm);

  return {
    sortBy,
    searchTerm,
    displayPokemons,
    isLoading,
    hasSearchTerm,
    searchInputValue,

    setSortBy,
    setSearchTerm,
    handleSortChange,
    handleSearchChange,
    clearSearch,
    handleInputChange,
  };
};