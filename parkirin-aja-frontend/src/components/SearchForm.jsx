import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const SearchForm = () => {
    const [location, setLocation] = useState(''); 
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?location=${location}`);
    };

    return (
        <div className='w-full flex justify-center'>
            <form onSubmit={handleSearch} className="bg-white text-gray-700 p-8 w-5/6 rounded-xl shadow-lg">
                <div className='flex flex-row gap-4 mb-6'>

                    <div className='w-full'>
                        <label className='block text-left text-sm font-bold mb-2'>Location</label>
                        <div className='relative'>
                            <FaMapMarkerAlt className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'/>
                            <input type="text" placeholder='Enter city or address' className='w-full border rounded-lg py-2 pl-10 pr-3' value={location}
                                onChange={(e) => setLocation(e.target.value)}/>
                        </div>
                    </div>

                    {/* <div className='w-full'>
                        <label className='block text-left text-sm font-bold mb-2'>Check In</label>
                        <div className='relative'>
                            <FaCalendarAlt className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'/>
                            <input type="text" placeholder='dd/mm/yyyy' className='w-full border rounded-lg py-2 pl-10 pr-3'/>
                        </div>
                    </div>

                    <div className='w-full'>
                        <label className='block text-left text-sm font-bold mb-2'>Check Out</label>
                        <div className='relative'>
                            <FaCalendarAlt className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'/>
                            <input type="text" placeholder='dd/mm/yyyy' className='w-full border rounded-lg py-2 pl-10 pr-3'/>
                        </div>
                    </div> */}

                    <div className='w-fit flex items-end'>
                        <button type="submit" className='bg-slate-800 text-white w-full py-2 px-20 border rounded-lg hover:bg-transparent hover:text-gray-600 flex items-center justify-center gap-2'>
                            <FaSearch />
                            Search
                        </button>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default SearchForm