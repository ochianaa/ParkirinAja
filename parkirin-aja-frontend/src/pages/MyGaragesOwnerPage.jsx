import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';
import AddGarageOwner from '../components/AddGarageOwner';
import OwnerGarageCard from '../components/OwnerGarageCard';

const MyGaragesPage = ({ garagesData }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = (garageId) => {
        alert(`Edit button clicked for garage ID: ${garageId}`);
    };

    const handleDelete = (garageId) => {
        if (window.confirm('Are you sure you want to delete this garage?')) {
            alert(`Delete button clicked for garage ID: ${garageId}`);
        }
    };

    return (
        <>
            <div className="bg-slate-100 py-12 min-h-screen">
                <div className='container mx-auto px-45'>         
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">My Garages</h1>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700">
                            <FaPlus /> Add New Garage
                        </button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {garagesData.map((garage) => (
                            <OwnerGarageCard 
                                key={garage.garage_id}
                                garage={garage}
                                onEdit={() => handleEdit(garage.garage_id)}
                                onDelete={() => handleDelete(garage.garage_id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <AddGarageOwner 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>        
    );
};

export default MyGaragesPage;