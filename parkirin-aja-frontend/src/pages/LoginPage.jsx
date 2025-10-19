import { Link } from 'react-router-dom'

const LoginPage = () => {
    return (
        <div className="h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Welcome Back!</h2>
                <form className="space-y-4">
                    <div className='flex items-start flex-col'>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                        />
                    </div>
                    <div className='flex items-start flex-col'>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full p-3 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600"
                    >
                        Sign In
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-slate-800 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage