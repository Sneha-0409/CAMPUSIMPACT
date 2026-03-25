// Auth pages get a clean layout without Navbar or Sidebar
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
