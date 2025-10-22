
import HeaderPokemon from '../components/HeaderPokemon';
import '../styles/homepage.css';
import CardsPokemon from '../components/CardsPokemon';
import { usePokemons } from '../hooks/usePokemons';

export const Home = () => {

  const { isLoading, pokemonData } = usePokemons(10, 0);
  
  if (isLoading) {
    return (
      <div className="home-page">
        <HeaderPokemon onSortChange={(value) => console.log(value)} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <HeaderPokemon onSortChange={(value) =>console.log(value)} />
      <main className="main-content">
        <CardsPokemon pokemons={pokemonData} onClick={(pokemon) => console.log(pokemon)} />
      </main>
    </div>
  )
}
