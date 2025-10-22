import React from 'react';
import './styles/cardsPokemon.css';
import { useNavigate } from 'react-router-dom';
import { IPokemon } from '@models/pokemon.interface';

interface CardsPokemonProps {
  pokemons: IPokemon[];
}

export const CardsPokemon: React.FC<CardsPokemonProps> = ({ pokemons }) => {

  const navigate = useNavigate()

  const formatPokemonNumber = (id: number): string => {
    return `#${id.toString().padStart(3, "0")}`
  }

  const handleCardClick = (id: number) => {
    navigate(`/pokemon/${id}`)
  }
  
  return (
    <div className="cards-container">
      <div className="cards-grid">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card" onClick={() => handleCardClick(pokemon.id)}>
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