// src/components/ThemeToggle.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle({ theme, toggleTheme }) {
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            title="Toggle dark mode"
        >
            {theme === 'light' ? (
                <Moon className="w-6 h-6" />
            ) : (
                <Sun className="w-6 h-6" />
            )}
        </button>
    );
}

export default ThemeToggle;