import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import OwnerGarageCard from '../components/OwnerGarageCard';

const MyGaragesPage = ({ garagesData }) => {

    const handleEdit = (garageId) => {
        alert(`Edit button clicked for garage ID: ${garageId}`);
    };

    const handleDelete = (garageId) => {
        if (window.confirm('Are you sure you want to delete this garage?')) {
            alert(`Delete button clicked for garage ID: ${garageId}`);
        }
    };

    return (
        <div className="mx-auto bg-slate-100 py-6 px-10 md:px-20 lg:px-32">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">My Garages</h1>
                <Link to="/owner/garages/form" className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700">
                    <FaPlus /> Add New Garage
                </Link>
            </div>

            {/* 2. Gunakan .map() pada 'garagesData' */}
            <div className="grid gap-6 md:grid-cols-2">
                {garagesData.map((garage) => (
                    <OwnerGarageCard 
                        // 3. Ganti key dari garage.id menjadi garage.garage_id
                        key={garage.garage_id}
                        garage={garage}
                        onEdit={() => handleEdit(garage.garage_id)}
                        onDelete={() => handleDelete(garage.garage_id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyGaragesPage;