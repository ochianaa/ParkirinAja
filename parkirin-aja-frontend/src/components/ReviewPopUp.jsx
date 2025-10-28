import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewModal = ({ isOpen, onClose }) => {
    // State untuk mengelola rating dan hover
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Write a Review</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm text-left font-medium text-gray-700 mb-2">Your Rating</label>
                        <div className="flex justify-center text-3xl">
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <label key={index}>
                                        <input 
                                            type="radio" 
                                            name="rating" 
                                            value={ratingValue} 
                                            onClick={() => setRating(ratingValue)}
                                            className="hidden" // Sembunyikan radio button asli
                                        />
                                        <FaStar 
                                            className="cursor-pointer"
                                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="review_text" className="block text-sm text-left font-medium text-gray-700">Comment</label>
                        <textarea 
                            id="review_text" 
                            name="review_text" 
                            rows="4" 
                            placeholder="Tell us about your experience..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t">
                         <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-700">
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;