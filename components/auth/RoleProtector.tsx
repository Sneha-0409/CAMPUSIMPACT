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
            // If they just logged in after picking a role on the landing page (saved in localStorage)
            const intendedRole = localStorage.getItem('intended_role');
            if (intendedRole && !profile?.role) {
                // Update their profile instantly in the background! (Upsert guarantees creation if they missed it during signup)
                await supabase.from('profiles').upsert({ id: session.user.id, role: intendedRole as UserRole, id_verified: 'pending' });
                localStorage.removeItem('intended_role');
                
                // Now they have a role, so let them skip onboarding!
                router.push('/app');
                setLoading(false);
                return;
            }

            // Normal Fallback logic: If no role chosen and no localStorage (e.g. direct link)
            // if (!profile?.role && pathname !== '/app/onboarding') {
            //     router.push('/app/onboarding');
            // } 
            // // If they have a role, never let them see the onboarding page again
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
