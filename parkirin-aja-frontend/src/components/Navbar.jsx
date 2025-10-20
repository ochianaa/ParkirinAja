import logo from '../assets/LogoBiruGold.png'
import { NavHashLink as Link } from 'react-router-hash-link'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {

    const { user, logout } = useAuth();

    const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  }

    return (
        <header id='navbar' className='bg-white shadow-sm sticky top-0 z-50'>
            <nav className='container mx-auto px-6 md:px-20 py-4 flex justify-between items-center'>
                <div>
                    <img src={logo} alt="Parkirin Aja" className='h-12 w-auto' />
                </div>

                {/* --- Menu Navigasi Utama (Dinamis) --- */}
                <div className='hidden md:flex items-center space-x-6'>
                {/* Link untuk semua orang */}
                    <Link to="/#home" smooth scroll={scrollWithOffset} className='text-gray-600 hover:font-bold'>Home</Link>
                    <Link to="/#recommendedGarages" smooth scroll={scrollWithOffset} className='text-gray-600 hover:font-bold'>Recommended Garages</Link>
                    <Link to="/#howItWorks" smooth scroll={scrollWithOffset} className='text-gray-600 hover:font-bold'>How It Works</Link>
                
                {/* Link hanya untuk Renter & yang sudah login */}
                {user && user.role === 'renter' && (
                    <>
                        <Link to="/favorites" className='text-gray-600 hover:font-bold'>Favorites</Link>
                        <Link to="/mybookings" className='text-gray-600 hover:font-bold'>My Bookings</Link>
                    </>
                )}

                {/* Link hanya untuk Owner */}
                {user && user.role === 'owner' && (
                    <>
                        <Link to="/owner/dashboard" className='text-gray-600 hover:font-bold'>Dashboard</Link>
                        <Link to="/owner/my-garages" className='text-gray-600 hover:font-bold'>My Garages</Link>
                        <Link to="/owner/requests" className='text-gray-600 hover:font-bold'>Requests</Link>
                        <Link to="/owner/reports" className='text-gray-600 hover:font-bold'>Reports</Link>
                    </>
                )}
                
                {/* Link hanya untuk Admin */}
                {user && user.role === 'admin' && (
                    <>
                        <Link to="/admin/dashboard" className='text-gray-600 hover:font-bold'>Dashboard</Link>
                        <Link to="/admin/users" className='text-gray-600 hover:font-bold'>Users</Link>
                        <Link to="/admin/garages" className='text-gray-600 hover:font-bold'>Garages</Link>
                    </>
                )}

                    <Link to="/#contact" smooth scroll={scrollWithOffset} className='text-gray-600 hover:font-bold'>Contact</Link>
                </div>

                {/* --- Area Pengguna (Dinamis) --- */}
                <div className='flex items-center space-x-4'>
                {user ? (
                    <>
                        <Link to="/profile" className='font-semibold text-gray-700 hover:text-slate-800'>Hi, {user.name}!</Link>
                        <button onClick={logout} className='text-gray-600 hover:font-bold'>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className='text-gray-600 hover:font-bold'>Sign In</Link>
                        <Link to="/register" className='text-white bg-slate-800 px-5 py-2 rounded-lg hover:bg-slate-700'>Sign Up</Link>
                    </>
                )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar