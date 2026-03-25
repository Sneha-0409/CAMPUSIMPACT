'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<"button"> {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    fullWidth?: boolean;
}


export function PrimaryButton({ children, loading, icon, iconRight, fullWidth, className, disabled, ...props }: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn('btn-primary', fullWidth && 'w-full justify-center', className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <LoadingSpinner /> : icon}
            {children}
            {!loading && iconRight}
        </motion.button>
    );
}

export function SecondaryButton({ children, loading, icon, iconRight, fullWidth, className, disabled, ...props }: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn('btn-secondary', fullWidth && 'w-full justify-center', className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <LoadingSpinner /> : icon}
            {children}
            {!loading && iconRight}
        </motion.button>
    );
}

export function SuccessButton({ children, loading, icon, fullWidth, className, disabled, ...props }: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn('btn-success', fullWidth && 'w-full justify-center', className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <LoadingSpinner /> : icon}
            {children}
        </motion.button>
    );
}

export function DangerButton({ children, loading, icon, fullWidth, className, disabled, ...props }: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn('btn-danger', fullWidth && 'w-full justify-center', className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <LoadingSpinner /> : icon}
            {children}
        </motion.button>
    );
}

function LoadingSpinner() {
    return (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

export default PrimaryButton;
