'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerAction } from '@/app/auth/actions';

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
        <Card className="w-full max-w-md mx-auto" data-auth-state="signed-out">
            <CardHeader>
                <CardTitle>{mode === 'login' ? 'Sign In' : 'Create Account'}</CardTitle>
                <CardDescription>
                    {mode === 'login' ? 'Enter your email below to sign in to your account' : 'Enter your email below to create your account'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    {error && <div className="text-sm text-destructive font-medium">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            placeholder="m@example.com"
                            value={email}
                            onChange={onChangeEmail}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={onChangePassword}
                            minLength={8}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || !email || !password}>
                        {loading ? 'Working…' : (mode === 'login' ? 'Sign in' : 'Create account')}
                    </Button>
                </form>

                {enableGoogle && (
                    <div className="mt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            className="w-full mt-4"
                        >
                            Sign in with Google
                        </Button>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button variant="link" onClick={onToggleMode} className="text-sm text-muted-foreground">
                    {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}
                </Button>
            </CardFooter>
        </Card>
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
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);

                const data = await registerAction(null, formData);
                if (!data?.ok) throw new Error(data?.message || data?.code || 'REGISTER_FAILED');
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
