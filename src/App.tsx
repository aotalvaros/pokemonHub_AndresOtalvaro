
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PokemonDetailPage } from './pages/PokemonDetailPage';
import { PokemonProvider } from './context/PokemonContext';

const queryClient = new QueryClient();

function App() {
  // const examplePokemon = {
  //   id: 1,
  //   name: 'Bulbasaur',
  //   image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
  //   types: [
  //     { name: 'Grass', color: '#74CB48' },
  //     { name: 'Poison', color: '#A43E9E' }
  //   ],
  //   weight: 69,
  //   height: 7,
  //   moves: ['Chlorophyll', 'Overgrow'],
  //   description: 'There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger.',
  //   stats: [
  //     { name: 'HP', value: 45, maxValue: 100 },
  //     { name: 'ATK', value: 49, maxValue: 100 },
  //     { name: 'DEF', value: 49, maxValue: 100 },
  //     { name: 'SATK', value: 65, maxValue: 100 },
  //     { name: 'SDEF', value: 65, maxValue: 100 },
  //     { name: 'SPD', value: 45, maxValue: 100 }
  //   ],
  //   themeColor: '#74CB48',
  //   onBack: () => console.log('Go back'),
  //   onPrevious: () => console.log('Previous Pokemon'),
  //   onNext: () => console.log('Next Pokemon')
  // };
  
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:id" element={<PokemonDetailPage/>} />
          </Routes>
        </BrowserRouter>
      </PokemonProvider>
    </QueryClientProvider>
  )
}

export default App
