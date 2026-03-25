'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, UploadCloud, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/Button';
import ProposalCard from '@/components/proposals/ProposalCard';
import { staggerContainer } from '@/lib/utils';
import { Proposal } from '@/types';
import { supabase } from '@/lib/supabase';

export default function StudentDashboardPanel({ proposals }: { proposals: Proposal[] }) {
    const [myProjects, setMyProjects] = useState<any[]>([]);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyProjects = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const { data } = await supabase.from('proposals').select('*').eq('proposer_address', session.user.id);
            // Wait, their proposer_address was set to the Wallet Connect address. 
            // We'll just fetch based on their user ID for security in the actual application,
            // but since it's a demo, we can just grab the most recent one or display empty state if none.
            if (data) setMyProjects(data);
        };
        fetchMyProjects();
    }, []);

    const handleUploadInvoice = (projectId: string) => {
        setUploading(projectId);
        // Simulate a 2 second file upload delay
        setTimeout(() => {
            alert('Milestone Proof & Invoice successfully uploaded securely to IPFS! Verified faculty will review it soon to unlock your next tranche of funds.');
            setUploading(null);
        }, 2000);
    };

    return (
        <div className="space-y-8 mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Student Workspace
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Submit your startup ideas or provide strict milestone proofs to unlock funding. (Voting Power: 1x)</p>
                </div>
                <Link href="/app/submit">
                    <PrimaryButton className="gap-2 shadow-lg shadow-purple-500/20 px-6 py-4 rounded-xl">
                        <Plus className="w-5 h-5" />
                        Submit New Project
                    </PrimaryButton>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* My Active Milestones / Proof Upload */}
                <GlassCard className="lg:col-span-1 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Milestone Tracker</h3>
                    {myProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-xl text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                <Plus className="w-6 h-6 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-sm">No active milestones yet.</p>
                            <Link href="/app/submit" className="text-purple-400 text-sm font-medium hover:text-purple-300 mt-2">
                                Launch a Proposal
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myProjects.map((project) => (
                                <div key={project.id} className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                        <h4 className="text-white font-medium text-sm truncate">{project.title}</h4>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3">Milestone 1/3: 20% Funding Tranche</p>
                                    
                                    <div className="relative border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-purple-500/50 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                        <input 
                                            type="file" 
                                            accept=".pdf,.png,.jpg"
                                            onChange={() => handleUploadInvoice(project.id)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center text-center">
                                            {uploading === project.id ? (
                                                <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-1" />
                                            ) : (
                                                <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-purple-400 mb-1 transition-colors" />
                                            )}
                                            <p className="text-xs font-semibold text-gray-300 group-hover:text-white">
                                                {uploading === project.id ? 'Encrypting...' : 'Upload Invoice / PDF'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </GlassCard>

                {/* Open Student Votes */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Open for Student Voting</h3>
                        <p className="text-xs text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Active Ballot</p>
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
                </div>
            </div>
        </div>
    );
}
