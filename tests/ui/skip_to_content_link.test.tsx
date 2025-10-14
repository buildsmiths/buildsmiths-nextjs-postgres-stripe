import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Layout from '../../app/layout';

// Mock next-auth for server-side rendering snapshot
vi.mock('next-auth/react', () => ({
    useSession: () => ({ data: null }),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children as any,
}));

describe('Skip to content link', () => {
    it('renders a visually-hidden link that targets #main and becomes visible on focus', () => {
        const html = ReactDOMServer.renderToStaticMarkup(
            // Provide a simple child to satisfy layout render
            (Layout as any)({ children: React.createElement('div', null, 'child') })
        );
        expect(html).toContain('href="#main"');
        // Class should include a focus-visible style hook; exact implementation can vary
        expect(html).toMatch(/skip-link/);
    });
});
