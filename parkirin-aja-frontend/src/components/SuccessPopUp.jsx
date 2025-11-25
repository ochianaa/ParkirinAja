import { FaCheckCircle } from "react-icons/fa";

const SuccessPopUp = ({ isOpen, onClose, title, message, buttonText }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
                <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <button onClick={onClose} className="w-full p-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700">
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default SuccessPopUp;