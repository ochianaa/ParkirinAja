import Home from '../sections/Home';
import RecommendedGarages from '../sections/RecommendedGarages';
import HowItWorks from '../sections/HowItWorks';
import FindGarages from '../sections/FindGarages';
import Contact from '../sections/Contact';

const HomePage = ({ garagesData, favorites, onToggleFavorite }) => {
  return (
    <>
      <Home />
      <RecommendedGarages
        garagesData={garagesData}
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