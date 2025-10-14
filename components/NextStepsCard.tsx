import React from 'react';

type NextStepsCardProps = {
    title?: string;
    items: React.ReactNode[];
    ariaLabel?: string;
    className?: string;
};

export default function NextStepsCard({ title = 'Next steps', items, ariaLabel = 'Getting started', className }: NextStepsCardProps) {
    return (
        <section aria-label={ariaLabel} className={["border rounded p-4 bg-white text-sm space-y-3", className].filter(Boolean).join(' ')}>
            <h3 className="font-semibold text-sm">{title}</h3>
            <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
                {items.map((node, i) => (
                    <li key={i}>{node}</li>
                ))}
            </ul>
        </section>
    );
}
