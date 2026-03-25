'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, FileText, CheckCircle2, ChevronDown, UserSquare2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/Button';
import { Proposal } from '@/types';
import { supabase } from '@/lib/supabase';

export default function ReviewerDashboardPanel({ role, proposals }: { role: 'faculty' | 'alumni', proposals: Proposal[] }) {
    // Basic rubric state for demonstration without writing it to DB yet
    const [evaluating, setEvaluating] = useState<string | null>(null);
    const [scores, setScores] = useState({ impact: 0, technical: 0, sustainability: 0 });

    const [submitting, setSubmitting] = useState(false);

    const totalScore = scores.impact + scores.technical + scores.sustainability;
    const maxWeight = role === 'faculty' ? 1.5 : 1.2;
    const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

    const handleScoreSelect = (category: string, value: number) => {
        setScores(prev => ({ ...prev, [category]: value }));
    };

    const submitEvaluation = async () => {
        setSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not logged in');

            // Math: (Score / 15) * MaxWeight
            // e.g. Faculty gets 15/15 = 100% * 1.5 = 1.5 Yes Votes. 
            // e.g. Faculty gets 10/15 = 66% * 1.5 = 1.0 Yes Votes.
            const percentage = totalScore / 15.0;
            const finalVoteWeight = parseFloat((percentage * maxWeight).toFixed(2));

            const { error } = await supabase.from('votes').insert({
                proposal_id: evaluating,
                voter_address: session.user.email || session.user.id, // Fallback for voter address
                voter_role: role,
                score: totalScore,
                weight_cast: finalVoteWeight,
                choice: 'yes'
            });

            if (error) throw error;
            
            alert(`Evaluation submitted! Your rubric score of ${totalScore}/15 translated to ${finalVoteWeight} YES votes cast towards this project.`);
            setEvaluating(null);
            setScores({ impact: 0, technical: 0, sustainability: 0 });
        } catch (err: any) {
            console.error(err);
            alert('Failed to cast weighted vote. Have you already voted on this project?');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        {roleTitle} Evaluation Workspace
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Review student projects using the official DAO rubric. (Max Voting Power: {maxWeight}x)</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-medium text-sm">
                    <UserSquare2 className="w-4 h-4" />
                    {roleTitle} Privileges
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Proposal Evaluation Queue */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Needs Evaluation</h3>
                    {proposals.slice(0, 3).map((proposal) => (
                        <GlassCard key={proposal.id} className="p-5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white/10 text-gray-300">
                                            {proposal.category}
                                        </span>
                                        <span className="text-yellow-400/80 text-xs flex items-center gap-1 font-medium">
                                            <Star className="w-3 h-3 fill-yellow-400/80" /> Needs Score
                                        </span>
                                    </div>
                                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{proposal.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{proposal.description}</p>
                                </div>
                                <PrimaryButton
                                    onClick={() => setEvaluating(evaluating === proposal.id ? null : proposal.id)}
                                    className="text-xs py-1.5 px-3 whitespace-nowrap bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
                                >
                                    {evaluating === proposal.id ? 'Close Rubric' : 'Evaluate'}
                                </PrimaryButton>
                            </div>

                            {/* Rubric Expansion Tool */}
                            <AnimatePresence>
                                {evaluating === proposal.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-4 pt-4 border-t border-white/5"
                                    >
                                        <div className="space-y-4">
                                            {[
                                                { id: 'impact', label: 'Idea Impact', desc: 'How much positive change creates this?' },
                                                { id: 'technical', label: 'Technical Feasibility', desc: 'Can this actually be built?' },
                                                { id: 'sustainability', label: 'Long Term Sustainability', desc: 'Will this survive without DAO funds later?' }
                                            ].map((cat) => (
                                                <div key={cat.id}>
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <p className="text-sm font-medium text-gray-200">{cat.label}</p>
                                                        <span className="text-xs font-bold text-blue-400">{scores[cat.id as keyof typeof scores]}/5</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((num) => (
                                                            <button
                                                                key={num}
                                                                onClick={(e) => { e.stopPropagation(); handleScoreSelect(cat.id, num); }}
                                                                className={`flex-1 py-1.5 rounded-md text-xs font-bold border ${scores[cat.id as keyof typeof scores] === num ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                                                            >
                                                                {num}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 mt-4">
                                                <div>
                                                    <p className="text-xs text-gray-400">Total Score</p>
                                                    <p className="text-xl font-bold text-white tracking-tight">{totalScore}<span className="text-sm text-gray-500 font-medium">/15</span></p>
                                                </div>
                                                <PrimaryButton
                                                    onClick={submitEvaluation}
                                                    disabled={totalScore === 0 || submitting}
                                                    loading={submitting}
                                                    className="shadow-lg shadow-blue-500/20 gap-2 disabled:opacity-50"
                                                >
                                                    Submit Rubric <CheckCircle2 className="w-4 h-4" />
                                                </PrimaryButton>
                                            </div>
                                            <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
                                                Your vote weight <ChevronDown className="w-2 h-2" /> calculated post-eval
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </GlassCard>
                    ))}
                </div>

                {/* Score Log History */}
                <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Evaluation Logs</h3>
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-xl text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <FileText className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-sm">You haven't evaluated any projects yet.</p>
                        <p className="text-xs text-gray-500 mt-2 max-w-[200px] mx-auto">
                            Submit your first rubric to cast your weighted {maxWeight}x votes automatically.
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
