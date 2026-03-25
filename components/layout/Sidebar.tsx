'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, FileText, Plus, Wallet, Shield,
    Activity, ChevronRight, Zap, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { label: 'Proposals', href: '/app/proposals', icon: FileText, badge: 3 },
    { label: 'Submit Proposal', href: '/app/submit', icon: Plus },
    { label: 'Treasury', href: '/app/treasury', icon: Wallet },
    { label: 'Governance', href: '/app/governance', icon: Shield },
    { label: 'Activity', href: '/app/activity', icon: Activity },
];

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 bottom-0 w-64 bg-background border-r border-white/[0.06] hidden md:flex flex-col py-6 overflow-y-auto no-scrollbar z-40',
                className
            )}
        >
            {/* Nav Items */}
            <nav className="flex flex-col gap-1 px-3">
                {sidebarItems.map(({ label, href, icon: Icon, badge }) => {
                    const isActive = pathname === href;
                    return (
                        <Link key={href} href={href}>
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
                    );
                })}
            </nav>

            {/* Treasury Quick Stats */}
            <div className="mt-6 mx-3 glass-card p-4">
                <p className="text-caption text-text-muted mb-3 uppercase tracking-wider font-semibold">Quick Stats</p>
                <div className="space-y-3">
                    {[
                        { label: 'Treasury', value: '₹248.5L' },
                        { label: 'Active', value: '3 proposals' },
                        { label: 'Your CIMP', value: '12,500' },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center">
                            <span className="text-caption text-text-muted">{label}</span>
                            <span className="text-caption text-text-secondary font-semibold">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Link */}
            <div className="mt-auto px-3">
                <a
                    href="https://polygonscan.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-body-sm text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all"
                >
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Polygon Network</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
            </div>
        </aside>
    );
}
