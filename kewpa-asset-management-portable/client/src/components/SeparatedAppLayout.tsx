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
  Eye
} from "lucide-react";
import QuickSearch from "@/components/QuickSearch";
import { useQuickSearch } from "@/hooks/useQuickSearch";

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

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
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
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-900">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-auto py-2",
                isActive(item.path) && "bg-blue-100 text-blue-700"
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
    <div className="flex min-h-screen bg-gray-50">
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
          "fixed inset-y-0 left-0 z-50 w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold">KEW System</span>
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
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-semibold text-gray-900">KEW.PA Framework</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  Asset Management
                </Badge>
              </div>
              <div className="space-y-1">
                {kewpaNavigation.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-auto py-3",
                        isActive(item.path) && "bg-primary/10 text-primary"
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
                <Warehouse className="h-4 w-4" />
                <span className="text-sm font-semibold text-gray-900">KEW.PS Framework</span>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary text-xs">
                  Store Management
                </Badge>
              </div>
              <div className="space-y-1">
                {kewpsNavigation.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-auto py-3",
                        isActive(item.path) && "bg-secondary/10 text-secondary"
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

        {/* Footer */}
        <div className="border-t p-4">
          <div className="text-center text-xs text-muted-foreground">
            <div>Malaysian Government</div>
            <div>Asset & Store Management System</div>
            <div className="mt-1 font-medium">KEW.PA & KEW.PS Compliant</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">KEW System</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={openSearch}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop header - Quick Search */}
        <div className="hidden lg:flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={openSearch}
              className="flex items-center gap-2 min-w-64 justify-start text-muted-foreground"
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