import "./styles/headerPokemon.css";
import vectorIcons from "@assets/index";
import { Fragment } from "react";
import SortMenu, { type SortOption } from "./SortMenu";
import ValidationPopup from "./ValidationPopup";
import { useHeaderLogic } from "./hooks/useHeaderLogic";
import { useNavigate } from "react-router-dom";

interface HeaderPokemonProps {
  searchValue?: string
  onInputChange?: (value: string) => void
  onSortChange?: (sortBy: SortOption) => void;
  onSearchChange?: (searchTerm: string) => void;
  disabled?: boolean;
  sort?: SortOption;
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
}

export default function HeaderPokemon({
  onSortChange,
  onSearchChange,
  disabled,
  searchValue,
  onInputChange,
  sort,
  showSearch = true,
  showSort = true,
  title = "Pokédex",
  showBackButton = false,
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

  const navigate = useNavigate()

  return (
    <Fragment>
      <header className="header-pokemon">
        <div className="header-container">
          <div className="logo-section">
            {showBackButton ? (
              <button className="back-button" onClick={() => navigate(-1)} aria-label="Volver">
                <img src={vectorIcons.arrowBack} alt="Back" className="back-icon" />
              </button>
            ) : (
              <img src={vectorIcons.pokeball} alt="Pokeball Icon" className="pokeball-icon" />
            )}
            <h1 className="logo-text">{title}</h1>
          </div>

          {showSearch && showSort && (
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
                ) : sort === "type" ? (
                  <img
                    src={vectorIcons.sortIcon || "/placeholder.svg"}
                    alt="Type Icon"
                    className="icon-button-filter"
                    data-testid="type-icon"
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
          )}
          
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
