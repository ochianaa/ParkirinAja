import { FaSearch, FaCalendarCheck, FaCar } from 'react-icons/fa';

const HowItWorks = () => {
    return(
        <section className='bg-gradient-to-t from-slate-100 to-white text-gray-800'>
            <div className='mx-auto px-20 py-20 text-center border-l border-r border-gray-300'>
                <h1 className='text-5xl font-bold mb-6 text-slate-800'>How It Works</h1>
                <p className='text-xl text-gray-800 mb-15'>Simple steps to secure your parking space</p>
            
                <div className='flex flex-row gap-10'>
                    <div className='flex flex-col items-center gap-5'>
                        <div className='bg-slate-800 text-white rounded-full w-16 h-16 flex items-center justify-center'>
                            <FaSearch size={32}/>
                        </div>
                        <h2 className='font-bold text-xl'>Search & Filter</h2>
                        <p>Find garage spaces in your desired location using our smart search and filtering system.</p>
                    </div>

                    <div className='flex flex-col items-center gap-5'>
                        <div className='bg-slate-800 text-white rounded-full w-16 h-16 flex items-center justify-center'>
                            <FaCalendarCheck size={32}/>
                        </div>
                        <h2 className='font-bold text-xl'>Book Instantly</h2>
                        <p>Select your dates and book your preferred garage space with instant confirmation.</p>
                    </div>

                    <div className='flex flex-col items-center gap-5'>
                        <div className='bg-slate-800 text-white rounded-full w-16 h-16 flex items-center justify-center'>
                            <FaCar size={32}/>
                        </div>
                        <h2 className='font-bold text-xl'>Park Securely</h2>
                        <p>Arrive at your booked garage and park with confidence knowing your space is secured.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks