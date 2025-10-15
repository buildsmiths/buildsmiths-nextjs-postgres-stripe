import React from 'react';

export default function SignedOutPrompt({ ariaLabel = 'Page' }: { ariaLabel?: string }) {
    return (
        <main aria-label={ariaLabel} className="max-w-lg mx-auto mt-24 p-6 border rounded bg-white space-y-4 text-center dark:bg-gray-900 dark:border-gray-800">
            <h1 className="text-xl font-semibold" aria-current="page">Please sign in</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Access the dashboard after authenticating.</p>
        </main>
    );
}
