import "./styles/headerPokemon.css";
import vectorIcons from "@assets/index";
import { Fragment } from "react";
import SortMenu, { type SortOption } from "./SortMenu";
import ValidationPopup from "./ValidationPopup";
import { useHeaderLogic } from "./hooks/useHeaderLogic";

interface HeaderPokemonProps {
  searchValue: string
  onInputChange: (value: string) => void
  onSortChange?: (sortBy: SortOption) => void;
  onSearchChange?: (searchTerm: string) => void;
  disabled?: boolean;
  sort?: SortOption
}

export default function HeaderPokemon({
  onSortChange,
  onSearchChange,
  disabled,
  searchValue,
  onInputChange,
  sort,
}: HeaderPokemonProps) {

  const {
    isSortMenuOpen,
    showValidationPopup,
    validationMessage,
    isInputFocused,
    setIsInputFocused,
    handleSearchChange,
    handleKeyDown,
    handleKeyUp,
    badgeMessage,
    placeholder,
    toggleSortMenu,
    setIsSortMenuOpen,
    closeValidationPopup
  } = useHeaderLogic({
    onSearchChange,
    searchValue,
    onInputChange,
    sort,
  });

  return (
    <Fragment>
      <header className="header-pokemon">
        <div className="header-container">
          <div className="logo-section">
            <img
              src={vectorIcons.pokeball}
              alt="Pokeball Icon"
              className="pokeball-icon"
            />
            <h1 className="logo-text">Pokédex</h1>
          </div>

          <div className="search-container">
            <div className="search-wrapper">
              <img
                src={vectorIcons.searchIcon}
                alt="Search Icon"
                className="search-icon"
              />
              <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                aria-label="Search Pokemon"
                data-testid="search-input"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                disabled={disabled}
              />
              {isInputFocused && (
                <div className="search-badge">{badgeMessage}</div>
              )}
            </div>
            <button
              className="filter-button"
              aria-label="Filter options"
              onClick={toggleSortMenu}
              data-testid="filter-button"
            >
              {sort === "number" ? (
                <img
                  src={vectorIcons.tagIcon}
                  alt="Sort Icon"
                  className="icon-button-filter"
                  data-testid="tag-icon"
                />
              ) : (
                <img
                  src={vectorIcons.textFormatIcon}
                  alt="Text Format Icon"
                  className="icon-button-filter"
                  data-testid="text-format-icon"
                />
              )}
            </button>
          </div>
        </div>
      </header>
      <SortMenu
        isOpen={isSortMenuOpen}
        currentSort={sort ?? "name"}
        onClose={() => setIsSortMenuOpen(false)}
        onSortChange={(value) => onSortChange?.(value)}
      />
      <ValidationPopup
        isOpen={showValidationPopup}
        message={validationMessage}
        onClose={closeValidationPopup}
      />
    </Fragment>
  );
}
