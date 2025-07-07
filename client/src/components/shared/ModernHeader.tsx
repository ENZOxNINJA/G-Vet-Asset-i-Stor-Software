import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'gradient' | 'kewpa' | 'kewps';
  className?: string;
}

export default function ModernHeader({
  title,
  subtitle,
  icon,
  actions,
  variant = 'default',
  className
}: ModernHeaderProps) {
  const variants = {
    default: 'from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400',
    gradient: 'from-primary-600 to-secondary-600',
    kewpa: 'from-blue-600 to-blue-400',
    kewps: 'from-green-600 to-green-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col md:flex-row md:items-center md:justify-between gap-4', className)}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20">
            {icon}
          </div>
        )}
        <div>
          <h1 className={cn(
            'text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
            variants[variant]
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </motion.div>
  );
}