import FeaturedGarageSection from '../components/FeaturedGarageSection';
import { TypeAnimation } from 'react-type-animation';

const Home = () => {
    return (
        <section id='home' className="bg-gradient-to-b from-slate-900 to-blue-950 text-white">
            <div className="container mx-auto px-34 py-24 text-center">
                <TypeAnimation
                    sequence={[
                        'Find & Book Your Perfect Garage',
                        6000, '', 1000,
                    ]}
                    wrapper="h1"
                    speed={10}
                    className="text-5xl font-bold mb-6"
                    repeat={Infinity}
                />
                <p className="text-xl text-slate-300 mb-20">Discover secure, affordable garage spaces in your area. <br/> Book instantly and park with confidence.</p>
                <FeaturedGarageSection />
            </div>
        </section>
    )
}

export default Home