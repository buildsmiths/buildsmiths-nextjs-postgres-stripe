"use client";

import React from 'react';

/**
 * PostCallbackStatus
 * Shows a brief “Signing you in...” notice to improve perceived responsiveness after OAuth callback.
 * Disappears automatically after a short delay; also exposes an optional `durationMs` prop for tests.
 */
export function PostCallbackStatus({ durationMs = 800 }: { durationMs?: number }) {
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
        const id = setTimeout(() => setVisible(false), durationMs);
        return () => clearTimeout(id);
    }, [durationMs]);

    if (!visible) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            data-testid="post-callback-status"
            className="rounded-md bg-blue-50 text-blue-700 border border-blue-200 px-3 py-2 text-sm"
        >
            Signing you in...
        </div>
    );
}

export default PostCallbackStatus;
