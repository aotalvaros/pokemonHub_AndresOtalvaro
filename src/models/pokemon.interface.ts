export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export interface PokemonType {
  name: string;
  color: string;
}

export interface PokemonStat {
  name: string;
  value: number;
  maxValue: number;
}

export interface PokemonDetailProps {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
  weight: number;
  height: number;
  moves: string[];
  description: string;
  stats: PokemonStat[];
  themeColor: string;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}