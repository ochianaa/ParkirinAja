import Card from "../components/card";

const garagesData = [
  {
    garage_id: 1,
    image: 'https://i.pinimg.com/1200x/ae/c4/91/aec491f1daa8ebe64c208ae7264778c0.jpg',
    name: 'Garasi Aman Downtown',
    address: 'Jl. Jenderal Sudirman No. 12, Jakarta Pusat',
    description: 'Garasi indoor yang aman dengan penjagaan 24 jam.',
    price_per_hour: 500000,
    status: 'available',
  },
  {
    garage_id: 2,
    image: 'https://i.pinimg.com/736x/ba/52/95/ba52956eeeb1db46940bcf15495f1a7d.jpg',
    name: 'Parkir Ekspres Kuta',
    address: 'Jl. Pantai Kuta No. 8, Kuta, Bali',
    description: 'Lokasi strategis dekat pantai, cocok untuk wisatawan.',
    price_per_hour: 1000000,
    status: 'available',
  },
  {
    garage_id: 3,
    image: 'https://i.pinimg.com/736x/c0/b8/a8/c0b8a8f6977fccf7b041b06746face56.jpg',
    name: 'Garasi Murah Meriah',
    address: 'Jl. Cihampelas No. 160, Bandung',
    description: 'Pilihan hemat untuk parkir harian di pusat perbelanjaan.',
    price_per_hour: 800000,
    status: 'unavailable',
  },
];


const RecommendedGarages = () => {
    return (
        <section className="bg-gradient-to-b from-slate-200 to-white text-gray-800">
            <div className="mx-auto px-20 py-24 text-center border-l border-r border-gray-300">
                <h1 className="text-5xl font-bold mb-6">Recomended Garages</h1>
                <p className="text-xl text-gray-800 mb-15">Discover top-rated garage spaces in popular locations</p>

                <div className="flex flex-wrap justify-center gap-8">
                    {garagesData.map(garage => (
                        <Card key={garage.id} garage={garage} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default RecommendedGarages