import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/components/SeparatedAppLayout";
import { Link } from "wouter";
import { 
  Warehouse, 
  Package, 
  Truck, 
  ClipboardList, 
  BarChart3, 
  AlertTriangle,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";

const KEWPSDashboard = () => {
  const { data: inventory } = useQuery({
    queryKey: ['/api/inventory'],
    queryFn: async () => {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return response.json();
    }
  });

  const calculateStoreStats = () => {
    if (!inventory) return { total: 0, lowStock: 0, outOfStock: 0, totalValue: 0 };
    
    return {
      total: inventory.length,
      lowStock: inventory.filter((item: any) => 
        item.quantity <= item.reorderLevel && item.quantity > 0
      ).length,
      outOfStock: inventory.filter((item: any) => item.quantity === 0).length,
      totalValue: inventory.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.price || 0) * item.quantity), 0
      )
    };
  };

  const stats = calculateStoreStats();

  const kewpsModules = [
    {
      title: "Store Receipts",
      description: "KEW.PS-1 Receipt Processing",
      icon: <Truck className="h-6 w-6" />,
      path: "/store-management-kewps?tab=receipts",
      color: "bg-blue-500",
      forms: ["KEW.PS-1", "KEW.PS-2"]
    },
    {
      title: "Stock Register",
      description: "KEW.PS-3 Inventory Management",
      icon: <Package className="h-6 w-6" />,
      path: "/store-management-kewps?tab=inventory",
      color: "bg-green-500",
      forms: ["KEW.PS-3", "KEW.PS-4", "KEW.PS-5"]
    },
    {
      title: "Stock Issuance",
      description: "KEW.PS-8 Request Processing",
      icon: <ClipboardList className="h-6 w-6" />,
      path: "/store-management-kewps?tab=issuance",
      color: "bg-orange-500",
      forms: ["KEW.PS-7", "KEW.PS-8", "KEW.PS-9"]
    },
    {
      title: "Store Verification",
      description: "KEW.PS-10 Annual Verification",
      icon: <CheckCircle className="h-6 w-6" />,
      path: "/store-management-kewps?tab=verification",
      color: "bg-purple-500",
      forms: ["KEW.PS-10", "KEW.PS-11", "KEW.PS-12"]
    }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Warehouse className="h-8 w-8 text-secondary" />
            <h1 className="text-3xl font-bold">KEW.PS Store Management</h1>
            <Badge className="bg-secondary/10 text-secondary">Kewangan Pengurusan Stor</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Malaysian Government Store and Inventory Management Framework
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">KEW.PS Modules</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="reports">Store Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Stock Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Active stock lines</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.lowStock}</div>
                  <p className="text-xs text-muted-foreground">Below reorder level</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.outOfStock}</div>
                  <p className="text-xs text-muted-foreground">Zero quantity items</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM {stats.totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Current inventory value</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Health Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Stock Availability</span>
                        <span className="text-sm">
                          {((stats.total - stats.outOfStock) / Math.max(stats.total, 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(stats.total - stats.outOfStock) / Math.max(stats.total, 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Optimal Stock Levels</span>
                        <span className="text-sm">
                          {((stats.total - stats.lowStock - stats.outOfStock) / Math.max(stats.total, 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(stats.total - stats.lowStock - stats.outOfStock) / Math.max(stats.total, 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">Stock Turnover</div>
                        <div className="text-sm text-muted-foreground">Monthly average</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Good</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <div>
                        <div className="font-medium">Order Fulfillment</div>
                        <div className="text-sm text-muted-foreground">Request completion rate</div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">95%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <div>
                        <div className="font-medium">Reorder Efficiency</div>
                        <div className="text-sm text-muted-foreground">Stock level management</div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kewpsModules.map((module) => (
                <Card key={module.path} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${module.color} text-white`}>
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <div className="text-sm text-muted-foreground mb-2">Available Forms:</div>
                      <div className="flex flex-wrap gap-1">
                        {module.forms.map((form) => (
                          <Badge key={form} variant="outline" className="text-xs">
                            {form}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link href={module.path}>
                      <Button className="w-full">
                        Access Module
                        <Package className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Store Transactions</CardTitle>
                <CardDescription>Latest stock movements and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory?.slice(0, 10).map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{format(new Date(), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>Receipt</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>KEW.PS-1</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No recent transactions
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">KEW.PS-4</CardTitle>
                  <CardDescription>List of Stock Registers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">KEW.PS-6</CardTitle>
                  <CardDescription>Expired Stock Report</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Check Expiry
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">KEW.PS-13</CardTitle>
                  <CardDescription>Verification Summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Summary
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Store Compliance Status</CardTitle>
                <CardDescription>KEW.PS framework compliance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Stock Register Maintenance</span>
                    <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Annual Verification Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Transaction Documentation</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Reorder Level Settings</span>
                    <Badge className="bg-green-100 text-green-800">Configured</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default KEWPSDashboard;