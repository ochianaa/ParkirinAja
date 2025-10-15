import { NavHashLink as Link } from 'react-router-hash-link'

const FindGarages = () => {
    return(
        <section id='findGarages' className="bg-gradient-to-t from-slate-900 to-blue-950 text-white mx-auto px-20 py-20">
            <div className="flex flex-col items-center gap-10">
                <div>
                    <h1 className="font-bold text-4xl mb-5">Ready to Find Your Perfect Garage?</h1>
                    <p>Join thousands of satisfied customers who trust ParkirinAja for their parking needs.</p>
                </div>
                <div className="flex flex-row gap-4 w-100">
                    <div className='w-full flex items-end'>
                        <Link to="/#home"  className='bg-white text-slate-800 font-semibold w-full py-2 px-4 border rounded-lg hover:bg-transparent hover:text-white flex items-center justify-center gap-2'>
                            Start Searching
                        </Link>
                    </div>
                    <div className='w-full flex items-end'>
                        <button className='bg-slate text-white font-semibold w-full py-2 px-4 border rounded-lg hover:bg-white hover:text-slate-800 flex items-center justify-center gap-2'>
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FindGarages