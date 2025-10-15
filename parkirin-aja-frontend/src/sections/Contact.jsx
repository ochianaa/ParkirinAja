import logo from '../assets/LogoParkirinAjaPutih.png'
import { NavHashLink as Link } from 'react-router-hash-link'

const Contact = () => {
    return(
        <section id='contact' className='bg-gray-950 text-slate-400'>
            <div className='mx-auto flex flex-col px-35 justify-center'>
                <div className="mx-auto w-full px-10 py-10 text-center flex flex-row border-b-1 border-b-gray-300">
                    <div className='w-full flex flex-col justify-start text-start gap-4'>
                        <div>
                            <img src={logo} alt="Parkirin Aja" className='h-14 w-auto' />
                        </div>
                        <p className='text-lg'>Find and book secure garage spaces in your area with ease.</p>
                    </div>

                    <div className='w-full flex flex-col justify-start text-center gap-2'>
                        <h2 className='text-white text-lg font-bold mb-2'>Company</h2>
                        <Link to="">About Us</Link>
                        <Link to="">Careers</Link>
                        <Link to="">Contact</Link>
                    </div>

                    <div className='w-full flex flex-col justify-start text-center gap-2'>
                        <h2 className='text-white text-lg font-bold mb-2'>Support</h2>
                        <Link to="">Help Center</Link>
                        <Link to="">Safety</Link>
                        <Link to="">Terms</Link>
                    </div>

                    <div className='w-full flex flex-col justify-start text-center gap-2'>
                        <h2 className='text-white text-lg font-bold mb-2'>Connect</h2>
                        <Link to="">Facebook</Link>
                        <Link to="">Twitter</Link>
                        <Link to="">Instagram</Link>
                    </div>
                </div>

                <div className='mx-auto px-20 py-5 text-center'>
                    <p>© 2025 ParkirinAja. All rights reserved.</p>
                </div>
            </div>
        </section>
    )
}

export default Contact