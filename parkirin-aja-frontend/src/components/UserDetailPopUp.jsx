// src/components/UserDetailModal.jsx
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';

const UserDetailPopUp = ({ isOpen, onClose, user }) => {

    if (!isOpen || !user) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={onClose}
        >
            {/* Konten Modal */}
            <div 
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">User Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <FaUser className="text-gray-400" />
                        <div className='flex flex-col items-start'>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-semibold">{user.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaEnvelope className="text-gray-400" />
                        <div className='flex flex-col items-start'>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaPhone className="text-gray-400" />
                        <div className='flex flex-col items-start'>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-semibold">{user.phoneNumber || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <div className='flex flex-col items-start'>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-semibold text-left">{user.address || 'Not provided'}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <FaShieldAlt className="text-gray-400" />
                        <div className='flex flex-col items-start'>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="font-semibold capitalize">{user.roles.join(', ')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaCalendarAlt className="text-gray-400" />
                        <div className='flex flex-col items-start'>
                            <p className="text-sm text-gray-500">Joined On</p>
                            <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPopUp;