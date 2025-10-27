import AdminService from "../api/AdminService";
import garageService from "../api/GarageService";
import bookingService from "../api/BookingService";
import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

const AdminDashboard = () => {

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalGarages, setTotalGarages] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [userResponse, garageResponse, allBookingsResponse, analyticsResponse] = await Promise.all([
                    AdminService.getAllUsers(),
                    garageService.getAllGarages(),
                    bookingService.getAllBookingsForAdmin(), // Still needed for the chart
                    bookingService.getAdminAnalytics() // For summary cards
                ]);

                // Set user and garage counts
                setTotalUsers(userResponse.data.data.users.length);
                setTotalGarages(garageResponse.data.length);

                // Set summary data from analytics endpoint
                const summary = analyticsResponse.data.summary;
                setTotalBookings(summary.totalBookings);
                setTotalRevenue(summary.totalRevenue);

                // Process all bookings data for the chart
                const bookingsByDate = allBookingsResponse.data.data.reduce((acc, booking) => {
                    const date = new Date(booking.created_at).toISOString().split('T')[0];
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                const formattedChartData = Object.keys(bookingsByDate).map(date => ({
                    date,
                    bookings: bookingsByDate[date],
                })).sort((a, b) => new Date(a.date) - new Date(b.date));

                setChartData(formattedChartData);

            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);


    return (
        <div className="min-h-screen bg-slate-100 py-15 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-15">Platform Analytics</h1>

            {/* --- Kartu Statistik --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border-1 shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6 border-gray-300">
                    <h3 className="text-sm font-medium text-gray-300">Total Users</h3>
                    {loading ? (
                        <p className="text-3xl font-bold mt-2 text-gray-300">...</p>
                    ) : error ? (
                        <p className="text-sm font-bold mt-2 text-red-500">{error}</p>
                    ) : (
                        <p className="text-3xl font-bold text-white mt-2">{totalUsers.toLocaleString()}</p>
                    )}
                </div>
                <div className="rounded-lg border-1 shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6 border-gray-300">
                    <h3 className="text-sm font-medium text-gray-300">Total Garages</h3>
                    {loading ? (
                        <p className="text-3xl font-bold mt-2 text-gray-300">...</p>
                    ) : error ? (
                        <p className="text-sm font-bold mt-2 text-red-500">{error}</p>
                    ) : (
                        <p className="text-3xl font-bold text-white mt-2">{totalGarages.toLocaleString()}</p>
                    )}
                </div>
                <div className="rounded-lg border-1 shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6 border-gray-300">
                    <h3 className="text-sm font-medium text-gray-300">Total Bookings</h3>
                    {loading ? (
                        <p className="text-3xl font-bold mt-2 text-gray-300">...</p>
                    ) : error ? (
                        <p className="text-sm font-bold mt-2 text-red-500">{error}</p>
                    ) : (
                        <p className="text-3xl font-bold text-white mt-2">{totalBookings.toLocaleString()}</p>
                    )}
                </div>
                <div className="rounded-lg border-1 shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6 border-gray-300">
                    <h3 className="text-sm font-medium text-gray-300">Total Revenue</h3>
                    {loading ? (
                        <p className="text-3xl font-bold mt-2 text-gray-300">...</p>
                    ) : error ? (
                        <p className="text-sm font-bold mt-2 text-red-500">{error}</p>
                    ) : (
                        <p className="text-3xl font-bold text-white mt-2">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                    )}
                </div>
            </div>

            {/* Placeholder for charts */}
            <div className="mt-8 p-6 bg-white rounded-sm border shadow-lg">
                <h3 className="font-bold text-lg mb-4">Booking Trends</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="bookings" stroke="#1e293b" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;