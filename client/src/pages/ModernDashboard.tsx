import { useState, useEffect } from 'react';
import { 
  Package, 
  Clipboard, 
  TrendingUp, 
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Database,
  Shield,
  Eye
} from 'lucide-react';
import ModernCard from '@/components/shared/ModernCard';
import ModernButton from '@/components/shared/ModernButton';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: ReactNode;
  color: string;
  framework?: 'kewpa' | 'kewps';
}

export default function ModernDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Animated counter for numbers
  const AnimatedCounter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        if (count < value) {
          setCount(prev => Math.min(prev + Math.ceil(value / 20), value));
        }
      }, 50);
      return () => clearTimeout(timer);
    }, [count, value]);
    
    return <span>{count.toLocaleString()}</span>;
  };

  const statCards: StatCard[] = [
    {
      title: 'Total Assets',
      value: stats?.totalAssets || 0,
      change: 12.5,
      icon: <Clipboard className="h-5 w-5" />,
      color: 'from-blue-500 to-blue-600',
      framework: 'kewpa'
    },
    {
      title: 'Inventory Items',
      value: stats?.totalInventory || 0,
      change: -2.3,
      icon: <Package className="h-5 w-5" />,
      color: 'from-green-500 to-green-600',
      framework: 'kewps'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      change: 5.1,
      icon: <Users className="h-5 w-5" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: 0.1,
      icon: <Activity className="h-5 w-5" />,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            System Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening in your system today.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {['day', 'week', 'month', 'year'].map((period) => (
            <ModernButton
              key={period}
              variant={selectedPeriod === period ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </ModernButton>
          ))}
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <ModernCard 
              variant={stat.framework === 'kewpa' ? 'kewpa' : stat.framework === 'kewps' ? 'kewps' : 'gradient'}
              className="p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : typeof stat.value === 'number' ? (
                      <AnimatedCounter value={stat.value} />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                    )}
                    <span className={`text-sm ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      vs last {selectedPeriod}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h2>
              <ModernButton variant="ghost" size="sm">
                View All
              </ModernButton>
            </div>
            
            <div className="space-y-4">
              {[
                { type: 'asset', action: 'New asset registered', user: 'Ahmad Hassan', time: '2 minutes ago', status: 'success' },
                { type: 'inventory', action: 'Stock level alert', item: 'Printer Paper A4', time: '15 minutes ago', status: 'warning' },
                { type: 'maintenance', action: 'Maintenance completed', asset: 'Laptop #1234', time: '1 hour ago', status: 'success' },
                { type: 'transfer', action: 'Asset transfer pending', from: 'Unit A', to: 'Unit B', time: '2 hours ago', status: 'pending' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    activity.status === 'success' && "bg-green-100 dark:bg-green-900/20",
                    activity.status === 'warning' && "bg-yellow-100 dark:bg-yellow-900/20",
                    activity.status === 'pending' && "bg-blue-100 dark:bg-blue-900/20"
                  )}>
                    {activity.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    {activity.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                    {activity.status === 'pending' && <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.user || activity.item || activity.asset}
                      {activity.from && ` • ${activity.from} → ${activity.to}`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </ModernCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ModernCard variant="gradient" className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Quick Actions
            </h2>
            
            <div className="space-y-3">
              <ModernButton
                variant="kewpa"
                className="w-full justify-start"
                icon={<Clipboard className="h-4 w-4" />}
              >
                Register New Asset
              </ModernButton>
              
              <ModernButton
                variant="kewps"
                className="w-full justify-start"
                icon={<Package className="h-4 w-4" />}
              >
                Add Inventory Item
              </ModernButton>
              
              <ModernButton
                variant="outline"
                className="w-full justify-start"
                icon={<BarChart3 className="h-4 w-4" />}
              >
                Generate Report
              </ModernButton>
              
              <ModernButton
                variant="outline"
                className="w-full justify-start"
                icon={<Users className="h-4 w-4" />}
              >
                Manage Users
              </ModernButton>
            </div>
          </ModernCard>

          {/* System Status */}
          <ModernCard variant="glass" className="p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              System Status
            </h2>
            
            <div className="space-y-4">
              {[
                { service: 'Database', status: 'operational', uptime: '99.9%' },
                { service: 'API Server', status: 'operational', uptime: '99.8%' },
                { service: 'Auth Service', status: 'operational', uptime: '100%' },
                { service: 'File Storage', status: 'maintenance', uptime: '95.2%' }
              ].map((service) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      service.status === 'operational' && "bg-green-500",
                      service.status === 'maintenance' && "bg-yellow-500"
                    )} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {service.service}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {service.uptime}
                  </span>
                </div>
              ))}
            </div>
          </ModernCard>
        </motion.div>
      </div>
    </div>
  );
}