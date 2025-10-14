import './globals.css';
import React from 'react';
import Link from 'next/link';
import { AuthButton } from '../components/AuthButton';
import { UserBadge } from '../components/UserBadge';
import NavLink from '../components/NavLink';
import Providers from '../components/Providers';

export const metadata = {
    title: 'BuildSmiths StarterKit',
    description: 'BuildSmiths StarterKit: Next.js, Postgres, and optional Stripe.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const reducedMotion = process.env.TEST_REDUCED_MOTION === '1';
    return (
        <html lang="en" className={reducedMotion ? 'reduced-motion' : undefined}>
            <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
                <Providers>
                    {/* Skip to content link (visually hidden, visible on focus) */}
                    <a href="#main" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-blue-700 focus:ring-2 focus:ring-blue-400 focus:px-3 focus:py-2 focus:rounded">
                        Skip to content
                    </a>
                    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                            <Link href="/" className="font-semibold text-sm">BuildSmiths StarterKit</Link>
                            <nav className="flex items-center gap-4 text-xs text-gray-600">
                                <NavLink className="hover:text-gray-900" href="/dashboard">Dashboard</NavLink>
                                <NavLink className="hover:text-gray-900" href="/account">Account</NavLink>
                                <NavLink className="hover:text-gray-900" href="/settings">Settings</NavLink>
                                <NavLink className="hover:text-gray-900" href="/billing">Billing</NavLink>
                                {/* Metrics link removed for lean starter */}
                                <UserBadge />
                                <AuthButton />
                            </nav>
                        </div>
                    </header>
                    <main id="main" className="flex-1">{children}</main>
                    <footer className="text-xs text-gray-500 py-6 text-center border-t">
                        &copy; {new Date().getFullYear()} BuildSmiths StarterKit
                    </footer>
                </Providers>
            </body>
        </html>
    );
}
