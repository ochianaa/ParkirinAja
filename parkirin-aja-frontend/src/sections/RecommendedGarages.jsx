import Card from "../components/Card";
import { Fade } from "react-awesome-reveal"


const RecommendedGarages = ({ garagesData, favorites, onToggleFavorite }) => {

    return (
      <Fade direction="fade" duration={1000} triggerOnce fraction={0.3}>
        <section id='recommendedGarages' className="bg-gradient-to-b from-slate-200 to-white text-gray-800">
            <div className="mx-auto px-20 py-24 text-center border-l border-r border-gray-300">
                <h1 className="text-5xl font-bold mb-6">Recomended Garages</h1>
                <p className="text-xl text-gray-800 mb-15">Discover top-rated garage spaces in popular locations</p>

                <div className="flex flex-wrap justify-center gap-8">
                    {garagesData.map(garage => (
                        <Card key={garage.garage_id} 
                          garage={garage}
                          isFavorited={favorites.includes(garage.garage_id)}
                          onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            </div>
        </section>
      </Fade>
    )
}

export default RecommendedGarages