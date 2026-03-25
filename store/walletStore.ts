'use client';

import { create } from 'zustand';
import { WalletState } from '@/types';

interface WalletStore extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  setAddress: (address: string) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: null,
  isConnected: false,
  balance: '0',
  chainId: null,
  network: '',

  connect: async () => {
    // Simulate wallet connection
    await new Promise((r) => setTimeout(r, 1200));
    set({
      address: '0x742d35Cc6634C0532925a3b8D4C9b5e4B8B7f1a',
      isConnected: true,
      balance: '12500.00',
      chainId: 137,
      network: 'Polygon',
    });
  },

  disconnect: () => {
    set({
      address: null,
      isConnected: false,
      balance: '0',
      chainId: null,
      network: '',
    });
  },

  setAddress: (address: string) => set({ address }),
}));
