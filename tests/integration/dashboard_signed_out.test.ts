import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// Import the server component page
vi.mock('next/headers', () => ({
    headers: () => ({ get: (_k: string) => null })
}));
import DashboardPage from '../../app/dashboard/page';

// T104: Broaden registration/fallback tests — ensure signed-out users see the sign-in prompt on the dashboard

describe('Dashboard (signed-out state)', () => {
    it('renders a sign-in prompt when unauthenticated', async () => {
        const el = await DashboardPage();
        const html = ReactDOMServer.renderToStaticMarkup(el as any);
        expect(html).toContain('Please sign in');
        expect(html).toContain('Access the dashboard after authenticating');
    });
});
