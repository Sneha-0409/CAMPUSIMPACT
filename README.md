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

##Architecture

User → Frontend (Next.js) → Smart Contracts (Polygon)
                  → Supabase (Off-chain Data Storage)

• Frontend (Next.js) handles user interaction — submitting projects, voting, and tracking progress
• Smart Contracts (Polygon) manage voting logic, fund distribution, and transparency
• Supabase (Backend / Off-chain) stores project details, user data, and metadata efficiently
• Wallet Integration (MetaMask) connects users to blockchain for secure transactions and voting

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed on your computer:

- **Node.js** (v18 or higher) → [Download here](https://nodejs.org/)
- **Git** → [Download here](https://git-scm.com/)
- A **Supabase** account (free) → [supabase.com](https://supabase.com)


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

