import { useState, useEffect } from 'react';
import FeaturedGarageCard from '../components/FeaturedGarageCard';

const FeaturedGarageSection = () => {
    const [featuredGarages, setFeaturedGarages] = useState([
        {
            garage_id: 1,
            name: "Mall Parking Area",
            address: "Jl. Thamrin No. 456, Jakarta Pusat",
            description: "Covered parking area near shopping mall",
            price_per_hour: "12000.00",
            status: "featured",
            image: "https://images.unsplash.com/photo-1549726261-26c71ca53ff1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Contoh gambar
        },
        {
            garage_id: 2,
            name: "Central Business Garage",
            address: "Jl. Sudirman No. 123, Jakarta Selatan",
            description: "Modern parking facility in the CBD",
            price_per_hour: "20000.00",
            status: "featured",
            image: "https://images.unsplash.com/photo-1577969501569-826c7d2c388a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            garage_id: 3,
            name: "Airport Shuttle Parking",
            address: "Bandara Soekarno-Hatta, Tangerang",
            description: "Long-term parking with shuttle service to airport",
            price_per_hour: "15000.00",
            status: "available",
            image: "https://images.unsplash.com/photo-1582266858273-db66847d0577?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
    ]);

    // Jika Anda punya API, Anda akan menggunakan useEffect seperti ini:
    /*
    const [featuredGarages, setFeaturedGarages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedGarages = async () => {
            try {
                // Asumsi ada endpoint seperti '/garages/featured'
                const response = await garageService.getFeaturedGarages(); 
                setFeaturedGarages(response.data.data); // Sesuaikan path sesuai API Anda
            } catch (err) {
                setError('Failed to load featured garages.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedGarages();
    }, []);

    if (loading) return <div className="text-center py-8">Loading featured garages...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    */

    return (
        <section className="bg-slate-100 rounded-3xl py-10">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">Featured Garages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredGarages.map((garage) => (
                        <FeaturedGarageCard key={garage.garage_id} garage={garage} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedGarageSection;