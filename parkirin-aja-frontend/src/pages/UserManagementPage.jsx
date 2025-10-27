import { useEffect, useState } from "react";
import AdminService from "../api/AdminService";
import UserDetailPopUp from "../components/UserDetailPopUp";


const UserManagementPage = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await AdminService.getAllUsers();
                setUsers(response.data.data.users);
            } catch (err) {
                setError('Failed to fetch user data. Please ensure you are logged in as an admin.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsPopUpOpen(true);
    };

    const handleClosePopUp = () => {
        setIsPopUpOpen(false);
        setSelectedUser(null);
    };

    if (loading) return <div className="p-10">Loading users...</div>;
    if (error) return <div className="p-10 text-red-500">{error}</div>;


    return (
        <>
            <div className="min-h-screen bg-slate-100 py-15 px-35">
                <h1 className="text-3xl font-bold text-slate-800 mb-15">User Management</h1>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-center">
                        <thead className="bg-slate-800 text-gray-300">
                            <tr>
                                <th className="p-4 font-semibold text-sm">User</th>
                                <th className="p-4 font-semibold text-sm">Role</th>
                                <th className="p-4 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} onClick={() => handleRowClick(user)} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="p-4">
                                        <p className="font-semibold">{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </td>
                                    <td className="p-4 capitalize">{user.roles}</td>
                                    <td className="p-4">
                                        <button onClick={(e) => e.stopPropagation()} className="w-25 text-sm p-2 bg-red-500 text-white font-semibold rounded-lg border hover:bg-transparent hover:text-gray-600">
                                            Ban User
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <UserDetailPopUp 
                isOpen={isPopUpOpen}
                onClose={handleClosePopUp}
                user={selectedUser}
            />
        </>
    );
};

export default UserManagementPage;