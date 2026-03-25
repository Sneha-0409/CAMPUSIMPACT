// ─── Core Domain Types ────────────────────────────────────────────────────

export type ProposalStatus = 'active' | 'pending' | 'passed' | 'rejected' | 'executed';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  fundAllocation: number; // percentage
  completed: boolean;
  dueDate: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  proposer: {
    name: string;
    university: string;
    address: string;
    avatar?: string;
  };
  fundingRequested: number; // in INR (lakhs)
  fundingToken: string;
  status: ProposalStatus;
  votesYes: number;
  votesNo: number;
  totalVoters: number;
  quorumRequired: number;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  tags: string[];
  ipfsHash?: string;
  txHash?: string;
}

export interface Transaction {
  id: string;
  date: string;
  proposal: string;
  proposalId: string;
  amount: number;
  type: 'allocation' | 'disbursement' | 'return';
  status: 'confirmed' | 'pending' | 'failed';
  txHash: string;
}

export interface TreasuryData {
  totalBalance: number; // INR in lakhs
  lockedBalance: number;
  availableBalance: number;
  totalDisbursed: number;
  monthlyChange: number; // percentage
  allocations: AllocationItem[];
  transactions: Transaction[];
}

export interface AllocationItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface GovernanceToken {
  symbol: string;
  name: string;
  totalSupply: number;
  yourBalance: number;
  circulatingSupply: number;
  votingWeight: number; // percentage
  holders: number;
  price: number; // in INR
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
  network: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  description?: string;
}
