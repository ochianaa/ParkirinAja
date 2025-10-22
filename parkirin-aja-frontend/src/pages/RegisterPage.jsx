import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/AuthService';

const RegisterPage = () => {

    const [role, setRole] = useState('renter');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        address: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const payload = { ...formData, role };

        try {
            const response = await authService.register(payload);
            
            // Langsung loginkan setelah berhasil registrasi
            login(response.data.user, response.data.token);

            // Arahkan ke halaman yang sesuai
            navigate(role === 'owner' ? '/owner/dashboard' : '/');
            
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
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
                    <input name="phone_number" type="tel" placeholder="Phone Number" required className="w-full p-3 border border-gray-300 rounded-lg" value={formData.phone_number} onChange={handleChange} />
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
    );
};

export default RegisterPage;