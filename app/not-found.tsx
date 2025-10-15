import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main aria-label="Not Found" className="max-w-lg mx-auto mt-24 p-6 border rounded bg-white space-y-4 text-center dark:bg-gray-900 dark:border-gray-800">
            <h1 className="text-xl font-semibold">Page not found</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">The page you’re looking for doesn’t exist or was moved.</p>
            <div>
                <Link href="/" className="text-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm">Back to home</Link>
            </div>
        </main>
    );
}
