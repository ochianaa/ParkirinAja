import { useState } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import FavoritesPage from './pages/FavoritePage'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router-dom'
import SearchResultsPage from './pages/SearchResultSPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import MyBookingPage from './pages/MyBookingPage'
import BookingDetailPage from './pages/BookingDetailPage'
import OwnerDashboard from './pages/OwnerDashboard'
import MyGaragesOwnerPage from './pages/MyGaragesOwnerPage'

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

const dummyBookings = [
    { id: 1, garageName: 'Garasi Aman Downtown', date: '20 Oct 2025', total: 500000, status: 'completed' },
    { id: 2, garageName: 'Parkir Ekspres Kuta', date: '25 Oct 2025', total: 1000000, status: 'pending' },
    { id: 3, garageName: 'Garasi Murah Meriah', date: '15 Sep 2025', total: 800000, status: 'cancelled' },
];

  const dummyBookingDetails = {
      id: 2,
      garage: {
          name: 'Parkir Ekspres Kuta',
          address: 'Jl. Pantai Kuta No. 8, Kuta, Bali',
          image: 'https://i.pinimg.com/736x/ba/52/95/ba52956eeeb1db46940bcf15495f1a7d.jpg',
      },
      startTime: '25 Oct 2025, 14:00',
      endTime: '26 Oct 2025, 14:00',
      totalPrice: 1000000,
      status: 'pending',
  };

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
        <Route path="/search" 
          element={
              <SearchResultsPage
                garagesData={garagesData}
                favorites={favorites} 
                onToggleFavorite={handleToggleFavorite} 
              />
          } 
        />
        <Route path="/login" 
          element={
              <LoginPage/>
          } 
        />
        <Route path="/register" 
          element={
              <RegisterPage/>
          } 
        />
        <Route path="/profile" 
          element={
              <ProfilePage/>
          } 
        />
        <Route path="/bookings"
          element={
              <MyBookingPage
                dummyBookings={dummyBookings}
              />
          } 
        />
        <Route path="/bookingdetails"
          element={
              <BookingDetailPage
                dummyBookingDetails={dummyBookingDetails}
              />
          } 
        />
        <Route path="/ownerdashboard"
          element={
              <OwnerDashboard/>
          } 
        />
        <Route path="/mygaragesowner"
          element={
              <MyGaragesOwnerPage
                garagesData={garagesData}
              />
          } 
        />
      </Routes>
    </div>
  )
}

export default App
