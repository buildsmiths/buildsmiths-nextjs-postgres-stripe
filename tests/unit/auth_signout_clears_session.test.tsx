// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthButton } from '../../components/AuthButton';

// Provide a stateful mock for useSession so we can flip to signed-out after signOut
const hoisted = vi.hoisted(() => {
    let session: any = { user: { id: 'user-1', email: 'u@example.com' } };
    const signOut = vi.fn(async () => {
        session = null;
    });
    return {
        getSession: () => session,
        signOut,
    };
});
vi.mock('next-auth/react', () => ({
    useSession: () => ({ data: hoisted.getSession() }),
    signOut: hoisted.signOut,
}));

import { signOut as mockedSignOut } from 'next-auth/react';

describe('AuthButton - sign out clears session', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('invokes next-auth signOut and returns to signed-out view', async () => {
        render(<AuthButton initialUserId={"user-1"} />);

        // Initially shows signed-in state
        const signOutBtn = await screen.findByRole('button', { name: /sign out/i });
        expect(signOutBtn).toBeDefined();

        // Click sign out
        await act(async () => {
            fireEvent.click(signOutBtn);
        });

        expect(mockedSignOut).toHaveBeenCalled();

        await waitFor(async () => {
            const signInLink = await screen.findByRole('link', { name: /sign in/i });
            expect(signInLink).toBeDefined();
            expect((signInLink as HTMLAnchorElement).getAttribute('href')).toBe('/auth');
        });
    });
});
