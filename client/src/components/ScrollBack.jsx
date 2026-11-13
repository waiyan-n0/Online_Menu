import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollBack = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-blue-800 hover:bg-blue-700 text-white rounded-full shadow-xl cursor-pointer transition-colors border border-white/30 flex items-center justify-center animate-in fade-in duration-200"
            aria-label="Scroll back to top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
};

export default ScrollBack;