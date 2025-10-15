import Card from "../components/Card"

const FavoritesPage = ({ garagesData, favorites, onToggleFavorite }) => {

  const favoritedGarages = garagesData.filter(garage => favorites.includes(garage.garage_id))

  return (
    <section id="favorites" className="bg-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-slate-800 mb-10">Your Favorite Garages</h1>
        
        {favoritedGarages.length === 0 ? (
          <p className="text-gray-500 mt-10">You haven't favorited any garages yet.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {favoritedGarages.map(garage => (
              <Card 
                key={garage.garage_id}
                garage={garage}
                isFavorited={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FavoritesPage