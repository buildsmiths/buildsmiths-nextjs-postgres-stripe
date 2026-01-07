import './globals.css';
import React from 'react';
import Link from 'next/link';
import { AuthButton } from '@/components/AuthButton';
import NavLink from '@/components/NavLink';
import Providers from '@/components/Providers';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
    title: 'BuildSmiths StarterKit',
    description: 'BuildSmiths StarterKit: Next.js, Postgres, and optional Stripe.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const reducedMotion = process.env.TEST_REDUCED_MOTION === '1';
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`min-h-screen bg-background text-foreground flex flex-col ${reducedMotion ? 'reduced-motion' : ''}`}>
                <Providers>
                    {/* Skip to content link (visually hidden, visible on focus) */}
                    <a href="#main" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-background focus:text-primary focus:ring-2 focus:ring-ring focus:px-3 focus:py-2 focus:rounded">
                        Skip to content
                    </a>
                    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                            <Link href="/" className="font-semibold text-sm">BuildSmiths StarterKit</Link>
                            <nav className="flex items-center gap-4 text-xs text-muted-foreground">
                                <NavLink className="hover:text-foreground" href="/dashboard">Dashboard</NavLink>
                                <NavLink className="hover:text-foreground" href="/account">Account</NavLink>
                                <NavLink className="hover:text-foreground" href="/billing">Billing</NavLink>
                                <NavLink className="hover:text-foreground" href="/settings">Settings</NavLink>
                                {/* Metrics link removed for lean starter */}
                                <ThemeToggle />
                                <AuthButton />
                            </nav>
                        </div>
                    </header>
                    <main id="main" className="flex-1">{children}</main>
                    <footer className="text-xs text-muted-foreground py-6 text-center border-t">
                        &copy; {new Date().getFullYear()} BuildSmiths StarterKit
                    </footer>
                </Providers>
            </body>
        </html>
    );
}
