import { useState } from 'react'
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
import ProtectedRoute from './router/ProtectedRoute'

const garagesData = [
  {
    garage_id: 1,
    image: 'https://i.pinimg.com/1200x/ae/c4/91/aec491f1daa8ebe64c208ae7264778c0.jpg',
    name: 'Garasi Aman Downtown',
    address: 'Jl. Jenderal Sudirman No. 12, Jakarta Pusat',
    description: 'Garasi indoor yang aman dengan penjagaan 24 jam.',
    price_per_hour: 15000,
    status: 'available',
  },
  {
    garage_id: 2,
    image: 'https://i.pinimg.com/736x/ba/52/95/ba52956eeeb1db46940bcf15495f1a7d.jpg',
    name: 'Parkir Ekspres Kuta',
    address: 'Jl. Pantai Kuta No. 8, Kuta, Bali',
    description: 'Lokasi strategis dekat pantai, cocok untuk wisatawan.',
    price_per_hour: 20000,
    status: 'available',
  },
  {
    garage_id: 3,
    image: 'https://i.pinimg.com/736x/c0/b8/a8/c0b8a8f6977fccf7b041b06746face56.jpg',
    name: 'Garasi Murah Meriah',
    address: 'Jl. Cihampelas No. 160, Bandung',
    description: 'Pilihan hemat untuk parkir harian di pusat perbelanjaan.',
    price_per_hour: 30000,
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
      {/* Navbar sekarang dinamis, tidak perlu diubah */}
      <Navbar/> 
      
      <Routes>
        {/* === Rute Publik (Bisa diakses semua orang) === */}
        <Route path="/" element={<HomePage garagesData={garagesData} favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/search" element={<SearchResultsPage garagesData={garagesData} favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* === Rute yang Butuh Login (Semua Role) === */}
        <Route element={<ProtectedRoute allowedRoles={['renter', 'owner', 'admin']} />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* === Rute Khusus Renter === */}
        <Route element={<ProtectedRoute allowedRoles={['renter']} />}>
          <Route path="/favorites" element={<FavoritesPage garagesData={garagesData} favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/mybookings" element={<MyBookingPage dummyBookings={dummyBookings} />} />
          <Route path="/mybookings/:id" element={<BookingDetailPage />} />
        </Route>

        {/* === Rute Khusus Owner === */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/my-garages" element={<MyGaragesOwnerPage garagesData={garagesData} />} />
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
