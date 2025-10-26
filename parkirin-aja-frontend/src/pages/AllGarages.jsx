import { useState, useEffect } from 'react';
import garageService from '../api/GarageService';
import bookingService from '../api/BookingService';
import Card from '../components/Card';
import BookingPopUp from '../components/BookingPopUp';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AllGaragesPage = () => {
    const [garages, setGarages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingGarage, setBookingGarage] = useState(null);

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
        setBookingGarage(garage);
        setIsBookingModalOpen(true);
    };

    const handleConfirmBooking = async (bookingData) => {
        try {
            await bookingService.createBooking(bookingData);
            alert('Booking created successfully!');
            setIsBookingModalOpen(false);
            setBookingGarage(null);
        } catch (err) {
            alert(`Booking failed: ${err.response?.data?.message || err.message}`);
            console.error("Booking failed", err);
        }
    };

    if (loading) {
        return <div className="text-center py-24">Loading garages...</div>;
    }

    if (error) {
        return <div className="text-center py-24 text-red-500">{error}</div>;
    }

    return (
        <>
            <div className="bg-slate-100 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-15">
                        <h1 className="text-3xl font-bold text-slate-800 sm:text-3xl">
                            All Garages
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Browse all available garage spaces. Find the perfect spot for you.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {garages.filter(garage => garage.status !== 'rejected').map(garage => (
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

            <BookingPopUp 
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                garage={bookingGarage}
                onSubmit={handleConfirmBooking}
            />
        </>
    );
};

export default AllGaragesPage;
