import { FaMapMarkerAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';

const SearchForm = () => {
    return (
        <div className="bg-white text-gray-700 p-8 rounded-xl shadow-lg shadow-cyan-800 w-full mt-20">
            <div className='flex flex-row gap-4 mb-6'>

                <div className='w-full'>
                    <label className='block text-left text-sm font-bold mb-2'>Location</label>
                    <div className='relative'>
                        <FaMapMarkerAlt className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'/>
                        <input type="text" placeholder='Enter city or address' className='w-full border rounded-lg py-2 pl-10 pr-3'/>
                    </div>
                </div>

                <div className='w-full'>
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
                </div>

                <div className='w-full flex items-end'>
                    <button className='bg-slate-800 text-white w-full py-2 px-4 border rounded-lg hover:bg-transparent hover:text-gray-600 flex items-center justify-center gap-2'>
                        <FaSearch />
                        Search
                    </button>
                </div>

            </div>
        </div>
    )
}

export default SearchForm