import { Proposal, TreasuryData, GovernanceToken } from '@/types';

// ─── Mock Proposals ────────────────────────────────────────────────────────

export const mockProposals: Proposal[] = [
  {
    id: 'prop-001',
    title: 'AgroSync: AI-Powered Crop Disease Detection Platform',
    description: 'A real-time crop disease identification system using satellite imagery and edge AI models deployed on affordable smartphone devices for rural farmers.',
    fullDescription: `AgroSync leverages cutting-edge computer vision models trained on 2M+ annotated crop images to identify 47 disease variants across 12 major Indian crops. Our edge-optimized ONNX runtime enables detection without internet connectivity — critical for rural deployment.\n\nPhase 1 deploys to 500 farmers in UP and Bihar. Phase 2 scales via partnerships with state agriculture departments. Revenue model: SaaS licensing to Krishi Kendras and direct B2C subscription.`,
    category: 'AgriTech',
    proposer: {
      name: 'Arjun Sharma',
      university: 'IIT Kanpur',
      address: '0x1a2b...3c4d',
    },
    fundingRequested: 18.5,
    fundingToken: 'USDC',
    status: 'active',
    votesYes: 8420,
    votesNo: 1340,
    totalVoters: 9760,
    quorumRequired: 7500,
    startDate: '2026-02-15',
    endDate: '2026-03-01',
    milestones: [
      { id: 'm1', title: 'Dataset Curation & Model Training', description: 'Curate 2M annotated images, train baseline CNN models', fundAllocation: 25, completed: true, dueDate: '2026-04-01' },
      { id: 'm2', title: 'Edge Optimization & Mobile App', description: 'ONNX runtime optimization, React Native app development', fundAllocation: 30, completed: false, dueDate: '2026-06-01' },
      { id: 'm3', title: 'Pilot Deployment (500 farmers)', description: 'UP/Bihar pilot, farmer training, feedback collection', fundAllocation: 25, completed: false, dueDate: '2026-08-01' },
      { id: 'm4', title: 'Government Partnership & Scale', description: 'State agriculture department partnerships, Krishi Kendra integration', fundAllocation: 20, completed: false, dueDate: '2026-10-01' },
    ],
    tags: ['AI/ML', 'AgriTech', 'Edge Computing', 'Rural India'],
    ipfsHash: 'Qm1a2b3c4d5e6f',
    txHash: '0xabcdef...',
  },
  {
    id: 'prop-002',
    title: 'ClearVote: Blockchain-Based Campus Election System',
    description: 'Immutable, transparent student body elections using zero-knowledge proofs to ensure privacy while maintaining full auditability on-chain.',
    fullDescription: `ClearVote eliminates electoral fraud in campus elections through ZK-SNARK-based anonymous voting. Each voter receives a cryptographic commitment; their vote is verifiable without revealing identity.\n\nBuilt on Polygon for gas efficiency. Integrates with university identity systems (Aadhaar-KYC optional). Deployable to any Indian university within 48 hours via our SDK.`,
    category: 'GovTech',
    proposer: {
      name: 'Priya Nair',
      university: 'IIT Bombay',
      address: '0x5e6f...7a8b',
    },
    fundingRequested: 12.0,
    fundingToken: 'USDC',
    status: 'active',
    votesYes: 6200,
    votesNo: 3800,
    totalVoters: 10000,
    quorumRequired: 7500,
    startDate: '2026-02-18',
    endDate: '2026-03-04',
    milestones: [
      { id: 'm1', title: 'ZK Circuit Design & Testing', description: 'Circom circuits for anonymous voting', fundAllocation: 30, completed: true, dueDate: '2026-04-15' },
      { id: 'm2', title: 'Smart Contract Deployment', description: 'Polygon mainnet deployment, audit', fundAllocation: 25, completed: false, dueDate: '2026-06-15' },
      { id: 'm3', title: 'University Pilot (3 campuses)', description: 'IIT B, IIT K, NIT Trichy pilot elections', fundAllocation: 45, completed: false, dueDate: '2026-09-01' },
    ],
    tags: ['ZK-Proofs', 'Governance', 'GovTech', 'Privacy'],
    ipfsHash: 'Qm7g8h9i0j',
  },
  {
    id: 'prop-003',
    title: 'NexaLearn: Adaptive AI Tutoring for Tier-3 Colleges',
    description: 'Personalized learning paths powered by LLMs, targeting students at Tier-3 engineering colleges with curriculum-aligned practice and real-time doubt resolution.',
    fullDescription: `NexaLearn addresses the massive quality gap in technical education beyond IITs/NITs. Our LLM-powered tutor adapts to each student's knowledge graph, identifies weak concepts, and generates targeted exercises.\n\nPowered by fine-tuned Llama-3 on GATE/competitive exam datasets. Offline-first architecture for low-bandwidth regions. Monetized via institution licensing at ₹199/student/month.`,
    category: 'EdTech',
    proposer: {
      name: 'Rahul Verma',
      university: 'NIT Trichy',
      address: '0x9c0d...1e2f',
    },
    fundingRequested: 22.0,
    fundingToken: 'USDC',
    status: 'active',
    votesYes: 11200,
    votesNo: 800,
    totalVoters: 12000,
    quorumRequired: 7500,
    startDate: '2026-02-10',
    endDate: '2026-02-28',
    milestones: [
      { id: 'm1', title: 'LLM Fine-tuning & Knowledge Graph', description: 'Fine-tune Llama-3 on edu datasets', fundAllocation: 35, completed: true, dueDate: '2026-03-15' },
      { id: 'm2', title: 'PWA Development & Offline Mode', description: 'Progressive web app, service workers', fundAllocation: 30, completed: true, dueDate: '2026-05-01' },
      { id: 'm3', title: 'Institutional Partnerships', description: '50 Tier-3 colleges onboarding', fundAllocation: 35, completed: false, dueDate: '2026-08-01' },
    ],
    tags: ['LLM', 'EdTech', 'Offline-First', 'AI Tutor'],
    txHash: '0x123456...',
  } as Proposal,
  {
    id: 'prop-004',
    title: 'MediChain: Decentralized Patient Health Records',
    description: 'Patient-controlled health data on-chain with selective disclosure for doctors, insurers, and hospitals — ending data silos in Indian healthcare.',
    fullDescription: `MediChain gives patients true ownership of their health records using NFT-based access control. Share records with a QR code. Revoke access instantly. Emergency access protocols ensure critical-care continuity.\n\nIntegrates with ABDM (Ayushman Bharat Digital Mission) for national health ID linkage.`,
    category: 'HealthTech',
    proposer: {
      name: 'Ananya Singh',
      university: 'AIIMS Delhi',
      address: '0x3g4h...5i6j',
    },
    fundingRequested: 28.0,
    fundingToken: 'USDC',
    status: 'pending',
    votesYes: 0,
    votesNo: 0,
    totalVoters: 0,
    quorumRequired: 7500,
    startDate: '2026-03-01',
    endDate: '2026-03-15',
    milestones: [
      { id: 'm1', title: 'ABDM Integration & Smart Contracts', description: 'Connect with national health ID', fundAllocation: 30, completed: false, dueDate: '2026-05-01' },
      { id: 'm2', title: 'Mobile App + QR Access System', description: 'Patient and doctor mobile apps', fundAllocation: 35, completed: false, dueDate: '2026-07-01' },
      { id: 'm3', title: 'Hospital Pilot (5 cities)', description: 'Delhi, Mumbai, Bangalore, Chennai, Hyderabad', fundAllocation: 35, completed: false, dueDate: '2026-10-01' },
    ],
    tags: ['HealthTech', 'NFT', 'ABDM', 'Privacy'],
  },
  {
    id: 'prop-005',
    title: 'GridFlow: P2P Solar Energy Trading Protocol',
    description: 'Enabling campus rooftop solar producers to sell surplus energy to neighbours via automated smart contracts — a micro-grid energy marketplace.',
    fullDescription: `GridFlow tokenizes solar energy production into tradeable Energy Tokens (1 token = 1 kWh). Producers earn; consumers save. All settlements automated via Ethereum smart contracts integrated with smart meters.\n\nPilot at IIT Madras campus targeting 200 kWh/day surplus redistribution.`,
    category: 'CleanTech',
    proposer: {
      name: 'Kiran Reddy',
      university: 'IIT Madras',
      address: '0x7k8l...9m0n',
    },
    fundingRequested: 15.5,
    fundingToken: 'USDC',
    status: 'executed',
    votesYes: 9800,
    votesNo: 700,
    totalVoters: 10500,
    quorumRequired: 7500,
    startDate: '2026-01-01',
    endDate: '2026-01-20',
    milestones: [
      { id: 'm1', title: 'Smart Meter Integration', description: 'IoT bridge for smart meter data', fundAllocation: 30, completed: true, dueDate: '2026-02-01' },
      { id: 'm2', title: 'Energy Token Smart Contract', description: 'ERC-20 energy tokens, AMM pool', fundAllocation: 40, completed: true, dueDate: '2026-03-01' },
      { id: 'm3', title: 'IIT Madras Campus Pilot', description: 'Live trading on campus microgrid', fundAllocation: 30, completed: false, dueDate: '2026-05-01' },
    ],
    tags: ['CleanTech', 'P2P Energy', 'IoT', 'DeFi'],
    txHash: '0xfedcba...',
  },
  {
    id: 'prop-006',
    title: 'LegalMitra: AI Legal Aid for First-Gen Students',
    description: 'Free AI-powered legal guidance for first-generation college students navigating scholarships, tenancy disputes, and consumer rights via vernacular NLP.',
    fullDescription: `LegalMitra democratizes legal knowledge through a bilingual AI assistant supporting Hindi, Tamil, Telugu, and Bengali. Trained on Indian law corpus (IPC, CrPC, Consumer Protection Act).\n\nReferral network to 200+ pro-bono lawyers for complex cases. NFT-based achievement system to gamify legal literacy.`,
    category: 'LegalTech',
    proposer: {
      name: 'Meera Krishnan',
      university: 'Delhi University',
      address: '0x1o2p...3q4r',
    },
    fundingRequested: 9.5,
    fundingToken: 'USDC',
    status: 'rejected',
    votesYes: 3200,
    votesNo: 8100,
    totalVoters: 11300,
    quorumRequired: 7500,
    startDate: '2026-01-15',
    endDate: '2026-01-30',
    milestones: [
      { id: 'm1', title: 'Legal NLP Model Training', description: 'Fine-tune on Indian law documents', fundAllocation: 40, completed: false, dueDate: '2026-03-01' },
      { id: 'm2', title: 'Multilingual Chatbot Interface', description: '4 language support + voice', fundAllocation: 35, completed: false, dueDate: '2026-05-01' },
      { id: 'm3', title: 'Community Launch', description: '50,000 student users target', fundAllocation: 25, completed: false, dueDate: '2026-08-01' },
    ],
    tags: ['LegalTech', 'NLP', 'Accessibility', 'Vernacular AI'],
  },
];

// ─── Mock Treasury ─────────────────────────────────────────────────────────

export const mockTreasury: TreasuryData = {
  totalBalance: 248.5,
  lockedBalance: 87.2,
  availableBalance: 161.3,
  totalDisbursed: 96.8,
  monthlyChange: 12.4,
  allocations: [
    { category: 'AgriTech', amount: 45.2, percentage: 28, color: '#10b981' },
    { category: 'EdTech', amount: 38.6, percentage: 24, color: '#6366f1' },
    { category: 'HealthTech', amount: 32.4, percentage: 20, color: '#3b82f6' },
    { category: 'CleanTech', amount: 25.8, percentage: 16, color: '#f59e0b' },
    { category: 'GovTech', amount: 19.3, percentage: 12, color: '#8b5cf6' },
  ],
  transactions: [
    { id: 'tx-001', date: '2026-02-27', proposal: 'AgroSync', proposalId: 'prop-001', amount: 18.5, type: 'allocation', status: 'confirmed', txHash: '0xabcd...1234' },
    { id: 'tx-002', date: '2026-02-25', proposal: 'NexaLearn', proposalId: 'prop-003', amount: 7.7, type: 'disbursement', status: 'confirmed', txHash: '0xef01...5678' },
    { id: 'tx-003', date: '2026-02-22', proposal: 'GridFlow', proposalId: 'prop-005', amount: 15.5, type: 'disbursement', status: 'confirmed', txHash: '0x2345...9abc' },
    { id: 'tx-004', date: '2026-02-20', proposal: 'ClearVote', proposalId: 'prop-002', amount: 12.0, type: 'allocation', status: 'confirmed', txHash: '0x6789...def0' },
    { id: 'tx-005', date: '2026-02-18', proposal: 'MediChain', proposalId: 'prop-004', amount: 28.0, type: 'allocation', status: 'pending', txHash: '0x1234...abcd' },
    { id: 'tx-006', date: '2026-02-15', proposal: 'LegalMitra', proposalId: 'prop-006', amount: 9.5, type: 'return', status: 'confirmed', txHash: '0x5678...ef01' },
  ],
};

// ─── Mock Governance Token ─────────────────────────────────────────────────

export const mockGovernanceToken: GovernanceToken = {
  symbol: 'CIMP',
  name: 'CampusImpact Governance Token',
  totalSupply: 10_000_000,
  yourBalance: 12_500,
  circulatingSupply: 6_800_000,
  votingWeight: 0.18,
  holders: 4287,
  price: 142.50,
};

// ─── Dashboard Stats ───────────────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  description: string;
}

export const dashboardStats: DashboardStat[] = [
  {
    label: 'Treasury Balance',
    value: '₹248.5L',
    change: '+12.4%',
    changeType: 'positive',
    icon: 'Wallet',
    description: 'Available: ₹161.3L',
  },
  {
    label: 'Active Proposals',
    value: '3',
    change: '+2 this week',
    changeType: 'positive',
    icon: 'FileText',
    description: '1 pending review',
  },
  {
    label: 'Your Voting Power',
    value: '12,500',
    change: '0.18% of supply',
    changeType: 'neutral',
    icon: 'Zap',
    description: 'CIMP tokens',
  },
  {
    label: 'Projects Funded',
    value: '24',
    change: '+3 this quarter',
    changeType: 'positive',
    icon: 'Trophy',
    description: '₹96.8L disbursed',
  },
];

// ─── Landing Page Stats ────────────────────────────────────────────────────

export const landingStats = [
  { label: 'Treasury Value', value: 248.5, prefix: '₹', suffix: 'L', description: 'Fully on-chain' },
  { label: 'Active Proposals', value: 3, prefix: '', suffix: '', description: 'In voting now' },
  { label: 'Projects Funded', value: 24, prefix: '', suffix: '+', description: 'Across 12 universities' },
  { label: 'Community Voters', value: 4287, prefix: '', suffix: '', description: 'CIMP token holders' },
];
