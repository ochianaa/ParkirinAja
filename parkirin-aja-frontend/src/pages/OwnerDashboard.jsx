import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
    return (
        <div className="mx-auto bg-slate-100 py-6 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>

            {/* --- Kartu Statistik --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue (This Month)</h3>
                    <p className="text-3xl font-bold mt-2">Rp 15.000.000</p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
                    <p className="text-3xl font-bold mt-2">5</p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Active Garages</h3>
                    <p className="text-3xl font-bold mt-2">3</p>
                </div>
            </div>

            {/* --- Permintaan Booking Terbaru --- */}
            <div className="rounded-lg border bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Recent Booking Requests</h3>
                    <Link to="/owner/requests" className="text-sm font-semibold text-slate-800 hover:underline">View All</Link>
                </div>
                <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Budi Santoso</p>
                            <p className="text-sm text-gray-500">Garasi Aman Downtown</p>
                        </div>
                        <span className="text-sm font-medium text-gray-600">20 Oct - 22 Oct</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Citra Lestari</p>
                            <p className="text-sm text-gray-500">Parkir Ekspres Kuta</p>
                        </div>
                        <span className="text-sm font-medium text-gray-600">25 Oct - 26 Oct</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default OwnerDashboard;