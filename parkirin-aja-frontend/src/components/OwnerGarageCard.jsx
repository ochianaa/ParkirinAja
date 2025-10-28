import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const OwnerGarageCard = ({ garage, onEdit, onDelete }) => {

    const { garage_id, image, name, status, address, price_per_hour } = garage;
    const [ratingSummary, setRatingSummary] = useState({ averageRating: 0, totalReviews: 0 });

    useEffect(() => {
        const fetchReviews = async () => {
            if (!garage_id) return;
            try {
                const response = await fetch(`http://localhost:8080/api/bookings/reviews/garage/${garage_id}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.data && data.data.summary) {
                        setRatingSummary(data.data.summary);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            }
        };

        fetchReviews();
    }, [garage_id]);

    const statusColor = status === 'available' ? 'text-green-600' : 'text-red-600';

    return(
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-90 hover:scale-105 transition-transform duration-300">
            <div className="relative">
                <div className="cursor-pointer">
                    <img className="w-full h-40 object-cover" src={image} alt={name} />
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between text-left mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                        <p className="text-sm text-gray-700">{address}</p>
                    </div>

                    <div className="flex items-center gap-1 text-sm pt-1">
                        <span className="font-bold text-gray-800">{ratingSummary.averageRating > 0 ? Number(ratingSummary.averageRating).toFixed(1) : 'N/A'}</span>
                        <FaStar className="text-yellow-400" />
                        {ratingSummary.totalReviews > 0 && <span className="text-gray-500 text-xs ml-1">({ratingSummary.totalReviews})</span>}
                    </div>
                </div>
                <div>
                    <p className={`text-sm font-semibold capitalize ${statusColor}`}>{status}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold text-gray-900">
                        Rp {Number(price_per_hour).toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-gray-500"> /hour</span>
                    </p>
                    <div className="flex justify-center">
                        <button onClick={onEdit} className="p-1 text-gray-500 hover:text-blue-600" aria-label="Edit Garage">
                            <FaEdit className='h-6 w-6'/>
                        </button>
                        <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600" aria-label="Delete Garage">
                            <FaTrash className='h-6 w-6'/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerGarageCard