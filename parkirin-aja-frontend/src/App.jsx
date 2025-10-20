import { useState } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import FavoritesPage from './pages/FavoritePage'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router-dom'

const garagesData = [
  {
    garage_id: 1,
    image: 'https://i.pinimg.com/1200x/ae/c4/91/aec491f1daa8ebe64c208ae7264778c0.jpg',
    name: 'Garasi Aman Downtown',
    address: 'Jl. Jenderal Sudirman No. 12, Jakarta Pusat',
    description: 'Garasi indoor yang aman dengan penjagaan 24 jam.',
    price_per_hour: 500000,
    status: 'available',
  },
  {
    garage_id: 2,
    image: 'https://i.pinimg.com/736x/ba/52/95/ba52956eeeb1db46940bcf15495f1a7d.jpg',
    name: 'Parkir Ekspres Kuta',
    address: 'Jl. Pantai Kuta No. 8, Kuta, Bali',
    description: 'Lokasi strategis dekat pantai, cocok untuk wisatawan.',
    price_per_hour: 1000000,
    status: 'available',
  },
  {
    garage_id: 3,
    image: 'https://i.pinimg.com/736x/c0/b8/a8/c0b8a8f6977fccf7b041b06746face56.jpg',
    name: 'Garasi Murah Meriah',
    address: 'Jl. Cihampelas No. 160, Bandung',
    description: 'Pilihan hemat untuk parkir harian di pusat perbelanjaan.',
    price_per_hour: 800000,
    status: 'unavailable',
  },
];


function App() {

  const [favorites, setFavorites] = useState([]);

  const handleToggleFavorite = (garageId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(garageId)) {
        return prevFavorites.filter((id) => id !== garageId);
      } else {
        return [...prevFavorites, garageId];
      }
    });
  };

  return (
    <div className='font-sans'>
      <Navbar/>
      <Routes>
        <Route path="/" 
          element={
            <HomePage 
              garagesData={garagesData}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          } 
        />
        <Route path="/favorites" 
          element={
            <FavoritesPage 
              garagesData={garagesData}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          } 
        />
      </Routes>
    </div>
  )
}

export default App
