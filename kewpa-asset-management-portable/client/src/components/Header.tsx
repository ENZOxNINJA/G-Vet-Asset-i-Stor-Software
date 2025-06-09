import { Bell, Settings } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Inventory Management System</h1>
        <div className="flex items-center space-x-2">
          <span className="hidden md:inline text-sm">Welcome, Admin</span>
          <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/20">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/20">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
