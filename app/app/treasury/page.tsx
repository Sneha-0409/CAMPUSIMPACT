'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, RefreshCcw, Search, ExternalLink } from 'lucide-react';
import { mockTreasury } from '@/lib/mockData';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { formatCurrency, formatDate, staggerContainer, fadeInUp, scaleIn } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { SecondaryButton } from '@/components/ui/Button';

export default function TreasuryPage() {
    const t = mockTreasury;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-caption text-text-muted uppercase tracking-widest mb-2 font-semibold">DAO Treasury</p>
                    <h1 className="text-display-sm font-bold text-text-primary">
                        Fund <span className="gradient-text">Overview</span>
                    </h1>
                    <p className="text-body-md text-text-secondary mt-2">
                        Transparent view of all DAO funds, allocations, and transaction history.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <SecondaryButton className="gap-2 text-body-sm py-2">
                        <RefreshCcw className="w-4 h-4" /> Sync Stats
                    </SecondaryButton>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={scaleIn} initial="hidden" animate="visible" className="lg:col-span-2">
                    <GlassCard className="p-8 h-full flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <p className="text-heading-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                                <Wallet className="w-5 h-5" /> Total Treasury Balance
                            </p>
                            <h2 className="text-display-lg font-bold gradient-text pb-4">
                                <AnimatedCounter target={t.totalBalance} prefix="₹" suffix="L" decimals={1} />
                            </h2>
                            <div className="flex items-center gap-6 pt-6 border-t border-white/[0.06]">
                                <div>
                                    <p className="text-caption text-text-muted mb-1">Monthly Change</p>
                                    <p className="text-heading-sm font-semibold text-success flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" /> +{t.monthlyChange}%
                                    </p>
                                </div>
                                <div className="w-px h-8 bg-white/[0.06]" />
                                <div>
                                    <p className="text-caption text-text-muted mb-1">Network</p>
                                    <p className="text-heading-sm font-semibold text-text-primary">Polygon</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
                    <motion.div variants={fadeInUp}>
                        <GlassCard className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                                    <ArrowUpRight className="w-5 h-5 text-success" />
                                </div>
                                <span className="text-caption text-success font-semibold px-2 py-0.5 rounded-full bg-success/10 border border-success/20">Available</span>
                            </div>
                            <p className="text-heading-sm text-text-secondary mt-4">Liquid Funds</p>
                            <p className="text-display-sm font-bold text-text-primary">{formatCurrency(t.availableBalance)}</p>
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <GlassCard className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                                    <ArrowDownRight className="w-5 h-5 text-warning" />
                                </div>
                                <span className="text-caption text-warning font-semibold px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20">Locked</span>
                            </div>
                            <p className="text-heading-sm text-text-secondary mt-4">In Active Proposals</p>
                            <p className="text-display-sm font-bold text-text-primary">{formatCurrency(t.lockedBalance)}</p>
                        </GlassCard>
                    </motion.div>
                </motion.div>
            </div>

            {/* Allocations & Chart */}
            <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard className="p-8">
                    <h3 className="text-heading-lg font-semibold text-text-primary mb-6">Category Allocation</h3>
                    <div className="space-y-5">
                        {t.allocations.map((alloc) => (
                            <div key={alloc.category}>
                                <div className="flex justify-between font-medium mb-2">
                                    <span className="text-body-sm text-text-secondary flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: alloc.color }} />
                                        {alloc.category}
                                    </span>
                                    <div className="text-right">
                                        <span className="text-body-sm text-text-primary mr-3">{formatCurrency(alloc.amount)}</span>
                                        <span className="text-caption text-text-muted">{alloc.percentage}%</span>
                                    </div>
                                </div>
                                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: alloc.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${alloc.percentage}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard className="p-8 flex items-center justify-center flex-col text-center">
                    <div className="w-48 h-48 relative mb-6">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="20" className="text-white/[0.02]" />
                            {t.allocations.map((alloc, i) => {
                                const prev = t.allocations.slice(0, i).reduce((sum, a) => sum + a.percentage, 0);
                                const offset = 251.2 - (prev / 100) * 251.2;
                                const strokeDasharray = `${(alloc.percentage / 100) * 251.2} 251.2`;
                                return (
                                    <motion.circle
                                        key={alloc.category}
                                        cx="50" cy="50" r="40"
                                        fill="transparent"
                                        stroke={alloc.color}
                                        strokeWidth="20"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={offset}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="origin-center hover:opacity-80 transition-opacity cursor-pointer flex"
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-caption text-text-muted">Total</span>
                            <span className="text-heading-sm font-bold text-text-primary">100%</span>
                        </div>
                    </div>
                    <p className="text-body-sm text-text-secondary text-balance">
                        Treasury funds are automatically diversified across sectors to maintain a balanced innovation portfolio.
                    </p>
                </GlassCard>
            </div>

            {/* Transaction History */}
            <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-heading-lg font-semibold text-text-primary">Transaction History</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input type="text" placeholder="Search tx hash..." className="input-field pl-9 py-2 text-body-sm bg-background border-white/5 w-48 focus:w-64 transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="pb-4 pt-2 text-caption font-semibold text-text-muted uppercase tracking-wider px-4">Type</th>
                                <th className="pb-4 pt-2 text-caption font-semibold text-text-muted uppercase tracking-wider px-4">Proposal</th>
                                <th className="pb-4 pt-2 text-caption font-semibold text-text-muted uppercase tracking-wider px-4">Amount</th>
                                <th className="pb-4 pt-2 text-caption font-semibold text-text-muted uppercase tracking-wider px-4">Date</th>
                                <th className="pb-4 pt-2 text-caption font-semibold text-text-muted uppercase tracking-wider px-4">Status</th>
                                <th className="pb-4 pt-2 text-caption font-semibold text-text-muted uppercase tracking-wider px-4 text-right">Explorer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {t.transactions.map((tx, i) => (
                                <motion.tr
                                    key={tx.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="py-4 px-4 font-medium text-body-sm text-text-primary capitalize flex items-center gap-2">
                                        {tx.type === 'allocation' && <ArrowDownRight className="w-4 h-4 text-warning" />}
                                        {tx.type === 'disbursement' && <ArrowUpRight className="w-4 h-4 text-success" />}
                                        {tx.type === 'return' && <RefreshCcw className="w-4 h-4 text-text-muted" />}
                                        {tx.type}
                                    </td>
                                    <td className="py-4 px-4 text-body-sm text-text-secondary">{tx.proposal}</td>
                                    <td className={cn(
                                        "py-4 px-4 font-semibold text-body-sm",
                                        tx.type === 'return' ? 'text-text-primary' : (tx.type === 'allocation' ? 'text-warning' : 'text-success')
                                    )}>
                                        {tx.type === 'return' ? '+' : '-'} {formatCurrency(tx.amount)}
                                    </td>
                                    <td className="py-4 px-4 text-body-sm text-text-muted">{formatDate(tx.date)}</td>
                                    <td className="py-4 px-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-caption font-semibold",
                                            tx.status === 'confirmed' ? 'bg-success/10 text-success border border-success/20' :
                                                tx.status === 'pending' ? 'bg-warning/10 text-warning border border-warning/20' :
                                                    'bg-danger/10 text-danger border border-danger/20'
                                        )}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <a href={`https://polygonscan.com/tx/${tx.txHash}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-primary-light hover:text-primary transition-colors">
                                            <span className="font-mono text-caption mr-1">{tx.txHash.substring(0, 6)}...</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
