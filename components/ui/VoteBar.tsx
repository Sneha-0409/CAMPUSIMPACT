'use client';

import { motion } from 'framer-motion';
import { cn, getVotePercentage } from '@/lib/utils';

interface VoteBarProps {
    yesVotes: number;
    noVotes: number;
    showLabels?: boolean;
    showCounts?: boolean;
    height?: 'sm' | 'md' | 'lg';
    className?: string;
    animate?: boolean;
}

const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
};

export default function VoteBar({
    yesVotes,
    noVotes,
    showLabels = true,
    showCounts = false,
    height = 'md',
    className,
    animate = true,
}: VoteBarProps) {
    const { yes, no } = getVotePercentage(yesVotes, noVotes);
    const total = yesVotes + noVotes;

    return (
        <div className={cn('w-full', className)}>
            {showLabels && (
                <div className="flex justify-between mb-2">
                    <span className="text-body-sm text-success font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-success inline-block" />
                        Yes {yes}%
                        {showCounts && <span className="text-text-muted">({yesVotes.toLocaleString()})</span>}
                    </span>
                    <span className="text-body-sm text-danger font-medium flex items-center gap-1.5">
                        {showCounts && <span className="text-text-muted">({noVotes.toLocaleString()})</span>}
                        No {no}%
                        <span className="w-2 h-2 rounded-full bg-danger inline-block" />
                    </span>
                </div>
            )}

            <div className={cn('w-full rounded-full bg-white/5 overflow-hidden flex', heightStyles[height])}>
                {total === 0 ? (
                    <div className="w-full h-full bg-white/5" />
                ) : (
                    <>
                        <motion.div
                            className="vote-bar-yes"
                            initial={animate ? { width: 0 } : { width: `${yes}%` }}
                            animate={{ width: `${yes}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                        <motion.div
                            className="vote-bar-no"
                            initial={animate ? { width: 0 } : { width: `${no}%` }}
                            animate={{ width: `${no}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
