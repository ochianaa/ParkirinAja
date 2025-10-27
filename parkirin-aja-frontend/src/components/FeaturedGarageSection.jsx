import { useState, useEffect } from 'react';
import FeaturedGarageCard from '../components/FeaturedGarageCard';
import garageService from '../api/GarageService';

const FeaturedGarageSection = () => {
    const [featuredGarages, setFeaturedGarages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedGarages = async () => {
            try {
                const response = await garageService.getAllGarages();
                const featured = response.data.filter(g => g.status === 'featured');
                setFeaturedGarages(featured);
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
    if (featuredGarages.length === 0) {
        return null; // Jangan tampilkan section jika tidak ada garasi featured
    }

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