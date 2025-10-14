import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import RootLayout from '../../app/layout';

// Mock next-auth for server-side rendering snapshot
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children as any,
}));

// Ensure dynamic NavLink marks Dashboard as current by simulating pathname
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<any>('next/navigation');
  return {
    ...actual,
    usePathname: () => '/dashboard',
  };
});

describe('Header navigation accessibility', () => {
  it('renders a nav landmark and marks Dashboard as current', () => {
    const el = (
      (<RootLayout>
        <div />
      </RootLayout>) as any
    );
    const html = ReactDOMServer.renderToStaticMarkup(el as any);
    expect(html).toContain('<nav');
    // Basic smoke for a nav landmark with links
    expect(html).toMatch(/<a[^>]*href=\"\/dashboard\"[^>]*>/);
    // aria-current present on Dashboard link
    expect(html).toMatch(/<a[^>]*href=\"\/dashboard\"[^>]*aria-current=\"page\"/);
    // Settings link removed (settings merged into account)
    expect(html).not.toMatch(/<a[^>]*href=\"\/settings\"[^>]*>/);
  });
});
