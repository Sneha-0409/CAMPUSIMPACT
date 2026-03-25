'use client';

import * as React from 'react';
import { Buffer } from 'buffer';
import {
    RainbowKitProvider,
    getDefaultConfig,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
    polygon,
    polygonAmoy,
    sepolia,
} from 'wagmi/chains';

const config = getDefaultConfig({
    appName: 'CampusImpact DAO',
    projectId: 'a42f74154fa784d0ababc2ddbd5db77a', // Public demo WalletConnect ID
    chains: [polygon, polygonAmoy, sepolia],
    ssr: true, // required for Next.js App Router
});

if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || Buffer;
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#10b981', // Tailwind success green or a primary green
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                        overlayBlur: 'small',
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
