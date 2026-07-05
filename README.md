# 🌟 CampusImpact DAO

> **Decentralized Autonomous Organization (DAO) for funding student innovation across Indian Universities.**

🏆 **Top 7 Finalist** - ORBIX 2026 Hackathon, IIIT Delhi

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Polygon](https://img.shields.io/badge/Polygon-Network-purple?logo=polygon)
![Live](https://img.shields.io/badge/Live-campusimpact--dao--faly.vercel.app-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

CampusImpact DAO is a blockchain-powered platform that enables students to submit innovative project ideas, participate in decentralized governance, and receive funding through transparent on-chain voting and treasury management.

🌐 **Live Demo:** https://campusimpact-dao-faly.vercel.app

---

## ✨ Features

- 🔗 **Wallet Connect** — Connect MetaMask and other EVM wallets using RainbowKit
- 📝 **Submit Proposals** — Multi-step proposal submission workflow
- 🗳️ **Community Voting** — Token holders vote **YES/NO** on proposals
- 💰 **DAO Treasury** — Automatic fund disbursement via smart contracts
- 📊 **Live Dashboard** — Real-time proposal and voting statistics
- ⛓️ **Smart Contracts** — ERC-20 Token, Governor & Treasury contracts
- 🔒 **Transparent Governance** — Immutable on-chain voting records
- ⚡ **Hybrid Architecture** — On-chain governance with off-chain metadata storage

---

## 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| **Web3** | wagmi v2, viem v2, RainbowKit |
| **Backend** | Supabase (PostgreSQL) |
| **Smart Contracts** | Solidity, OpenZeppelin |
| **Blockchain** | Polygon / Polygon Amoy Testnet |
| **Deployment** | Vercel |

---

## 🏗 Architecture

```text
                    User
                      │
                      ▼
        Next.js Frontend (TypeScript)
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 Smart Contracts (Polygon)      Supabase
  DAO • Treasury • Voting     PostgreSQL
        │                           │
        └─────────────┬─────────────┘
                      ▼
              Live Dashboard
```

### Workflow

- **Frontend** manages proposal submission, voting, and dashboard.
- **Smart Contracts** execute governance, voting, and treasury logic.
- **Supabase** stores proposal metadata and user information.
- **Wallet Integration** enables secure blockchain authentication.

---

## 📜 Smart Contracts

| Contract | Description |
|----------|-------------|
| **CampusToken.sol** | ERC-20 governance token (CIMP) |
| **CampusGovernor.sol** | Proposal lifecycle, voting & quorum |
| **CampusTreasury.sol** | Treasury management and fund distribution |

Deployable on **Polygon Mainnet** or **Polygon Amoy Testnet** using Hardhat or Foundry.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Git
- MetaMask Wallet
- Supabase Account

### Clone the repository

```bash
git clone https://github.com/<your-username>/CampusImpact-DAO.git

cd CampusImpact-DAO
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

### Run locally

```bash
npm run dev
```

---

## 🏆 Hackathon Achievement

CampusImpact DAO was designed and developed during **ORBIX 2026**, the flagship hackathon hosted at **IIIT Delhi**.

Among hundreds of participating teams, the project was selected as one of the **Top 7 Finalists** in web3/blockchain domain for its innovative application of **Blockchain, DAOs, and Web3 technologies** to democratize funding for student-led innovation.

---

## 🤝 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Sneha-0409">
        <b>Sneha</b>
      </a>
    </td>
<!-- <td align="center">
      <a href="https://github.com/Sneha-0409">
        <b>Sneha</b>
      </a>
    </td> -->
    <td align="center">
      <a href="https://github.com/Samarth9179">
        <b>Samarth Khare</b>
      </a>
    </td>
  </tr>
</table>

---

## 📄 License

Licensed under the **MIT License**.

---

⭐ If you found this project interesting, consider giving it a **star**!
Sneha



