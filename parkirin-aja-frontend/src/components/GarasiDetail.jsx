import { FaHeart, FaRegHeart } from 'react-icons/fa';

const GarageDetail = ({ garage, onClose, isFavorited, onToggleFavorite }) => {

    if (!garage) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative">
                {/* Tombol Tutup */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                
                <img className="w-full h-64 object-cover rounded-t-xl" src={garage.image_url} alt={garage.name} />
                
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{garage.name}</h2>
                            <p className="text-md text-gray-500">{garage.address}</p>
                        </div>
                        <button 
                            onClick={() => onToggleFavorite(garage.garage_id)}
                            className="p-2 rounded-full hover:bg-red-100 transition-colors"
                        >
                            {isFavorited ? (
                                <FaHeart className="w-6 h-6 text-red-500" />
                            ) : (
                                <FaRegHeart className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>

                    <p className="text-gray-700 mb-6">{garage.description || 'No description available.'}</p>

                    <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-gray-900">
                            Rp {Number(garage.price_per_hour).toLocaleString('id-ID')}
                            <span className="text-lg font-normal text-gray-500">/month</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GarageDetail;