/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';
import { SortOption } from '@components/SortMenu';
import { validatePokemonSearch, type SearchType } from '@utils/validatePokemonSearch';

interface UseHeaderLogicProps {
  searchValue: string;
  onInputChange: (value: string) => void;
  onSearchChange?: (searchTerm: string) => void;
  sort?: SortOption;
}

export const useHeaderLogic = ({
    searchValue,
    onInputChange,
    onSearchChange,
    sort = "name",
}: UseHeaderLogicProps) => {

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const toggleSortMenu = useCallback(() => {
    setIsSortMenuOpen(prev => !prev);
  }, []);


  const closeValidationPopup = useCallback(() => {
    setShowValidationPopup(false);
  }, []);

  const showValidationError = useCallback((message: string) => {
    setValidationMessage(message);
    setShowValidationPopup(true);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange?.(value);
  }, [onInputChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const searchType: SearchType = sort === "name" ? "name" : "number"
      const validation = validatePokemonSearch(searchValue, searchType)

      if (!validation.isValid && validation.error) {
        showValidationError(validation.error);
        onSearchChange?.("");
      } else {
        const processedValue = searchType === "number" ? searchValue.trim() : searchValue.trim().toLowerCase()
        onSearchChange?.(processedValue)
      }
    }
  }, [searchValue, onSearchChange, showValidationError]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onInputChange?.("");
      onSearchChange?.("");
    }
  }, [onInputChange, onSearchChange]);

   const badgeMessage =
    sort === "name" ? "Presione Enter para buscar por nombre" : "Presione Enter para buscar por número"

  const placeholder = sort === "name" ? "Buscar por nombre..." : "Buscar por número (ej: 25 o #025)..."

  return {
    isSortMenuOpen,
    toggleSortMenu,
    setIsSortMenuOpen,

    showValidationPopup,
    validationMessage,
    closeValidationPopup,

    isInputFocused,
    setIsInputFocused,

    handleSearchChange,
    handleKeyDown,
    handleKeyUp,
    badgeMessage,
    placeholder
  };
};