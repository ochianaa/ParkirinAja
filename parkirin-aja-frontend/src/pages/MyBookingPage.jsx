import { FaCalendarAlt, FaTag, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import bookingService from '../api/BookingService';

const getStatusInfo = (status) => {
    switch (status) {
        case 'completed':
            return { icon: <FaCheckCircle />, color: 'text-green-500', text: 'Completed' };
        case 'pending':
            return { icon: <FaHourglassHalf />, color: 'text-yellow-500', text: 'Pending' };
        case 'cancelled':
            return { icon: <FaTimesCircle />, color: 'text-red-500', text: 'Cancelled' };
        default:
            return { icon: '', color: 'text-gray-500', text: 'Unknown' };
    }
};

const MyBookingPage = () => {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingService.getMyBookings();
                setBookings(response.data.data);
            } catch (err) {
                setError('Failed to fetch your bookings. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <div className="p-10 text-center">Loading your bookings...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">{error}</div>;
    }

    return (
        <div id="mybookings" className="min-h-screen bg-slate-100 py-15">
            <div className="container mx-auto px-6">
                <div className="w-full max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 pb-10">My Bookings</h2>
                    
                    {bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.map((booking) => {
                                const statusInfo = getStatusInfo(booking.status);
                                return (
                                    <Link to={`/my-bookings/${booking.booking_id}`} key={booking.booking_id} className="block">
                                        <div className="bg-slate-800 text-white p-6 pl-8 pr-8 rounded-lg shadow-lg shadow-black/50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">booking.garage.name</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-300 mt-2 pl-5">
                                                    <span className="flex items-center gap-2"><FaCalendarAlt /> {new Date(booking.start_time).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-2"><FaTag /> Rp {Number(booking.total_price).toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>
                                            <div className={`mt-4 sm:mt-0 flex items-center gap-2 font-semibold ${statusInfo.color}`}>
                                                {statusInfo.icon}
                                                <span>{statusInfo.text}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">You have no bookings yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookingPage