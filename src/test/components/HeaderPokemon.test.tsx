import HeaderPokemon from "@components/HeaderPokemon";
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from "@testing-library/react";
import { SortOption } from "@components/models/input.interface";
import { useHeaderLogic } from '../../components/hooks/useHeaderLogic';

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockonSortChange = vi.fn();
const mockonSearchChange = vi.fn();
const mockdisabled = false
const mocksearchValue = ""
const mockonInputChange = vi.fn();
const mockshowSearch = false
const mockshowSort = true
const mocktitle = 'Pokédex'
const mockshowBackButton = false


vi.mock("../../components/hooks/useHeaderLogic")

vi.mock("../../components/SearchIcon", () => ({
    default: () => <div>SearchIcon Mock</div>,
}))

interface SortMenuProps {
    onClose: () => void;
    onSortChange: (sortBy: SortOption) => void;
}

vi.mock("../../components/SortMenu", () => ({
    default: ({ onClose, onSortChange }: SortMenuProps) => (
        <div>
            SortMenu Mock
            <button onClick={() => onSortChange("type")} data-testid="sort-by-type-button">Sort by Type</button>
            <button onClick={onClose} data-testid="close-menu-button">Close Menu</button>
        </div>
    )
}))

interface ValidationPopupProps {
  onClose: () => void
}

vi.mock("../../components/ValidationPopup", () => ({
    default: ({ onClose }: ValidationPopupProps) => (
        <div>
            ValidationPopup Mock
            <button onClick={onClose} data-testid="close-popup-button">Close Popup</button>
        </div>
    )
}))

describe("HeaderPokemon", () => {

    const mockReturnValue = {
        isSortMenuOpen : false,
        showValidationPopup: false,
        validationMessage: '',
        isInputFocused: false,
        setIsInputFocused: vi.fn(),
        handleSearchChange: vi.fn(),
        handleKeyDown: vi.fn(),
        handleKeyUp: vi.fn(),
        searchConfig: {
            placeholder: "Search Pokémon",
            badgeMessage: "Search by name, number, or type",
            type: "type" as const,
        },
        toggleSortMenu: vi.fn(),
        setIsSortMenuOpen: vi.fn(),
        closeValidationPopup: vi.fn()
    }

    beforeEach(() => {
        vi.mocked(useHeaderLogic).mockReturnValue(mockReturnValue);
    })

    const setup = (props = {}) => {
        const defaultProps = {
            onSortChange: mockonSortChange,
            onSearchChange: mockonSearchChange,
            onInputChange: mockonInputChange,
            disabled: mockdisabled,
            searchValue: mocksearchValue,
            sort: 'name' as SortOption,
            showSearch: mockshowSearch,
            showSort: mockshowSort,
            title: mocktitle,
            showBackButton: mockshowBackButton,
        };
        
        render(<HeaderPokemon {...defaultProps} {...props} />);
    }

     it('should render with default props', () => {
        setup();
        
        expect(screen.getByText('Pokédex')).toBeInTheDocument();
        expect(screen.getByTestId('pokeball-icon')).toBeInTheDocument();
    });

     it('should render back button when showBackButton is true', () => {
        setup({ showBackButton: true });
        
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
        expect(screen.queryByTestId('pokeball-icon')).not.toBeInTheDocument();
        expect(screen.getByAltText('Back')).toBeInTheDocument();
    });

    it('should navigate back when back button is clicked', () => {
        setup({ showBackButton: true });
        
        const backButton = screen.getByTestId('back-button');
        fireEvent.click(backButton);
        
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should render custom title', () => {
        setup({ title: 'Custom Title' });
        
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should render search container when both showSearch and showSort are true', () => {
        setup({ showSearch: true, showSort: true });
        
        expect(screen.getByTestId('search-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
        expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });

    it('should not render search container when showSearch is false', () => {
        setup({ showSearch: false, showSort: true });
        
        expect(screen.queryByTestId('search-wrapper')).not.toBeInTheDocument();
    });

    it('should not render search container when showSort is false', () => {
        setup({ showSearch: true, showSort: false });
        
        expect(screen.queryByTestId('search-wrapper')).not.toBeInTheDocument();
    });

    it('should render search input with correct props', () => {
        setup({ showSearch: true, showSort: true, searchValue: 'pikachu', disabled: true });
        
        const searchInput = screen.getByTestId('search-input');
        
        expect(searchInput).toHaveValue('pikachu');
        expect(searchInput).toBeDisabled();
        expect(searchInput).toHaveAttribute('placeholder', 'Search Pokémon');
        expect(searchInput).toHaveAttribute('aria-label', 'Search Pokemon');
    });

    it('should call handleSearchChange when input changes', () => {
        setup({ showSearch: true, showSort: true });
        
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'charizard' } });
        
        expect(mockReturnValue.handleSearchChange).toHaveBeenCalled();
    });

    it('should call handleKeyDown when key is pressed', () => {
        setup({ showSearch: true, showSort: true });
        
        const searchInput = screen.getByTestId('search-input');
        fireEvent.keyDown(searchInput, { key: 'Enter' });
        
        expect(mockReturnValue.handleKeyDown).toHaveBeenCalled();
    });

    it('should call handleKeyUp when key is released', () => {
        setup({ showSearch: true, showSort: true });
        
        const searchInput = screen.getByTestId('search-input');
        fireEvent.keyUp(searchInput, { key: 'Escape' });
        
        expect(mockReturnValue.handleKeyUp).toHaveBeenCalled();
    });

    it('should call setIsInputFocused(true) when input is focused', () => {
        setup({ showSearch: true, showSort: true });
        
        const searchInput = screen.getByTestId('search-input');
        fireEvent.focus(searchInput);
        
        expect(mockReturnValue.setIsInputFocused).toHaveBeenCalledWith(true);
    });

    it('should call setIsInputFocused(false) when input is blurred', () => {
        setup({ showSearch: true, showSort: true });
        
        const searchInput = screen.getByTestId('search-input');
        fireEvent.blur(searchInput);
        
        expect(mockReturnValue.setIsInputFocused).toHaveBeenCalledWith(false);
    });

    it('should show search badge when input is focused', () => {
        const mockReturnValueWithFocus = {
            ...mockReturnValue,
            isInputFocused: true
        };
        vi.mocked(useHeaderLogic).mockReturnValue(mockReturnValueWithFocus);
        
        setup({ showSearch: true, showSort: true });
        
        expect(screen.getByTestId('search-badge')).toBeInTheDocument();
        expect(screen.getByText('Search by name, number, or type')).toBeInTheDocument();
    });

    it('should not show search badge when input is not focused', () => {
        setup({ showSearch: true, showSort: true });
        
        expect(screen.queryByTestId('search-badge')).not.toBeInTheDocument();
    });

    it('should call toggleSortMenu when filter button is clicked', () => {
        setup({ showSearch: true, showSort: true });
        
        const filterButton = screen.getByTestId('filter-button');
        fireEvent.click(filterButton);
        
        expect(mockReturnValue.toggleSortMenu).toHaveBeenCalled();
    });

    it('should render SearchIcon with correct sortType', () => {
        setup({ showSearch: true, showSort: true, sort: 'number' });
        
        expect(screen.getByText('SearchIcon Mock')).toBeInTheDocument();
    });

    it('should render SortMenu with correct props', () => {
        setup();
        
        expect(screen.getByText('SortMenu Mock')).toBeInTheDocument();
    });

    it('should call setIsSortMenuOpen(false) when SortMenu onClose is triggered', () => {
        setup();
        
        const closeMenuButton = screen.getByTestId('close-menu-button');
        fireEvent.click(closeMenuButton);
        
        expect(mockReturnValue.setIsSortMenuOpen).toHaveBeenCalledWith(false);
    });

    it('should call onSortChange when SortMenu onSortChange is triggered', () => {
        setup();
        
        const sortByTypeButton = screen.getByTestId('sort-by-type-button');
        fireEvent.click(sortByTypeButton);
        
        expect(mockonSortChange).toHaveBeenCalledWith('type');
    });

    it('should render ValidationPopup with correct props', () => {
        const mockReturnValueWithPopup = {
            ...mockReturnValue,
            showValidationPopup: true,
            validationMessage: 'Test validation message'
        };
        vi.mocked(useHeaderLogic).mockReturnValue(mockReturnValueWithPopup);
        
        setup();
        
        expect(screen.getByText('ValidationPopup Mock')).toBeInTheDocument();
    });

    it('should call closeValidationPopup when ValidationPopup onClose is triggered', () => {
        setup();
        
        const closePopupButton = screen.getByTestId('close-popup-button');
        fireEvent.click(closePopupButton);
        
        expect(mockReturnValue.closeValidationPopup).toHaveBeenCalled();
    });

    it('should pass correct props to useHeaderLogic hook', () => {
        setup({
            searchValue: 'test-value',
            onInputChange: mockonInputChange,
            onSearchChange: mockonSearchChange,
            sort: 'number'
        });
        
        expect(useHeaderLogic).toHaveBeenCalledWith({
            onSearchChange: mockonSearchChange,
            searchValue: 'test-value',
            onInputChange: mockonInputChange,
            sort: 'number'
        });
    });

    it('should handle undefined onSortChange gracefully', () => {
        setup({ onSortChange: undefined });
        
        const sortByTypeButton = screen.getByTestId('sort-by-type-button');
        
        expect(() => {
            fireEvent.click(sortByTypeButton);
        }).not.toThrow();
    });

    it('should use default sort value when sort is undefined', () => {
        setup({ sort: undefined });
        
        expect(useHeaderLogic).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: 'name'
            })
        );
    });

    it('should render with all default values when no props provided', () => {
        render(<HeaderPokemon />);
        
        expect(screen.getByText('Pokédex')).toBeInTheDocument();
        expect(screen.getByTestId('pokeball-icon')).toBeInTheDocument();
        expect(screen.getByTestId('search-wrapper')).toBeInTheDocument();
    });

    it('should have correct accessibility attributes', () => {
        setup({ showBackButton: true, showSearch: true, showSort: true });
        
        const backButton = screen.getByTestId('back-button');
        const searchInput = screen.getByTestId('search-input');
        const filterButton = screen.getByTestId('filter-button');
        
        expect(backButton).toHaveAttribute('aria-label', 'Volver');
        expect(searchInput).toHaveAttribute('aria-label', 'Search Pokemon');
        expect(filterButton).toHaveAttribute('aria-label', 'Filter options');
    });

    it('should render all images with correct alt attributes', () => {
        setup({ showBackButton: true, showSearch: true, showSort: true });
        
        expect(screen.getByAltText('Back')).toBeInTheDocument();
        expect(screen.getByAltText('Search Icon')).toBeInTheDocument();
    });

    it('should render pokeball icon when showBackButton is false', () => {
        setup({ showBackButton: false });
        
        expect(screen.getByAltText('Pokeball Icon')).toBeInTheDocument();
        expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
    });

    it('should maintain component structure with Fragment wrapper', () => {
        const { container } = render(<HeaderPokemon />);
        
        // Fragment doesn't create DOM node, so we check for header as direct child
        expect(container.firstChild?.nodeName).toBe('HEADER');
    });

    it('should handle sort menu open state correctly', () => {
        const mockReturnValueWithOpenMenu = {
            ...mockReturnValue,
            isSortMenuOpen: true
        };
        vi.mocked(useHeaderLogic).mockReturnValue(mockReturnValueWithOpenMenu);
        
        setup();
        
        // SortMenu receives isOpen prop
        expect(screen.getByText('SortMenu Mock')).toBeInTheDocument();
    });

    it('should render search container elements correctly', () => {
        setup({ showSearch: true, showSort: true });
        
        const searchWrapper = screen.getByTestId('search-wrapper');
        const searchIcon = screen.getByAltText('Search Icon');
        const searchInput = screen.getByTestId('search-input');
        const filterButton = screen.getByTestId('filter-button');
        
        expect(searchWrapper).toBeInTheDocument();
        expect(searchIcon).toBeInTheDocument();
        expect(searchInput).toBeInTheDocument();
        expect(filterButton).toBeInTheDocument();
    });

})

