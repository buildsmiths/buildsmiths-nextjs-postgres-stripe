"use client";
import React from 'react';
import { usePathname } from 'next/navigation';

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export default function NavLink({ href, className = '', children, ...rest }: NavLinkProps) {
    const pathname = usePathname() || '/';
    const isActive = pathname === href;
    const ariaCurrent = isActive ? 'page' : undefined;
    const cls = `${className} focus-ring`;
    return (
        <a href={href} aria-current={ariaCurrent as any} className={cls} {...rest}>
            {children}
        </a>
    );
}
