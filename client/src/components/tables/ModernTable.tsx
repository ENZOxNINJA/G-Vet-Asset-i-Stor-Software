import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import ModernButton from '@/components/shared/ModernButton';

interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface ModernTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  variant?: 'default' | 'striped' | 'glass';
}

export default function ModernTable<T extends { id: string | number }>({
  data,
  columns,
  className,
  loading = false,
  emptyMessage = 'No data available',
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10,
  variant = 'default'
}: ModernTableProps<T>) {
  const variants = {
    default: 'bg-white dark:bg-gray-900',
    striped: 'bg-white dark:bg-gray-900',
    glass: 'glass-card'
  };

  if (loading) {
    return (
      <div className={cn('rounded-xl overflow-hidden', variants[variant], className)}>
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('rounded-xl overflow-hidden', variants[variant], className)}>
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl overflow-hidden', variants[variant], className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'border-b border-gray-100 dark:border-gray-800 transition-colors',
                  'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  variant === 'striped' && index % 2 === 1 && 'bg-gray-50 dark:bg-gray-800/30'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {column.accessor(item)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <ModernButton
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              icon={<ChevronsLeft className="h-4 w-4" />}
            />
            <ModernButton
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              icon={<ChevronLeft className="h-4 w-4" />}
            />
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <ModernButton
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </ModernButton>
                );
              })}
            </div>
            
            <ModernButton
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              icon={<ChevronRight className="h-4 w-4" />}
            />
            <ModernButton
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              icon={<ChevronsRight className="h-4 w-4" />}
            />
          </div>
        </div>
      )}
    </div>
  );
}