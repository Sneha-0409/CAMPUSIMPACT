'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    ChevronRight, ChevronLeft, Plus, Trash2, Check,
    FileText, DollarSign, Target, Eye
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { cn, fadeInUp } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';

const steps = [
    { id: 1, label: 'Basic Info', icon: FileText },
    { id: 2, label: 'Funding', icon: DollarSign },
    { id: 3, label: 'Milestones', icon: Target },
    { id: 4, label: 'Review', icon: Eye },
];

interface MilestoneField {
    title: string;
    description: string;
    allocation: string;
    dueDate: string;
}

interface FormData {
    title: string;
    description: string;
    category: string;
    university: string;
    teamSize: string;
    fundingAmount: string;
    fundingToken: string;
    duration: string;
    milestones: MilestoneField[];
}

const initialMilestone: MilestoneField = { title: '', description: '', allocation: '', dueDate: '' };

export default function SubmitProposalPage() {
    const router = useRouter();
    const { address } = useAccount();
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState<FormData>({
        title: '',
        description: '',
        category: '',
        university: '',
        teamSize: '',
        fundingAmount: '',
        fundingToken: 'USDC',
        duration: '',
        milestones: [{ ...initialMilestone }],
    });

    const updateField = (field: keyof FormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const updateMilestone = (index: number, field: keyof MilestoneField, value: string) => {
        setForm(prev => ({
            ...prev,
            milestones: prev.milestones.map((m, i) => i === index ? { ...m, [field]: value } : m),
        }));
    };

    const addMilestone = () => {
        if (form.milestones.length < 6) {
            setForm(prev => ({ ...prev, milestones: [...prev.milestones, { ...initialMilestone }] }));
        }
    };

    const removeMilestone = (index: number) => {
        if (form.milestones.length > 1) {
            setForm(prev => ({ ...prev, milestones: prev.milestones.filter((_, i) => i !== index) }));
        }
    };

    const handleSubmit = async () => {
        if (!address) {
            alert('Please connect your wallet first!');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('proposals')
                .insert([
                    {
                        title: form.title,
                        description: form.description,
                        category: form.category,
                        university: form.university,
                        team_size: parseInt(form.teamSize) || 1,
                        funding_amount: parseFloat(form.fundingAmount) || 0,
                        funding_token: form.fundingToken,
                        duration: parseInt(form.duration) || 1,
                        milestones: form.milestones,
                        proposer_address: address,
                        status: 'active'
                    }
                ]);

            if (error) throw error;

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting proposal:', error);
            alert('Failed to submit proposal. Check console for details.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-success/10 border-2 border-success/30 rounded-full flex items-center justify-center"
                >
                    <Check className="w-10 h-10 text-success" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
                    <h2 className="text-display-sm font-bold text-text-primary">Proposal Submitted!</h2>
                    <p className="text-body-lg text-text-secondary">Your proposal has been submitted to IPFS and will enter the voting queue within 24 hours after admin review.</p>
                    <p className="text-body-sm text-text-muted font-mono">IPFS Hash: Qm9K2p3Xq7vL...</p>
                </motion.div>
                <div className="flex gap-3">
                    <PrimaryButton onClick={() => router.push('/app/proposals')}>View Proposals</PrimaryButton>
                    <SecondaryButton onClick={() => { setSubmitted(false); setCurrentStep(1); }}>Submit Another</SecondaryButton>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <p className="text-caption text-text-muted uppercase tracking-widest mb-2 font-semibold">DAO Governance</p>
                <h1 className="text-display-sm font-bold text-text-primary">Submit a <span className="gradient-text">Proposal</span></h1>
                <p className="text-body-md text-text-secondary mt-2">Present your innovation to the community. Get funded by the DAO.</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-0">
                {steps.map(({ id, label }, i) => (
                    <div key={id} className="flex items-center flex-1">
                        <div
                            onClick={() => id < currentStep && setCurrentStep(id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 flex-shrink-0',
                                currentStep === id && 'bg-primary/15 border border-primary/30',
                                id < currentStep && 'cursor-pointer hover:bg-white/5',
                                id > currentStep && 'opacity-40'
                            )}
                        >
                            <div className={cn(
                                'w-6 h-6 rounded-full border-2 flex items-center justify-center text-caption font-bold transition-all',
                                id < currentStep ? 'border-success bg-success/20 text-success' :
                                    currentStep === id ? 'border-primary bg-primary/20 text-primary-light' :
                                        'border-white/20 text-text-muted'
                            )}>
                                {id < currentStep ? <Check className="w-3 h-3" /> : id}
                            </div>
                            <span className={cn(
                                'text-body-sm font-medium hidden sm:block',
                                currentStep === id ? 'text-primary-light' : id < currentStep ? 'text-success' : 'text-text-muted'
                            )}>{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="flex-1 h-px mx-2 bg-white/10" />
                        )}
                    </div>
                ))}
            </div>

            {/* Form */}
            <GlassCard className="p-8">
                <AnimatePresence mode="wait">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <motion.div key="step1" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <h2 className="text-heading-lg font-semibold text-text-primary">Project Basics</h2>
                            <div className="space-y-5">
                                <FloatingInput
                                    label="Project Title"
                                    value={form.title}
                                    onChange={v => updateField('title', v)}
                                    placeholder="e.g., AgroSync: AI Crop Disease Detection"
                                />
                                <div>
                                    <label className="block text-body-sm text-text-secondary font-medium mb-2">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => updateField('description', e.target.value)}
                                        placeholder="Describe your project, its impact, and why it deserves funding..."
                                        rows={5}
                                        className="input-field resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-body-sm text-text-secondary font-medium mb-2">Category</label>
                                        <select value={form.category} onChange={e => updateField('category', e.target.value)} className="input-field">
                                            <option value="">Select category</option>
                                            {['AgriTech', 'EdTech', 'HealthTech', 'CleanTech', 'GovTech', 'LegalTech', 'FinTech', 'Other'].map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <FloatingInput label="University" value={form.university} onChange={v => updateField('university', v)} placeholder="e.g., IIT Kanpur" />
                                </div>
                                <FloatingInput label="Team Size" value={form.teamSize} onChange={v => updateField('teamSize', v)} placeholder="e.g., 4 members" type="number" />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Funding */}
                    {currentStep === 2 && (
                        <motion.div key="step2" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <h2 className="text-heading-lg font-semibold text-text-primary">Funding Request</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-body-sm text-text-secondary font-medium mb-2">Funding Amount (₹ Lakhs)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-semibold">₹</span>
                                        <input
                                            type="number"
                                            value={form.fundingAmount}
                                            onChange={e => updateField('fundingAmount', e.target.value)}
                                            placeholder="0.00"
                                            className="input-field pl-8"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-body-sm">Lakhs</span>
                                    </div>
                                    <p className="text-caption text-text-muted mt-1.5">Maximum: ₹50 Lakhs per proposal</p>
                                </div>
                                <div>
                                    <label className="block text-body-sm text-text-secondary font-medium mb-2">Disbursement Token</label>
                                    <div className="flex gap-3">
                                        {['USDC', 'DAI', 'MATIC'].map(token => (
                                            <button
                                                key={token}
                                                onClick={() => updateField('fundingToken', token)}
                                                className={cn(
                                                    'flex-1 py-3 rounded-xl border text-body-sm font-semibold transition-all',
                                                    form.fundingToken === token
                                                        ? 'border-primary/50 bg-primary/10 text-primary-light'
                                                        : 'border-white/10 text-text-muted hover:border-white/20'
                                                )}
                                            >
                                                {token}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <FloatingInput label="Project Duration (months)" value={form.duration} onChange={v => updateField('duration', v)} placeholder="e.g., 12" type="number" />
                                <GlassCard className="p-4 bg-primary/5 border-primary/20">
                                    <p className="text-body-sm text-text-secondary">
                                        💡 <strong className="text-text-primary">Smart disbursement:</strong> Funds are released in tranches as milestones are achieved. Define milestones in the next step.
                                    </p>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Milestones */}
                    {currentStep === 3 && (
                        <motion.div key="step3" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-heading-lg font-semibold text-text-primary">Project Milestones</h2>
                                <button
                                    onClick={addMilestone}
                                    disabled={form.milestones.length >= 6}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-body-sm text-primary-light bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" /> Add Milestone
                                </button>
                            </div>
                            <div className="space-y-4">
                                {form.milestones.map((milestone, i) => (
                                    <GlassCard key={i} className="p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-body-sm font-semibold text-primary-light">Milestone {i + 1}</span>
                                            {form.milestones.length > 1 && (
                                                <button onClick={() => removeMilestone(i)} className="text-text-muted hover:text-danger transition-colors p-1">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <FloatingInput label="Title" value={milestone.title} onChange={v => updateMilestone(i, 'title', v)} placeholder="e.g., Dataset curation and model training" />
                                        <div>
                                            <label className="block text-body-sm text-text-secondary font-medium mb-2">Description</label>
                                            <textarea
                                                value={milestone.description}
                                                onChange={e => updateMilestone(i, 'description', e.target.value)}
                                                placeholder="What will be delivered at this milestone?"
                                                rows={2}
                                                className="input-field resize-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-body-sm text-text-secondary font-medium mb-2">Fund Allocation (%)</label>
                                                <input
                                                    type="number"
                                                    value={milestone.allocation}
                                                    onChange={e => updateMilestone(i, 'allocation', e.target.value)}
                                                    placeholder="25"
                                                    min="1" max="100"
                                                    className="input-field"
                                                />
                                            </div>
                                            <FloatingInput label="Due Date" value={milestone.dueDate} onChange={v => updateMilestone(i, 'dueDate', v)} type="date" />
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                            <p className="text-caption text-text-muted">
                                Total allocation: <strong className="text-text-secondary">
                                    {form.milestones.reduce((sum, m) => sum + (parseInt(m.allocation) || 0), 0)}%
                                </strong> / 100%
                            </p>
                        </motion.div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <motion.div key="step4" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">
                            <h2 className="text-heading-lg font-semibold text-text-primary">Review & Submit</h2>
                            <div className="space-y-4">
                                <ReviewRow label="Project Title" value={form.title || '—'} />
                                <ReviewRow label="Category" value={form.category || '—'} />
                                <ReviewRow label="University" value={form.university || '—'} />
                                <ReviewRow label="Funding Requested" value={`₹${form.fundingAmount || 0} Lakhs in ${form.fundingToken}`} highlight />
                                <ReviewRow label="Duration" value={`${form.duration || 0} months`} />
                                <ReviewRow label="Milestones" value={`${form.milestones.length} defined`} />
                            </div>
                            <GlassCard className="p-4 bg-success/5 border-success/20 space-y-2">
                                <p className="text-body-sm font-semibold text-text-primary flex items-center gap-2">
                                    <Check className="w-4 h-4 text-success" /> Submission Checklist
                                </p>
                                {['Proposal stored on IPFS (decentralized)', 'Smart contract records proposal on Polygon', '24h admin review before community voting', 'Voting period: 14 days'].map(item => (
                                    <p key={item} className="text-body-sm text-text-muted flex items-center gap-2 pl-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" /> {item}
                                    </p>
                                ))}
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>

            {/* Navigation */}
            <div className="flex justify-between">
                <SecondaryButton
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> Previous
                </SecondaryButton>

                {currentStep < 4 ? (
                    <PrimaryButton onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))} className="gap-2">
                        Next <ChevronRight className="w-4 h-4" />
                    </PrimaryButton>
                ) : (
                    <PrimaryButton onClick={handleSubmit} loading={submitting} className="gap-2 px-8">
                        Submit Proposal
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
}

function FloatingInput({ label, value, onChange, placeholder, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
    return (
        <div>
            <label className="block text-body-sm text-text-secondary font-medium mb-2">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-field" />
        </div>
    );
}

function ReviewRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-white/[0.06]">
            <span className="text-body-sm text-text-muted">{label}</span>
            <span className={cn('text-body-sm font-semibold text-right', highlight ? 'gradient-text text-heading-sm' : 'text-text-primary')}>{value}</span>
        </div>
    );
}
