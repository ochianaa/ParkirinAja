import { useEffect, useState } from "react";
import AdminService from "../api/AdminService";
import garageService from "../api/GarageService";

const GarageManagementPage = () => {
    const [garages, setGarages] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [garageRes, userRes] = await Promise.all([
                garageService.getAllGarages(),
                AdminService.getAllUsers(),
            ]);

            const usersMap = userRes.data.data.users.reduce((acc, user) => {
                acc[user.id] = user.username;
                return acc;
            }, {});

            setGarages(garageRes.data || []);
            setUsers(usersMap);

        } catch (err) {
            setError('Failed to load data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (garageId, status) => {
        try {
            await AdminService.updateGarageStatus(garageId, status);
            fetchData(); // Refresh data after update
        } catch (err) {
            alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-100 py-15 px-35">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-slate-100 py-15 px-35 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 py-15 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-15">Garage Management</h1>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-gray-300">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Garage Name</th>
                            <th className="p-4 font-semibold text-sm">Owner</th>
                            <th className="p-4 font-semibold text-sm">Status</th>
                            <th className="p-4 font-semibold text-sm text-center">Actions</th>
                            <th className="p-4 font-semibold text-sm">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {garages.map((garage) => (
                            <tr key={garage.garage_id}>
                                <td className="p-4 font-semibold">{garage.name}</td>
                                <td className="p-4 text-gray-600">{users[garage.owner_id] || 'Unknown'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        garage.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        garage.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        garage.status === 'featured' ? 'bg-purple-100 text-purple-800' :
                                        garage.status === 'available' ? 'bg-blue-100 text-blue-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {garage.status}
                                    </span>
                                </td>
                                <td className="py-4 flex gap-2">
                                    <button onClick={() => handleUpdateStatus(garage.garage_id, 'approved')} className="text-sm font-semibold text-green-600 hover:underline disabled:text-gray-400" disabled={garage.status === 'approved'}>Approve</button>
                                    <button onClick={() => handleUpdateStatus(garage.garage_id, 'rejected')} className="text-sm font-semibold text-red-600 hover:underline disabled:text-gray-400" disabled={garage.status === 'rejected'}>Reject</button>
                                    <button onClick={() => handleUpdateStatus(garage.garage_id, 'featured')} className="text-sm font-semibold text-purple-600 hover:underline disabled:text-gray-400" disabled={garage.status === 'featured'}>Feature</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GarageManagementPage;