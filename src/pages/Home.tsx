
import HeaderPokemon from '../components/HeaderPokemon';
import '../styles/homepage.css';
import CardsPokemon from '../components/CardsPokemon';
import { usePokemons } from '../hooks/usePokemons';
import SkeletonCard from '../components/SkeletonCard';

export const Home = () => {

  const { isLoading, pokemonData } = usePokemons(10, 0);
  
  if (isLoading) {
    return (
      <div className="home-page">
        <HeaderPokemon onSortChange={(value) => console.log(value)} />
        <main className="main-content">
          <div className="cards-container-skeleton">
            { Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={`skeleton-${index}`} />) } 
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <HeaderPokemon onSortChange={(value) =>console.log(value)} />
      <main className="main-content">
        <CardsPokemon pokemons={pokemonData} />
      </main>
    </div>
  )
}
