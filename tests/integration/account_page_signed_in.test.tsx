import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

vi.mock('next/headers', () => ({
    headers: () => ({ get: (k: string) => (k.toLowerCase() === 'authorization' ? 'Bearer test:user_42' : null) })
}));
import AccountPage from '@/app/account/page';

describe('Account page (signed-in via dev bearer)', () => {
    it('renders user id when authenticated', async () => {
        const el = await (AccountPage as any)();
        const html = ReactDOMServer.renderToStaticMarkup(el as any);
        expect(html).toContain('Account');
        expect(html).toContain('user_42');
    });
});
