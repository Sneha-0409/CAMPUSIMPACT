'use client';

import { ProposalStatus } from '@/types';
import { getStatusColor, getStatusLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: ProposalStatus;
    className?: string;
    dot?: boolean;
}

export default function StatusBadge({ status, className, dot = true }: StatusBadgeProps) {
    return (
        <span className={cn(getStatusColor(status), className)}>
            {dot && (
                <span
                    className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        status === 'active' && 'bg-success animate-pulse',
                        status === 'pending' && 'bg-warning',
                        status === 'passed' && 'bg-primary-light',
                        status === 'rejected' && 'bg-danger',
                        status === 'executed' && 'bg-accent-blue',
                    )}
                />
            )}
            {getStatusLabel(status)}
        </span>
    );
}
