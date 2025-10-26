import { useState, useEffect } from 'react';

const BookingPopUp = ({ isOpen, onClose, garage, onSubmit }) => {
    // State untuk setiap field di formulir
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [notes, setNotes] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    // Dapatkan tanggal dan waktu saat ini dalam format yang benar untuk atribut min
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const minDateTime = now.toISOString().slice(0, 16);

    // Hitung total harga secara otomatis saat waktu berubah
    useEffect(() => {
        if (startTime && endTime && garage) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const hours = (end - start) / 1000 / 60 / 60; // Hitung selisih jam
            if (hours > 0) {
                setTotalPrice(hours * garage.price_per_hour);
            } else {
                setTotalPrice(0);
            }
        }
    }, [startTime, endTime, garage]);

    // Jika modal tidak terbuka atau tidak ada data garasi, jangan render apa-apa
    if (!isOpen || !garage) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const bookingData = {
            garage_id: garage.garage_id,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            total_price: totalPrice,
            notes: notes,
        };
        onSubmit(bookingData); // Kirim data ke parent component
    };

    return (
        // Backdrop (lapisan gelap di belakang)
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={onClose}
        >
            {/* Konten Modal */}
            <div 
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"
                onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat konten diklik
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Book Garage</h2>
                        <p className="text-md text-gray-500">{garage.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-left font-medium text-gray-700">Start Time</label>
                            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" min={minDateTime} />
                        </div>
                        <div>
                            <label className="block text-sm text-left font-medium text-gray-700">End Time</label>
                            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" min={startTime || minDateTime} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-left font-medium text-gray-700">Notes (Optional)</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" placeholder="e.g., Need parking for business meeting" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"></textarea>
                    </div>

                    {/* Tampilan Total Harga */}
                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-700">Total Price:</span>
                            <span className="text-xl font-bold text-slate-800">
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                         <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-700">
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingPopUp;