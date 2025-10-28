import { useState, useEffect } from 'react';
import garageService from '../api/GarageService';
import bookingService from '../api/BookingService';
import Card from '../components/Card';
import BookingPopUp from '../components/BookingPopUp';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GarageDetail from '../components/GarasiDetail';
import DisplayReviewsPopUp from '../components/DisplayReviewsPopUp';

const AllGaragesPage = ({ favorites, onToggleFavorite }) => {
    const [garages, setGarages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingGarage, setBookingGarage] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGarage, setSelectedGarage] = useState(null)

    const [isReviewPopupOpen, setReviewPopupOpen] = useState(false);
    const [popupReviews, setPopupReviews] = useState([]);
    const [popupGarageName, setPopupGarageName] = useState('');

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

    const handleRatingClick = async (garage) => {
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/reviews/garage/${garage.garage_id}`);
            if (response.ok) {
                const data = await response.json();
                setPopupReviews(data.data.reviews || []);
                setPopupGarageName(garage.name);
                setReviewPopupOpen(true);
            }
        } catch (error) {
            console.error('Failed to fetch reviews for popup', error);
        }
    };

    const handleCloseReviewPopup = () => {
        setReviewPopupOpen(false);
        setPopupReviews([]);
        setPopupGarageName('');
    };

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

    const handleOpenModal = (garage) => {
        setSelectedGarage(garage)
        setIsModalOpen(true)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedGarage(null)
    };

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
                                isFavorited={favorites.includes(garage.garage_id)}
                                onToggleFavorite={() => onToggleFavorite(garage.garage_id)}
                                onCardClick={() => handleOpenModal(garage)}
                                onBookNowClick={() => handleBookNowClick(garage)}
                                onRatingClick={() => handleRatingClick(garage)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <GarageDetail
                garage={selectedGarage}
                onClose={handleCloseModal}
                isFavorited={selectedGarage && favorites.includes(selectedGarage.garage_id)}
                onToggleFavorite={onToggleFavorite}
            />

            <BookingPopUp 
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                garage={bookingGarage}
                onSubmit={handleConfirmBooking}
            />

            <DisplayReviewsPopUp 
                isOpen={isReviewPopupOpen}
                reviews={popupReviews} 
                onClose={handleCloseReviewPopup} 
                garageName={popupGarageName} 
            />
        </>
    );
};

export default AllGaragesPage;
