import PokemonDetail from '../../components/PokemonDetail';
import { describe, it, afterEach, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockisFavorite = vi.fn();
const mocktoggleFavorite = vi.fn();

vi.mock("../../context/FavoritesContext", () => ({
  useFavorites: () => ({
    isFavorite: mockisFavorite,
    toggleFavorite: mocktoggleFavorite,
  }),
}));

vi.mock("../../assets/index", () => ({
  default: {
    pokeball2: "/mockPokeball2.svg",
    arrowBack: "/mockArrowBack.svg",
    weigthIcon: "/mockWeightIcon.svg"
  }
}));

describe("PokemonDetail", () => {
  const mockOnBack = vi.fn();
  const mockOnPrevious = vi.fn();
  const mockOnNext = vi.fn();

  const mockPokemonData = {
    id: 25,
    name: "Pikachu",
    image: "https://example.com/pikachu.png",
    types: [
      { name: "Electric", color: "#F7D02C" },
      { name: "Normal", color: "#A8A878" }
    ],
    weight: 60, // 6.0 kg
    height: 40, // 4.0 m
    moves: ["Thunder Shock", "Quick Attack", "Agility", "Thunder"],
    description: "When Pikachu meets a new friend, it shocks them with electricity from its cheek pouches.",
    stats: [
      { name: "HP", value: 35, maxValue: 100 },
      { name: "Attack", value: 55, maxValue: 100 },
      { name: "Defense", value: 40, maxValue: 100 },
      { name: "Sp. Atk", value: 50, maxValue: 100 },
      { name: "Sp. Def", value: 50, maxValue: 100 },
      { name: "Speed", value: 90, maxValue: 100 }
    ],
    themeColor: "#F7D02C",
    onBack: mockOnBack,
    onPrevious: mockOnPrevious,
    onNext: mockOnNext
  };

  beforeEach(() => {
    mockisFavorite.mockReturnValue(false);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const setup = (props = {}) => {
    const mergedProps = { ...mockPokemonData, ...props };
    return render(<PokemonDetail {...mergedProps} />);
  };

  it('should render pokemon basic information correctly', () => {
    setup();

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-number')).toHaveTextContent('#025');
    expect(screen.getByText('When Pikachu meets a new friend, it shocks them with electricity from its cheek pouches.')).toBeInTheDocument();
  });

  it('should display only first 2 moves', () => {
    setup();
    const movesElement = screen.getByTestId('moves');
    expect(movesElement).toHaveTextContent('Thunder Shock Quick Attack');
    expect(movesElement).not.toHaveTextContent('Agility');
  });

  it('should render type badges with correct styling', () => {
    setup();

    const typeBadges = screen.getAllByText(/Electric|Normal/);
    expect(typeBadges).toHaveLength(2);

    const electricBadge = screen.getByText('Electric');
    expect(electricBadge).toHaveStyle({ backgroundColor: '#F7D02C' });

    const normalBadge = screen.getByText('Normal');
    expect(normalBadge).toHaveStyle({ backgroundColor: '#A8A878' });
  });

  it('should apply theme color to background and elements', () => {
    const { container } = setup();

    const pokemonDetail = container.querySelector('.pokemon-detail');
    expect(pokemonDetail).toHaveStyle({ backgroundColor: '#F7D02C' });

    const sectionTitles = screen.getAllByText(/About|Base Stats/);
    sectionTitles.forEach(title => {
      expect(title).toHaveStyle({ color: '#F7D02C' });
    });
  });

  it('should render stats with correct values and bars', () => {
    setup();

    const stats = mockPokemonData.stats;
    stats.forEach((stat, index) => {
      expect(screen.getByTestId(`stat-name-${index}`)).toHaveTextContent(stat.name);
      expect(screen.getByTestId(`stat-value-${index}`)).toHaveTextContent(stat.value.toString().padStart(3, '0'));
      
      const statBar = screen.getByTestId(`stat-bar-${index}`);
      const expectedWidth = `${(stat.value / stat.maxValue) * 100}%`;
      expect(statBar).toHaveStyle({ 
        width: expectedWidth,
        backgroundColor: '#F7D02C'
      });
    });
  });

  it('should call onBack when back button is clicked', () => {
    setup();

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should render previous button when onPrevious is provided', () => {
    setup();

    const previousButton = screen.getByTestId('previous-button');
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toHaveAttribute('aria-label', 'Previous Pokemon');
  });

  it('should render next button when onNext is provided', () => {
    setup();

    const nextButton = screen.getByTestId('next-button');
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveAttribute('aria-label', 'Next Pokemon');
  });

  it('should render placeholder div when onPrevious is not provided', () => {
    setup({ onPrevious: undefined });

    const placeholderDivs = screen.getAllByTestId('placeholder-div');
    expect(placeholderDivs).toHaveLength(1); 
    expect(screen.queryByTestId('previous-button')).not.toBeInTheDocument();
  });

  it('should render placeholder div when onNext is not provided', () => {
    setup({ onNext: undefined });

    const placeholderDivs = screen.getAllByTestId('placeholder-div');
    expect(placeholderDivs).toHaveLength(1);
    expect(screen.queryByTestId('next-button')).not.toBeInTheDocument();
  });

  it('should call onPrevious when previous button is clicked', () => {
    setup();

    const previousButton = screen.getByTestId('previous-button');
    fireEvent.click(previousButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when next button is clicked', () => {
    setup();

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should show unfavorite icon when pokemon is not favorite', () => {
    mockisFavorite.mockReturnValue(false);
    setup();

    const favoriteButton = screen.getByTestId('favorite-button');
    expect(favoriteButton).toHaveClass('btn-icon');
    
    // Check for FavoriteBorderTwoToneIcon (unfilled)
    const unfilledIcon = favoriteButton.querySelector('svg[data-testid="FavoriteBorderTwoToneIcon"]');
    expect(unfilledIcon).toBeInTheDocument();
  });

  it('should show favorite icon when pokemon is favorite', () => {
    mockisFavorite.mockReturnValue(true);
    setup();

    const favoriteButton = screen.getByTestId('favorite-button');
    expect(favoriteButton).toHaveClass('btn-favorite');
    
    // Check for FavoriteIcon (filled)
    const filledIcon = favoriteButton.querySelector('svg[data-testid="FavoriteIcon"]');
    expect(filledIcon).toBeInTheDocument();
  });

  it('should toggle favorite when favorite button is clicked', () => {
    setup();

    const favoriteButton = screen.getByTestId('favorite-button');
    fireEvent.click(favoriteButton);

    expect(mocktoggleFavorite).toHaveBeenCalledWith(25);
    expect(mocktoggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('should prevent event propagation when favorite button is clicked', () => {
    const mockStopPropagation = vi.fn();
    setup();

    const favoriteButton = screen.getByTestId('favorite-button');
    
    // Create a custom event with stopPropagation
    const clickEvent = new MouseEvent('click', { bubbles: true });
    clickEvent.stopPropagation = mockStopPropagation;
    
    fireEvent(favoriteButton, clickEvent);

    expect(mockStopPropagation).toHaveBeenCalled();
  });

  it('should use placeholder image when image is not provided', () => {
    setup({ image: undefined });

    const pokemonImage = screen.getByAltText('Pikachu');
    expect(pokemonImage).toHaveAttribute('src', '/placeholder.svg');
  });

  it('should use provided image when available', () => {
    setup();

    const pokemonImage = screen.getByAltText('Pikachu');
    expect(pokemonImage).toHaveAttribute('src', 'https://example.com/pikachu.png');
  });

  it('should render background pokeball image', () => {
    setup();

    const backgroundPokeball = screen.getByAltText('Background Pokeball');
    expect(backgroundPokeball).toBeInTheDocument();
    expect(backgroundPokeball).toHaveAttribute('src', '/mockPokeball2.svg');
    expect(backgroundPokeball).toHaveClass('background-pokeball');
  });

  it('should render weight icon', () => {
    setup();

    const weightIcon = screen.getByAltText('Weight');
    expect(weightIcon).toBeInTheDocument();
    expect(weightIcon).toHaveAttribute('src', '/mockWeightIcon.svg');
  });

  it('should render height SVG icon', () => {
    setup();

    const heightContainer = screen.getByTestId('height');
    const heightSvg = heightContainer.querySelector('svg');
    expect(heightSvg).toBeInTheDocument();
    expect(heightSvg).toHaveClass('about-icon');
  });

  it('should handle empty types array', () => {
    setup({ types: [] });

    const typeBadges = screen.queryByText(/Electric|Normal/);
    expect(typeBadges).not.toBeInTheDocument();
  });

  it('should handle empty moves array', () => {
    setup({ moves: [] });

    const movesElement = screen.getByTestId('moves');
    expect(movesElement).toHaveTextContent('');
  });

  it('should handle single move', () => {
    setup({ moves: ['Thunder Shock'] });

    const movesElement = screen.getByTestId('moves');
    expect(movesElement).toHaveTextContent('Thunder Shock');
  });

  it('should handle empty stats array', () => {
    setup({ stats: [] });

    const statNames = screen.queryAllByTestId(/stat-name-/);
    expect(statNames).toHaveLength(0);
  });

  it('should have correct accessibility attributes', () => {
    setup();

    const backButton = screen.getByTestId('back-button');
    expect(backButton).toHaveAttribute('aria-label', 'Go back');

    const favoriteButton = screen.getByTestId('favorite-button');
    expect(favoriteButton).toHaveAttribute('aria-label', 'Toggle favorite');

    const previousButton = screen.getByTestId('previous-button');
    expect(previousButton).toHaveAttribute('aria-label', 'Previous Pokemon');

    const nextButton = screen.getByTestId('next-button');
    expect(nextButton).toHaveAttribute('aria-label', 'Next Pokemon');
  });

  it('should render correct CSS classes', () => {
    const { container } = setup();

    expect(container.querySelector('.pokemon-detail')).toBeInTheDocument();
    expect(container.querySelector('.pokemon-detail-header')).toBeInTheDocument();
    expect(container.querySelector('.pokemon-detail-content')).toBeInTheDocument();
    expect(container.querySelector('.type-badges')).toBeInTheDocument();
    expect(container.querySelector('.about-grid')).toBeInTheDocument();
    expect(container.querySelector('.stats-container')).toBeInTheDocument();
  });

  it('should handle very large stat values correctly', () => {
    const largeStats = [
      { name: "HP", value: 255, maxValue: 255 },
      { name: "Attack", value: 999, maxValue: 999 }
    ];
    
    setup({ stats: largeStats });

    expect(screen.getByTestId('stat-value-0')).toHaveTextContent('255');
    expect(screen.getByTestId('stat-value-1')).toHaveTextContent('999');
    
    const firstStatBar = screen.getByTestId('stat-bar-0');
    expect(firstStatBar).toHaveStyle({ width: '100%' });
  });

  it('should handle zero stat values', () => {
    const zeroStats = [{ name: "HP", value: 0, maxValue: 100 }];
    
    setup({ stats: zeroStats });

    expect(screen.getByTestId('stat-value-0')).toHaveTextContent('000');
    
    const statBar = screen.getByTestId('stat-bar-0');
    expect(statBar).toHaveStyle({ width: '0%' });
  });

  it('should handle special characters in pokemon name', () => {
    setup({ name: "Nidoran♂" });

    expect(screen.getByText('Nidoran♂')).toBeInTheDocument();
    
    const pokemonImage = screen.getByAltText('Nidoran♂');
    expect(pokemonImage).toBeInTheDocument();
  });

  it('should handle long descriptions', () => {
    const longDescription = "This is a very long description that contains multiple sentences and should be displayed properly in the component without breaking the layout or causing any issues.";
    
    setup({ description: longDescription });

    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

});