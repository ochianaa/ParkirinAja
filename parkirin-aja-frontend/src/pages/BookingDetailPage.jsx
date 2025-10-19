import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BookingDetailPage = ({ dummyBookingDetails }) => {

    const renderActionButtons = () => {
        switch (dummyBookingDetails.status) {
            case 'pending':
                return (
                    <>
                        <button type="button" className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200">
                            Cancel Booking
                        </button>
                        <button type="submit" className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600">
                            Proceed to Payment
                        </button>
                    </>
                );
            case 'completed':
                return (
                    <button type="button" className="w-full px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700">
                        Write a Review
                    </button>
                );
            case 'cancelled':
                return <p className="text-red-500 font-semibold">This booking has been cancelled.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <div className="container mx-auto px-6">
                <div className="w-full max-w-4xl mx-auto">
                    <Link to="/bookings" className="flex items-center gap-2 text-slate-600 font-semibold mb-4 hover:text-slate-800">
                        <FaArrowLeft /> Back to My Bookings
                    </Link>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <img src={dummyBookingDetails.garage.image} alt={dummyBookingDetails.garage.name} className="w-full h-64 object-cover" />
                        <div className="p-8">
                            {/* Header */}
                            <div className="border-b pb-4 mb-6">
                                <h2 className="text-3xl font-bold text-slate-800">{dummyBookingDetails.garage.name}</h2>
                                <p className="text-md text-gray-500 mt-1">{dummyBookingDetails.garage.address}</p>
                            </div>

                            {/* Booking Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md">
                                <div>
                                    <h4 className="font-semibold text-gray-500">Booking ID</h4>
                                    <p className="text-slate-800 font-bold">BK-{dummyBookingDetails.id.toString().padStart(6, '0')}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500">Status</h4>
                                    <p className="text-slate-800 font-bold capitalize">{dummyBookingDetails.status}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500">Start Time</h4>
                                    <p className="text-slate-800 font-bold">{dummyBookingDetails.startTime}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500">End Time</h4>
                                    <p className="text-slate-800 font-bold">{dummyBookingDetails.endTime}</p>
                                </div>
                            </div>
                            
                            {/* Total Price */}
                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-slate-800">Total Price</h3>
                                    <p className="text-2xl font-bold text-slate-800">Rp {dummyBookingDetails.totalPrice.toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                                {renderActionButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailPage;