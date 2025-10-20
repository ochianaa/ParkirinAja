import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';

const ProfilePage = () => {

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <div className="container mx-auto px-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 pb-4">My Profile</h2>
                    
                    <form className="space-y-6">
                        <div className="relative flex items-start flex-col">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                            <FaUser className="absolute top-10 left-3 text-gray-400" />
                            <input
                                type="text"
                                defaultValue="ochianaa"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                            />
                        </div>
                        <div className="relative flex items-start flex-col">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <FaEnvelope className="absolute top-10 left-3 text-gray-400" />
                            <input
                                type="email"
                                defaultValue="ochiana@example.com"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                            />
                        </div>
                        <div className="relative flex items-start flex-col">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                            <FaPhone className="absolute top-10 left-3 text-gray-400" />
                            <input
                                type="tel"
                                defaultValue="081234567890"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                            />
                        </div>
                        <div className="relative flex items-start flex-col">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                            <FaMapMarkerAlt className="absolute top-10 left-3 text-gray-400" />
                            <textarea
                                defaultValue="Jl. Raya Kuta No. 1, Denpasar, Bali"
                                rows="3"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                            ></textarea>
                        </div>
                        
                        <div className="flex justify-end items-center pt-4 border-t">

                            <div className="flex gap-4">
                                <button type="submit" className="px-6 py-2 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-800">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;