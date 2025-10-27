import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import bookingService from '../api/BookingService';
import garageService from '../api/GarageService';

const OwnerDashboard = () => {

    const [pendingCount, setPendingCount] = useState(0);
    const [activeGaragesCount, setActiveGaragesCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [bookingRequests, setBookingRequests] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingResponse, garageResponse, incomeResponse] = await Promise.all([
                    bookingService.getBookingRequests(),
                    garageService.getMyGarages(),
                    bookingService.getOwnerIncome()
                ]);

                const bookings = bookingResponse.data.data;
                const pendingBookings = bookings.filter(booking => booking.status === 'pending');
                setPendingCount(pendingBookings.length);

                // Sort bookings by most recent
                const sortedBookings = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setBookingRequests(sortedBookings);

                const activeGarages = garageResponse.data.filter(garage => garage.status !== 'rejected');
                setActiveGaragesCount(activeGarages.length);

                setTotalRevenue(incomeResponse.data.data.total_income);

            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const requestsToDisplay = showAll ? bookingRequests : bookingRequests.slice(0, 3);

    return (
        <div className="min-h-screen bg-slate-100 py-15 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>

            {/* --- Kartu Statistik --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="rounded-lg border-1 shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6 border-gray-300">
                    <h3 className="text-sm font-medium text-gray-300">Total Revenue</h3>
                    {loading ? (
                        <p className="text-3xl font-bold mt-2">...</p>
                    ) : error ? (
                        <p className="text-sm font-bold mt-2 text-red-500">{error}</p>
                    ) : (
                        <p className="text-3xl font-bold mt-2 text-white">Rp {Number(totalRevenue).toLocaleString('id-ID')}</p>
                    )}
                </div>
                <div className="rounded-lg border-1 shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6 border-gray-300">
                    <h3 className="text-sm font-medium text-gray-300">Pending Requests</h3>
                    {loading ? (
                        <p className="text-3xl font-bold mt-2">...</p>
                    ) : error ? (
                        <p className="text-sm font-bold mt-2 text-red-500">{error}</p>
                    ) : (
                        <p className="text-3xl font-bold mt-2 text-white">{pendingCount}</p>
                    )}
                </div>
                <div className="rounded-lg border-1 shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6 border-gray-300">
                    <h3 className="text-sm font-medium text-gray-300">Active Garages</h3>
                    {loading ? (
                        <p className="text-3xl font-bold mt-2">...</p>
                    ) : error ? (
                        <p className="text-sm font-bold mt-2 text-red-500">{error}</p>
                    ) : (
                        <p className="text-3xl font-bold mt-2 text-white">{activeGaragesCount}</p>
                    )}
                </div>
            </div>

            {/* --- Permintaan Booking Terbaru --- */}
            <div className="mt-15 rounded-lg border bg-white p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Recent Booking Requests</h3>
                    {bookingRequests.length > 3 && (
                        <button 
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm font-semibold text-slate-800 hover:underline"
                        >
                            {showAll ? 'Show Less' : 'View All'}
                        </button>
                    )}
                </div>
                <ul className="space-y-4">
                    {loading ? (
                        <p>Loading requests...</p>
                    ) : error ? (
                        <p className="text-red-500">Could not load requests.</p>
                    ) : requestsToDisplay.length > 0 ? (
                        requestsToDisplay.map(req => (
                            <li key={req.booking_id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-semibold">Booking ID: {req.booking_id}</p>
                                    <p className="text-sm text-gray-500">
                                        Status: <span className={`font-medium ${req.status === 'pending' ? 'text-yellow-500' : (req.status === 'completed' || req.status === 'confirmed') ? 'text-green-500' : (req.status === 'cancelled' || req.status === 'rejected') ? 'text-red-500' : 'text-gray-500'}`}>{req.status}</span>
                                    </p>
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                    {new Date(req.created_at).toLocaleDateString()}
                                </span>
                            </li>
                        ))
                    ) : (
                        <p>No booking requests found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default OwnerDashboard;