'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

export function renderSignedOutView(params: {
    loading: boolean;
    error: string | null;
    email: string;
    password: string;
    mode: 'login' | 'register';
    onSubmit: (e: React.FormEvent) => void;
    onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleMode: () => void;
    enableGoogle?: boolean;
}) {
    const { loading, error, email, password, mode, onSubmit, onChangeEmail, onChangePassword, onToggleMode, enableGoogle } = params;
    return (
        <div className="space-y-3" data-auth-state="signed-out">
            {error && <div className="text-sm text-red-600">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-2">
                <label className="block text-sm text-gray-700 dark:text-gray-200">{mode === 'login' ? 'Sign in with email' : 'Create an account'}</label>
                <div className="flex flex-col gap-2">
                    <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={onChangeEmail}
                        className="px-3 py-2 border rounded text-sm bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                    />
                    <input
                        type="password"
                        required
                        placeholder="password"
                        value={password}
                        onChange={onChangePassword}
                        className="px-3 py-2 border rounded text-sm bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                        minLength={8}
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-700 focus-ring"
                        disabled={loading || !email || !password}
                    >
                        {loading ? 'Working…' : (mode === 'login' ? 'Sign in' : 'Create account')}
                    </button>
                    <button type="button" className="text-xs text-gray-600 underline dark:text-gray-300" onClick={onToggleMode}>
                        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}
                    </button>
                </div>
            </form>
            {enableGoogle && (
                <>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-black px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Sign in with Google
                    </button>
                </>
            )}
        </div>
    );
}

export const SignInPanel: React.FC<{ enableGoogle?: boolean }> = ({ enableGoogle }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'login' | 'register'>('login');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (mode === 'register') {
                const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
                const data = await res.json();
                if (!res.ok || !data?.ok) throw new Error(data?.code || 'REGISTER_FAILED');
            }
            const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/dashboard' });
            if ((result as any)?.error) throw new Error((result as any).error);
            // On success, either NextAuth returns a URL or we fallback to our dashboard
            const url = (result as any)?.url || '/dashboard';
            window.location.assign(url);
        } catch (err: any) {
            setError(err?.message || 'Auth failed');
        } finally {
            setLoading(false);
        }
    }

    return renderSignedOutView({
        loading,
        error,
        email,
        password,
        mode,
        onSubmit: handleSubmit,
        onChangeEmail: (e) => setEmail(e.target.value),
        onChangePassword: (e) => setPassword(e.target.value),
        onToggleMode: () => setMode((m) => (m === 'login' ? 'register' : 'login')),
        enableGoogle
    });
};
