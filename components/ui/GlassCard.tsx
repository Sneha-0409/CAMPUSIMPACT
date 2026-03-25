'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    elevated?: boolean;
    gradient?: boolean;
}

export default function GlassCard({
    children,
    className,
    hover = false,
    elevated = false,
    gradient = false,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                elevated ? 'glass-card-elevated' : 'glass-card',
                hover && 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-white/10',
                gradient && 'bg-gradient-card',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
