import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Demo users for authentication
      const demoUsers = [
        { id: 1, username: "admin", password: "admin123", fullName: "System Administrator", role: "admin", permissions: "full", isActive: true, department: "IT", position: "IT Manager" },
        { id: 2, username: "manager", password: "manager123", fullName: "Department Manager", role: "manager", permissions: "admin", isActive: true, department: "Administration", position: "Operations Manager" },
        { id: 3, username: "staff", password: "staff123", fullName: "Asset Staff", role: "staff", permissions: "write", isActive: true, department: "Administration", position: "Asset Officer" },
        { id: 4, username: "visitor", password: "visitor123", fullName: "Guest User", role: "visitor", permissions: "read", isActive: true, department: "External", position: "Visitor" }
      ];

      // Try to fetch from API first, fallback to demo users if database is unavailable
      let users = demoUsers;
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          users = await response.json();
        }
      } catch (apiError) {
        console.warn("API unavailable, using demo authentication");
      }

      const user = users.find((u: any) => 
        u.username === credentials.username && 
        u.password === credentials.password &&
        u.isActive !== false
      );

      if (user) {
        onLogin(user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.fullName || user.username}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error", 
        description: "Authentication failed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleAccounts = [
    { username: "admin", password: "admin123", role: "Administrator", color: "text-red-600" },
    { username: "manager", password: "manager123", role: "Manager", color: "text-blue-600" },
    { username: "staff", password: "staff123", role: "Staff", color: "text-green-600" },
    { username: "visitor", password: "visitor123", role: "Visitor", color: "text-gray-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full glass">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">KEW.PA Asset Management</h1>
          <p className="text-white/90 mt-2 drop-shadow">Malaysian Government Asset & Store Management System</p>
        </div>

        {/* Login Form */}
        <Card className="glass card-hover">
          <CardHeader>
            <CardTitle className="text-center text-foreground">System Login</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sample Accounts */}
        <Card className="glass card-hover">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">Demo Accounts</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Use these sample accounts for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleAccounts.map((account) => (
                <div 
                  key={account.username}
                  className="flex justify-between items-center p-2 bg-muted/50 rounded cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => setCredentials({ username: account.username, password: account.password })}
                >
                  <div>
                    <span className="font-medium text-foreground">{account.username}</span>
                    <span className={`ml-2 text-sm ${account.color} dark:text-white/80`}>({account.role})</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Click to use</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}