import { useState } from 'react';
import { FaImage } from 'react-icons/fa'; // Ikon untuk placeholder
import garageService from '../api/GarageService';

const AddGarageOwner = ({ isOpen, onClose, onGarageAdded }) => {
    
    // State untuk form, dengan 'image_url'
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        pricePerHour: '',
        image_url: '', // Tambahkan image_url
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

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
            await garageService.createGarage(payload);
            onGarageAdded(); 
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add garage.');
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
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Add New Garage</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* --- Kolom Kiri (Input Gambar) --- */}
                        <div className="w-full md:w-1/3">
                            <label htmlFor="image_url" className="block text-sm text-left font-medium text-gray-700">Garage Photo URL</label>
                            <input type="text" id="image_url" name="image_url" placeholder='https://example.com/image.png'
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" 
                                value={formData.image_url}
                                onChange={handleChange}
                            />
                            {/* Preview Gambar */}
                            <div className="mt-2 w-full aspect-video bg-gray-50 rounded-md flex justify-center items-center border border-gray-200">
                                {formData.image_url ? (
                                    <img src={formData.image_url} alt="Garage Preview" className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <FaImage className="mx-auto h-12 w-12" />
                                        <p className="mt-2 text-sm">Image preview</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- Kolom Kanan (Detail Garasi) --- */}
                        <div className="w-full md:w-2/3 flex flex-col space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm text-left font-medium text-gray-700">Garage Name</label>
                                <input type="text" id="name" name="name" placeholder='Garage name'
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" 
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm text-left font-medium text-gray-700">Address</label>
                                <textarea id="address" name="address" rows="3"  placeholder='input garage address'
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
                                    value={formData.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm text-left font-medium text-gray-700">Description</label>
                                <textarea id="description" name="description" rows="4" placeholder='input dercriptions here'
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="pricePerHour" className="block text-sm text-left font-medium text-gray-700">Price per Hour (Rp)</label>
                                <input type="number" id="pricePerHour" name="pricePerHour"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
                                    value={formData.pricePerHour}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Garage'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGarageOwner;