import { useState, useEffect } from 'react';
import Card from "../components/Card";
import garageService from '../api/GarageService';

const FavoritesPage = ({ onToggleFavorite }) => {
  const [favoritedGarages, setFavoritedGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await garageService.getFavorites();
        setFavoritedGarages(response.data || []);
      } catch (err) {
        setError('Failed to fetch favorites.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = (garageId) => {
    // Call the main toggle function from App.jsx
    onToggleFavorite(garageId);
    // Update the UI immediately
    setFavoritedGarages(prevGarages => prevGarages.filter(g => g.garage_id !== garageId));
  };

  if (loading) {
    return <div className="text-center py-24">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-center py-24 text-red-500">{error}</div>;
  }

  return (
    <section id="favorites" className="bg-slate-100 py-15 min-h-screen">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-15">Your Favorite Garages</h1>
        
        {favoritedGarages.length === 0 ? (
          <p className="text-gray-500 mt-10">You haven't favorited any garages yet.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {favoritedGarages.map(garage => (
              <Card 
                key={garage.garage_id}
                garage={garage}
                isFavorited={true} // Always true on this page
                onToggleFavorite={() => handleToggleFavorite(garage.garage_id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FavoritesPage