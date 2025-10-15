const Card = ({ garage }) => {
    const { name, image, address, price_per_hour, status } = garage;

    return(
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-80 hover:scale-110 transition-transform duration-300">
            <div className="relative">
                <img className="w-full h-40 object-cover" src={image} alt={name} />
                <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}>
                {status}
                </div>
            </div>

            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">{address}</p>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold text-gray-900">
                        Rp {Number(price_per_hour).toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                    <button className="bg-slate-800 text-white px-5 py-2 rounded-lg font-semibold border hover:bg-transparent hover:text-gray-600"
                        disabled={status !== 'available'}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card