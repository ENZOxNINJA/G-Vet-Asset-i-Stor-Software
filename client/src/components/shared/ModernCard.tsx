import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'kewpa' | 'kewps';
  hover?: boolean;
  onClick?: () => void;
}

export default function ModernCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  onClick 
}: ModernCardProps) {
  const variants = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700',
    glass: 'glass-card',
    kewpa: 'kewpa-card',
    kewps: 'kewps-card'
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'rounded-xl shadow-sm transition-all duration-200',
        hover && 'cursor-pointer hover:shadow-lg',
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
}