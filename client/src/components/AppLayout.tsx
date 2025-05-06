import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Clipboard,
  CheckSquare,
  ArrowRightLeft,
  Search,
  Truck,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ui/theme-provider";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/",
  },
  {
    title: "Inventory",
    icon: <Package className="h-5 w-5" />,
    path: "/inventory",
  },
  {
    title: "Assets",
    icon: <Clipboard className="h-5 w-5" />,
    path: "/assets",
  },
  {
    title: "Registration",
    icon: <Clipboard className="h-5 w-5" />,
    path: "/asset-registration",
  },
  {
    title: "Verification",
    icon: <CheckSquare className="h-5 w-5" />,
    path: "/asset-verification",
  },
  {
    title: "Movement",
    icon: <ArrowRightLeft className="h-5 w-5" />,
    path: "/asset-movement",
  },
  {
    title: "Search",
    icon: <Search className="h-5 w-5" />,
    path: "/asset-search",
  },
  {
    title: "Suppliers",
    icon: <Truck className="h-5 w-5" />,
    path: "/suppliers",
  },
];

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Render mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="header-gradient px-4 py-2 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">PLT ASSET</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Mobile Menu (slide out when open) */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity",
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={toggleMobileMenu}
        >
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out",
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="header-gradient p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">PLT ASSET</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground"
                  onClick={toggleMobileMenu}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col px-4 space-y-1">
                  {menuItems.map((item) => (
                    <div 
                      key={item.path}
                      onClick={() => {
                        window.location.href = item.path;
                        toggleMobileMenu();
                      }}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                        location === item.path
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    );
  }

  // Render desktop view
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo and Collapse Button */}
        <div
          className={cn(
            "h-16 flex items-center px-4 border-b header-gradient",
            sidebarOpen ? "justify-between" : "justify-center"
          )}
        >
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-white">PLT ASSET</h1>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <div
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    location === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !sidebarOpen && "justify-center"
                  )}
                  onClick={() => window.location.href = item.path}
                >
                  {item.icon}
                  {sidebarOpen && <span className="ml-3">{item.title}</span>}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto p-4 border-t border-border">
          <div
            className={cn(
              "flex items-center",
              sidebarOpen ? "justify-between" : "justify-center"
            )}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            {sidebarOpen && (
              <Button
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border header-gradient flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-medium text-white">
              {menuItems.find((item) => item.path === location)?.title || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
              <Users className="h-4 w-4 mr-2" />
              <span>Admin</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;