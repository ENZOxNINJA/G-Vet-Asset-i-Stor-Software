import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/SeparatedAppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CircleUser,
  PackageOpen,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  LayoutDashboard
} from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();
  
  const { data: assets, isLoading: loadingAssets } = useQuery({
    queryKey: ['/api/assets'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/assets');
        if (!response.ok) {
          throw new Error('Failed to fetch assets');
        }
        return await response.json();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load assets data",
        });
        throw error;
      }
    }
  });
  
  const { data: inventory, isLoading: loadingInventory } = useQuery({
    queryKey: ['/api/inventory'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/inventory');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }
        return await response.json();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load inventory data",
        });
        throw error;
      }
    }
  });

  const totalAssets = assets?.length || 0;
  const pendingVerification = assets?.filter(asset => 
    asset.status === "pending" || asset.status === "verification_pending"
  ).length || 0;
  
  const totalInventory = inventory?.length || 0;
  const lowStockItems = inventory?.filter(item => 
    item.quantity <= (item.reorderLevel || 10) && item.quantity > 0
  ).length || 0;
  const outOfStockItems = inventory?.filter(item => item.quantity <= 0).length || 0;

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to PLT ASSET</h2>
        <p className="text-muted-foreground">
          View and manage your organization's assets and inventory efficiently.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssets}</div>
              <p className="text-xs text-muted-foreground">
                Registered assets across all departments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingVerification}</div>
              <p className="text-xs text-muted-foreground">
                Assets awaiting verification
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInventory}</div>
              <p className="text-xs text-muted-foreground">
                Total items in the inventory
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems + outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">
                Low and out of stock items
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Asset Movements</CardTitle>
                  <CardDescription>Latest asset transfers and loans</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAssets ? (
                    <p className="text-center text-muted-foreground py-4">Loading...</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-center text-muted-foreground py-4">No recent movements</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Asset Distribution</CardTitle>
                  <CardDescription>Assets by department</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAssets ? (
                    <p className="text-center text-muted-foreground py-4">Loading...</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-center text-muted-foreground py-4">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                  <CardDescription>Stock levels by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingInventory ? (
                    <p className="text-center text-muted-foreground py-4">Loading...</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-center text-muted-foreground py-4">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Detailed analysis of assets and inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Analytics module coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Asset and inventory reports
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Reports module coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;