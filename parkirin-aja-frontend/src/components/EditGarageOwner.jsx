import { FaImage } from 'react-icons/fa';

const EditGarageOwner = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
                onClick={onClose}
            >
                <div 
                    className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl" // Lebarkan modal sedikit
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-slate-800">Edit Garage</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                    </div>
                    
                    <form>
                        <div className="w-full md:w-2/3 flex flex-col space-y-6">
                            <div>
                                <label className="block text-sm text-left font-medium text-gray-700">Garage Name</label>
                                <input type="text" placeholder="e.g., Garasi Modern Sudirman" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
                            </div>
                            <div>
                                <label className="block text-sm text-left font-medium text-gray-700">Address</label>
                                <textarea rows="3" placeholder="e.g., Jl. Jenderal Sudirman No. 12, Jakarta Pusat" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm text-left font-medium text-gray-700">Description</label>
                                <textarea rows="4" placeholder="Describe your garage..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm text-left font-medium text-gray-700">Price per Month (Rp)</label>
                                <input type="number" placeholder="e.g., 500000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">
                                Cancel
                            </button>
                            <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold border hover:text-gray-600 hover:bg-transparent">
                                Save Garage
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditGarageOwner;