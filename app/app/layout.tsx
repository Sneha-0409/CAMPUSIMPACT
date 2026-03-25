import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Sidebar />
            <div className="pt-16 pl-0 md:pl-64">
                <div className="min-h-screen p-6 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
