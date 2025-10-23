import React from 'react';
import './styles/sortMenu.css';

export type SortOption = "number" | "name" | "type"

interface SortMenuProps {
  isOpen: boolean;
  currentSort: SortOption;
  onClose: () => void;
  onSortChange: (sortBy: SortOption) => void;
}

export const SortMenu: React.FC<SortMenuProps> = ({
  isOpen,
  currentSort,
  onClose,
  onSortChange,
}) => {
  if (!isOpen) return null;

  const handleOptionClick = (option: SortOption) => {
    onSortChange(option);
    onClose();
  };

  return (
    <>
      <div className="sort-menu-overlay" onClick={onClose}></div>
      <div className="sort-menu">
        <div className="sort-menu-header">Ordenar por:</div>
        <div className="sort-menu-options">
          <button className="sort-option" onClick={() => handleOptionClick("type")} data-testid="sort-type-option">
            <div className={`radio-button ${currentSort === "type" ? "selected" : ""}`} data-testid="radio-type">
              {currentSort === "type" && <div className="radio-inner"></div>}
            </div>
            <span className="sort-option-label">Tipo</span>
          </button>
          <button
            className="sort-option"
            onClick={() => handleOptionClick('number')}
            data-testid="sort-number-option"
          >
            <div className={`radio-button ${currentSort === 'number' ? 'selected' : ''}`} data-testid="radio-number">
              {currentSort === 'number' && <div className="radio-inner"></div>}
            </div>
            <span className="sort-option-label">Numero</span>
          </button>
          
          <button
            className="sort-option"
            onClick={() => handleOptionClick('name')}
            data-testid="sort-name-option"
          >
            <div className={`radio-button ${currentSort === 'name' ? 'selected' : ''}`} data-testid="radio-name">
              {currentSort === 'name' && <div className="radio-inner"></div>}
            </div>
            <span className="sort-option-label">Nombre</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SortMenu;