'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Zap, LogIn } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
        } else {
            router.push('/app');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/app` },
        });
        setGoogleLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050508] via-[#0d0d1a] to-[#080814] px-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">CampusImpact <span className="text-purple-400">DAO</span></span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="text-gray-400 mt-1 text-sm">Sign in to access the DAO platform</p>
                </div>

                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors mb-6 disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-gray-500">or sign in with email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 font-medium mb-1.5 block">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@iitk.ac.in"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 font-medium mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-10 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                            Create one free
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
