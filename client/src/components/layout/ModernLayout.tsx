import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Clipboard, 
  Search, 
  Settings,
  Menu,
  X,
  Building2,
  BarChart3,
  Users,
  Shield,
  Eye,
  LogOut,
  Sun,
  Moon,
  Command
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface ModernLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  icon: ReactNode;
  path: string;
  description?: string;
  color?: string;
  framework?: 'kewpa' | 'kewps' | 'general';
}

export default function ModernLayout({ children }: ModernLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const { theme, setTheme } = useTheme();

  // Enhanced navigation with framework colors
  const navigation: NavItem[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/",
      description: "System overview",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      framework: 'general'
    },
    {
      title: "Asset Management",
      icon: <Clipboard className="h-5 w-5" />,
      path: "/assets",
      description: "KEW.PA Framework",
      color: "bg-gradient-to-r from-blue-600 to-blue-400",
      framework: 'kewpa'
    },
    {
      title: "Inventory",
      icon: <Package className="h-5 w-5" />,
      path: "/inventory",
      description: "KEW.PS Framework",
      color: "bg-gradient-to-r from-green-600 to-green-400",
      framework: 'kewps'
    },
    {
      title: "Roadmap Analysis",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/roadmap-analysis",
      description: "Compliance tracking",
      color: "bg-gradient-to-r from-purple-600 to-purple-400",
      framework: 'general'
    },
    {
      title: "User Management",
      icon: <Users className="h-5 w-5" />,
      path: "/admin-control",
      description: "Admin control",
      color: "bg-gradient-to-r from-orange-600 to-orange-400",
      framework: 'general'
    }
  ];

  // Filter navigation based on permissions
  const filteredNav = navigation.filter(item => {
    if (item.path === "/admin-control" && user?.role !== 'admin') return false;
    return hasPermission('read');
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transform lg:translate-x-0 transition-transform duration-300",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700",
          !sidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                KEW System
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Asset Management</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-75"></div>
              <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role} • {user?.permissions}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-1">
          {filteredNav.map((item) => {
            const isActive = location === item.path;
            const isKewpa = item.framework === 'kewpa';
            const isKewps = item.framework === 'kewps';
            
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? item.color
                      : "bg-gray-100 dark:bg-gray-800 group-hover:scale-110",
                    isActive && "shadow-lg"
                  )}>
                    <div className={cn(
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-400"
                    )}>
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium transition-colors",
                      isActive 
                        ? "text-gray-900 dark:text-gray-100" 
                        : "text-gray-600 dark:text-gray-400"
                    )}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"
                    />
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-full items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search... (⌘K)"
                  className="pl-10 pr-4 py-2 w-80 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  onFocus={() => setSearchOpen(true)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>

      {/* Command Palette / Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative top-20 mx-auto max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <Command className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets, inventory, or commands..."
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                  <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    ESC
                  </kbd>
                </div>
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Start typing to search...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}