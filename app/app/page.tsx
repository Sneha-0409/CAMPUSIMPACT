'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Wallet, FileText, Zap, Trophy, ArrowUpRight,
    Clock, TrendingUp, Filter, Plus
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import ProposalCard from '@/components/proposals/ProposalCard';
import { dashboardStats, mockProposals } from '@/lib/mockData';
import { staggerContainer, fadeInUp, scaleIn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import StudentDashboardPanel from '@/components/dashboard/StudentDashboardPanel';

const iconMap: Record<string, React.ElementType> = {
    Wallet, FileText, Zap, Trophy,
};

export default function DashboardPage() {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);
    const [role, setRole] = useState<'student' | 'faculty' | 'alumni' | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth/login');
                return;
            }
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            setRole(profile?.role || null);
            setAuthChecked(true);
        };
        checkAuth();
    }, [router]);

    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    const activeProposals = mockProposals.filter(p => p.status === 'active');

    return (
        <div className="space-y-10">
            {/* Header */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex items-start justify-between"
            >
                <motion.div variants={fadeInUp}>
                    <p className="text-caption text-text-muted uppercase tracking-widest mb-2 font-semibold">Dashboard</p>
                    <h1 className="text-display-sm font-bold text-text-primary">
                        Welcome back, <span className="gradient-text">Builder</span>
                    </h1>
                    <p className="text-body-md text-text-secondary mt-2">
                        3 active proposals need your vote · Treasury at all-time high
                    </p>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex gap-3">
                    {role !== 'faculty' && role !== 'alumni' && (
                        <Link href="/app/submit">
                            <PrimaryButton className="gap-2">
                                <Plus className="w-4 h-4" />
                                New Proposal
                            </PrimaryButton>
                        </Link>
                    )}
                </motion.div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
            >
                {dashboardStats.map((stat) => {
                    const Icon = iconMap[stat.icon];
                    let displayValue = stat.value;
                    let displayChange = stat.change;
                    let displayDescription = stat.description;

                    if (stat.label === 'Your Voting Power') {
                        if (role === 'faculty') {
                            displayValue = '1.5x'; displayChange = ''; displayDescription = '';
                        } else if (role === 'alumni') {
                            displayValue = '1.2x'; displayChange = ''; displayDescription = '';
                        } else if (role === 'student') {
                            displayValue = '1.0x'; displayChange = ''; displayDescription = '';
                        }
                    }

                    return (
                        <motion.div key={stat.label} variants={scaleIn}>
                            <GlassCard className="p-6 space-y-4 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 group">
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        {Icon && <Icon className="w-5 h-5 text-primary-light" />}
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
                                </div>
                                <div>
                                    <p className="text-display-sm font-bold text-text-primary leading-none mb-1">
                                        {displayValue}
                                    </p>
                                    <p className="text-heading-sm font-medium text-text-secondary">{stat.label}</p>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                                    <span className={`text-caption font-semibold ${stat.changeType === 'positive' ? 'text-success' :
                                        stat.changeType === 'negative' ? 'text-danger' : 'text-text-muted'
                                        }`}>
                                        {displayChange}
                                    </span>
                                    <span className="text-caption text-text-muted">{displayDescription}</span>
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Activity + Governance snapshot */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Treasury Snapshot */}
                {role !== 'faculty' && role !== 'alumni' && (
                    <GlassCard className="p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-heading-md font-semibold text-text-primary">Treasury Health</h3>
                            <Link href="/app/treasury" className="text-body-sm text-primary-light hover:text-primary transition-colors">View →</Link>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Total Balance', value: '₹248.5L', width: '100%', color: 'bg-primary' },
                                { label: 'Locked in Proposals', value: '₹87.2L', width: '35%', color: 'bg-warning' },
                                { label: 'Available', value: '₹161.3L', width: '65%', color: 'bg-success' },
                            ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between text-body-sm">
                                        <span className="text-text-secondary">{item.label}</span>
                                        <span className="text-text-primary font-semibold">{item.value}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: item.width }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-success" />
                                <span className="text-body-sm text-success font-semibold">+12.4% this month</span>
                            </div>
                        </div>
                    </GlassCard>
                )}

                {/* Recent Activity */}
                {role !== 'faculty' && role !== 'alumni' && (
                    <GlassCard className="lg:col-span-2 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-heading-md font-semibold text-text-primary">Recent Activity</h3>
                            <Link href="/app/activity" className="text-body-sm text-primary-light hover:text-primary transition-colors">View All →</Link>
                        </div>
                        <div className="space-y-1">
                            {[
                                { action: 'Voted YES on AgroSync', time: '2 hours ago', type: 'vote', color: 'text-success', bg: 'bg-success/10 border-success/20' },
                                { action: 'NexaLearn passed quorum threshold', time: '5 hours ago', type: 'milestone', color: 'text-primary-light', bg: 'bg-primary/10 border-primary/20' },
                                { action: 'GridFlow disbursement executed', time: '1 day ago', type: 'treasury', color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/20' },
                                { action: 'ClearVote proposal submitted', time: '2 days ago', type: 'proposal', color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
                                { action: 'MediChain funding requested: ₹28L', time: '3 days ago', type: 'proposal', color: 'text-text-muted', bg: 'bg-white/5 border-white/10' },
                            ].map(({ action, time, type, color, bg }) => (
                                <div key={action} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.02] transition-all group">
                                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${bg}`}>
                                        {type === 'vote' && <TrendingUp className={`w-3.5 h-3.5 ${color}`} />}
                                        {type === 'milestone' && <Zap className={`w-3.5 h-3.5 ${color}`} />}
                                        {type === 'treasury' && <Wallet className={`w-3.5 h-3.5 ${color}`} />}
                                        {type === 'proposal' && <FileText className={`w-3.5 h-3.5 ${color}`} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">{action}</p>
                                    </div>
                                    <span className="text-caption text-text-muted flex-shrink-0 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}
            </div>

            {/* Role-Specific Dashboard Inject */}
            {role === 'student' && <StudentDashboardPanel proposals={activeProposals} />}

            {/* Active Proposals */}
            <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-display-sm font-bold text-text-primary">Active Proposals</h2>
                        <p className="text-body-sm text-text-secondary mt-1">
                            <span className="text-success font-semibold">3 proposals</span> currently in voting period
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <SecondaryButton className="gap-2 text-body-sm py-2.5">
                            <Filter className="w-4 h-4" />
                            Filter
                        </SecondaryButton>
                        <Link href="/app/proposals">
                            <SecondaryButton className="text-body-sm py-2.5 gap-2">
                                View All
                                <ArrowUpRight className="w-4 h-4" />
                            </SecondaryButton>
                        </Link>
                    </div>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {activeProposals.map((proposal, i) => (
                        <ProposalCard key={proposal.id} proposal={proposal} index={i} />
                    ))}
                </motion.div>
            </div>

            {/* Governance Snapshot */}
            {role !== 'faculty' && role !== 'alumni' && (
                <GlassCard className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-2">
                            <h3 className="text-heading-lg font-semibold text-text-primary">Your Governance Power</h3>
                            <p className="text-body-sm text-text-secondary">Hold CIMP tokens to vote on proposals and shape the direction of the DAO.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-8 lg:flex lg:gap-12">
                            {[
                                { label: 'CIMP Balance', value: '12,500', sub: 'tokens' },
                                { label: 'Voting Weight', value: '1.0x', sub: 'multiplier' },
                                { label: 'Votes Cast', value: '34', sub: 'this month' },
                            ].map(({ label, value, sub }) => (
                                <div key={label} className="text-center">
                                    <p className="text-heading-lg font-bold gradient-text">{value}</p>
                                    <p className="text-body-sm text-text-secondary font-medium mt-0.5">{label}</p>
                                    <p className="text-caption text-text-muted">{sub}</p>
                                </div>
                            ))}
                        </div>
                        <Link href="/app/governance">
                            <PrimaryButton className="text-body-sm py-2.5">
                                View Governance
                            </PrimaryButton>
                        </Link>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
