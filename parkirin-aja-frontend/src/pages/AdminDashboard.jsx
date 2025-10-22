const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-slate-100 py-15 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Platform Analytics</h1>

            {/* --- Kartu Statistik --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                    <p className="text-3xl font-bold mt-2">1,250</p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Garages</h3>
                    <p className="text-3xl font-bold mt-2">350</p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                    <p className="text-3xl font-bold mt-2">5,400</p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-3xl font-bold mt-2">Rp 1.2B</p>
                </div>
            </div>

            {/* Placeholder for charts */}
            <div className="mt-8 p-6 bg-white rounded-lg border">
                <h3 className="font-bold text-lg">User Growth Chart</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                    [Chart will be displayed here]
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;