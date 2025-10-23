import { SortOption } from "@components/models/input.interface";
import { usePaginatedPokemons } from "@hooks/usePaginatedPokemons";
import { usePaginatedSearchPokemons } from "@hooks/usePaginatedSearchPokemons";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useHomePokemonLogic = () => {
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const searchType = sortBy === "name" ? "name" : sortBy === "number" ? "number" : "type"

  const navigate = useNavigate()
  const sortType = sortBy === "name" ? "name" : "number"

  const {
    isLoading: isLoadingAll,
    pokemonData,
    totalPages: totalPagesAll,
  } = usePaginatedPokemons(currentPage, sortType)

  const {
    isLoading: isSearching,
    searchResults,
    totalPages: totalPagesSearch,
  } = usePaginatedSearchPokemons(searchTerm, searchType, currentPage, searchTerm.length >= 1)

  const isSearchActive = searchTerm.length >= 1
  const displayPokemons = isSearchActive ? searchResults : pokemonData
  const totalPages = isSearchActive ? totalPagesSearch : totalPagesAll
  const isLoading = isSearchActive ? isSearching : isLoadingAll


  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy)
    setSearchTerm("")
    setSearchInputValue("")
    setCurrentPage(1)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleInputChange = (value: string) => {
    setSearchInputValue(value)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setSearchInputValue("")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    sortBy,
    searchTerm,
    displayPokemons,
    isLoading,
    searchInputValue,
    currentPage,
    totalPages,

    handlePageChange,
    handleClearSearch,
    navigate,
    handleSortChange,
    handleSearchChange,
    handleInputChange,
  };
};