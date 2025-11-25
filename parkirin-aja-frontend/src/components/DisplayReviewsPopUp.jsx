import { FaStar, FaUserCircle } from 'react-icons/fa';

const DisplayReviewsPopUp = ({ isOpen, onClose, reviews, garageName }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50" 
            onClick={onClose}
        >
            <div 
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Reviews for {garageName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>

                <div className="space-y-6">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.review_id} className="border-b pb-4">
                                <div className="flex items-center mb-2">
                                    <FaUserCircle className="text-gray-400 mr-3 text-2xl" />
                                    <div>
                                        <p className="font-semibold text-slate-700">User {review.user_id}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center mb-2">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            color={index < review.rating ? "#ffc107" : "#e4e5e9"}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600">{review.review_text}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center py-8">No reviews yet for this garage.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DisplayReviewsPopUp;