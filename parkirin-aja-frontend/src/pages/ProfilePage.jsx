import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import AuthService from '../api/AuthService';

const ProfilePage = () => {

    const { user, updateUser } = useAuth();

    const [ isEditing, setIsEditing ] = useState(false);
    const [ formData, setFormData ] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Di sini Anda akan memanggil API untuk menyimpan perubahan
        try {
            const response = await AuthService.updateProfile(formData);
            updateUser(response.data.data.user);
            alert('Profile updated successfully!');
            setIsEditing(false); // Kembali ke mode lihat setelah berhasil
            // Anda mungkin perlu memperbarui 'user' di AuthContext di sini
        } catch (error) {
            alert('Failed to update profile.');
        }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <div className="container mx-auto px-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 pb-4">My Profile</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative flex items-start flex-col">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                            <FaUser className="absolute top-10 left-3 text-gray-400" />
                            <input
                                name='username'
                                type='text'
                                value={formData.username}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                            />
                        </div>
                        <div className="relative flex items-start flex-col">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <FaEnvelope className="absolute top-10 left-3 text-gray-400" />
                            <input
                                name='email'
                                type='email'
                                value={formData.email}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                            />
                        </div>
                        <div className="relative flex items-start flex-col">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                            <FaPhone className="absolute top-10 left-3 text-gray-400" />
                            <input
                                name='phoneNumber'
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                            />
                        </div>
                        <div className="relative flex items-start flex-col">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                            <FaMapMarkerAlt className="absolute top-10 left-3 text-gray-400" />
                            <textarea
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                                readOnly={!isEditing}
                                rows="3"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 read-only:bg-gray-200 read-only:cursor-not-allowed"
                            ></textarea>
                        </div>
                        
                        <div className="flex justify-end items-center pt-4 border-t">

                            <div className="flex gap-4">
                                {isEditing ? (
                                    <>
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-6 py-2 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600">
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600">
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;