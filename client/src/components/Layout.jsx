import React, { useState, useEffect, useCallback } from 'react';
import useScrollSpy from '../hooks/useScrollSpy';
import SocialIcons from './SocialIcons';

const NAV_ITEMS = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
];

const Layout = ({ children }) => {
    const activeSection = useScrollSpy(
        NAV_ITEMS.map((item) => item.id),
        80
    );

    // ─── Mouse-follow spotlight gradient ────────────────
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    return (
        <div
            className="relative min-h-screen lg:flex justify-between gap-4 max-w-screen-xl mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 group/spotlight"
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight gradient overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 lg:absolute"
                style={{
                    background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
                }}
            />

            {/* Left Fixed Sidebar (Header) */}
            <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
                        <a href="/">Devesh</a>
                    </h1>
                    <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
                        Full Stack Developer
                    </h2>
                    <p className="mt-4 max-w-xs leading-normal text-slate-400">
                        I build accessible, pixel-perfect, secure, and performant web applications.
                    </p>

                    {/* Navigation with active scroll-spy */}
                    <nav className="nav hidden lg:block" aria-label="In-page jump links">
                        <ul className="mt-16 w-max">
                            {NAV_ITEMS.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <li key={item.id}>
                                        <a
                                            className="group flex items-center py-3"
                                            href={`#${item.id}`}
                                        >
                                            <span
                                                className={`nav-indicator mr-4 h-px transition-all motion-reduce:transition-none ${
                                                    isActive
                                                        ? 'w-16 bg-teal-300'
                                                        : 'w-8 bg-slate-600 group-hover:w-16 group-hover:bg-teal-300'
                                                }`}
                                            />
                                            <span
                                                className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors ${
                                                    isActive
                                                        ? 'text-teal-300'
                                                        : 'text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200'
                                                }`}
                                            >
                                                {item.label}
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                {/* Social Icons (Lucide) */}
                <SocialIcons />
            </header>

            {/* Right Scrollable Content */}
            <main className="pt-24 lg:w-1/2 lg:py-24">
                {children}
            </main>
        </div>
    );
};

export default Layout;
