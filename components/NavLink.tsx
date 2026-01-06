"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export default function NavLink({ href, className = '', children, ...rest }: NavLinkProps) {
    const pathname = usePathname() || '/';
    const isActive = pathname === href;
    const ariaCurrent = isActive ? 'page' : undefined;

    return (
        <a
            href={href}
            aria-current={ariaCurrent as any}
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-foreground" : "text-muted-foreground",
                className
            )}
            {...rest}
        >
            {children}
        </a>
    );
}
