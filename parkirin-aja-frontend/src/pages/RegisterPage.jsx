import { Link } from 'react-router-dom';

const RegisterPage = () => {

    const activeRole = 'renter'

    return (
        <div className="h-screen flex items-center justify-center bg-slate-100 py-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Create an Account</h2>
                
                <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-200 rounded-lg">
                    <button type="button" className={`py-2 rounded-md transition-all ${activeRole === 'renter' ? 'bg-slate-800 text-white shadow' : 'text-gray-600'}`}>
                        Renter
                    </button>
                    <button type="button" className={`py-2 rounded-md transition-all ${activeRole === 'owner' ? 'bg-slate-800 text-white shadow' : 'text-gray-600'}`}>
                        Owner
                    </button>
                </div>

                <form className="space-y-4">
                    <input name="username" type="text" placeholder="Username" required className="w-full p-3 border border-gray-300 rounded-lg" />
                    <input name="email" type="email" placeholder="Email" required className="w-full p-3 border border-gray-300 rounded-lg" />
                    <input name="password" type="password" placeholder="Password" required className="w-full p-3 border border-gray-300 rounded-lg" />
                    <input name="phone_number" type="tel" placeholder="Phone Number" required className="w-full p-3 border border-gray-300 rounded-lg" />
                    <textarea name="address" placeholder="Address" required rows="2" className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
                    
                    <button type="submit" className="w-full p-3 bg-slate-800 text-white rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600">
                        Create Account
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-slate-800 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;