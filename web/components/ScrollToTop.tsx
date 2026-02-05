"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const container = document.getElementById('scroll-container');
            let scrollTop = 0;

            if (container) {
                scrollTop = container.scrollTop;
            } else {
                scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            }

            if (scrollTop > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const container = document.getElementById('scroll-container');
        const target = container || window;

        target.addEventListener("scroll", toggleVisibility);
        // Initial check
        toggleVisibility();

        return () => target.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        const container = document.getElementById('scroll-container');
        if (container) {
            container.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-12 right-12 w-12 h-12 rounded-xl bg-white text-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 hover:text-red-600 hover:border-red-100 hover:shadow-lg transition-all duration-300 z-[100] focus:outline-none flex items-center justify-center group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                }`}
            aria-label="回到顶部"
        >
            <ArrowUp className="w-6 h-6 stroke-[2] group-hover:-translate-y-0.5 transition-transform duration-300" />
        </button>
    );
}
