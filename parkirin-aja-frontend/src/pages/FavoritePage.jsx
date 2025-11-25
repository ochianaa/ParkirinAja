import { useState, useEffect } from 'react';
import Card from "../components/Card";
import garageService from '../api/GarageService';
import bookingService from '../api/BookingService';
import BookingPopUp from '../components/BookingPopUp';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DisplayReviewsPopUp from '../components/DisplayReviewsPopUp';

const FavoritesPage = ({ onToggleFavorite }) => {
  const [favoritedGarages, setFavoritedGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingGarage, setBookingGarage] = useState(null);

  const [isReviewPopupOpen, setReviewPopupOpen] = useState(false);
  const [popupReviews, setPopupReviews] = useState([]);
  const [popupGarageName, setPopupGarageName] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await garageService.getFavorites();
        setFavoritedGarages(response.data || []);
      } catch (err) {
        setError('Failed to fetch favorites.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = (garageId) => {
    // Call the main toggle function from App.jsx
    onToggleFavorite(garageId);
    // Update the UI immediately
    setFavoritedGarages(prevGarages => prevGarages.filter(g => g.garage_id !== garageId));
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

  if (loading) {
    return <div className="text-center py-24">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-center py-24 text-red-500">{error}</div>;
  }

  return (
    <>
      <section id="favorites" className="bg-slate-100 py-15 min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-15">Your Favorite Garages</h1>
          
          {favoritedGarages.length === 0 ? (
            <p className="text-gray-500 mt-10">You haven't favorited any garages yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {favoritedGarages.map(garage => (
                <Card 
                  key={garage.garage_id}
                  garage={garage}
                  isFavorited={true} // Always true on this page
                  onToggleFavorite={() => handleToggleFavorite(garage.garage_id)}
                  onBookNowClick={() => handleBookNowClick(garage)}
                  onRatingClick={() => handleRatingClick(garage)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

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
  )
}

export default FavoritesPage