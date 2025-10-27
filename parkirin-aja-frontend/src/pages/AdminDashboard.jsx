import AdminService from "../api/AdminService";
import garageService from "../api/GarageService";
import bookingService from "../api/BookingService";
import { useEffect, useState } from "react";

const AdminDashboard = () => {

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalGarages, setTotalGarages] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [userResponse, garageResponse, bookingResponse] = await Promise.all([
                    AdminService.getAllUsers(),
                    garageService.getAllGarages(),
                    bookingService.getAllBookingsForAdmin()
                ]);

                const userCount = userResponse.data.data.users.length;
                setTotalUsers(userCount);

                const garageCount = garageResponse.data.length;
                setTotalGarages(garageCount);

                const bookingCount = bookingResponse.data.data.length;
                setTotalBookings(bookingCount);

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
                    <p className="text-3xl font-bold text-white mt-2">Rp 1.2M</p>
                </div>
            </div>

            {/* Placeholder for charts */}
            <div className="mt-8 p-6 bg-white rounded-sm border shadow-lg">
                <h3 className="font-bold text-lg">User Growth Chart</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                    [Chart will be displayed here]
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;