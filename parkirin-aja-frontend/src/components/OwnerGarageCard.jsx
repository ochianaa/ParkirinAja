import { FaEdit, FaTrash } from 'react-icons/fa';

const OwnerGarageCard = ({ garage, onEdit, onDelete }) => {

    const { image, name, status, address, price_per_hour } = garage;

    const statusColor = status === 'available' ? 'text-green-600' : 'text-red-600';

    return(
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-90 hover:scale-105 transition-transform duration-300">
            <div className="relative">
                <div className="cursor-pointer">
                    <img className="w-full h-40 object-cover" src={image} alt={name} />
                </div>
            </div>

            <div className="p-5">
                <div className="cursor-pointer">
                    <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                </div>
                <div className='mb-3'>
                    <p className='text-sm font-normal text-gray-700'>{address}</p>
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