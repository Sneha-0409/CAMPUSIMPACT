'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/types';

export default function RoleProtector({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            // AUTO-MAGIC ROLE ASSIGNMENT:
            // 1. Check for intended_role from landing page
            const intendedRole = localStorage.getItem('intended_role');
            
            if (!profile?.role) {
                const finalRole = (intendedRole || 'student') as UserRole;
                console.log('No role found, assigning default:', finalRole);
                
                // Update their profile instantly (Upsert guarantees creation)
                const { error } = await supabase.from('profiles').upsert({ 
                    id: session.user.id, 
                    role: finalRole, 
                    id_verified: 'pending' 
                });
                
                if (error) {
                    console.error('Supabase Save Error:', error);
                }
                
                if (intendedRole) localStorage.removeItem('intended_role');
                
                // Refresh or continue
                setLoading(false);
                return;
            }            // // If they have a role, never let them see the onboarding page again
            // else if (profile?.role && pathname === '/app/onboarding') {
            //     router.push(`/app`); 
            // }
            
            setLoading(false);
        };

        checkUser();
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050508]">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
