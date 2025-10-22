
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PokemonDetailPage } from './pages/PokemonDetailPage';
import { PokemonProvider } from './context/PokemonContext';
import { FavoritesProvider } from '@context/FavoritesContext';
import { Favorites } from '@pages/Favorites';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <PokemonProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </PokemonProvider>
    </QueryClientProvider>
  )
}

export default App
