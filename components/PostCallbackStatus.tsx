"use client";

import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert"

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
        <Alert
            role="status"
            aria-live="polite"
            data-testid="post-callback-status"
            className="bg-primary/10 text-primary border-primary/20"
        >
            <AlertDescription>
                Signing you in...
            </AlertDescription>
        </Alert>
    );
}

export default PostCallbackStatus;
