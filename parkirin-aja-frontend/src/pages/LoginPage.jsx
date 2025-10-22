import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthService from '../api/AuthService';

const LoginPage = () => {

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await AuthService.login(formData);
            
            login(response.data.user, response.data.token);

            const userRole = response.data.user.role;
            if (userRole === 'renter') {
                navigate('/features');
            } else if (userRole === 'owner') {
                navigate('/owner/dashboard');
            } else if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    
    return (
        <div className="h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Welcome Back!</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='flex items-start flex-col'>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                        />
                    </div>
                    <div className='flex items-start flex-col'>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full p-3 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600"
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-slate-800 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage