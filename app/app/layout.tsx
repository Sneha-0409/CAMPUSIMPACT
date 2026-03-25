import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import RoleProtector from '@/components/auth/RoleProtector';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleProtector>
            <div className="min-h-screen bg-background">
                <Navbar />
                <Sidebar />
                <div className="pt-16 pl-0 md:pl-64">
                    <div className="min-h-screen p-6 md:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </RoleProtector>
    );
}
