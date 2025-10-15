import logo from '../assets/LogoBiruGold.png'
import { NavHashLink as Link } from 'react-router-hash-link'

const Navbar = () => {

    const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  }

    return (
        <header id='navbar' className='bg-white shadow-sm sticky top-0 z-50'>
            <nav className='container mx-auto px-26 py-4 flex justify-between items-center'>
                <div>
                    <img src={logo} alt="Parkirin Aja" className='h-12 w-auto' />
                </div>

                <div className='hidden md:flex items-center space-x-6'>
                    <Link to="/#home" smooth scroll={scrollWithOffset} className='text-gray-600 hover:font-bold'>Home</Link>
                    <Link to="/#findGarages" smooth scroll={scrollWithOffset} className='text-gray-600 hover:font-bold'>Find Garages</Link>
                    <Link to="/favorites" className='text-gray-600 hover:font-bold'>Favorites</Link>
                    <Link to="/#howItWorks" smooth scroll={scrollWithOffset} className='text-gray-600 hover:font-bold'>How It Works</Link>
                    <Link to="/#contact" smooth scroll={scrollWithOffset} className='text-gray-600 hover:font-bold'>Contact</Link>
                </div>

                <div className='flex items-center space-x-3'>
                    <a href="#" className='text-gray-600 hover:font-bold'>Sign In</a>
                    <a href="#" className='text-white bg-slate-800 px-5 py-2 border-2 rounded-lg hover:text-gray-600 hover:font-semibold hover:bg-transparent'>Sign Up</a>
                </div>
            </nav>
        </header>
    )
}

export default Navbar