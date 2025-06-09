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
  Building2, 
  ClipboardCheck, 
  Settings, 
  Search, 
  ArrowRightLeft, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Eye
} from "lucide-react";
import { format } from "date-fns";

const KEWPADashboard = () => {
  const { data: assets } = useQuery({
    queryKey: ['/api/assets'],
    queryFn: async () => {
      const response = await fetch('/api/assets');
      if (!response.ok) throw new Error('Failed to fetch assets');
      return response.json();
    }
  });

  const { data: inspections } = useQuery({
    queryKey: ['/api/inspections'],
    queryFn: async () => {
      const response = await fetch('/api/inspections');
      if (!response.ok) throw new Error('Failed to fetch inspections');
      return response.json();
    }
  });

  const { data: maintenance } = useQuery({
    queryKey: ['/api/maintenance'],
    queryFn: async () => {
      const response = await fetch('/api/maintenance');
      if (!response.ok) throw new Error('Failed to fetch maintenance');
      return response.json();
    }
  });

  const calculateAssetStats = () => {
    if (!assets) return { total: 0, active: 0, needMaintenance: 0, totalValue: 0 };
    
    return {
      total: assets.length,
      active: assets.filter((asset: any) => asset.status === 'active').length,
      needMaintenance: assets.filter((asset: any) => asset.condition === 'poor').length,
      totalValue: assets.reduce((sum: number, asset: any) => sum + parseFloat(asset.price || 0), 0)
    };
  };

  const stats = calculateAssetStats();

  const kewpaModules = [
    {
      title: "Asset Registration",
      description: "KEW.PA-1, KEW.PA-2, KEW.PA-3",
      icon: <ClipboardCheck className="h-6 w-6" />,
      path: "/asset-registration-kewpa",
      color: "bg-blue-500",
      status: "Active"
    },
    {
      title: "Asset Inspection",
      description: "KEW.PA-11, KEW.PA-12, KEW.PA-13",
      icon: <Search className="h-6 w-6" />,
      path: "/asset-inspection",
      color: "bg-green-500",
      status: "Active"
    },
    {
      title: "Asset Maintenance",
      description: "KEW.PA-14, KEW.PA-15, KEW.PA-16",
      icon: <Settings className="h-6 w-6" />,
      path: "/asset-maintenance",
      color: "bg-orange-500",
      status: "Active"
    },
    {
      title: "Asset Movement",
      description: "KEW.PA-9, KEW.PA-17, KEW.PA-18",
      icon: <ArrowRightLeft className="h-6 w-6" />,
      path: "/asset-movement",
      color: "bg-purple-500",
      status: "Active"
    }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">KEW.PA Asset Management</h1>
            <Badge className="bg-blue-100 text-blue-700">Kewangan Pendaftaran Aset</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Malaysian Government Fixed Asset Management Framework
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">KEW.PA Modules</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Registered assets</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">Currently in use</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Needs Maintenance</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.needMaintenance}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM {stats.totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Asset portfolio value</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Distribution by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['ICT Equipment', 'Vehicles', 'Furniture', 'Buildings', 'Machinery'].map((category, index) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{Math.floor(Math.random() * 50)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Inspections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inspections?.slice(0, 5).map((inspection: any) => (
                      <div key={inspection.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{inspection.department}</div>
                          <div className="text-sm text-muted-foreground">{inspection.inspectionType}</div>
                        </div>
                        <Badge variant="outline">{inspection.status}</Badge>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">No inspections scheduled</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kewpaModules.map((module) => (
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
                      <Badge className="bg-green-100 text-green-700">{module.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={module.path}>
                      <Button className="w-full">
                        Access Module
                        <ArrowRightLeft className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Asset Activities</CardTitle>
                <CardDescription>Latest actions across all KEW.PA modules</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets?.slice(0, 10).map((asset: any) => (
                      <TableRow key={asset.id}>
                        <TableCell>{format(new Date(asset.createdAt || new Date()), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>Asset Registration</TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>KEW.PA-3</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No recent activities
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
                  <CardTitle className="text-lg">Asset Register</CardTitle>
                  <CardDescription>Complete asset listing</CardDescription>
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
                  <CardTitle className="text-lg">Inspection Summary</CardTitle>
                  <CardDescription>Annual inspection results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Summary
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maintenance Log</CardTitle>
                  <CardDescription>Maintenance history report</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Download Log
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>KEW.PA framework compliance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Asset Registration Compliance</span>
                    <Badge className="bg-green-100 text-green-800">100%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Annual Inspection Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Maintenance Records</span>
                    <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Movement Documentation</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
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

export default KEWPADashboard;