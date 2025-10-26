import { useState, useEffect } from 'react';
import garageService from '../api/GarageService';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AllGaragesPage = () => {
    const [garages, setGarages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGarages = async () => {
            try {
                const response = await garageService.getAllGarages();
                setGarages(response.data || []);
            } catch (err) {
                setError('Failed to fetch garages.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGarages();
    }, []);

    const handleBookNowClick = (garage) => {
        if (!user) {
            alert('You must be logged in to book a garage.');
            navigate('/login');
            return;
        }
        if (user.role !== 'renter') {
            alert('Only renters can book a garage.');
            return;
        }
        // Navigate to booking page or open booking modal
        console.log('Book now for', garage);
    };

    if (loading) {
        return <div className="text-center py-24">Loading garages...</div>;
    }

    if (error) {
        return <div className="text-center py-24 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-slate-100 px-35 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-800 sm:text-3xl">
                        All Garages
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Find the perfect spot from our entire collection of garages.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {garages.map(garage => (
                        <Card 
                            key={garage.garage_id}
                            garage={garage}
                            isFavorited={false} // Placeholder
                            onToggleFavorite={() => console.log('Toggle favorite')} // Placeholder
                            onCardClick={() => console.log('Card clicked', garage)} // Placeholder
                            onBookNowClick={() => handleBookNowClick(garage)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllGaragesPage;
