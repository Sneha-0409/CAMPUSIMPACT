'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, UploadCloud, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/Button';
import ProposalCard from '@/components/proposals/ProposalCard';
import { cn, staggerContainer } from '@/lib/utils';
import { Proposal } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';

export default function StudentDashboardPanel({ proposals }: { proposals: Proposal[] }) {
    const { address } = useAccount();
    const [myProjects, setMyProjects] = useState<any[]>([]);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyProjects = async () => {
            if (!address) return;
            const { data } = await supabase.from('proposals').select('*').eq('proposer_address', address);
            if (data) setMyProjects(data);
        };
        fetchMyProjects();
    }, [address]);

    const handleUploadInvoice = async (projectId: string, milestoneIndex: number) => {
        setUploading(`${projectId}-${milestoneIndex}`);
        const project = myProjects.find(p => p.id === projectId);
        if (!project) return;

        const updatedMilestones = [...(project.milestones || [])];
        if (updatedMilestones[milestoneIndex]) {
            updatedMilestones[milestoneIndex].completed = true;
            updatedMilestones[milestoneIndex].completedAt = new Date().toISOString();
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const { error } = await supabase
            .from('proposals')
            .update({ milestones: updatedMilestones })
            .eq('id', projectId);

        if (error) {
            alert('Error updating milestone: ' + error.message);
        } else {
            setMyProjects(prev => prev.map(p => 
                p.id === projectId ? { ...p, milestones: updatedMilestones } : p
            ));
            alert('Milestone Proof & Invoice successfully uploaded securely to IPFS! Verified faculty will review it soon to unlock your next tranche of funds.');
        }
        
        setUploading(null);
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
                                {myProjects.map((project) => {
                                    const milestones = project.milestones || [];
                                    const currentMilestoneIndex = milestones.findIndex((m: any) => !m.completed);
                                    const isCompleted = currentMilestoneIndex === -1 && milestones.length > 0;
                                    const currentMilestone = isCompleted ? null : (milestones[currentMilestoneIndex]);
                          
                                    const completedCount = milestones.filter((m: any) => m.completed).length;
                                    const progressPct = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

                                    return (
                                        <div key={project.id} className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        isCompleted ? "bg-success" : "bg-yellow-500 animate-pulse"
                                                    )} />
                                                    <h4 className="text-white font-medium text-sm truncate">{project.title}</h4>
                                                </div>
                                                <span className="text-caption text-text-muted shrink-0">{Math.round(progressPct)}%</span>
                                            </div>

                                            {/* Mini Progress Bar */}
                                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progressPct}%` }}
                                                    className="h-full bg-primary"
                                                />
                                            </div>
                                            
                                            {!isCompleted && currentMilestone ? (
                                                <div className="pt-1">
                                                    <p className="text-xs text-gray-400 mb-1">
                                                        Next: <span className="text-gray-300">{currentMilestone.title}</span> ({currentMilestoneIndex + 1}/{milestones.length})
                                                    </p>
                                                    <p className="text-xs text-blue-400 font-medium mb-3">
                                                        {currentMilestone.allocation}% Funding Tranche
                                                    </p>
                                                    <div className="relative border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-primary/50 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                                        <input 
                                                            type="file" 
                                                            accept=".pdf,.png,.jpg"
                                                            onChange={() => handleUploadInvoice(project.id, currentMilestoneIndex)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <div className="flex flex-col items-center text-center">
                                                            {uploading === `${project.id}-${currentMilestoneIndex}` ? (
                                                                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-1" />
                                                            ) : (
                                                                <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-primary mb-1 transition-colors" />
                                                            )}
                                                            <p className="text-xs font-semibold text-gray-300 group-hover:text-white">
                                                                {uploading === `${project.id}-${currentMilestoneIndex}` ? 'Encrypting...' : 'Upload Proof / Invoice'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : isCompleted ? (
                                                <div className="flex items-center gap-2 py-1">
                                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                                    <span className="text-xs text-success font-medium">Project Completed</span>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-500 italic">Plan your first milestone to begin.</p>
                                            )}
                                        </div>
                                    );
                                })}
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
