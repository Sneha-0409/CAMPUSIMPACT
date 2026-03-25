import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CampusImpact DAO — Decentralized Innovation Funding for Indian Universities',
  description: 'Transparent, smart contract-powered governance for student innovation projects. Fund, vote, and track milestones on-chain.',
  keywords: ['DAO', 'blockchain', 'student funding', 'India', 'Web3', 'governance', 'DeFi', 'innovation'],
  openGraph: {
    title: 'CampusImpact DAO',
    description: 'Decentralizing Campus Innovation Funding across Indian Universities',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} antialiased bg-background text-text-primary overflow-x-hidden`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

