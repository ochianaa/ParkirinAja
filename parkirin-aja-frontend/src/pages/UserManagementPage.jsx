const UserManagementPage = ({ dummyUsers }) => {
    return (
        <div className="min-h-screen bg-slate-100 py-15 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">User Management</h1>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 font-semibold text-sm">User</th>
                            <th className="p-4 font-semibold text-sm">Role</th>
                            <th className="p-4 font-semibold text-sm">Status</th>
                            <th className="p-4 font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {dummyUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="p-4">
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </td>
                                <td className="p-4 capitalize">{user.role}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-sm font-semibold text-red-600 hover:underline">
                                        Ban User
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPage;