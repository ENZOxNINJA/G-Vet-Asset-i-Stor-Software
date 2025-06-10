import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  Shield, 
  Settings, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Lock,
  Unlock,
  Eye,
  Database,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { User, userRoles, userPermissions } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminControl() {
  const [selectedTab, setSelectedTab] = useState("users");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    department: "",
    position: "",
    role: "visitor",
    permissions: "read"
  });
  const { toast } = useToast();

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      return apiRequest("/api/users", {
        method: "POST",
        body: userData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setNewUser({
        username: "",
        password: "",
        email: "",
        fullName: "",
        department: "",
        position: "",
        role: "visitor",
        permissions: "read"
      });
      toast({
        title: "User Created",
        description: "New user has been successfully created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create user.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
      return apiRequest(`/api/users/${id}`, {
        method: "PATCH",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setEditingUser(null);
      toast({
        title: "User Updated",
        description: "User information has been updated.",
      });
    },
  });

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    updateUserMutation.mutate({
      id: userId,
      data: { isActive: !isActive }
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "manager": return "default";
      case "staff": return "secondary";
      case "visitor": return "outline";
      default: return "outline";
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "full": return "text-red-600";
      case "admin": return "text-orange-600";
      case "write": return "text-blue-600";
      case "read": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Control Panel
              </h1>
              <p className="text-gray-600 mt-1">
                User management and system administration
              </p>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Creation Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Create New User
                  </CardTitle>
                  <CardDescription>
                    Add a new user to the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={newUser.username}
                      onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={newUser.department} onValueChange={(value) => setNewUser(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Procurement">Procurement</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="visitor">Visitor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="permissions">Permissions</Label>
                    <Select value={newUser.permissions} onValueChange={(value) => setNewUser(prev => ({ ...prev, permissions: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Access</SelectItem>
                        <SelectItem value="admin">Admin Access</SelectItem>
                        <SelectItem value="write">Read/Write</SelectItem>
                        <SelectItem value="read">Read Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => createUserMutation.mutate(newUser)}
                    disabled={createUserMutation.isPending || !newUser.username || !newUser.password}
                    className="w-full"
                  >
                    {createUserMutation.isPending ? "Creating..." : "Create User"}
                  </Button>
                </CardContent>
              </Card>

              {/* Users List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>
                    Manage existing users and their permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Permissions</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users?.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.fullName || user.username}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{user.department || "—"}</TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role || "visitor")}>
                                {user.role?.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={getPermissionColor(user.permissions || "read")}>
                                {user.permissions?.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {user.isActive ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                                <span className={user.isActive ? "text-green-600" : "text-red-600"}>
                                  {user.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleUserStatus(user.id, user.isActive || false)}
                                >
                                  {user.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Role Management */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Administrator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600 mb-4">Full system access and control</p>
                  <ul className="text-xs space-y-1 text-red-700">
                    <li>• User management</li>
                    <li>• System configuration</li>
                    <li>• All KEW.PA/KEW.PS functions</li>
                    <li>• Database access</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600 mb-4">Department management access</p>
                  <ul className="text-xs space-y-1 text-blue-700">
                    <li>• Asset approval</li>
                    <li>• Team management</li>
                    <li>• Reporting access</li>
                    <li>• KEW.PA/KEW.PS operations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Staff
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600 mb-4">Daily operations access</p>
                  <ul className="text-xs space-y-1 text-green-700">
                    <li>• Asset registration</li>
                    <li>• Inventory management</li>
                    <li>• Form submission</li>
                    <li>• Basic reporting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-gray-700 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Visitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Read-only access</p>
                  <ul className="text-xs space-y-1 text-gray-700">
                    <li>• View assets</li>
                    <li>• View inventory</li>
                    <li>• Basic search</li>
                    <li>• No modifications</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Security Settings</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-strong-passwords">Require Strong Passwords</Label>
                      <Switch id="require-strong-passwords" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-2fa">Enable Two-Factor Authentication</Label>
                      <Switch id="enable-2fa" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-logout">Auto Logout (30 min)</Label>
                      <Switch id="auto-logout" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">System Preferences</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="audit-logging">Enable Audit Logging</Label>
                      <Switch id="audit-logging" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="backup-alerts">Backup Alerts</Label>
                      <Switch id="backup-alerts" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users?.length || 0}</div>
                  <p className="text-sm text-gray-600 mt-1">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {users?.filter(u => u.isActive).length || 0}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {users?.filter(u => u.role === 'admin').length || 0}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Admin users</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}