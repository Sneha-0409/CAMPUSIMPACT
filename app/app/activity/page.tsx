'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, FileText, Clock, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

// --- Mock/static proposal titles for mock IDs ---
const MOCK_TITLES: Record<string, string> = {
    'prop-001': 'AgroSync: AI-Powered Crop Disease Detection',
    'prop-002': 'NexaLearn: Adaptive AI Tutoring Platform',
    'prop-003': 'LegalMitra: AI Legal Aid for Rural India',
    'prop-004': 'GridFlow: Smart Energy DAO',
    'prop-005': 'MediChain: Decentralised Health Records',
};

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

interface VoteRow {
    id: string;
    proposal_id: string;
    voter_address: string;
    choice: 'yes' | 'no';
    created_at: string;
}
interface ProposalRow {
    id: string;
    title: string;
    status: string;
    created_at: string;
}

type TabType = 'all' | 'votes' | 'proposals';

export default function ActivityPage() {
    const [votes, setVotes] = useState<VoteRow[]>([]);
    const [proposals, setProposals] = useState<ProposalRow[]>([]);
    const [proposalTitles, setProposalTitles] = useState<Record<string, string>>(MOCK_TITLES);
    const [tab, setTab] = useState<TabType>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            // Fetch proposals first (to build title map)
            const { data: propData } = await supabase
                .from('proposals')
                .select('id, title, status, created_at')
                .order('created_at', { ascending: false })
                .limit(50);

            const titleMap: Record<string, string> = { ...MOCK_TITLES };
            if (propData) {
                propData.forEach(p => { titleMap[p.id] = p.title; });
                setProposals(propData);
            }
            setProposalTitles(titleMap);

            // Fetch votes
            const { data: voteData, error } = await supabase
                .from('votes')
                .select('id, proposal_id, voter_address, choice, created_at')
                .order('created_at', { ascending: false })
                .limit(50);

            if (voteData) setVotes(voteData);
            if (error) console.error('Votes error:', error);

            setLoading(false);
        };
        load();
    }, []);

    const shortAddr = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-caption text-text-muted uppercase tracking-widest mb-2 font-semibold">DAO Operations</p>
                    <h1 className="text-display-sm font-bold text-text-primary">
                        Recent <span className="gradient-text">Activity</span>
                    </h1>
                    <p className="text-body-md text-text-secondary mt-2">
                        Live feed of votes and proposals — directly from Supabase.
                        {!loading && <span className="text-primary-light font-semibold"> {votes.length} votes · {proposals.length} proposals</span>}
                    </p>
                </div>
                {/* Tab Buttons */}
                <div className="flex gap-2 flex-wrap">
                    {([
                        { id: 'all', label: 'All Activity' },
                        { id: 'votes', label: `Votes (${votes.length})` },
                        { id: 'proposals', label: `Proposals (${proposals.length})` },
                    ] as { id: TabType; label: string }[]).map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={cn(
                                'px-4 py-2 border rounded-xl text-body-sm transition-colors',
                                tab === t.id
                                    ? 'bg-primary/20 border-primary/40 text-primary-light font-semibold'
                                    : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <GlassCard className="p-4 sm:p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-20 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-light" />
                        <span className="text-text-muted">Loading live activity…</span>
                    </div>
                ) : (
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">

                        {/* ── VOTES ── */}
                        {(tab === 'all' || tab === 'votes') && (
                            <>
                                {votes.length === 0 ? (
                                    tab === 'votes' && (
                                        <div className="text-center py-10 text-text-muted">
                                            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p>No votes yet. Be the first to vote!</p>
                                        </div>
                                    )
                                ) : (
                                    votes.map((vote) => {
                                        const isYes = vote.choice === 'yes';
                                        const title = proposalTitles[vote.proposal_id] || `Proposal #${vote.proposal_id.substring(0, 8)}`;
                                        return (
                                            <motion.div key={vote.id} variants={fadeInUp} className="flex gap-4 items-start">
                                                <div className={cn(
                                                    'w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5',
                                                    isYes ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'
                                                )}>
                                                    {isYes
                                                        ? <TrendingUp className="w-5 h-5 text-success" />
                                                        : <TrendingDown className="w-5 h-5 text-danger" />
                                                    }
                                                </div>
                                                <div className="flex-1 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                        <p className="text-body-sm text-text-primary font-medium">
                                                            <span className={cn('font-bold', isYes ? 'text-success' : 'text-danger')}>
                                                                {isYes ? '✓ YES' : '✗ NO'}
                                                            </span>
                                                            {' '}vote on <span className="text-text-primary">&ldquo;{title}&rdquo;</span>
                                                        </p>
                                                        <span className="text-caption text-text-muted flex items-center gap-1 flex-shrink-0">
                                                            <Clock className="w-3 h-3" /> {timeAgo(vote.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-caption text-text-muted mt-1 font-mono">
                                                        by {shortAddr(vote.voter_address)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </>
                        )}

                        {/* ── PROPOSALS ── */}
                        {(tab === 'all' || tab === 'proposals') && (
                            <>
                                {proposals.length === 0 && tab === 'proposals' ? (
                                    <div className="text-center py-10 text-text-muted">
                                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        <p>No proposals submitted yet.</p>
                                    </div>
                                ) : (
                                    proposals.map((p) => (
                                        <motion.div key={p.id} variants={fadeInUp} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 bg-warning/10 border-warning/30">
                                                <FileText className="w-5 h-5 text-warning" />
                                            </div>
                                            <div className="flex-1 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <p className="text-body-sm text-text-primary font-medium">
                                                        📄 New proposal: <span className="text-text-primary">&ldquo;{p.title}&rdquo;</span>
                                                    </p>
                                                    <span className="text-caption text-text-muted flex items-center gap-1 flex-shrink-0">
                                                        <Clock className="w-3 h-3" /> {timeAgo(p.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-caption text-text-muted mt-1 capitalize">
                                                    Status: <span className={cn(
                                                        'font-semibold',
                                                        p.status === 'active' ? 'text-success' : p.status === 'rejected' ? 'text-danger' : 'text-text-muted'
                                                    )}>{p.status}</span>
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </>
                        )}

                        {/* Empty state for "All" tab */}
                        {tab === 'all' && votes.length === 0 && proposals.length === 0 && (
                            <div className="text-center py-16 text-text-muted">
                                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p className="text-body-md">No activity yet. Submit a proposal or cast a vote!</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </GlassCard>
        </div>
    );
}
