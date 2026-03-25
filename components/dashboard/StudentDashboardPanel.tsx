'use client';

import { motion } from 'framer-motion';
import { Plus, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/Button';
import ProposalCard from '@/components/proposals/ProposalCard';
import { staggerContainer } from '@/lib/utils';
import { Proposal } from '@/types';

export default function StudentDashboardPanel({ proposals }: { proposals: Proposal[] }) {
    return (
        <div className="space-y-8 mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Student Workspace
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Submit your startup ideas to the DAO or vote on peer proposals. (Voting Power: 1x)</p>
                </div>
                <Link href="/app/submit">
                    <PrimaryButton className="gap-2 shadow-lg shadow-purple-500/20">
                        <Plus className="w-4 h-4" />
                        Submit New Project
                    </PrimaryButton>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* My Projects Status */}
                <GlassCard className="lg:col-span-1 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">My Submissions</h3>
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-xl text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Plus className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-sm">You haven't submitted any projects yet.</p>
                        <Link href="/app/submit" className="text-purple-400 text-sm font-medium hover:text-purple-300 mt-2">
                            Create a Proposal
                        </Link>
                    </div>
                </GlassCard>

                {/* Proposals Needing Votes */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Open for Student Voting</h3>
                        <p className="text-xs text-purple-400 font-medium bg-purple-500/10 px-3 py-1 rounded-full">Your Vote = 1 Votes</p>
                    </div>
                    
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid sm:grid-cols-2 gap-4"
                    >
                        {proposals.slice(0, 2).map((proposal, i) => (
                            <ProposalCard key={proposal.id} proposal={proposal} index={i} />
                        ))}
                    </motion.div>
                    
                    <div className="mt-4 flex justify-end">
                        <Link href="/app/proposals" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                            View All Proposals <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
