import "./styles/headerPokemon.css";
import { vectorIcons } from "../assets/index";
import { Fragment, useState } from "react";
import SortMenu, { type SortOption } from "./SortMenu";

interface HeaderPokemonProps {
  onSortChange?: (sortBy: SortOption) => void;
}

export default function HeaderPokemon({ onSortChange }: HeaderPokemonProps) {

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('number');
  console.log("🚀 ~ HeaderPokemon ~ currentSort:", currentSort)

  const handleSortChange = (sortBy: SortOption) => {
    setCurrentSort(sortBy);
    if (onSortChange) {
      onSortChange(sortBy);
    }
  };

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
                  placeholder="Search"
                  aria-label="Search Pokemon"
                  data-testid="search-input"
              />
            </div>
            <button 
              className="filter-button" 
              aria-label="Filter options" 
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              data-testid="filter-button"
            >
              {
                currentSort === 'number' 
                ? (
                  <img 
                    src={vectorIcons.tagIcon} 
                    alt="Sort Icon"
                    className="icon-button-filter"
                    data-testid="tag-icon"
                  />
                ) 
                : (
                  <img 
                    src={vectorIcons.textFormatIcon} 
                    alt="Text Format Icon"
                    className="icon-button-filter"
                    data-testid="text-format-icon"
                  />
                )
              }
            </button>
          </div>
        </div>
      </header>
      <SortMenu
        isOpen={isSortMenuOpen}
        currentSort={currentSort}
        onClose={() => setIsSortMenuOpen(false)}
        onSortChange={handleSortChange}
      />
    </Fragment>
  );
}
