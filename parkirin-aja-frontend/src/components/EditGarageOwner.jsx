import { useState, useEffect } from 'react';
import garageService from '../api/GarageService';

const EditGarageOwner = ({ isOpen, onClose, garage, onGarageUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        pricePerHour: '',
        status: 'available',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (garage) {
            setFormData({
                name: garage.name || '',
                address: garage.address || '',
                description: garage.description || '',
                pricePerHour: garage.price_per_hour || '',
                status: garage.status || 'available',
            });
        }
    }, [garage]);

    if (!isOpen || !garage) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            pricePerHour: Number(formData.pricePerHour),
        };

        try {
            await garageService.updateGarage(garage.garage_id, payload);
            onGarageUpdated();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update garage.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-2xl font-bold text-slate-800">Edit Garage</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full flex flex-col space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm text-left font-medium text-gray-700">Garage Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm text-left font-medium text-gray-700">Address</label>
                                <textarea id="address" name="address" rows="3" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"></textarea>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm text-left font-medium text-gray-700">Description</label>
                                <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"></textarea>
                            </div>
                            <div>
                                <label htmlFor="pricePerHour" className="block text-sm text-left font-medium text-gray-700">Price per Hour (Rp)</label>
                                <input type="number" id="pricePerHour" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
                            </div>
                             <div>
                                <label htmlFor="status" className="block text-sm text-left font-medium text-gray-700">Status</label>
                                <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3">
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

                    <div className="flex justify-end gap-4 pt-4 mt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGarageOwner;