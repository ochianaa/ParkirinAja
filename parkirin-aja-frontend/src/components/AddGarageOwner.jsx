import { useState } from 'react';
import { FaImage } from 'react-icons/fa';

const AddGarageOwner = ({ isOpen, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl" // Lebarkan modal sedikit
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Add New Garage</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                
                <form>
                    <div className="flex flex-col md:flex-row gap-8">

                        <div className="w-full md:w-1/3">
                            <label className="block text-sm text-left font-medium text-gray-700">Garage Photo</label>
                            <div className="mt-1 flex justify-center items-center p-2 border-2 border-gray-300 border-dashed rounded-md w-full aspect-video">
                                <div className="space-y-1 text-center flex flex-col justify-center">
                                    {preview ? (
                                        <div>
                                            <img src={preview} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-cover" />
                                            <button type="button" onClick={handleRemoveImage} className="mt-2 text-sm text-red-600 hover:underline">
                                                Remove Image
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-slate-600 hover:text-slate-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>


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
                                <label className="block text-sm text-left font-medium text-gray-700">Price per Hour (Rp)</label>
                                <input type="number" placeholder="e.g., 50000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
                            </div>
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
    );
};

export default AddGarageOwner;