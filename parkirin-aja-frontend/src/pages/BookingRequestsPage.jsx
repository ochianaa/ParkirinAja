import { useState, useEffect } from 'react';
import bookingService from '../api/BookingService';
import garageService from '../api/GarageService';
import AdminService from '../api/AdminService';

const BookingRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [detailedRequests, setDetailedRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await bookingService.getBookingRequests();
                setRequests(response.data.data);
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            }
        };

        fetchRequests();
    }, []);

    useEffect(() => {
        const fetchDetailedRequests = async () => {
            if (requests.length > 0) {
                const detailed = [];
                for (const request of requests) {
                    try {
                        const user = await AdminService.getUserById(request.user_id);
                        const garage = await garageService.getGarageById(request.garage_id);
                        detailed.push({
                            ...request,
                            renterName: user.data.username,
                            garageName: garage.data.name,
                            dateRange: `${new Date(request.start_time).toLocaleDateString()} - ${new Date(request.end_time).toLocaleDateString()}`
                        });
                    } catch (error) {
                        console.error(`Failed to fetch details for request ${request.booking_id}`, error);
                        detailed.push({
                            ...request,
                            renterName: 'Unknown Renter',
                            garageName: 'Unknown Garage',
                            dateRange: `${new Date(request.start_time).toLocaleDateString()} - ${new Date(request.end_time).toLocaleDateString()}`
                        });
                    }
                }
                setDetailedRequests(detailed);
            }
            setLoading(false);
        };

        fetchDetailedRequests();
    }, [requests]);

    const handleConfirm = async (id) => {
        try {
            await bookingService.confirmBooking(id);
            setDetailedRequests(detailedRequests.filter(request => request.booking_id !== id));
            alert('Booking confirmed successfully!');
        } catch (error) {
            console.error('Error confirming booking:', error);
            alert('Failed to confirm booking.');
        }
    };

    const handleReject = async (id) => {
        try {
            await bookingService.rejectBooking(id);
            setDetailedRequests(detailedRequests.filter(request => request.booking_id !== id));
            alert('Booking rejected successfully!');
        } catch (error) {
            console.error('Error rejecting booking:', error);
            alert('Failed to reject booking.');
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-100 py-12 min-h-screen flex justify-center items-center">
                <p className="text-lg text-gray-500">Loading booking requests...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-100 py-12 min-h-screen">
            <div className="container mx-auto px-45">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Booking Requests</h1>
                
                {detailedRequests.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md">
                        <ul className="divide-y divide-gray-200">
                            {detailedRequests.map((request) => (
                                <li key={request.booking_id} className="px-10 flex flex-row justify-between items-start ">
                                    <div className="px-5 py-5 flex flex-row justify-center items-center gap-15">
                                        <div>
                                            <p className="font-semibold text-lg text-slate-800">{request.renterName}</p>
                                        </div>
                                        <div className="flex flex-row gap-10">
                                            <div>
                                                <p className="text-sm text-gray-500">{request.garageName}</p>
                                                <p className="text-sm text-gray-500 mt-1">{request.dateRange}</p>
                                            </div>
                                            <div className="">
                                                <p className="text-md font-bold text-gray-700 mt-2">Rp {parseFloat(request.total_price).toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 self-end sm:self-center">
                                        <button onClick={() => handleReject(request.booking_id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200">
                                            Reject
                                        </button>
                                        <button onClick={() => handleConfirm(request.booking_id)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm hover:bg-green-200">
                                            Confirm
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <p className="text-lg text-gray-500">No pending booking requests.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingRequestsPage;