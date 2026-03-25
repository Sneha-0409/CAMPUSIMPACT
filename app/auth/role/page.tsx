'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Shield, TrendingUp, Zap } from 'lucide-react';
import { UserRole } from '@/types';

export default function RoleSelectionPage() {
    const router = useRouter();

    const handleRoleSelect = (role: UserRole) => {
        // Save the chosen role to local storage before sending them to authenticate
        localStorage.setItem('intended_role', role);
        router.push('/auth/login');
    };

    const roles = [
        {
            id: 'student' as UserRole,
            title: 'Student',
            description: 'Submit and manage innovation projects.',
            icon: User
        },
        {
            id: 'faculty' as UserRole,
            title: 'Faculty',
            description: 'Evaluate and mentor student initiatives.',
            icon: Shield
        },
        {
            id: 'alumni' as UserRole,
            title: 'Alumni',
            description: 'Support projects through voting & mentorship.',
            icon: TrendingUp
        }
    ];

    return (
        <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background elements to match the requested design */}
            <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0f1115] to-[#0f1115]" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md flex flex-col items-center"
            >
                {/* Logo Area */}
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                    <span className="text-white text-3xl font-bold font-sans">C</span>
                </div>
                
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">CampusImpact</h1>
                <p className="text-gray-400 text-sm mb-10 text-center">Decentralized University Innovation Hub</p>

                {/* Content Box */}
                <div className="w-full bg-[#15181e]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-white mb-1">Identify Yourself</h2>
                        <p className="text-sm text-gray-400">Select your current role at the university</p>
                    </div>

                    <div className="space-y-4">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role.id)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-300 group text-left"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold mb-0.5">{role.title}</h3>
                                        <p className="text-xs text-gray-500">{role.description}</p>
                                    </div>
                                    <div className="text-gray-600 group-hover:text-white transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Tag */}
                <div className="mt-12 text-xs text-gray-500 flex items-center gap-1.5">
                    Powered by <span className="text-blue-400 font-medium">Polygon Network</span> & <span className="text-blue-400 font-medium">zkEVM</span>
                </div>
            </motion.div>
        </div>
    );
}
