import { useState, useEffect } from 'react';
import Home from '../sections/Home';
import RecommendedGarages from '../sections/RecommendedGarages';
import HowItWorks from '../sections/HowItWorks';
import FindGarages from '../sections/FindGarages';
import Contact from '../sections/Contact';
import garageService from '../api/GarageService';

const HomePage = ({ favorites, onToggleFavorite }) => {
  const [garages, setGarages] = useState([]);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const response = await garageService.getAllGarages();
        setGarages(response.data || []);
      } catch (error) {
        console.error("Failed to fetch garages:", error);
      }
    };
    fetchGarages();
  }, []);

  return (
    <>
      <Home />
      <RecommendedGarages
        garagesData={garages}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
      <HowItWorks />
      <FindGarages />
      <Contact />
    </>
  );
};

export default HomePage;