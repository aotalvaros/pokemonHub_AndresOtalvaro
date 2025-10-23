import React from 'react';
import './styles/cardsPokemon.css';
import { useNavigate } from 'react-router-dom';
import { IPokemon } from '@models/pokemon.interface';
import { useFavorites } from '@context/FavoritesContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { LazyImage } from "./LazyImage"

interface CardsPokemonProps {
  pokemons: IPokemon[];
}

export const CardsPokemon: React.FC<CardsPokemonProps> = ({ pokemons }) => {

  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()

  const formatPokemonNumber = (id: number): string => {
    return `#${id.toString().padStart(3, "0")}`
  }

  const handleCardClick = (id: number) => {
    navigate(`/pokemon/${id}`)
  }

   const handleFavoriteClick = (e: React.MouseEvent, pokemonId: number) => {
    e.stopPropagation()
    toggleFavorite(pokemonId)
  }
  
  return (
    <div className="cards-container">
      <div className="cards-grid" data-testid="cards-grid">
        {pokemons?.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card" onClick={() => handleCardClick(pokemon.id)} data-testid={`pokemon-card-${pokemon.id}`}>
            <span className="pokemon-number" data-testid={`pokemon-number-${pokemon.id}`}>
              {formatPokemonNumber(pokemon.id)}
            </span>
            
              <IconButton aria-label="delete" 
                className={`favorite-button ${isFavorite(pokemon.id) ? "favorite-check" : "favorite-icon"}`} 
                onClick={(e) => handleFavoriteClick(e, pokemon.id)}
                data-testid={`favorite-button-${pokemon.id}`} 
              >
                <FavoriteIcon />
              </IconButton>
             
            
            <div className="pokemon-image-container">
              <LazyImage
                src={pokemon?.pokemon_v2_pokemonsprites[0]?.sprites.other?.['official-artwork']?.front_default ?? ''}
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