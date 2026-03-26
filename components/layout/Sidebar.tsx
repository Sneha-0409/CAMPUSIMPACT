'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, FileText, Plus, Wallet, Shield,
    Activity, ChevronRight, Zap, ExternalLink, LogOut, UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

const sidebarItems = [
    { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { label: 'Proposals', href: '/app/proposals', icon: FileText, badge: 3 },
    { label: 'Submit Proposal', href: '/app/submit', icon: Plus },
    { label: 'Become Mentor', href: '#', icon: UserCheck, isAction: true },
    { label: 'Treasury', href: '/app/treasury', icon: Wallet },
    { label: 'Governance', href: '/app/governance', icon: Shield },
    { label: 'Activity', href: '/app/activity', icon: Activity },
];

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
                if (data) setRole(data.role);
            }
        };
        fetchRole();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const filteredItems = sidebarItems.filter(item => {
        if (role === 'faculty') {
            return item.label !== 'Submit Proposal' && 
                   item.label !== 'Become Mentor' &&
                   item.label !== 'Governance' && 
                   item.label !== 'Treasury';
        }
        if (role === 'alumni') {
            return item.label !== 'Submit Proposal' && 
                   item.label !== 'Governance' && 
                   item.label !== 'Treasury';
        }
        if (role === 'student' || !role) {
            return item.label !== 'Become Mentor' &&
                   item.label !== 'Governance' && 
                   item.label !== 'Treasury';
        }
        return true;
    });

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 bottom-0 w-64 bg-background border-r border-white/[0.06] hidden md:flex flex-col py-6 overflow-y-auto no-scrollbar z-40',
                className
            )}
        >
            {/* Nav Items */}
            <nav className="flex flex-col gap-1 px-3">
                {filteredItems.map(({ label, href, icon: Icon, badge }) => {
                    const isActive = pathname === href;
                    return (
                        <div key={label}>
                            {href === '#' ? (
                                <motion.div
                                    whileHover={{ x: 2 }}
                                    onClick={label === 'Become Mentor' ? async () => {
                                        const { data: { session } } = await supabase.auth.getSession();
                                        if (session) {
                                            await supabase.from('profiles').update({ is_mentor: true }).eq('id', session.user.id);
                                            alert('You are now a mentor!');
                                        }
                                    } : undefined}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium transition-all duration-150 cursor-pointer relative',
                                        'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                                    )}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="flex-1">{label}</span>
                                </motion.div>
                            ) : (
                                <Link href={href}>
                                    <motion.div
                                        whileHover={{ x: 2 }}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium transition-all duration-150 cursor-pointer relative',
                                            isActive
                                                ? 'bg-primary/10 text-primary-light border border-primary/20'
                                                : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                                        )}
                                    >
                                        <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-primary-light')} />
                                        <span className="flex-1">{label}</span>
                                        {badge && (
                                            <span className="text-caption font-semibold bg-primary/20 text-primary-light px-2 py-0.5 rounded-full">
                                                {badge}
                                            </span>
                                        )}
                                        {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                                    </motion.div>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="mt-auto px-3">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-body-sm text-text-muted hover:text-danger hover:bg-danger/10 transition-all group"
                >
                    <LogOut className="w-4 h-4 group-hover:text-danger transition-colors" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
