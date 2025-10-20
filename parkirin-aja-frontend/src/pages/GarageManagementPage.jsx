const GarageManagementPage = () => {
    return (
        <div className="min-h-screen bg-slate-100 py-15 px-35">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Garage Management</h1>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Garage Name</th>
                            <th className="p-4 font-semibold text-sm">Owner</th>
                            <th className="p-4 font-semibold text-sm">Status</th>
                            <th className="p-4 font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {dummyGarages.map((garage) => (
                            <tr key={garage.id}>
                                <td className="p-4 font-semibold">{garage.name}</td>
                                <td className="p-4 text-gray-600">{garage.owner}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        garage.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        garage.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {garage.status}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button className="text-sm font-semibold text-green-600 hover:underline">Approve</button>
                                    <button className="text-sm font-semibold text-red-600 hover:underline">Reject</button>
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