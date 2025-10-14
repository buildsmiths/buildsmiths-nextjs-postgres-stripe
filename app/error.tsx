"use client";
import React from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <main aria-label="Error" className="max-w-lg mx-auto mt-24 p-6 border rounded bg-white space-y-4 text-center">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-gray-600">An unexpected error occurred. Please try again.</p>
            <div>
                <button onClick={() => reset()} className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 focus-ring">Try again</button>
            </div>
            {process.env.NODE_ENV !== 'production' && (
                <pre className="text-xs text-left whitespace-pre-wrap bg-gray-50 border rounded p-3 overflow-auto">{String(error?.message || '')}</pre>
            )}
        </main>
    );
}
