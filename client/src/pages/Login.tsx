import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
      // Simple authentication check
      const users = await apiRequest("/api/users");
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
        description: "Unable to connect to the server.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">KEW.PA Asset Management</h1>
          <p className="text-gray-600 mt-2">Malaysian Government Asset & Store Management System</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">System Login</CardTitle>
            <CardDescription className="text-center">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
            <CardDescription className="text-xs">
              Use these sample accounts for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleAccounts.map((account) => (
                <div 
                  key={account.username}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setCredentials({ username: account.username, password: account.password })}
                >
                  <div>
                    <span className="font-medium">{account.username}</span>
                    <span className={`ml-2 text-sm ${account.color}`}>({account.role})</span>
                  </div>
                  <span className="text-xs text-gray-500">Click to use</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}