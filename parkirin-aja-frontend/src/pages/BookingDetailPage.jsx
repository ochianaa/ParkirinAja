import { FaArrowLeft } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import bookingService from '../api/BookingService';
import garageService from '../api/GarageService';
import SuccessPopUp from '../components/SuccessPopUp';

const BookingDetailPage = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const bookingRes = await bookingService.getMyBookingById(id);
                const bookingData = bookingRes.data;

                const garageRes = await garageService.getGarageById(bookingData.garage_id);
                const garageData = garageRes.data;

                setBooking({ ...bookingData, garage: garageData });

            } catch (err) {
                setError('Failed to load booking details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const handleCancelBooking = async () => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        setIsCancelling(true);
        setCancelError(null);
        try {
            await bookingService.cancelBooking(id);
            setBooking(prevBooking => ({ ...prevBooking, status: 'cancelled' }));
            alert('Booking cancelled successfully.');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to cancel booking.';
            setCancelError(message);
            alert(message);
            console.error(err);
        } finally {
            setIsCancelling(false);
        }
    };

    const handlePayment = async () => {
        setIsPaying(true);
        setPaymentError(null);
        try {
            const response = await bookingService.startPayment(id);
            const updatedBookingData = response.data.data;
            setBooking(prevBooking => ({ ...prevBooking, ...updatedBookingData }));
            setShowSuccessPopup(true); // Show custom popup
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to process payment.';
            setPaymentError(message);
            alert(message);
            console.error(err);
        } finally {
            setIsPaying(false);
        }
    };

    const renderActionButtons = () => {
        if (!booking) return null;

        switch (booking.status) {
            case 'pending':
                return (
                    <>
                        <div className="flex flex-col items-end">
                            <div className="flex gap-4">
                                <button 
                                    type="button" 
                                    className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 disabled:opacity-50"
                                    onClick={handleCancelBooking}
                                    disabled={isCancelling || isPaying}
                                >
                                    {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                                </button>
                                <button 
                                    type="button" 
                                    className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600 disabled:opacity-50"
                                    onClick={handlePayment}
                                    disabled={isPaying || isCancelling}
                                >
                                    {isPaying ? 'Processing...' : 'Proceed to Payment'}
                                </button>
                            </div>
                            {cancelError && <p className="text-red-500 text-sm mt-2">{cancelError}</p>}
                            {paymentError && <p className="text-red-500 text-sm mt-2">{paymentError}</p>}
                        </div>
                    </>
                );
            case 'completed':
                return (
                    <button type="button" className="w-full px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700">
                        Write a Review
                    </button>
                );
            case 'cancelled':
                return <p className="text-red-500 font-semibold">This booking has been cancelled.</p>;
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-100 py-12 text-center">Loading details...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-slate-100 py-12 text-center text-red-500">{error}</div>;
    }

    if (!booking) {
        return <div className="min-h-screen bg-slate-100 py-12 text-center">Booking not found.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <SuccessPopUp 
                isOpen={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                title="Payment Successful!"
                message="Your booking has been confirmed and paid."
                buttonText="OK"
            />
            <div className="container mx-auto px-6">
                <div className="w-full max-w-4xl mx-auto">
                    <Link to="/mybookings" className="flex items-center gap-2 text-slate-600 font-semibold mb-4 hover:text-slate-800">
                        <FaArrowLeft /> Back to My Bookings
                    </Link>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <img src={booking.garage.image} alt={booking.garage.name} className="w-full h-64 object-cover" />
                        <div className="p-8">
                            <div className="border-b pb-4 mb-6">
                                <h2 className="text-3xl font-bold text-slate-800">{booking.garage.name}</h2>
                                <p className="text-md text-gray-500 mt-1">{booking.garage.address}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md">
                                <div>
                                    <h4 className="font-semibold text-gray-500">Booking ID</h4>
                                    <p className="text-slate-800 font-bold">BK-{booking.booking_id.toString().padStart(6, '0')}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500">Status</h4>
                                    <p className="text-slate-800 font-bold capitalize">{booking.status}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500">Start Time</h4>
                                    <p className="text-slate-800 font-bold">{new Date(booking.start_time).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500">End Time</h4>
                                    <p className="text-slate-800 font-bold">{new Date(booking.end_time).toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-slate-800">Total Price</h3>
                                    <p className="text-2xl font-bold text-slate-800">Rp {Number(booking.total_price).toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                                {renderActionButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailPage;