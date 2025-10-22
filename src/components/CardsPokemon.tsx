import React from 'react';
import './styles/cardsPokemon.css';
import { Pokemon } from 'src/models/pokemon.interface';

interface CardsPokemonProps {
  pokemons: Pokemon[];
  onClick?: (pokemon: Pokemon) => void;
}

export const CardsPokemon: React.FC<CardsPokemonProps> = ({ pokemons, onClick }) => {
  const formatPokemonNumber = (id: number): string => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  return (
    <div className="cards-container">
      <div className="cards-grid">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card" onClick={() => onClick?.(pokemon)}>
            <span className="pokemon-number">
              {formatPokemonNumber(pokemon.id)}
            </span>
            <div className="pokemon-image-container">
              <img 
                src={pokemon.pokemon_v2_pokemonsprites[0]?.sprites.other?.['official-artwork'].front_default || "/placeholder.svg"} 
                alt={pokemon.name}
                className="pokemon-image"
              />
            </div>
            <h3 className="pokemon-name">{pokemon.name}</h3>
            <div className='content-name'></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsPokemon;