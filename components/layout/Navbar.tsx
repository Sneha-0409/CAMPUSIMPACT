'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Menu, X, Bell, LogOut
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { cn } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { supabase } from '@/lib/supabase';

const navLinks = [
    { label: 'Dashboard', href: '/app' },
    { label: 'Proposals', href: '/app/proposals' },
    { label: 'Treasury', href: '/app/treasury' },
    { label: 'Governance', href: '/app/governance' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isConnected } = useAccount();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const isLanding = pathname === '/';

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserEmail(session?.user?.email ?? null);
            if (session?.user) {
                supabase.from('profiles').select('role').eq('id', session.user.id).single()
                    .then(({ data }) => setRole(data?.role || null));
            }
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user?.email ?? null);
            if (session?.user) {
                supabase.from('profiles').select('role').eq('id', session.user.id).single()
                    .then(({ data }) => setRole(data?.role || null));
            } else {
                setRole(null);
            }
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled || !isLanding
                    ? 'bg-background/90 backdrop-blur-xl border-b border-white/[0.06] shadow-elevation-2'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative w-8 h-8">
                        <div className="absolute inset-0 bg-gradient-primary rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
                        <Zap className="absolute inset-0 m-auto w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-heading-sm text-text-primary tracking-tight">
                        CampusImpact
                        <span className="gradient-text"> DAO</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {isLanding
                        ? (
                            <>
                                <a href="#services" className="px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5">AboutUs</a>
                                <a href="#solution" className="px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5">Solution</a>
                                <a href="#impact" className="px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5">Impact</a>
                            </>
                        )
                        : navLinks
                            .filter(link => {
                                // Faculty/Alumni Navbar is empty. Students see only Dashboard/Proposals as requested.
                                // Unified minimalist Navbar for all main roles (Faculty, Alumni, Student) or unknown
                                if (role === 'faculty' || role === 'alumni') {
                                    return false; // Faculty/Alumni have an empty navbar
                                } else if (role === 'student' || !role) {
                                    // Students and unknown roles see Dashboard/Proposals
                                    return link.label !== 'Treasury' && link.label !== 'Governance';
                                }
                                return true; // Other roles see all links
                            })
                            .map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'px-4 py-2 text-body-sm rounded-lg transition-all duration-150 font-medium',
                                        pathname === link.href
                                            ? 'bg-primary/10 text-primary-light'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))
                    }
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {!isLanding && isConnected && (
                        <button className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                        </button>
                    )}

                    <ConnectButton
                        accountStatus="avatar"
                        chainStatus="icon"
                        showBalance={{ smallScreen: false, largeScreen: true }}
                    />

                    {/* Logged-in user chip + logout */}
                    {userEmail && (
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg max-w-[140px] truncate">
                                {userEmail}
                            </span>
                            <button
                                onClick={handleLogout}
                                title="Sign out"
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {isLanding && (
                        <Link href="/app"
                            className="hidden sm:inline-flex px-5 py-2.5 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Launch App
                        </Link>
                    )}

                    {/* Mobile menu */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/[0.06]"
                    >
                        <nav className="px-6 py-4 flex flex-col gap-1">
                            {navLinks
                                .filter(link => {
                                    if (role === 'faculty' || role === 'alumni' || role === 'student' || !role) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'px-4 py-3 rounded-xl text-body-sm font-medium transition-all',
                                        pathname === link.href
                                            ? 'bg-primary/10 text-primary-light'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
