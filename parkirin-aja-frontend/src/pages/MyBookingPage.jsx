import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTag, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

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

const MyBookingPage = ({ dummyBookings }) => {
    return (
        <div id="mybookings" className="min-h-screen bg-slate-100 py-12">
            <div className="container mx-auto px-6">
                <div className="w-full max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 pb-4">My Bookings</h2>
                    
                    {dummyBookings.length > 0 ? (
                        <div className="space-y-4">
                            {dummyBookings.map((booking) => {
                                const statusInfo = getStatusInfo(booking.status);
                                return (
                                    <Link to={`/my-bookings/${booking.id}`} key={booking.id} className="block">
                                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800">{booking.garageName}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                                    <span className="flex items-center gap-2"><FaCalendarAlt /> {booking.date}</span>
                                                    <span className="flex items-center gap-2"><FaTag /> Rp {booking.total.toLocaleString('id-ID')}</span>
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