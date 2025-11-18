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

const dummyBookings = [
    { booking_id: 1, garage: { name: 'Garasi Aman Downtown' },start_time: "2025-10-20T10:00:00.000Z",total_price: "500000.00", status: 'completed' },
    { booking_id: 2, garage: { name: 'Parkir Ekspres Kuta' },start_time: "2025-10-25T14:00:00.000Z",total_price: "1000000.00", status: 'pending' },
    { booking_id: 3, garage: { name: 'Garasi Murah Meriah' }, start_time: "2025-09-15T09:00:00.000Z",total_price: "800000.00", status: 'cancelled' },
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

const dummyRequests = [
    { id: 1, renterName: 'Budi Santoso', garageName: 'Garasi Aman Downtown', dateRange: '20 Oct - 22 Oct 2025', amount: 15000 },
    { id: 2, renterName: 'Citra Lestari', garageName: 'Parkir Ekspres Kuta', dateRange: '25 Oct - 26 Oct 2025', amount: 20000 },
    { id: 3, renterName: 'Agus Wijaya', garageName: 'Garasi Aman Downtown', dateRange: '01 Nov - 03 Nov 2025', amount: 30000 },
];

const dummyTransactions = [
    { id: 1, date: '22 Oct 2025', bookingId: 'BK-000001', amount: 500000, status: 'Completed' },
    { id: 2, date: '18 Oct 2025', bookingId: 'BK-000002', amount: 750000, status: 'Completed' },
    { id: 3, date: '15 Sep 2025', bookingId: 'BK-000003', amount: 800000, status: 'Cancelled' },
];

const dummyUsers = [
    { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'renter', status: 'Active' },
    { id: 2, name: 'Citra Lestari', email: 'citra@example.com', role: 'owner', status: 'Active' },
    { id: 3, name: 'Agus Wijaya', email: 'agus@example.com', role: 'renter', status: 'Banned' },
];

const dummyGarages = [
    { id: 1, name: 'Garasi Aman Downtown', owner: 'Citra Lestari', status: 'Approved' },
    { id: 2, name: 'Garasi Baru Menteng', owner: 'Eko Pratama', status: 'Pending' },
    { id: 3, name: 'Parkir Murah Tebet', owner: 'Fajar Nugraha', status: 'Rejected' },
];

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
          <Route path="/mybookings" element={<MyBookingPage dummyBookings={dummyBookings} />} />
          <Route path="/mybookings/:id" element={<BookingDetailPage />} />
        </Route>

        {/* === Rute Khusus Owner === */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/my-garages" element={<MyGaragesOwnerPage />} />
          <Route path="/owner/requests" element={<BookingRequestsPage dummyRequests={dummyRequests} />} />
          <Route path="/owner/reports" element={<ReportsPage dummyTransactions={dummyTransactions} />} />
        </Route>

        {/* === Rute Khusus Admin === */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagementPage dummyUsers={dummyUsers} />} />
          <Route path="/admin/garages" element={<GarageManagementPage dummyGarages={dummyGarages} />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App
