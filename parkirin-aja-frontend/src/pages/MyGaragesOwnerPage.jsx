import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import AddGarageOwner from '../components/AddGarageOwner';
import EditGarageOwner from '../components/EditGarageOwner';
import OwnerGarageCard from '../components/OwnerGarageCard';
import garageService from '../api/GarageService';

const MyGaragesPage = () => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingGarage, setEditingGarage] = useState(null);
    const [garages, setGarages] = useState([]);

    const fetchGarages = async () => {
        try {
            const response = await garageService.getMyGarages();
            setGarages(response.data);
        } catch (error) {
            console.error('Failed to fetch garages:', error);
        }
    };

    useEffect(() => {
        fetchGarages();
    }, []);

    const handleGarageAdded = () => {
        fetchGarages();
        setIsAddModalOpen(false);
    };

    const handleEdit = (garage) => {
        setEditingGarage(garage);
        setIsEditModalOpen(true);
    };

    const handleGarageUpdated = () => {
        setIsEditModalOpen(false);
        setEditingGarage(null);
        fetchGarages();
    };

    const handleDelete = async (garageId) => {
        if (window.confirm('Are you sure you want to delete this garage?')) {
            try {
                await garageService.deleteGarage(garageId);
                fetchGarages();
            } catch (error) {
                console.error('Failed to delete garage:', error);
                alert('Failed to delete garage. It might have active bookings.');
            }
        }
    };

    return (
        <>
            <div className="bg-slate-100 py-12 min-h-screen">
                <div className='container mx-auto px-45'>         
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">My Garages</h1>
                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700">
                            <FaPlus /> Add New Garage
                        </button>
                    </div>

                    <div className="grid gap-x-6 gap-y-6 md:grid-cols-3">
                        {garages.map((garage) => (
                            <OwnerGarageCard 
                                key={garage.garage_id}
                                garage={garage}
                                onEdit={() => handleEdit(garage)}
                                onDelete={() => handleDelete(garage.garage_id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <AddGarageOwner 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onGarageAdded={handleGarageAdded}
            />

            {editingGarage && (
                <EditGarageOwner 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    garage={editingGarage}
                    onGarageUpdated={handleGarageUpdated}
                />
            )}
        </>        
    );
};

export default MyGaragesPage;