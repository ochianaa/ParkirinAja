import logo from '../assets/LogoBiruGold.png'

const Navbar = () => {
    return (
        <header className='bg-white shadow-sm'>
            <nav className='container mx-auto px-26 py-4 flex justify-between items-center'>
                <div>
                    <img src={logo} alt="Parkirin Aja" className='h-12 w-auto' />
                </div>

                <div className='hidden md:flex items-center space-x-6'>
                    <a href="#" className='text-gray-600 hover:font-bold'>Home</a>
                    <a href="#"className='text-gray-600 hover:font-bold'>Find Garages</a>
                    <a href="#"className='text-gray-600 hover:font-bold'>How It Works</a>
                    <a href="#"className='text-gray-600 hover:font-bold'>Contact</a>
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