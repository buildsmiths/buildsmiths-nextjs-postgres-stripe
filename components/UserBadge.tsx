"use client";
import React from 'react';
import { useSession } from 'next-auth/react';

export function UserBadge() {
    const { data } = useSession();
    const user = data?.user as any;
    const userId = user?.id ?? null;
    const email = user?.email ?? null;

    if (!userId) return null;
    const text = email ? email : userId;
    const label = `Signed in user: ${text}`;
    return (
        <span
            className="inline-flex items-center text-xs text-gray-700 min-w-[10ch]"
            data-user-badge
            role="status"
            aria-label={label}
            title={label}
        >
            {text}
        </span>
    );
}
