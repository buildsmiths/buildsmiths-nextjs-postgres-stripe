"use client";
import React from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const isDark = (resolvedTheme ?? theme) === 'dark';

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
            <span className="sr-only">Toggle theme</span>
            {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                    <path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 1 1-9.45-9.45 1 1 0 0 0-.14-2A10 10 0 1 0 22 14a1 1 0 0 0-.36-1z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                    <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zm10.48 0l1.8-1.79 1.79 1.79-1.79 1.79-1.8-1.79zM12 4a1 1 0 011 1v2a1 1 0 01-2 0V5a1 1 0 011-1zm0 12a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zM4 11a1 1 0 011-1h2a1 1 0 010 2H5a1 1 0 01-1-1zm12 0a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1zM6.76 19.16l-1.8 1.79-1.79-1.79 1.79-1.79 1.8 1.79zm10.48 0l1.8 1.79 1.79-1.79-1.79-1.79-1.8 1.79zM12 16a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
            )}
            <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
        </button>
    );
}
