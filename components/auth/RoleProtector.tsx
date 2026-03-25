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

            // If no role has been chosen and they are not already on the onboarding page
            if (!profile?.role && pathname !== '/app/onboarding') {
                router.push('/app/onboarding');
            } 
            // If they have a role, never let them see the onboarding page again
            else if (profile?.role && pathname === '/app/onboarding') {
                router.push(`/app`); // We will make a dynamic router for this later
            }
            
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
