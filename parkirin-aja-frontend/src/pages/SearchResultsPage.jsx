import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Card from '../components/Card'
import SearchForm from '../components/SearchForm'
import GarageDetail from '../components/GarasiDetail'
import { useAuth } from '../context/AuthContext'
import BookingPopUp from '../components/BookingPopUp'


const SearchResultsPage = ({ favorites, onToggleFavorite, garagesData }) => {

    const [searchParams] = useSearchParams();
    const location = searchParams.get('location')?.toLowerCase() || '';

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGarage, setSelectedGarage] = useState(null)

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingGarage, setBookingGarage] = useState(null);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    const filteredGarages = garagesData.filter(garage => 
        garage.address.toLowerCase().includes(location) || 
        garage.name.toLowerCase().includes(location)
    );

    const handleOpenModal = (garage) => {
        setSelectedGarage(garage)
        setIsModalOpen(true)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedGarage(null)
    };

    // 3. Modifikasi fungsi ini untuk menambahkan validasi
    const handleOpenBookingModal = (garage) => {
        // Skenario 1: Pengguna belum login
        if (!user) {
            alert('You must be logged in to book a garage.');
            navigate('/login'); // Arahkan ke halaman login
            return; // Hentikan fungsi di sini
        }

        // Skenario 2: Pengguna sudah login, tapi bukan 'renter'
        if (user.role !== 'renter') {
            alert('Only renters can book a garage. Please log in with a renter account.');
            return; // Hentikan fungsi di sini
        }
        
        // Skenario 3: Pengguna sudah login dan rolenya 'renter' (sukses)
        setBookingGarage(garage);
        setIsBookingModalOpen(true);
    };

    const handleCloseBookingModal = () => {
        setIsBookingModalOpen(false);
        setBookingGarage(null);
    };
    
    const handleConfirmBooking = (bookingData) => {
        console.log("Booking data submitted:", bookingData);
        alert("Booking created successfully! (Check console for data)");
        handleCloseBookingModal();
    };

    return (
        <>
            <div className="container mx-auto py-5 px-26 min-h-screen">
                <SearchForm/>
                <h1 className="text-3xl font-bold mb-2 mt-15">Search Results</h1>
                <p className="text-gray-600 mb-8">
                    Showing results for: <span className="font-semibold">{searchParams.get('location')}</span>
                </p>

                {filteredGarages.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-lg text-gray-500">No garages found for this location.</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGarages.map(garage => (
                        <Card 
                            key={garage.garage_id}
                            garage={garage}
                            isFavorited={favorites.includes(garage.garage_id)}
                            onToggleFavorite={onToggleFavorite}
                            onCardClick={() => handleOpenModal(garage)}
                            onBookNowClick={() => handleOpenBookingModal(garage)}
                        />
                    ))}
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
                onClose={handleCloseBookingModal}
                garage={bookingGarage}
                onSubmit={handleConfirmBooking}
            />
        </> 
    );
};

export default SearchResultsPage