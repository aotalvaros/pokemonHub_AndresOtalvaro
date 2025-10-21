import React from 'react';
import './styles/sortMenu.css';

export type SortOption = 'number' | 'name';

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
        <div className="sort-menu-header">Sort by:</div>
        <div className="sort-menu-options">
          <button
            className="sort-option"
            onClick={() => handleOptionClick('number')}
            data-testid="sort-number-option"
          >
            <div className={`radio-button ${currentSort === 'number' ? 'selected' : ''}`} data-testid="radio-number">
              {currentSort === 'number' && <div className="radio-inner"></div>}
            </div>
            <span className="sort-option-label">Number</span>
          </button>
          
          <button
            className="sort-option"
            onClick={() => handleOptionClick('name')}
            data-testid="sort-name-option"
          >
            <div className={`radio-button ${currentSort === 'name' ? 'selected' : ''}`} data-testid="radio-name">
              {currentSort === 'name' && <div className="radio-inner"></div>}
            </div>
            <span className="sort-option-label">Name</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SortMenu;