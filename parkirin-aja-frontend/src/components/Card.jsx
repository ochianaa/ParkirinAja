import { FaHeart, FaRegHeart } from 'react-icons/fa'

const Card = ({ garage, isFavorited, onToggleFavorite, onCardClick, onBookNowClick }) => {
    const { garage_id, name, image, address, price_per_hour, status } = garage;

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
            case 'approved':
                return 'bg-green-500';
            case 'unavailable':
            case 'rejected':
                return 'bg-red-500';
            case 'featured':
                return 'bg-blue-500';
            case 'pending':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return(
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-90 hover:scale-110 transition-transform duration-300">
            <div className="relative">
                <div onClick={onCardClick} className="cursor-pointer">
                    <img className="w-full h-40 object-cover" src={image} alt={name} />
                </div>
                <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${getStatusColor(status)}`}>
                {status}
                </div>
                <button 
                    onClick={() => onToggleFavorite(garage_id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full cursor-pointer hover:bg-red-100 transition-colors"
                    >
                        {isFavorited ? (
                            <FaHeart className="w-4 h-4 text-red-500" />
                        ) : (
                            <FaRegHeart className="w-4 h-4 text-gray-600" />
                        )}
                </button>
            </div>

            <div className="p-4">
                <div onClick={onCardClick} className="mb-2 cursor-pointer">
                    <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">{address}</p>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold text-gray-900">
                        Rp {Number(price_per_hour).toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-gray-500"> /Hour</span>
                    </p>
                    <button onClick={(e) => {e.stopPropagation(); onBookNowClick(); }} className="bg-slate-800 text-white px-5 py-2 rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600"
                        disabled={status !== 'available'}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card