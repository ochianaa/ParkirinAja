import { FaStar } from "react-icons/fa";
import { useState, useEffect } from 'react';
import bookingService from '../api/BookingService';

const ReportsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [summaryData, setSummaryData] = useState({ total_bookings: 0, total_income: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transactionsResponse, incomeResponse] = await Promise.all([
                    bookingService.getOwnerTransactions(),
                    bookingService.getOwnerIncome()
                ]);
                setTransactions(transactionsResponse.data.data);
                setSummaryData(incomeResponse.data.data);
            } catch (err) {
                setError('Failed to load reports data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 py-15 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-10">Reports</h1>
            
            {/* --- Ringkasan Laporan --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-15">
                <div className="rounded-lg border shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6">
                    <h3 className="text-sm font-medium">Completed Bookings</h3>
                    {loading ? <p className="text-3xl font-bold text-white mt-2">...</p> : <p className="text-3xl font-bold text-white mt-2">{summaryData.total_bookings}</p>}
                </div>
                <div className="rounded-lg border shadow-lg shadow-black/50 bg-slate-800 text-gray-300 p-6">
                    <h3 className="text-sm font-medium">Total Revenue</h3>
                    {loading ? <p className="text-3xl font-bold text-white mt-2">...</p> : <p className="text-3xl font-bold text-white mt-2">Rp {Number(summaryData.total_income).toLocaleString('id-ID')}</p>}
                </div>
            </div>

            {/* --- Riwayat Transaksi --- */}
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Transaction History</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-center">
                    <thead className="bg-slate-800 text-gray-300">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Date</th>
                            <th className="p-4 font-semibold text-sm">Booking ID</th>
                            <th className="p-4 font-semibold text-sm">Amount</th>
                            <th className="p-4 font-semibold text-sm">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="4" className="p-4 text-center text-red-500">{error}</td></tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.booking_id}>
                                    <td className="p-4">{new Date(tx.updated_at).toLocaleDateString()}</td>
                                    <td className="p-4 font-mono text-gray-600">{tx.booking_id}</td>
                                    <td className="p-4">Rp {Number(tx.total_price).toLocaleString('id-ID')}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                            tx.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {tx.payment_status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-4 text-center">No transactions found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsPage;