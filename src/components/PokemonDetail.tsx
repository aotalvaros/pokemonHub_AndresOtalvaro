import React from 'react';
import './styles/pokemondetailStyle.css';
import { vectorIcons } from '../assets/index';
import { PokemonDetailProps } from '@models/pokemon.interface';

export const PokemonDetail: React.FC<PokemonDetailProps> = ({
  id,
  name,
  image,
  types,
  weight,
  height,
  moves,
  description,
  stats,
  themeColor,
  onBack,
  onPrevious,
  onNext,
}) => {
  const formatPokemonNumber = (id: number): string => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const formatWeight = (weight: number): string => {
    return `${(weight / 10).toFixed(1)} kg`;
  };

  const formatHeight = (height: number): string => {
    return `${(height / 10).toFixed(1)} m`;
  };

  return (
    <div className="pokemon-detail" style={{ backgroundColor: themeColor }}>
      <img 
        src={vectorIcons.pokeball2} 
        alt="Background Pokeball" 
        className="background-pokeball"
      />
      <div  className="pokemon-detail-header" >
        <div className="header-navigation">
          <button 
            className="nav-button back-button" 
            onClick={onBack}
            aria-label="Go back"
            data-testid="back-button"
          >
            <img 
              src={vectorIcons.arrowBack} 
              alt="Back" 
              className="back-icon"
            />
          </button>
          
          <div className="header-title">
            <h1 className="pokemon-detail-name">{name}</h1>
            <span className="pokemon-detail-number">
              {formatPokemonNumber(id)}
            </span>
          </div>
        </div>

        <div className="header-image-container">
          {onPrevious ? (
            <button 
              className="nav-button" 
              onClick={onPrevious}
              aria-label="Previous Pokemon"
              data-testid="previous-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M15 18L9 12L15 6" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )
          : <div style={{ width: '40px' }}></div>
        }

           <img 
            src={image || "/placeholder.svg"} 
            alt={name}
            className="pokemon-detail-image"
          />


          {onNext ? (
            <button 
              className="nav-button" 
              onClick={onNext}
              aria-label="Next Pokemon"
              data-testid="next-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )
          : <div style={{ width: '40px' }}></div>
        }
        </div>
      </div>

      <div className="pokemon-detail-content">
        
        <div className="type-badges">
          {types.map((type, index) => (
            <span 
              key={index} 
              className="type-badge"
              style={{ backgroundColor: type.color }}
            >
              {type.name}
            </span>
          ))}
        </div>


        <h2 className="section-title" style={{ color: themeColor }}>
          About
        </h2>

        <div className="about-grid">
          <div className="about-item">
            <div className="about-value">
              <img src={vectorIcons.weigthIcon} alt="Weight" />
              {formatWeight(weight)}
            </div>
            <div className="about-label">Weight</div>
          </div>

          <div className="about-item">
            <div className="about-value">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="about-icon">
                <path d="M8 2V14M4 6L8 2L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {formatHeight(height)}
            </div>
            <div className="about-label">Height</div>
          </div>

          <div className="about-item">
            <div className="about-value moves-value">
              {moves.slice(0, 2).join('\n')}
            </div>
            <div className="about-label">Moves</div>
          </div>
        </div>

        <p className="pokemon-description">{description}</p>


        <h2 className="section-title" style={{ color: themeColor }}>
          Base Stats
        </h2>

        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-row">
              <span 
                className="stat-name"
                style={{ color: themeColor }}
              >
                {stat.name}
              </span>
              <span className="stat-value">
                {stat.value.toString().padStart(3, '0')}
              </span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar"
                  style={{ 
                    width: `${(stat.value / stat.maxValue) * 100}%`,
                    backgroundColor: themeColor 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;