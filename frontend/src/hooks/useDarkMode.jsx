// src/hooks/useDarkMode.jsx
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
    // Initialize state from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove old theme class
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        // Add new theme class
        root.classList.add(theme);
        
        // Save preference to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    return [theme, toggleTheme];
};