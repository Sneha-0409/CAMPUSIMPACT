'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Proposal } from '@/types';
import { formatCurrency, formatTimeLeft, getVotePercentage } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import VoteBar from '@/components/ui/VoteBar';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { fadeInUp } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';

interface ProposalCardProps {
    proposal: Proposal;
    index?: number;
    compact?: boolean;
}

export default function ProposalCard({ proposal, index = 0, compact = false }: ProposalCardProps) {
    getVotePercentage(proposal.votesYes, proposal.votesNo);
    const isVotable = proposal.status === 'active';
    const { address } = useAccount();
    const [hasVoted, setHasVoted] = useState<'yes' | 'no' | null>(null);
    const [votesYes, setVotesYes] = useState(0);
    const [votesNo, setVotesNo] = useState(0);

    useEffect(() => {
        if (!proposal.id || !isVotable) return;

        const checkVote = async () => {
            // Fetch live vote counts for this card
            const { data: yesData } = await supabase
                .from('votes')
                .select('id')
                .eq('proposal_id', proposal.id)
                .eq('choice', 'yes');

            const { data: noData } = await supabase
                .from('votes')
                .select('id')
                .eq('proposal_id', proposal.id)
                .eq('choice', 'no');

            // Use ?? 0 so that 0 real votes stays 0 (not falling back to mock data)
            setVotesYes(yesData ? yesData.length : 0);
            setVotesNo(noData ? noData.length : 0);

            // Check if this wallet already voted
            if (address) {
                const { data: myVote } = await supabase
                    .from('votes')
                    .select('choice')
                    .eq('proposal_id', proposal.id)
                    .eq('voter_address', address)
                    .single();

                if (myVote) setHasVoted(myVote.choice as 'yes' | 'no');
            }
        };

        checkVote();
    }, [proposal.id, address, isVotable, proposal.votesYes, proposal.votesNo]);

    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
            className={cn(
                'glass-card p-6 flex flex-col gap-5 transition-all duration-300 group',
                'hover:-translate-y-1 hover:shadow-card-hover hover:border-white/10',
                compact && 'p-4 gap-3'
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={proposal.status} />
                        <span className="text-caption text-text-muted bg-white/5 px-2 py-0.5 rounded-full">
                            {proposal.category}
                        </span>
                        {/* Show voted badge on the card itself */}
                        {hasVoted && (
                            <span className={cn(
                                'inline-flex items-center gap-1 text-caption font-semibold px-2 py-0.5 rounded-full',
                                hasVoted === 'yes'
                                    ? 'bg-success/15 text-success border border-success/30'
                                    : 'bg-danger/15 text-danger border border-danger/30'
                            )}>
                                <CheckCircle className="w-3 h-3" />
                                Voted {hasVoted.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h3 className="text-heading-md font-semibold text-text-primary leading-snug group-hover:text-white transition-colors line-clamp-2">
                        {proposal.title}
                    </h3>
                    {!compact && (
                        <p className="text-body-sm text-text-secondary mt-2 line-clamp-2 leading-relaxed">
                            {proposal.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Proposer */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-caption text-white font-bold">
                        {proposal.proposer.name.charAt(0)}
                    </span>
                </div>
                <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="text-body-sm text-text-secondary font-medium truncate">
                        {proposal.proposer.name}
                    </span>
                    <span className="text-caption text-text-muted">·</span>
                    <span className="text-caption text-text-muted truncate">{proposal.proposer.university}</span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-caption text-text-muted uppercase tracking-wider">Requested</span>
                    <span className="text-body-sm font-semibold text-text-primary">
                        {formatCurrency(proposal.fundingRequested)}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-caption text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3 h-3" /> Voters
                    </span>
                    <span className="text-body-sm font-semibold text-text-primary">
                        {(votesYes + votesNo).toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-caption text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Ends
                    </span>
                    <span className={cn(
                        'text-body-sm font-semibold',
                        isVotable ? 'text-warning' : 'text-text-muted'
                    )}>
                        {formatTimeLeft(proposal.endDate)}
                    </span>
                </div>
            </div>

            {/* Vote Bar */}
            {(proposal.status !== 'pending') && (
                <div>
                    <VoteBar
                        yesVotes={votesYes}
                        noVotes={votesNo}
                        height="sm"
                        showLabels
                    />
                </div>
            )}

            {/* Tags */}
            {!compact && (
                <div className="flex flex-wrap gap-1.5">
                    {proposal.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-caption text-text-muted bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1 border-t border-white/[0.06]">
                <Link href={`/app/proposals/${proposal.id}`} className="flex-1">
                    <SecondaryButton fullWidth className="text-body-sm py-2.5">
                        View Details
                    </SecondaryButton>
                </Link>
                {isVotable && (
                    hasVoted ? (
                        // Already voted — show a disabled "Voted" button
                        <div className={cn(
                            'inline-flex items-center gap-1.5 text-body-sm font-semibold px-4 py-2.5 rounded-xl border',
                            hasVoted === 'yes'
                                ? 'bg-success/10 text-success border-success/30'
                                : 'bg-danger/10 text-danger border-danger/30'
                        )}>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Voted {hasVoted.toUpperCase()}
                        </div>
                    ) : (
                        <Link href={`/app/proposals/${proposal.id}#vote`}>
                            <PrimaryButton className="text-body-sm py-2.5 gap-1.5">
                                Vote Now
                                <TrendingUp className="w-3.5 h-3.5" />
                            </PrimaryButton>
                        </Link>
                    )
                )}
            </div>
        </motion.div>
    );
}
