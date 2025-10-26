import Card from "../components/Card";
import { Fade } from "react-awesome-reveal"
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import GarageDetail from "../components/GarasiDetail";
import BookingPopUp from "../components/BookingPopUp";


const RecommendedGarages = ({ garagesData, favorites, onToggleFavorite }) => {

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingGarage, setBookingGarage] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGarage, setSelectedGarage] = useState(null)
    
    const { user } = useAuth();
    const navigate = useNavigate();

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
        <Fade direction="fade" duration={1000} triggerOnce fraction={0.3}>
          <section id='recommendedGarages' className="bg-gradient-to-b from-slate-200 to-white text-gray-800">
              <div className="mx-auto px-20 py-24 text-center border-l border-r border-gray-300">
                  <h1 className="text-5xl font-bold mb-6">Recomended Garages</h1>
                  <p className="text-xl text-gray-800 mb-15">Discover top-rated garage spaces in popular locations</p>

                  <div className="flex flex-wrap justify-center gap-8">
                      {garagesData.slice(0, 3).map(garage => (
                          <Card key={garage.garage_id} 
                            garage={garage}
                            isFavorited={favorites.includes(garage.garage_id)}
                            onToggleFavorite={onToggleFavorite}
                            onCardClick={() => handleOpenModal(garage)}
                            onBookNowClick={() => handleOpenBookingModal(garage)}
                          />
                      ))}
                  </div>
                  <div>
                    <button onClick={() => navigate('/all-garages')} className="bg-slate-800 text-white px-5 py-2 rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600 mt-10">
                        See More
                    </button>
                  </div>
              </div>
          </section>
        </Fade>

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
    )
}

export default RecommendedGarages