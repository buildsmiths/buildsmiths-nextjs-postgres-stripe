import React from 'react';
import { SignInPanel } from '../../components/SignInPanel';

export const metadata = {
    title: 'Sign in',
    description: 'Authenticate to access your dashboard and account.'
};

export default function AuthPage() {
    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h1 className="text-lg font-semibold">Sign in</h1>
            <p className="text-sm text-gray-600">Access the dashboard after authenticating.</p>
            <SignInPanel />
        </div>
    );
}
