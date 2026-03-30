import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
            className={`relative p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
            style={{
                color: 'var(--content-muted)',
                background: 'transparent',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-muted)'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <div className="relative w-4 h-4">
                <Sun
                    size={16}
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                        opacity: isDark ? 1 : 0,
                        transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
                    }}
                />
                <Moon
                    size={16}
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                        opacity: isDark ? 0 : 1,
                        transform: isDark ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
                    }}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
