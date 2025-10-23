import { describe, it, afterEach, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CardsPokemon from "../../components/CardsPokemon";
import { IPokemon, Other, PokemonV2Pokemonsprite, Sprites } from "@models/pokemon.interface";

const mockisFavorite = vi.fn();
const mocktoggleFavorite = vi.fn();

vi.mock("../../context/FavoritesContext", () => ({
  useFavorites: () => ({
    isFavorite: mockisFavorite,
    toggleFavorite: mocktoggleFavorite,
  }),
}));

vi.mock("@components/LazyImage", () => ({
  LazyImage: vi.fn(() => <div>LazyImage Mock</div>),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("CardsPokemon Component", () => {
  const mockPokemon: IPokemon = {
    id: 25,
    name: "pikachu",
    pokemon_v2_pokemonsprites: [
      {
        sprites: {
          other: {
            "official-artwork": {
              front_default: "https://example.com/pikachu.png",
              front_shiny: "https://example.com/pikachu-shiny.png",
            },
            
          } as Other
        } as Sprites
      },
    ],
  } as IPokemon;

  const mockPokemonWithoutSprite: IPokemon = {
    id: 1,
    name: "bulbasaur",
    pokemon_v2_pokemonsprites: [] as PokemonV2Pokemonsprite[]
  } as IPokemon;

  const setUp = (pokemons = [mockPokemon, mockPokemonWithoutSprite]) => {
    render(
      <CardsPokemon pokemons={pokemons} />
    )
  }

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state when no pokemons provided', () => {
    setUp([]);
    
    const cardsGrid = screen.getByTestId('cards-grid');
    expect(cardsGrid.children.length).toBe(0);
    expect(cardsGrid).toBeInTheDocument();
  });

  it('should render pokemon cards correctly', () => {
    setUp();

    const pikachuCard = screen.getByTestId('pokemon-card-25');
    const bulbasaurCard = screen.getByTestId('pokemon-card-1');

    expect(pikachuCard).toBeInTheDocument();
    expect(bulbasaurCard).toBeInTheDocument();
  })

  it('should format pokemon number correctly', () => {
    const pokemonWithDifferentId = { ...mockPokemon, id: 1 };
    setUp([pokemonWithDifferentId]);

    const formattedNumber = screen.getByText('#001');
    expect(formattedNumber).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-number-1')).toHaveTextContent('#001');
  })


  it('should format pokemon number with three digits for larger numbers', () => {
    const pokemonWithLargeId = { ...mockPokemon, id: 150 };
    setUp([pokemonWithLargeId]);

    expect(screen.getByTestId('pokemon-number-150')).toHaveTextContent('#150');
  })

  it('should navigate to pokemon detail on card click', () => {
    setUp();

    const pokemonCard = screen.getByTestId('pokemon-card-25');
    fireEvent.click(pokemonCard);

    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/25');
  })

  it('should toggle favorite on favorite button click', () => {
    setUp([mockPokemon]);

    const favoriteButton = screen.getByTestId('favorite-button-25');
    fireEvent.click(favoriteButton);

    expect(mocktoggleFavorite).toHaveBeenCalledWith(25);
  })

  it('should prevent event propagation when clicking favorite button', () => {
    setUp([mockPokemon]);

    const favoriteButton = screen.getByTestId('favorite-button-25');
    fireEvent.click(favoriteButton);
    
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mocktoggleFavorite).toHaveBeenCalledWith(25);
  })

  it('should apply favorite-check class when pokemon is favorite', () => {
    mockisFavorite.mockReturnValue(true);
    setUp([mockPokemon]);

    const favoriteButton = screen.getByTestId('favorite-button-25');
    expect(favoriteButton).toHaveClass('favorite-check');
    expect(favoriteButton).toHaveClass('favorite-button');
  })

  it('should apply favorite-icon class when pokemon is not favorite', () => {
    mockisFavorite.mockReturnValue(false);
    setUp([mockPokemon]);

    const favoriteButton = screen.getByTestId('favorite-button-25');
    expect(favoriteButton).toHaveClass('favorite-icon');
    expect(favoriteButton).toHaveClass('favorite-button');
  })

  it('should render LazyImage with correct props', () => {
    setUp([mockPokemon]);

    const lazyImage = screen.getByText('LazyImage Mock');
    expect(lazyImage).toBeInTheDocument();
  })

  it('should render multiple pokemon cards', () => {
    const multiplePokemon = [
      mockPokemon,
      { ...mockPokemon, id: 1, name: 'bulbasaur' },
      { ...mockPokemon, id: 4, name: 'charmander' }
    ];

    setUp(multiplePokemon);


    expect(screen.getByTestId('pokemon-card-25')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-card-4')).toBeInTheDocument();

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();

  })

});
