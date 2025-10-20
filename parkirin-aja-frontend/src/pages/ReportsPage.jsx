// --- Data Contoh (Dummy Data) ---
const ReportsPage = ({ dummyTransactions }) => {
    return (
        <div className="min-h-screen bg-slate-100 py-15 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Reports</h1>
            
            {/* --- Ringkasan Laporan --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-3xl font-bold mt-2">Rp 35.000.000</p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Completed Bookings</h3>
                    <p className="text-3xl font-bold mt-2">25</p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="text-sm font-medium text-gray-500">Avg. Rating</h3>
                    <p className="text-3xl font-bold mt-2">4.8 ★</p>
                </div>
            </div>

            {/* --- Riwayat Transaksi --- */}
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Transaction History</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Date</th>
                            <th className="p-4 font-semibold text-sm">Booking ID</th>
                            <th className="p-4 font-semibold text-sm">Amount</th>
                            <th className="p-4 font-semibold text-sm">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {dummyTransactions.map((tx) => (
                            <tr key={tx.id}>
                                <td className="p-4">{tx.date}</td>
                                <td className="p-4 font-mono text-gray-600">{tx.bookingId}</td>
                                <td className="p-4">Rp {tx.amount.toLocaleString('id-ID')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsPage;