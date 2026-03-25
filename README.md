# ⚡ CampusImpact DAO

> **Decentralized Autonomous Organization for funding student innovation across Indian Universities.**

🌐 **Live Demo: [campusimpact-dao-faly.vercel.app](https://campusimpact-dao-faly.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Polygon](https://img.shields.io/badge/Polygon-Network-purple?logo=polygon)
![Live](https://img.shields.io/badge/Live-campusimpact--dao--faly.vercel.app-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- 🔗 **Wallet Connect** — Connect MetaMask, Coinbase, or any wallet via RainbowKit
- 📝 **Submit Proposals** — Multi-step form to submit your campus project idea
- 🗳️ **Community Voting** — Token holders vote YES/NO on proposals
- 🏦 **Treasury** — Funds auto-disbursed via smart contracts on Polygon
- 📊 **Live Dashboard** — Real-time data from Supabase PostgreSQL database
- ⛓️ **Smart Contracts** — CampusToken (ERC-20), Governor, and Treasury contracts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| **Web3** | wagmi v2, viem v2, RainbowKit |
| **Database** | Supabase (PostgreSQL) |
| **Smart Contracts** | Solidity, OpenZeppelin |
| **Network** | Polygon / Polygon Amoy (Testnet) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed on your computer:

- **Node.js** (v18 or higher) → [Download here](https://nodejs.org/)
- **Git** → [Download here](https://git-scm.com/)
- A **Supabase** account (free) → [supabase.com](https://supabase.com)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Samarth9179/Campusimpact-dao.git
cd Campusimpact-dao
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

> This may take 1-2 minutes. It will install all the Web3 and UI libraries.

---

### Step 3 — Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a **free account**
2. Click **"New Project"** and give it a name (e.g. `campusimpact`)
3. Once the project loads, click **"SQL Editor"** in the left sidebar
4. Click **"New Query"** and paste the following SQL, then click **Run**:

```sql
create table proposals (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  university text not null,
  team_size integer not null,
  funding_amount numeric not null,
  funding_token text not null,
  duration integer not null,
  tags text[] default '{}',
  milestones jsonb not null default '[]',
  status text not null default 'pending',
  proposer_address text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Allow anyone to read and insert proposals
alter table proposals enable row level security;
create policy "allow_all_inserts" on proposals for insert with check (true);
create policy "allow_all_selects" on proposals for select using (true);

-- Also create the votes table
create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  proposal_id text not null,
  voter_address text not null,
  choice text not null check (choice in ('yes', 'no')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (proposal_id, voter_address)
);
alter table votes enable row level security;
create policy "allow_all_inserts_votes" on votes for insert with check (true);
create policy "allow_all_selects_votes" on votes for select using (true);
```

---

### Step 4 — Configure Environment Variables

1. In the project folder, copy the example env file:

```bash
# On Windows (PowerShell):
Copy-Item .env.example .env.local

# On Mac / Linux:
cp .env.example .env.local
```

2. Open `.env.local` in a text editor and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Where to find these values in Supabase:**
- Go to your Supabase project → **Settings** (gear icon) → **API**
- Copy the **Project URL** and **anon / public** key

---

### Step 5 — Run the App

```bash
npm run dev
```

Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
campusimpact-dao/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout with Web3 providers
│   ├── providers.tsx       # wagmi + RainbowKit + React Query
│   └── app/
│       ├── page.tsx        # Dashboard
│       ├── proposals/      # Proposals list + detail pages
│       ├── submit/         # Submit a proposal (multi-step form)
│       ├── treasury/       # Treasury overview
│       └── governance/     # Governance stats
├── components/
│   ├── layout/             # Navbar, Sidebar
│   ├── proposals/          # ProposalCard component
│   └── ui/                 # Button, GlassCard, VoteBar, etc.
├── contracts/              # Solidity smart contracts
│   ├── CampusToken.sol     # ERC-20 governance token (CIMP)
│   ├── CampusGovernor.sol  # DAO voting and proposal logic
│   └── CampusTreasury.sol  # Fund vault controlled by Governor
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── mockData.ts         # Demo data for UI testing
│   └── utils.ts            # Shared utility functions
├── types/                  # TypeScript type definitions
├── .env.example            # Template for environment variables
└── README.md               # You are here!
```

---

## 🔐 Security Notes

- ✅ `.env.local` is in `.gitignore` and will **never** be committed to GitHub
- ✅ Smart contracts use **OpenZeppelin** audited libraries
- ✅ Treasury funds can **only** be released by successful DAO proposals
- ✅ Supabase Row Level Security (RLS) is enabled on the proposals table

---

## 🧪 How to Test the Full Flow

1. **Connect your wallet** — Click "Connect Wallet" in the navbar and connect MetaMask
2. **Submit a proposal** — Go to `/app/submit` and fill out the form
3. **View your proposal** — Go to `/app/proposals` — your new proposal appears at the top
4. **Vote on a proposal** — Click any active proposal → click "Vote YES" or "Vote NO"
5. **Check the database** — Go to Supabase → Table Editor → proposals table → your data is there!

---

## 📜 Smart Contracts

| Contract | Description |
|---|---|
| `CampusToken.sol` | ERC-20 governance token (CIMP). Determines voting power. |
| `CampusGovernor.sol` | DAO logic — proposal lifecycle, voting, quorum enforcement. |
| `CampusTreasury.sol` | Holds USDC/MATIC. Only releases funds on successful proposals. |

> Contracts are ready to deploy on Polygon or Polygon Amoy testnet using Hardhat or Foundry.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/) — Free to use, modify, and distribute.

---

