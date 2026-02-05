"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Try to find the app-specific scroll container, fallback to window
        const container = document.getElementById("scroll-container") || window;

        const toggleVisibility = () => {
            let scrollTop = 0;
            if (container === window) {
                scrollTop = window.pageYOffset;
            } else {
                scrollTop = (container as HTMLElement).scrollTop;
            }

            if (scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Attach listener
        container.addEventListener("scroll", toggleVisibility);

        // Initial check
        toggleVisibility();

        return () => {
            container.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        const container = document.getElementById("scroll-container") || window;
        container.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <button
                onClick={scrollToTop}
                className="p-3 bg-party-red text-white rounded-full shadow-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-party-red"
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-6 h-6" />
            </button>
        </div>
    );
};
