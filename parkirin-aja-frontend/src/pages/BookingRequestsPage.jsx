const BookingRequestsPage = ({ dummyRequests }) => {
    return (
        <div className="bg-slate-100 py-12 min-h-screen">
            <div className="container mx-auto px-45">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Booking Requests</h1>
                
                {dummyRequests.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md">
                        <ul className="divide-y divide-gray-200">
                            {dummyRequests.map((request) => (
                                <li key={request.id} className="px-10 flex flex-row justify-between items-start ">
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
                                                <p className="text-md font-bold text-gray-700 mt-2">Rp {request.amount.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 self-end sm:self-center">
                                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200">
                                            Reject
                                        </button>
                                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm hover:bg-green-200">
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