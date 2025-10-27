import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../api/AuthService';
import SuccessRegisterPopUp from '../components/SuccessRegisterPopUp';

const RegisterPage = () => {

    const [role, setRole] = useState('renter');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isSuccessPopUpOpen, setIsSuccessPopUpOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const payload = { ...formData, role };

        try {
            await authService.register(payload);

            setIsSuccessPopUpOpen(true);    
            // navigate('/login');

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClosePopUpAndNavigate = () => {
        setIsSuccessPopUpOpen(false);
        navigate('/login');
    };


    return (
        <>
            <div className="h-screen flex items-center justify-center bg-slate-100 py-12">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Create an Account</h2>
                    
                    <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-200 rounded-lg">
                        <button type="button" onClick={() => setRole('renter')} className={`py-2 rounded-md transition-all ${role === 'renter' ? 'bg-slate-800 text-white shadow' : 'text-gray-600'}`}>
                            Renter
                        </button>
                        <button type="button" onClick={() => setRole('owner')} className={`py-2 rounded-md transition-all ${role === 'owner' ? 'bg-slate-800 text-white shadow' : 'text-gray-600'}`}>
                            Owner
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="username" type="text" placeholder="Username" required className="w-full p-3 border border-gray-300 rounded-lg" value={formData.username} onChange={handleChange} />
                        <input name="email" type="email" placeholder="Email" required className="w-full p-3 border border-gray-300 rounded-lg" value={formData.email} onChange={handleChange} />
                        <input name="password" type="password" placeholder="Password" required className="w-full p-3 border border-gray-300 rounded-lg" value={formData.password} onChange={handleChange} />
                        <input name="phoneNumber" type="tel" placeholder="Phone Number" required className="w-full p-3 border border-gray-300 rounded-lg" value={formData.phoneNumber} onChange={handleChange} />
                        <textarea name="address" placeholder="Address" required rows="2" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.address} onChange={handleChange} ></textarea>
                        
                        <button type="submit" className="w-full p-3 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-slate-800 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <SuccessRegisterPopUp 
                isOpen={isSuccessPopUpOpen}
                onClose={handleClosePopUpAndNavigate}
            />
        </>
    );
};

export default RegisterPage;