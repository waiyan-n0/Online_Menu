import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Previous = () => {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(-1)} aria-label="Go back" className="fixed top-4 left-4 z-50 p-3 bg-blue-800 hover:bg-blue-700 text-white rounded-full shadow-xl cursor-pointer transition-colors border border-white/30 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
        </button>
    );
};

export default Previous;