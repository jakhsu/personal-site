import { ChevronUp } from "lucide-react";

export const ScrollToTopButton = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className="p-2 rounded-full text-lg cursor-pointer rounded-full bg-black/50 dark:bg-white/50 text-white dark:text-black border-none"
        >
            <ChevronUp />
        </button>
    );
};
