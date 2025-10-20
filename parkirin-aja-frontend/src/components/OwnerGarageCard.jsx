import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import EditGarageOwner from './EditGarageOwner';

const OwnerGarageCard = ({ garage, onEdit, onDelete }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { image, name, status, price_per_hour } = garage;

    const statusColor = status === 'available' ? 'text-green-600' : 'text-red-600';

    return (
        <>   
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={image} alt={name} className="w-full h-40 object-cover" />
                <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-800">{name}</h3>
                    <p className={`text-sm font-semibold capitalize ${statusColor}`}>{status}</p>
                    <p className="text-md font-bold text-gray-900 mt-2">
                        Rp {Number(price_per_hour).toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-500 hover:text-blue-600" aria-label="Edit Garage">
                            <FaEdit />
                        </button>
                        <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-600" aria-label="Delete Garage">
                            <FaTrash />
                        </button>
                    </div>
                </div>
            </div>

            <EditGarageOwner 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
};

export default OwnerGarageCard;