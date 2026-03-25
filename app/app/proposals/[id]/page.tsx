/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft, ExternalLink, CheckCircle, Clock,
    Zap, Shield, AlertCircle
} from 'lucide-react';
import { mockProposals } from '@/lib/mockData';
import GlassCard from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { Proposal, ProposalStatus } from '@/types';
import { SuccessButton, DangerButton, PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import VoteBar from '@/components/ui/VoteBar';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { formatCurrency, formatDate, getVotePercentage, getQuorumPercentage, staggerContainer, fadeInUp } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useAccount } from 'wagmi';

export default function ProposalDetailPage() {
    const params = useParams();
    const { address } = useAccount();
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [loading, setLoading] = useState(true);
    const [voted, setVoted] = useState<'yes' | 'no' | null>(null);
    const [voting, setVoting] = useState(false);
    const [votesYes, setVotesYes] = useState(0);
    const [votesNo, setVotesNo] = useState(0);

    useEffect(() => {
        const fetchProposal = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('proposals')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data && !error) {
                const createdDate = new Date(data.created_at);
                const endDate = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);

                const mapped: Proposal = {
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    fullDescription: data.description,
                    category: data.category,
                    status: data.status as ProposalStatus,
                    proposer: {
                        name: data.proposer_address?.substring(0, 6) + '...' || 'Anon',
                        address: data.proposer_address || '0x0',
                        university: data.university || 'Unknown'
                    },
                    fundingRequested: data.funding_amount || 0,
                    fundingToken: data.funding_token || 'USDC',
                    votesYes: 0,
                    votesNo: 0,
                    totalVoters: 0,
                    quorumRequired: 1000000,
                    startDate: createdDate.toISOString(),
                    endDate: endDate.toISOString(),
                    tags: data.tags || [],
                    milestones: data.milestones || []
                };
                setProposal(mapped);
            } else {
                // Try to find it in mockData if it's not a UUID
                const fallback = mockProposals.find(p => p.id === params.id);
                if (fallback) setProposal(fallback);
            }
            setLoading(false);
        };

        fetchProposal();
    }, [params.id]);

    // Check if the current wallet address already voted, and fetch live vote counts
    useEffect(() => {
        if (!params.id) return;

        const checkVote = async () => {
            // Fetch live vote counts
            const { data: yesData } = await supabase
                .from('votes')
                .select('id', { count: 'exact' })
                .eq('proposal_id', params.id)
                .eq('choice', 'yes');

            const { data: noData } = await supabase
                .from('votes')
                .select('id', { count: 'exact' })
                .eq('proposal_id', params.id)
                .eq('choice', 'no');

            setVotesYes(yesData ? yesData.length : 0);
            setVotesNo(noData ? noData.length : 0);

            // Check if this wallet has already voted (runs when address loads too)
            const walletAddress = address;
            if (walletAddress) {
                const { data: myVote } = await supabase
                    .from('votes')
                    .select('choice')
                    .eq('proposal_id', params.id)
                    .eq('voter_address', walletAddress)
                    .maybeSingle();

                if (myVote) {
                    setVoted(myVote.choice as 'yes' | 'no');
                }
            }
        };

        checkVote();
    }, [params.id, address]); // re-runs when wallet connects

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <AlertCircle className="w-12 h-12 text-text-muted" />
                <h2 className="text-heading-lg text-text-secondary">Proposal not found</h2>
                <Link href="/app/proposals"><SecondaryButton>← Back to Proposals</SecondaryButton></Link>
            </div>
        );
    }

    getVotePercentage(votesYes, votesNo);
    const quorumPct = getQuorumPercentage(votesYes + votesNo, proposal.quorumRequired);
    const isActive = proposal.status === 'active';
    const isPassed = proposal.status === 'passed';
    const completedMilestones = proposal.milestones.filter(m => m.completed).length;

    const handleVote = async (choice: 'yes' | 'no') => {
        if (!address) {
            alert('Please connect your wallet to vote!');
            return;
        }
        setVoting(true);
        try {
            const { error } = await supabase
                .from('votes')
                .insert([{
                    proposal_id: params.id,
                    voter_address: address,
                    choice: choice
                }]);

            if (error) {
                // Unique constraint violation means they already voted
                if (error.code === '23505') {
                    alert('You have already voted on this proposal!');
                } else {
                    throw error;
                }
            } else {
                setVoted(choice);
                // Update live counts
                if (choice === 'yes') setVotesYes(v => v + 1);
                else setVotesNo(v => v + 1);
            }
        } catch (err) {
            console.error('Vote error:', err);
            alert('Failed to submit vote. Please try again.');
        } finally {
            setVoting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Back */}
            <Link href="/app/proposals" className="inline-flex items-center gap-2 text-body-sm text-text-muted hover:text-text-secondary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Proposals
            </Link>

            {/* Header */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                <motion.div variants={fadeInUp} className="flex items-center gap-3 flex-wrap">
                    <StatusBadge status={proposal.status} />
                    <span className="text-caption text-text-muted bg-white/5 px-3 py-1 rounded-full border border-white/[0.06]">{proposal.category}</span>
                    {proposal.ipfsHash && (
                        <a href="#" className="text-caption text-primary-light flex items-center gap-1 hover:underline">
                            <ExternalLink className="w-3 h-3" /> IPFS: {proposal.ipfsHash.substring(0, 12)}...
                        </a>
                    )}
                </motion.div>
                <motion.h1 variants={fadeInUp} className="text-display-sm font-bold text-text-primary leading-tight">
                    {proposal.title}
                </motion.h1>
                <motion.div variants={fadeInUp} className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                            <span className="text-caption text-white font-bold">{proposal.proposer.name.charAt(0)}</span>
                        </div>
                        <div>
                            <span className="text-body-sm font-semibold text-text-primary">{proposal.proposer.name}</span>
                            <span className="text-body-sm text-text-muted"> · {proposal.proposer.university}</span>
                        </div>
                    </div>
                    <span className="text-caption text-text-muted font-mono">{proposal.proposer.address}</span>
                </motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Overview */}
                    <GlassCard className="p-8 space-y-4">
                        <h2 className="text-heading-lg font-semibold text-text-primary flex items-center gap-2">
                            <FileIcon /> Overview
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            {proposal.fullDescription.split('\n\n').map((para, i) => (
                                <p key={i} className="text-body-md text-text-secondary leading-relaxed mb-4 last:mb-0">{para}</p>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {proposal.tags.map(tag => (
                                <span key={tag} className="text-caption text-text-muted bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Funding Breakdown */}
                    <GlassCard className="p-8 space-y-6">
                        <h2 className="text-heading-lg font-semibold text-text-primary">💰 Funding Breakdown</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Total Requested', value: formatCurrency(proposal.fundingRequested), highlight: true },
                                { label: 'Token', value: proposal.fundingToken },
                                { label: 'Start Date', value: formatDate(proposal.startDate) },
                                { label: 'End Date', value: formatDate(proposal.endDate) },
                            ].map(({ label, value, highlight }) => (
                                <div key={label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <p className="text-caption text-text-muted mb-1">{label}</p>
                                    <p className={cn('font-semibold', highlight ? 'text-display-sm gradient-text' : 'text-heading-md text-text-primary')}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Milestones */}
                    <GlassCard className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-heading-lg font-semibold text-text-primary">🎯 Milestones</h2>
                            <span className="text-body-sm text-text-muted">{completedMilestones}/{proposal.milestones.length} completed</span>
                        </div>
                        {/* Progress */}
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedMilestones / proposal.milestones.length) * 100}%` }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
                            />
                        </div>
                        <div className="space-y-4">
                            {proposal.milestones.map((milestone, i) => (
                                <div key={milestone.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            'w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                                            milestone.completed
                                                ? 'border-success bg-success/10'
                                                : 'border-white/20 bg-white/5'
                                        )}>
                                            {milestone.completed
                                                ? <CheckCircle className="w-4 h-4 text-success" />
                                                : <span className="text-caption text-text-muted font-bold">{i + 1}</span>
                                            }
                                        </div>
                                        {i < proposal.milestones.length - 1 && (
                                            <div className={cn('w-px flex-1 mt-2', milestone.completed ? 'bg-success/30' : 'bg-white/10')} />
                                        )}
                                    </div>
                                    <div className="pb-6 flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className={cn('text-heading-sm font-semibold', milestone.completed ? 'text-text-primary' : 'text-text-secondary')}>
                                                {milestone.title}
                                            </h4>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-caption text-text-muted">{milestone.fundAllocation}% of funds</span>
                                                {milestone.completed && <span className="badge-active text-caption">Done</span>}
                                            </div>
                                        </div>
                                        <p className="text-body-sm text-text-muted">{milestone.description}</p>
                                        <p className="text-caption text-text-muted mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Due: {formatDate(milestone.dueDate)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Voting Interface */}
                    <div id="vote" className="scroll-mt-24">
                        <GlassCard className="p-6 space-y-6">
                            <h3 className="text-heading-md font-semibold text-text-primary">Cast Your Vote</h3>

                            {isActive ? (
                                <>
                                    <CountdownTimer endDate={proposal.endDate} />

                                    <VoteBar
                                        yesVotes={votesYes}
                                        noVotes={votesNo}
                                        height="md"
                                        showLabels
                                        showCounts
                                    />

                                    {voted ? (
                                        <div className={cn(
                                            'p-4 rounded-xl border text-center',
                                            voted === 'yes' ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'
                                        )}>
                                            <CheckCircle className={cn('w-6 h-6 mx-auto mb-2', voted === 'yes' ? 'text-success' : 'text-danger')} />
                                            <p className="text-body-sm font-semibold text-text-primary">
                                                Vote cast: {voted.toUpperCase()}
                                            </p>
                                            <p className="text-caption text-text-muted mt-1">Recorded on Polygon</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <SuccessButton
                                                fullWidth
                                                loading={voting}
                                                onClick={() => handleVote('yes')}
                                                className="py-3.5"
                                            >
                                                ✓ Vote YES
                                            </SuccessButton>
                                            <DangerButton
                                                fullWidth
                                                loading={voting}
                                                onClick={() => handleVote('no')}
                                                className="py-3.5"
                                            >
                                                ✗ Vote NO
                                            </DangerButton>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <p className="text-caption text-text-muted">Your voting power: <span className="text-text-secondary font-semibold">12,500 CIMP</span></p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <StatusBadge status={proposal.status} className="mb-3" />
                                    <p className="text-body-sm text-text-muted">Voting has ended</p>
                                    <VoteBar yesVotes={votesYes} noVotes={votesNo} height="md" showLabels showCounts className="mt-4" />
                                </div>
                            )}

                            {/* Quorum */}
                            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                                <div className="flex justify-between">
                                    <span className="text-caption text-text-muted">Quorum Progress</span>
                                    <span className="text-caption text-text-secondary font-semibold">{quorumPct}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${quorumPct}%` }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
                                    />
                                </div>
                                <p className="text-caption text-text-muted">
                                    {proposal.totalVoters.toLocaleString()} / {proposal.quorumRequired.toLocaleString()} required
                                </p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Execution Panel */}
                    {isPassed && (
                        <GlassCard elevated className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-success" />
                                <h3 className="text-heading-sm font-semibold text-text-primary">Ready to Execute</h3>
                            </div>
                            <p className="text-body-sm text-text-muted leading-relaxed">
                                This proposal has passed quorum. The smart contract is ready to disburse funds automatically.
                            </p>
                            <PrimaryButton fullWidth className="gap-2">
                                <Zap className="w-4 h-4" />
                                Execute Proposal
                            </PrimaryButton>
                            <p className="text-caption text-text-muted text-center">Gas fee: ~0.004 MATIC</p>
                        </GlassCard>
                    )}

                    {/* Proposal Info */}
                    <GlassCard className="p-6 space-y-4">
                        <h3 className="text-heading-sm font-semibold text-text-primary">Proposal Info</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Proposal ID', value: proposal.id },
                                { label: 'Submitted', value: formatDate(proposal.startDate) },
                                { label: 'Voting Ends', value: formatDate(proposal.endDate) },
                                { label: 'Total Votes', value: proposal.totalVoters.toLocaleString() },
                                { label: 'Network', value: 'Polygon' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-start gap-2">
                                    <span className="text-caption text-text-muted">{label}</span>
                                    <span className="text-caption text-text-secondary font-medium text-right">{value}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

function FileIcon() {
    return (
        <svg className="w-5 h-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}
