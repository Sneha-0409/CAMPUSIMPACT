'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockProposals } from '@/lib/mockData';
import ProposalCard from '@/components/proposals/ProposalCard';
import { staggerContainer } from '@/lib/utils';
import { ProposalStatus, Proposal } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const statusFilters: { label: string; value: ProposalStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Passed', value: 'passed' },
    { label: 'Executed', value: 'executed' },
    { label: 'Rejected', value: 'rejected' },
];

const categories = ['All', 'AgriTech', 'EdTech', 'HealthTech', 'CleanTech', 'GovTech', 'LegalTech'];

export default function ProposalsPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<ProposalStatus | 'all'>('all');
    const [category, setCategory] = useState('All');
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch from Supabase
    useEffect(() => {
        const fetchProposals = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('proposals').select('*').order('created_at', { ascending: false });

            if (data && !error) {
                // Map the DB structure to our frontend interface
                const mappedProposals: Proposal[] = data.map((row) => {
                    // Start date is creation date, end date is creation date + 14 days
                    const createdDate = new Date(row.created_at);
                    const endDate = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

                    return {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        fullDescription: row.description, // Fallback for missing property
                        category: row.category,
                        status: row.status as ProposalStatus,
                        proposer: {
                            name: row.proposer_address?.substring(0, 6) + '...' || 'Anon',
                            address: row.proposer_address || '0x0',
                            university: row.university || 'Unknown'
                        },
                        fundingRequested: row.funding_amount || 0,
                        fundingToken: row.funding_token || 'USDC',
                        votesYes: 0, // In real life, fetch from Governor Contract
                        votesNo: 0,
                        totalVoters: 0,
                        quorumRequired: 1000000,
                        quorumNumber: 1000000,
                        startDate: createdDate.toISOString(),
                        endDate: endDate.toISOString(),
                        tags: row.tags || [],
                        milestones: row.milestones || []
                    };
                });

                // For demonstration, keep the mock ones if DB is empty so page isn't totally blank
                // setProposals(mappedProposals.length > 0 ? mappedProposals : mockProposals);
                setProposals([...mappedProposals, ...mockProposals]);
            } else {
                setProposals(mockProposals); // Fallback
            }
            setLoading(false);
        };

        fetchProposals();
    }, []);

    const filtered = proposals.filter((p) => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === 'all' || p.status === status;
        const matchCategory = category === 'All' || p.category === category;
        return matchSearch && matchStatus && matchCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <p className="text-caption text-text-muted uppercase tracking-widest mb-2 font-semibold">Community Governance</p>
                <h1 className="text-display-sm font-bold text-text-primary">
                    All <span className="gradient-text">Proposals</span>
                </h1>
                <p className="text-body-md text-text-secondary mt-2">
                    {proposals.length} total · {proposals.filter(p => p.status === 'active').length} active
                </p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col gap-4">
                {/* Search */}
                <div className="relative max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search proposals..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-11"
                    />
                </div>

                {/* Status filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {statusFilters.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setStatus(value)}
                            className={cn(
                                'px-4 py-2 rounded-xl text-body-sm font-medium transition-all duration-150',
                                status === value
                                    ? 'bg-primary/15 text-primary-light border border-primary/30'
                                    : 'text-text-muted border border-white/[0.06] hover:border-white/20 hover:text-text-secondary'
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Category filters */}
                <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-caption text-text-muted flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3 h-3" /> Category:
                    </span>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-caption font-medium transition-all duration-150',
                                category === cat
                                    ? 'bg-white/10 text-text-primary'
                                    : 'text-text-muted hover:text-text-secondary'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-24">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-text-muted" />
                    </div>
                    <h3 className="text-heading-md font-semibold text-text-secondary mb-2">No proposals found</h3>
                    <p className="text-body-sm text-text-muted">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {filtered.map((proposal, i) => (
                        <ProposalCard key={proposal.id} proposal={proposal} index={i} />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
