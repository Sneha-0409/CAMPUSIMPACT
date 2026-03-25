'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, BookOpen, UploadCloud, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';

export default function OnboardingPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [idFile, setIdFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { id: 'student', title: 'Student', icon: <GraduationCap className="w-6 h-6" />, desc: 'Submit projects and vote' },
        { id: 'faculty', title: 'Faculty', icon: <Briefcase className="w-6 h-6" />, desc: 'Evaluate and score projects' },
        { id: 'alumni', title: 'Alumni', icon: <BookOpen className="w-6 h-6" />, desc: 'Review and fund proposals' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedRole) {
            setError('Please select a role');
            return;
        }
        if (!idFile) {
            setError('Please upload an ID card for verification');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not logged in');

            // 1. We update their profile directly with the chosen role 
            // In a real production app, ID URLs would be uploaded to Supabase Storage here.
            // For now, we update the role and mark ID verification as pending!
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ 
                    role: selectedRole,
                    id_verified: 'pending',
                    id_card_url: 'uploaded_file_placeholder.png' // Would be actual URL after storage
                })
                .eq('id', session.user.id);

            if (updateError) throw updateError;

            // Instantly redirect them to the app dashboard which will now open up!
            router.push('/app');
            router.refresh(); // force the layout to re-check the route wrapper

        } catch (err: any) {
            setError(err.message || 'Error saving profile');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 relative z-10">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                    Welcome to CampusImpact DAO
                </h1>
                <p className="text-gray-400 text-sm">Please verify your identity and select your platform role.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Role Selection */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">1. Select Your Role</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => setSelectedRole(role.id as UserRole)}
                                className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                                    selectedRole === role.id 
                                        ? 'border-purple-500 bg-purple-500/10' 
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className={`p-3 rounded-full mb-4 ${selectedRole === role.id ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                    {role.icon}
                                </div>
                                <h3 className="text-white font-medium mb-1">{role.title}</h3>
                                <p className="text-xs text-gray-400 text-center">{role.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ID Card Upload */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">2. Upload ID Verification</h2>
                    <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:bg-white/[0.02] transition-colors group">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                            {idFile ? (
                                <>
                                    <CheckCircle2 className="w-12 h-12 text-green-400 mb-3" />
                                    <p className="text-green-400 font-medium">{idFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                        <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-purple-400 m-auto" />
                                    </div>
                                    <p className="text-white font-medium mb-1">Upload University ID Card</p>
                                    <p className="text-xs text-gray-500 text-center max-w-[250px]">
                                        Requires a clear photo of your student, faculty, or alumni ID card. (Max 5MB)
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !selectedRole || !idFile}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    {loading ? 'Verifying...' : 'Complete Setup'}
                </button>
            </form>
        </div>
    );
}
