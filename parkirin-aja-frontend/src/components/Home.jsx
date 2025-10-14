import SearchForm from './SearchForm'

const Home = () => {
    return (
        <section className="bg-gradient-to-b from-slate-900 to-blue-950 text-white">
            <div className="container mx-auto px-34 py-24 text-center">
                <h1 className="text-5xl font-bold mb-6">Find & Book Your Perfect Garage</h1>
                <p className="text-xl text-slate-300">Discover secure, affordable garage spaces in your area. <br/> Book instantly and park with confidence.</p>
            <SearchForm />
            </div>
        </section>
    )
}

export default Home