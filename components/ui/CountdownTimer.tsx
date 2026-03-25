'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
    endDate: string;
    className?: string;
    compact?: boolean;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    ended: boolean;
}

function getTimeLeft(endDate: string): TimeLeft {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        ended: false,
    };
}

export default function CountdownTimer({ endDate, className, compact = false }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(endDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(endDate));
        }, 1000);
        return () => clearInterval(interval);
    }, [endDate]);

    if (timeLeft.ended) {
        return (
            <span className={cn('text-text-muted text-body-sm font-medium', className)}>
                Voting ended
            </span>
        );
    }

    if (compact) {
        return (
            <span className={cn('text-text-secondary text-body-sm font-mono', className)}>
                {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
            </span>
        );
    }

    const segments = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
    ];

    return (
        <div className={cn('flex gap-3', className)}>
            {segments.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                    <div className="glass-card px-3 py-2 min-w-[52px] text-center">
                        <span className="text-heading-md font-bold text-text-primary font-mono">
                            {String(value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-caption text-text-muted mt-1 uppercase tracking-wider">{label}</span>
                </div>
            ))}
        </div>
    );
}
