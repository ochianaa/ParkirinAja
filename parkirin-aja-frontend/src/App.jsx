import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import FavoritesPage from './pages/FavoritePage'
import HomePage from './pages/HomePage'
import SearchResultsPage from './pages/SearchResultsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import MyBookingPage from './pages/MyBookingPage'
import BookingDetailPage from './pages/BookingDetailPage'
import OwnerDashboard from './pages/OwnerDashboard'
import MyGaragesOwnerPage from './pages/MyGaragesOwnerPage'
import BookingRequestsPage from './pages/BookingRequestsPage'
import ReportsPage from './pages/ReportsPage'
import AdminDashboard from './pages/AdminDashboard'
import UserManagementPage from './pages/UserManagementPage'
import GarageManagementPage from './pages/GarageManagementPage'
import AllGaragesPage from './pages/AllGarages.jsx'
import ProtectedRoute from './router/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import garageService from './api/GarageService'


function App() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && user.role === 'renter') {
        try {
          const response = await garageService.getFavorites();
          setFavorites(response.data.map(fav => fav.garage_id));
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      } else {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (garageId) => {
    try {
      if (favorites.includes(garageId)) {
        await garageService.removeFavorite(garageId);
        setFavorites(prevFavorites => prevFavorites.filter(id => id !== garageId));
      } else {
        await garageService.addFavorite(garageId);
        setFavorites(prevFavorites => [...prevFavorites, garageId]);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      alert("Failed to update favorite status. Please try again.");
    }
  };

  return (
    <div className='font-sans'>
      {/* Navbar sekarang dinamis, tidak perlu diubah */}
      <Navbar/> 
      
      <Routes>
        {/* === Rute Publik (Bisa diakses semua orang) === */}
        <Route path="/" element={<HomePage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/search" element={<SearchResultsPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/all-garages" element={<AllGaragesPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* === Rute yang Butuh Login (Semua Role) === */}
        <Route element={<ProtectedRoute allowedRoles={['renter', 'owner', 'admin']} />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* === Rute Khusus Renter === */}
        <Route element={<ProtectedRoute allowedRoles={['renter']} />}>
          <Route path="/favorites" element={<FavoritesPage onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/mybookings" element={<MyBookingPage />} />
          <Route path="/mybookings/:id" element={<BookingDetailPage />} />
        </Route>

        {/* === Rute Khusus Owner === */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner/dashboard" />
          <Route path="/owner/my-garages" />
          <Route path="/owner/requests" />
          <Route path="/owner/reports" />
        </Route>

        {/* === Rute Khusus Admin === */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" />
          <Route path="/admin/users" />
          <Route path="/admin/garages" />
        </Route>

      </Routes>
    </div>
  )
}

export default App
