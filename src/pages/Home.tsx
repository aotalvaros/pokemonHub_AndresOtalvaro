
import HeaderPokemon from '../components/HeaderPokemon';
import '../styles/homepage.css';
import SkeletonCard from '@components/SkeletonCard';
import CardsPokemon from '@components/CardsPokemon';
import { useHomePokemonLogic } from '@components/hooks/useHomePokemonLogic';
import { useFavorites } from '@context/FavoritesContext';

export const Home = () => {
  const {
    sortBy,
    displayPokemons,
    isLoading,
    handleSortChange,
    handleSearchChange,
    clearSearch,
    hasSearchTerm,
    searchInputValue,
    handleInputChange,
    navigate
  } = useHomePokemonLogic();

  const { favorites } = useFavorites()

  if (isLoading) {
    return (
      <div className="home-page">
        <HeaderPokemon 
          searchValue={searchInputValue}
          onInputChange={handleInputChange}
        />
        <main className="main-content">
          <div className="cards-container-skeleton">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="home-page">
      <HeaderPokemon
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchValue={searchInputValue}
        onInputChange={handleInputChange}
        sort={sortBy}
      />
      {favorites.length > 0 && (
        <div className="favorites-banner">
          <button className="favorites-button" onClick={() => navigate("/favorites")}>
            ⭐ Ver Favoritos ({favorites.length})
          </button>
        </div>
      )}
      <main className="main-content">
        {displayPokemons.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron Pokémon que coincidan con tu búsqueda.</p>
            {hasSearchTerm && (
              <button className="clear-search-button" onClick={clearSearch}>
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <CardsPokemon pokemons={displayPokemons} />
        )}
      </main>
    </div>
  )
}
