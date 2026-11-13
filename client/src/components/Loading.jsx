import React from "react";

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 cursor-not-allowed select-none">
            <div className="bg-white px-6 py-5 rounded-2xl shadow-2xl flex items-center space-x-4 border border-gray-100 animate-in fade-in duration-200">
                <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin flex-shrink-0"></div>
                <div>
                    <h4 className="text-sm font-bold text-gray-800">Saving...</h4>
                </div>
            </div>
        </div>
    );
};

export default Loading;