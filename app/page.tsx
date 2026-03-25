'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Shield, TrendingUp, Globe, ChevronRight,
  CheckCircle, Zap, Users, Lock, Eye, AlertCircle
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Navbar from '@/components/layout/Navbar';

import GlassCard from '@/components/ui/GlassCard';
import { landingStats, mockProposals } from '@/lib/mockData';
import { staggerContainer, fadeInUp, scaleIn } from '@/lib/utils';
import ProposalCard from '@/components/proposals/ProposalCard';

function HeroCard() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-sm"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 via-blue-500/10 to-purple-600/10 rounded-3xl blur-3xl" />
      <div className="glass-card-elevated p-6 space-y-5 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption text-text-muted uppercase tracking-wider mb-1">DAO Treasury</p>
            <p className="text-display-sm font-bold gradient-text">₹248.5L</p>
          </div>
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-body-sm font-semibold text-text-primary">AgroSync AI Platform</p>
              <p className="text-caption text-text-muted">Requesting ₹18.5L · IIT Kanpur</p>
            </div>
            <span className="badge-active">Active</span>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            <div className="w-[86%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full" />
            <div className="w-[14%] bg-gradient-to-r from-rose-600 to-red-500 rounded-r-full" />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-caption text-success">86% Yes</span>
            <span className="text-caption text-danger">14% No</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: 'Proposals', value: '24' }, { label: 'Voters', value: '4.2K' }, { label: 'Funded', value: '₹96L' }].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-heading-sm font-bold text-text-primary">{value}</p>
              <p className="text-caption text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-6 -right-8 glass-card px-4 py-3 flex items-center gap-2.5 z-10"
      >
        <div className="w-8 h-8 rounded-lg bg-success/20 border border-success/30 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-success" />
        </div>
        <div>
          <p className="text-body-sm font-semibold text-text-primary">GridFlow Funded</p>
          <p className="text-caption text-success">₹15.5L disbursed</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const services = [
  { icon: Users, title: 'Project Incubation', description: 'Providing expert guidance and mentorship to turn raw student ideas into viable products.', color: 'text-primary-light', bg: 'bg-primary/10 border-primary/20' },
  { icon: Zap, title: 'Decentralized Funding', description: 'Transparent, merit-based grants powered by community voting for impactful campus innovations.', color: 'text-success', bg: 'bg-success/10 border-success/20' },
  { icon: Globe, title: 'Resource Networking', description: 'Connecting student innovators with industry experts, alumni, and essential development tools.', color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/20' },
];

const solutionSteps = [
  { number: '01', label: 'Submit', desc: 'Teams submit proposals with milestones & funding breakdown on-chain via IPFS' },
  { number: '02', label: 'Vote', desc: 'Token holders vote transparently. Quorum required. Results immutable on-chain.' },
  { number: '03', label: 'Fund', desc: 'Smart contract auto-executes treasury disbursement upon vote passing quorum.' },
  { number: '04', label: 'Track', desc: 'Milestone completion unlocks next tranche. Full audit trail. Public forever.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg overflow-hidden">
      <Navbar />
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-body-sm font-semibold text-primary-light bg-primary/10 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Built on Polygon · Powered by Community
              </span>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-display-lg font-bold text-text-primary leading-tight text-balance">
                Decentralizing <span className="gradient-text">Campus Innovation</span> Funding
              </h1>
              <p className="text-body-lg text-text-secondary max-w-lg leading-relaxed">
                Empowering student innovators with transparent, smart contract-powered governance. No gatekeepers. No bias. Just merit.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex items-center gap-4 flex-wrap">
              <Link href="/auth/role">
                <PrimaryButton className="text-body-md px-8 py-4 gap-2">
                  Launch App <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
              </Link>
              <Link href="/app/proposals">
                <SecondaryButton className="text-body-md px-8 py-4">View Live Proposals</SecondaryButton>
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {['A', 'R', 'P', 'K', 'M'].map((initial, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background flex items-center justify-center text-caption text-white font-bold">{initial}</div>
                ))}
              </div>
              <div>
                <p className="text-body-sm font-semibold text-text-primary">4,287 voters across 12 universities</p>
                <p className="text-caption text-text-muted">IIT K · IIT B · IIT M · NIT T · AIIMS</p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex justify-center lg:justify-end">
            <HeroCard />
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
          <span className="text-caption uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* Impact Numbers */}
      <section id="impact" className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {landingStats.map((stat) => (
              <motion.div key={stat.label} variants={scaleIn}>
                <GlassCard className="p-8 text-center" hover>
                  <p className="text-display-md font-bold gradient-text mb-1">
                    <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.value % 1 !== 0 ? 1 : 0} />
                  </p>
                  <p className="text-heading-sm text-text-primary font-semibold mb-1">{stat.label}</p>
                  <p className="text-caption text-text-muted">{stat.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge-active mb-4 inline-flex">Our Services</span>
            <h2 className="text-display-md font-bold text-text-primary mb-4 text-balance">
              What We <span className="gradient-text">Provide</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Empowering the next generation of creators with the funding, guidance, and network they need to succeed.
            </p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, description, color, bg }) => (
              <motion.div key={title} variants={fadeInUp}>
                <GlassCard className="p-8 h-full" hover>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="text-heading-lg font-semibold text-text-primary mb-3">{title}</h3>
                  <p className="text-body-md text-text-secondary leading-relaxed">{description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge-active mb-4 inline-flex">The Solution</span>
            <h2 className="text-display-md font-bold text-text-primary mb-4 text-balance">
              A governance layer that puts <span className="gradient-text">merit first.</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">Every rupee is traceable. Every vote is immutable. Every project milestone is on-chain.</p>
          </motion.div>
          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {solutionSteps.map(({ number, label, desc }) => (
                <motion.div key={number} variants={fadeInUp} className="text-center relative">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center mx-auto mb-6 relative z-10">
                    <span className="text-caption text-primary-light font-mono">{number}</span>
                    <span className="text-heading-md font-bold text-primary-light">{label}</span>
                  </div>
                  <p className="text-body-sm text-text-secondary leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Proposals */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge-active mb-3 inline-flex">Live Now</span>
              <h2 className="text-display-sm font-bold text-text-primary">Active Proposals</h2>
              <p className="text-body-md text-text-secondary mt-2">Vote now. Shape what gets built.</p>
            </div>
            <Link href="/app/proposals">
              <SecondaryButton className="hidden md:flex gap-2">View All Proposals <ChevronRight className="w-4 h-4" /></SecondaryButton>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProposals.filter(p => p.status === 'active').map((proposal, i) => (
              <ProposalCard key={proposal.id} proposal={proposal} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/app/proposals">
              <PrimaryButton className="gap-2">Explore All Proposals <ArrowRight className="w-4 h-4" /></PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-display-md font-bold text-text-primary mb-4">Built for <span className="gradient-text">institutional trust</span></h2>
            <p className="text-body-lg text-text-secondary">Enterprise-grade infrastructure under a student-friendly interface.</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Smart Contract Treasury', desc: 'Funds held in audited on-chain vaults. Zero human custody. Auto-executes on quorum.', color: 'text-primary-light', bg: 'bg-primary/10 border-primary/20' },
              { icon: Eye, title: 'Full Transparency', desc: 'Every vote, every transaction, every decision permanently on Polygon. Anyone can verify.', color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/20' },
              { icon: TrendingUp, title: 'Milestone Tracking', desc: 'Fund disbursement tied to verifiable milestones. Smart contract holds next tranche until conditions met.', color: 'text-success', bg: 'bg-success/10 border-success/20' },
              { icon: Users, title: 'Community Governance', desc: 'CIMP token holders vote on proposals. Quadratic voting prevents plutocracy.', color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
              { icon: Globe, title: 'Multi-University', desc: 'Any Indian university can join. Proposals from IITs, NITs, AIIMS, and state universities.', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
              { icon: Zap, title: 'Gasless UX', desc: 'Meta-transactions via Biconomy. Students vote and submit proposals with zero gas fees.', color: 'text-text-secondary', bg: 'bg-white/10 border-white/20' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <motion.div key={title} variants={fadeInUp}>
                <GlassCard className="p-6 h-full" hover>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <h3 className="text-heading-sm font-semibold text-text-primary mb-2">{title}</h3>
                  <p className="text-body-sm text-text-secondary leading-relaxed">{desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card-elevated p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-500/5 to-purple-600/10 rounded-2xl" />
            <div className="relative">
              <h2 className="text-display-md font-bold text-text-primary mb-4 text-balance">Ready to fund the next <span className="gradient-text">breakthrough?</span></h2>
              <p className="text-body-lg text-text-secondary mb-10 max-w-xl mx-auto">Join 4,287 token holders shaping the future of Indian student innovation. Connect your wallet and start voting today.</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/auth/role"><PrimaryButton className="text-body-md px-10 py-4 gap-2">Launch App <ArrowRight className="w-4 h-4" /></PrimaryButton></Link>
                <Link href="/app/submit"><SecondaryButton className="text-body-md px-10 py-4">Submit a Proposal</SecondaryButton></Link>
              </div>
              <p className="text-caption text-text-muted mt-8">No KYC required · Open to all Indian university students · 100% on-chain</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-text-primary">CampusImpact DAO</span>
          </div>
          <p className="text-body-sm text-text-muted text-center">© 2026 CampusImpact DAO · Deployed on Polygon · Open Source</p>
          <div className="flex gap-6">
            {['Docs', 'GitHub', 'Discord', 'Terms'].map((link) => (
              <a key={link} href="#" className="text-body-sm text-text-muted hover:text-text-secondary transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
