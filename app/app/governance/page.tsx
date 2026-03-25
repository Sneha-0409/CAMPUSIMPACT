'use client';

import { motion } from 'framer-motion';
import {
    Shield, Activity, TrendingUp, AlertTriangle,
    HelpCircle, ChevronRight, Lock, Copy
} from 'lucide-react';
import { mockGovernanceToken } from '@/lib/mockData';
import GlassCard from '@/components/ui/GlassCard';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { formatNumber, staggerContainer, fadeInUp, scaleIn } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function GovernancePage() {
    const t = mockGovernanceToken;
    const [copied, setCopied] = useState(false);
    const contractAddress = "0x8F3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";

    const handleCopy = () => {
        navigator.clipboard.writeText(contractAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-caption text-text-muted uppercase tracking-widest mb-2 font-semibold">Tokenomics</p>
                    <h1 className="text-display-sm font-bold text-text-primary">
                        <span className="gradient-text">Governance</span> Overview
                    </h1>
                    <p className="text-body-md text-text-secondary mt-2">
                        View token distribution, delegate your votes, and manage your CIMP power.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <SecondaryButton className="gap-2 text-body-sm py-2">
                        Buy CIMP
                    </SecondaryButton>
                    <PrimaryButton className="gap-2 text-body-sm py-2">
                        Delegate Votes
                    </PrimaryButton>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Your Power Card */}
                <motion.div variants={scaleIn} initial="hidden" animate="visible" className="lg:col-span-1">
                    <GlassCard elevated className="p-8 h-full bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-indigo">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-heading-md font-bold text-text-primary">Your Voting Power</h3>
                                <p className="text-body-sm text-text-secondary">Connected wallet</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-display-md font-bold text-text-primary mb-1">
                                <AnimatedCounter target={t.yourBalance} decimals={0} />
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-body-sm text-primary-light font-medium tracking-wide">{t.symbol}</p>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                    <Activity className="w-3.5 h-3.5 text-success" />
                                    <span className="text-caption font-semibold text-text-secondary">Weight: {t.votingWeight}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-body-sm text-text-secondary flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-text-muted" /> Locked for voting
                                    </span>
                                    <span className="text-body-sm font-semibold text-text-primary">0 {t.symbol}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-body-sm text-text-secondary flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-text-muted" /> Available
                                    </span>
                                    <span className="text-body-sm font-semibold text-text-primary">{formatNumber(t.yourBalance)} {t.symbol}</span>
                                </div>
                            </div>
                            <p className="text-caption text-text-muted text-center flex items-center justify-center gap-1.5">
                                <AlertTriangle className="w-3 h-3 text-warning" />
                                Tokens used to vote are locked until the proposal ends.
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Global Token Stats */}
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                    {[
                        { label: 'Total Supply', value: t.totalSupply, sub: t.symbol, color: 'text-primary-light' },
                        { label: 'Circulating Supply', value: t.circulatingSupply, sub: `${((t.circulatingSupply / t.totalSupply) * 100).toFixed(1)}% circulating`, color: 'text-success' },
                        { label: 'Token Holders', value: t.holders, sub: '+12% this month', color: 'text-warning' },
                        { label: 'Current Price', value: t.price, prefix: '₹', sub: 'Uniswap V3 Polygon', color: 'text-accent-blue' },
                    ].map((stat) => (
                        <motion.div key={stat.label} variants={fadeInUp}>
                            <GlassCard className="p-6 h-full flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
                                <p className="text-caption text-text-muted uppercase tracking-wider mb-2 font-semibold relative z-10">{stat.label}</p>
                                <p className="text-display-sm font-bold text-text-primary mb-1 relative z-10">
                                    {stat.prefix}<AnimatedCounter target={stat.value} decimals={stat.prefix ? 2 : 0} />
                                </p>
                                <p className={cn("text-caption font-medium relative z-10", stat.color)}>{stat.sub}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Token Contract */}
                <GlassCard className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <span className="font-bold text-primary-light text-heading-sm">C</span>
                        </div>
                        <div>
                            <h3 className="text-heading-md font-semibold text-text-primary">Contract Details</h3>
                            <p className="text-caption text-text-muted">Deployed on Polygon Mainnet</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between group cursor-pointer" onClick={handleCopy}>
                            <div className="overflow-hidden mr-4">
                                <p className="text-caption text-text-muted font-semibold mb-1 uppercase tracking-widest">Address</p>
                                <p className="text-body-sm text-text-primary font-mono truncate">{contractAddress}</p>
                            </div>
                            <button className="p-2 rounded-lg bg-white/5 text-text-muted group-hover:text-primary-light group-hover:bg-primary/10 transition-colors flex-shrink-0 relative">
                                <Copy className="w-4 h-4" />
                                {copied && (
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-elevated text-text-primary text-caption font-medium px-2 py-1 rounded shadow-elevation-2">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                <p className="text-caption text-text-muted font-semibold mb-1 uppercase tracking-widest">Decimals</p>
                                <p className="text-body-sm text-text-primary font-mono font-medium">18</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                <p className="text-caption text-text-muted font-semibold mb-1 uppercase tracking-widest">Standard</p>
                                <p className="text-body-sm text-text-primary font-mono font-medium">ERC-20 Comp</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <a href={`https://polygonscan.com/token/${contractAddress}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-light hover:text-primary transition-colors text-body-sm font-medium">
                                View on Polygonscan <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </GlassCard>

                {/* Governance Rules */}
                <GlassCard className="p-8 bg-gradient-to-br from-surface to-surface-elevated">
                    <h3 className="text-heading-md font-semibold text-text-primary flex items-center gap-2 mb-6">
                        <HelpCircle className="w-5 h-5 text-accent-blue" />
                        Governance Parameters
                    </h3>
                    <div className="space-y-5">
                        {[
                            { title: 'Quadratic Voting Active', desc: 'Voting power scales to the square root of tokens held, preventing whales from dominating. Cost per vote increases exponentially.' },
                            { title: 'Proposal Threshold', desc: 'You need at least 1,000 CIMP (or delegated CIMP) to submit a new funding proposal.' },
                            { title: 'Quorum Requirement', desc: 'A minimum of 7,500 total votes must be cast for a proposal to be considered valid.' },
                            { title: 'Voting Period', desc: 'Standard proposals remain active for 14 days. Emergency proposals bypass standard duration.' },
                        ].map((rule, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-caption text-accent-blue font-bold">{i + 1}</span>
                                </div>
                                <div>
                                    <h4 className="text-body-sm font-semibold text-text-primary leading-tight mb-1">{rule.title}</h4>
                                    <p className="text-caption text-text-muted leading-relaxed">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
