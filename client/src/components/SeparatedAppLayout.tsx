import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  Clipboard,
  Search,
  Settings,
  CheckSquare,
  ArrowRightLeft,
  Truck,
  FileText,
  Menu,
  X,
  Building2,
  Warehouse,
  Command,
  Database,
  Shield,
  Eye,
  LogOut,
  BarChart3
} from "lucide-react";
import QuickSearch from "@/components/QuickSearch";
import { useQuickSearch } from "@/hooks/useQuickSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

type AppLayoutProps = {
  children: ReactNode;
};

const generalNavigation = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/",
  },
  {
    title: "Basic Inventory",
    icon: <Package className="h-5 w-5" />,
    path: "/inventory",
  },
  {
    title: "Basic Assets",
    icon: <Clipboard className="h-5 w-5" />,
    path: "/assets",
  },
  {
    title: "Suppliers",
    icon: <Truck className="h-5 w-5" />,
    path: "/suppliers",
  },
  {
    title: "Info-T Integration",
    icon: <Database className="h-5 w-5" />,
    path: "/info-t-integration",
  },
  {
    title: "Admin Control",
    icon: <Shield className="h-5 w-5" />,
    path: "/admin-control",
  },
  {
    title: "Visitor Dashboard",
    icon: <Eye className="h-5 w-5" />,
    path: "/visitor-dashboard",
  },
  {
    title: "Roadmap Analysis",
    icon: <BarChart3 className="h-5 w-5" />,
    path: "/roadmap-analysis",
  },
];

const kewpaNavigation = [
  {
    title: "KEW.PA Dashboard",
    subtitle: "Asset Management Overview",
    icon: <Building2 className="h-5 w-5" />,
    path: "/kewpa",
  },
  {
    title: "Asset Registration",
    subtitle: "KEW.PA-1, 2, 3",
    icon: <Clipboard className="h-5 w-5" />,
    path: "/asset-registration-kewpa",
  },
  {
    title: "Asset Inspection",
    subtitle: "KEW.PA-11, 12, 13",
    icon: <Search className="h-5 w-5" />,
    path: "/asset-inspection",
  },
  {
    title: "Asset Maintenance",
    subtitle: "KEW.PA-14, 15, 16",
    icon: <Settings className="h-5 w-5" />,
    path: "/asset-maintenance",
  },
  {
    title: "Asset Verification",
    subtitle: "Verification Process",
    icon: <CheckSquare className="h-5 w-5" />,
    path: "/asset-verification",
  },
  {
    title: "Asset Movement",
    subtitle: "KEW.PA-9, 17, 18",
    icon: <ArrowRightLeft className="h-5 w-5" />,
    path: "/asset-movement",
  },
  {
    title: "Asset Search",
    subtitle: "Search & Reports",
    icon: <FileText className="h-5 w-5" />,
    path: "/asset-search",
  },
];

const kewpsNavigation = [
  {
    title: "KEW.PS Dashboard",
    subtitle: "Store Management Overview",
    icon: <Warehouse className="h-5 w-5" />,
    path: "/kewps",
  },
  {
    title: "Store Operations",
    subtitle: "Complete KEW.PS System",
    icon: <Package className="h-5 w-5" />,
    path: "/store-management-kewps",
  },
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isOpen, openSearch, closeSearch } = useQuickSearch();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
  };

  const NavigationSection = ({ 
    title, 
    items, 
    icon 
  }: { 
    title: string; 
    items: typeof generalNavigation; 
    icon: ReactNode;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-auto py-2 hover:bg-primary/10 transition-colors",
                isActive(item.path) && "bg-primary/10 text-primary border-primary/20"
              )}
            >
              {item.icon}
              <div className="text-left">
                <div className="font-medium">{item.title}</div>
                {"subtitle" in item && (
                  <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                )}
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transform glass border-r border-border/50 transition-transform duration-300 ease-in-out lg:static lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">KEW System</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* General Navigation */}
            <NavigationSection
              title="General"
              items={generalNavigation}
              icon={<LayoutDashboard className="h-4 w-4" />}
            />

            <Separator />

            {/* KEW.PA Framework */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">KEW.PA Framework</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary text-xs border-primary/20">
                  Asset Management
                </Badge>
              </div>
              <div className="space-y-1">
                {kewpaNavigation.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-auto py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-blue-500/10 transition-all",
                        isActive(item.path) && "bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary border-primary/20"
                      )}
                    >
                      {item.icon}
                      <div className="text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <Separator />

            {/* KEW.PS Framework */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2">
                <Warehouse className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-foreground">KEW.PS Framework</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-secondary/20 to-green-500/20 text-secondary text-xs border-secondary/20">
                  Store Management
                </Badge>
              </div>
              <div className="space-y-1">
                {kewpsNavigation.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-auto py-3 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-green-500/10 transition-all",
                        isActive(item.path) && "bg-gradient-to-r from-secondary/10 to-green-500/10 text-secondary border-secondary/20"
                      )}
                    >
                      {item.icon}
                      <div className="text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* User Profile Section */}
        <div className="border-t border-border/50 p-4">
          {user && (
            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">
                    {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {user.fullName || user.username}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.department} • {user.role}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 w-8 p-0"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <div className="text-center text-xs text-muted-foreground mt-3">
            <div>Malaysian Government</div>
            <div>Asset & Store Management System</div>
            <div className="mt-1 font-medium">KEW.PA & KEW.PS Compliant</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 glass backdrop-blur-sm px-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">KEW System</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={openSearch}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop header - Quick Search */}
        <div className="hidden lg:flex h-16 items-center justify-between border-b border-border/50 glass backdrop-blur-sm px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={openSearch}
              className="flex items-center gap-2 min-w-64 justify-start text-muted-foreground glass border-border/50"
            >
              <Search className="h-4 w-4" />
              <span>Search everything...</span>
              <div className="ml-auto flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <Command className="h-3 w-3" />K
                </kbd>
              </div>
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Quick Search Modal */}
      <QuickSearch isOpen={isOpen} onClose={closeSearch} />
    </div>
  );
};

export default AppLayout;