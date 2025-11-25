import { FaMapMarkerAlt, FaTag } from 'react-icons/fa';

const FeaturedGarageCard = ({ garage }) => {
    const { name, image_url, address, price_per_hour, status } = garage;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-xs mx-auto hover:scale-105 transition-transform duration-300">
            <img className="w-full h-30 object-cover" src={image_url} alt={name} />
            <div className="p-4">
                <div className='flex flex-col justify-center items-center'>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mb-3">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" /> {address}
                    </p>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                    <p className="text-lg font-bold text-gray-900 flex items-center">
                        <FaTag className="mr-2 text-gray-500" /> Rp {Number(price_per_hour).toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-gray-500">/hour</span>
                    </p>
                    {status === 'featured' && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Featured
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedGarageCard;