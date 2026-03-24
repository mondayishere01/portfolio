import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks which section is currently in view.
 * Returns the id of the active section.
 * @param {string[]} sectionIds - Array of section IDs to observe
 * @param {number} offset - Offset in pixels from the top (default 100)
 */
const useScrollSpy = (sectionIds, offset = 100) => {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: `-${offset}px 0px -50% 0px`,
            }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sectionIds, offset]);

    return activeId;
};

export default useScrollSpy;
