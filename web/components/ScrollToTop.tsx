"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Try to find the app-specific scroll container, fallback to window
        // The main scroll area in page.tsx has id "main-scroll"
        // Retrying slightly later might be needed if hydration is slow, but usually useEffect is fine.
        const getContainer = () => document.getElementById("main-scroll") || window;
        const container = getContainer();

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
        const container = document.getElementById("main-scroll") || window;
        container.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
            <button
                onClick={scrollToTop}
                className="p-3 bg-party-red text-white rounded-full shadow-lg hover:bg-party-red-hover hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-party-red"
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </div>
    );
};
