
import HeaderPokemon from '../components/HeaderPokemon';
import '../styles/homepage.css';
import SkeletonCard from '@components/SkeletonCard';
import CardsPokemon from '@components/CardsPokemon';
import { useHomePokemonLogic } from '@components/hooks/useHomePokemonLogic';
import { useFavorites } from '@context/FavoritesContext';
import Badge from '@mui/material/Badge';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import Pagination from '@components/Pagination';


export const Home = () => {
  const {
    sortBy,
    displayPokemons,
    isLoading,
    searchInputValue,
    currentPage,
    searchTerm,
    totalPages,
    
    handleClearSearch,
    handlePageChange,
    handleSortChange,
    handleSearchChange,
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
          disabled={true}
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
        <Badge badgeContent={favorites.length} color="primary" className='favorites-button' onClick={() => navigate("/favorites")}>
          <FavoriteBorderTwoToneIcon />
        </Badge>
      )}
      <main className="main-content">
        {displayPokemons.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron Pokémon que coincidan con tu búsqueda.</p>
            {searchTerm && (
              <button className="clear-search-button" onClick={handleClearSearch}>
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
         <>
            <CardsPokemon pokemons={displayPokemons} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </main>
    </div>
  )
}
