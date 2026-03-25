/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Class Utility ─────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Formatting Utilities ──────────────────────────────────────────────────
export function formatCurrency(value: number, prefix = '₹', suffix = 'L'): string {
  if (value >= 100) return `${prefix}${value.toFixed(1)}${suffix}`;
  return `${prefix}${value.toFixed(2)}${suffix}`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTimeLeft(endDate: string): string {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

// ─── Vote Calculation ─────────────────────────────────────────────────────
export function getVotePercentage(yesVotes: number, noVotes: number): { yes: number; no: number } {
  const total = yesVotes + noVotes;
  if (total === 0) return { yes: 0, no: 0 };
  return {
    yes: Math.round((yesVotes / total) * 100),
    no: Math.round((noVotes / total) * 100),
  };
}

export function getQuorumPercentage(totalVoters: number, quorumRequired: number): number {
  return Math.min(Math.round((totalVoters / quorumRequired) * 100), 100);
}

// ─── Status Helpers ───────────────────────────────────────────────────────
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'badge-active',
    pending: 'badge-pending',
    passed: 'badge-passed',
    rejected: 'badge-rejected',
    executed: 'badge-executed',
  };
  return map[status] || 'badge-pending';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Active',
    pending: 'Pending',
    passed: 'Passed',
    rejected: 'Rejected',
    executed: 'Executed',
  };
  return map[status] || status;
}

// ─── Animation Variants ───────────────────────────────────────────────────
export const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const slideInLeft: any = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};
