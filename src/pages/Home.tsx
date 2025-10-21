
import HeaderPokemon from '../components/HeaderPokemon';
import '../styles/homepage.css';
import { Pokemon } from 'src/models/pokemon.interface';
import CardsPokemon from '../components/CardsPokemon';

export const Home = () => {

  const mockPokemons: Pokemon[] = [
    {
      id: 1,
      name: 'Bulbasaur',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    },
    {
      id: 4,
      name: 'Charmander',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    },
    {
      id: 7,
      name: 'Squirtle',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    },
    {
      id: 10,
      name: 'Caterpie',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png',
    }
  ];

  return (
    <div className="home-page">
      <HeaderPokemon onSortChange={(value) =>console.log(value)} />
      <main className="main-content">
        <CardsPokemon pokemons={mockPokemons} />
      </main>
    </div>
  )
}
