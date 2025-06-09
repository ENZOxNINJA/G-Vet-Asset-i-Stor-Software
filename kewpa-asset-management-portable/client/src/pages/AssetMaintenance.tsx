import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AppLayout from "@/components/SeparatedAppLayout";
import { 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  FileText,
  Plus,
  Search
} from "lucide-react";
import { format } from "date-fns";

const AssetMaintenance = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAsset, setSelectedAsset] = useState("");

  // Fetch maintenance records
  const { data: maintenanceRecords, isLoading } = useQuery({
    queryKey: ['/api/maintenance'],
    queryFn: async () => {
      const response = await fetch('/api/maintenance');
      if (!response.ok) throw new Error('Failed to fetch maintenance records');
      return response.json();
    }
  });

  // Fetch assets
  const { data: assets } = useQuery({
    queryKey: ['/api/assets'],
    queryFn: async () => {
      const response = await fetch('/api/assets');
      if (!response.ok) throw new Error('Failed to fetch assets');
      return response.json();
    }
  });

  // Create maintenance request
  const createMaintenanceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/maintenance', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance request created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create maintenance request.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { color: "bg-blue-100 text-blue-800", label: "Requested" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      assigned: { color: "bg-yellow-100 text-yellow-800", label: "Assigned" },
      "in-progress": { color: "bg-orange-100 text-orange-800", label: "In Progress" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      verified: { color: "bg-purple-100 text-purple-800", label: "Verified" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.requested;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      urgent: { color: "bg-red-100 text-red-800", label: "Urgent" },
      normal: { color: "bg-blue-100 text-blue-800", label: "Normal" },
      low: { color: "bg-gray-100 text-gray-800", label: "Low" }
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.normal;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const calculateMaintenanceStats = () => {
    if (!maintenanceRecords) return { total: 0, pending: 0, completed: 0, totalCost: 0 };
    
    return {
      total: maintenanceRecords.length,
      pending: maintenanceRecords.filter((r: any) => 
        ['requested', 'approved', 'assigned', 'in-progress'].includes(r.status)
      ).length,
      completed: maintenanceRecords.filter((r: any) => 
        ['completed', 'verified'].includes(r.status)
      ).length,
      totalCost: maintenanceRecords
        .filter((r: any) => r.totalCost)
        .reduce((sum: number, r: any) => sum + parseFloat(r.totalCost || 0), 0)
    };
  };

  const stats = calculateMaintenanceStats();

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Asset Maintenance Management</h1>
          <p className="text-muted-foreground">
            KEW.PA-14, KEW.PA-15, KEW.PA-16 - Comprehensive Asset Maintenance System
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="request" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Maintenance Schedule
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">All maintenance records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">Awaiting completion</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <p className="text-xs text-muted-foreground">Successfully completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RM {stats.totalCost.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Maintenance Activities</CardTitle>
                <CardDescription>
                  Latest maintenance requests and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRecords?.slice(0, 10).map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {assets?.find((a: any) => a.id === record.assetId)?.name || 'Unknown Asset'}
                        </TableCell>
                        <TableCell className="capitalize">{record.maintenanceType}</TableCell>
                        <TableCell>{record.requestedBy}</TableCell>
                        <TableCell>{format(new Date(record.requestedDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{getUrgencyBadge(record.urgencyLevel)}</TableCell>
                        <TableCell>RM {parseFloat(record.totalCost || 0).toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Request Tab */}
          <TabsContent value="request" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Maintenance Request</CardTitle>
                <CardDescription>
                  Submit a new maintenance request following KEW.PA-10 procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MaintenanceRequestForm 
                  assets={assets || []} 
                  onSubmit={(data) => createMaintenanceMutation.mutate(data)} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preventive Maintenance Schedule</CardTitle>
                <CardDescription>
                  Scheduled maintenance activities and upcoming due dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MaintenanceScheduleView 
                  maintenanceRecords={maintenanceRecords || []} 
                  assets={assets || []} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">KEW.PA-14</CardTitle>
                  <CardDescription>Capital Asset Maintenance Register</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed maintenance history for capital assets (≥RM2,000)
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate KEW.PA-14
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">KEW.PA-15</CardTitle>
                  <CardDescription>Low-Value Asset Maintenance Register</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Maintenance records for low-value assets (&lt;RM2,000)
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate KEW.PA-15
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">KEW.PA-16</CardTitle>
                  <CardDescription>Annual Maintenance Report</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive annual maintenance summary
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate KEW.PA-16
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <MaintenanceCostAnalysis maintenanceRecords={maintenanceRecords || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Maintenance Request Form Component
const MaintenanceRequestForm = ({ assets, onSubmit }: { assets: any[]; onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    assetId: '',
    maintenanceType: '',
    problemDescription: '',
    urgencyLevel: 'normal',
    requestedBy: '',
    requestedDate: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      assetId: parseInt(formData.assetId)
    });
    setFormData({
      assetId: '',
      maintenanceType: '',
      problemDescription: '',
      urgencyLevel: 'normal',
      requestedBy: '',
      requestedDate: format(new Date(), 'yyyy-MM-dd')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assetId">Asset</Label>
          <Select 
            value={formData.assetId} 
            onValueChange={(value) => setFormData({...formData, assetId: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset) => (
                <SelectItem key={asset.id} value={asset.id.toString()}>
                  {asset.name} ({asset.assetTag})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maintenanceType">Maintenance Type</Label>
          <Select 
            value={formData.maintenanceType} 
            onValueChange={(value) => setFormData({...formData, maintenanceType: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preventive">Preventive Maintenance</SelectItem>
              <SelectItem value="corrective">Corrective Maintenance</SelectItem>
              <SelectItem value="emergency">Emergency Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="urgencyLevel">Urgency Level</Label>
          <Select 
            value={formData.urgencyLevel} 
            onValueChange={(value) => setFormData({...formData, urgencyLevel: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="requestedBy">Requested By</Label>
          <Input
            id="requestedBy"
            value={formData.requestedBy}
            onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
            placeholder="Name and position"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="problemDescription">Problem Description</Label>
        <Textarea
          id="problemDescription"
          value={formData.problemDescription}
          onChange={(e) => setFormData({...formData, problemDescription: e.target.value})}
          placeholder="Detailed description of the problem or maintenance requirement"
          rows={4}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Maintenance Request
      </Button>
    </form>
  );
};

// Maintenance Schedule View Component
const MaintenanceScheduleView = ({ maintenanceRecords, assets }: { maintenanceRecords: any[]; assets: any[] }) => {
  const upcomingMaintenance = maintenanceRecords
    .filter(record => record.nextMaintenanceDue && new Date(record.nextMaintenanceDue) > new Date())
    .sort((a, b) => new Date(a.nextMaintenanceDue).getTime() - new Date(b.nextMaintenanceDue).getTime());

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Last Maintenance</TableHead>
            <TableHead>Next Due</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {upcomingMaintenance.map((record) => {
            const asset = assets.find(a => a.id === record.assetId);
            const daysUntilDue = Math.ceil(
              (new Date(record.nextMaintenanceDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            
            return (
              <TableRow key={record.id}>
                <TableCell>{asset?.name || 'Unknown'}</TableCell>
                <TableCell>
                  {record.workEndDate ? format(new Date(record.workEndDate), 'dd/MM/yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  {format(new Date(record.nextMaintenanceDue), 'dd/MM/yyyy')}
                  <span className={`ml-2 text-xs ${daysUntilDue <= 7 ? 'text-red-600' : 'text-gray-500'}`}>
                    ({daysUntilDue} days)
                  </span>
                </TableCell>
                <TableCell className="capitalize">{record.maintenanceType}</TableCell>
                <TableCell>
                  {daysUntilDue <= 7 ? (
                    <Badge className="bg-red-100 text-red-800">Due Soon</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {upcomingMaintenance.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No scheduled maintenance found
        </div>
      )}
    </div>
  );
};

// Maintenance Cost Analysis Component
const MaintenanceCostAnalysis = ({ maintenanceRecords }: { maintenanceRecords: any[] }) => {
  const currentYear = new Date().getFullYear();
  const yearlyData = maintenanceRecords
    .filter(record => record.workEndDate && record.totalCost)
    .reduce((acc, record) => {
      const year = new Date(record.workEndDate).getFullYear();
      if (!acc[year]) acc[year] = { total: 0, count: 0 };
      acc[year].total += parseFloat(record.totalCost);
      acc[year].count += 1;
      return acc;
    }, {} as Record<number, { total: number; count: number }>);

  const typeAnalysis = maintenanceRecords
    .filter(record => record.totalCost)
    .reduce((acc, record) => {
      const type = record.maintenanceType;
      if (!acc[type]) acc[type] = { total: 0, count: 0 };
      acc[type].total += parseFloat(record.totalCost);
      acc[type].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Yearly Cost Breakdown</h3>
        <div className="space-y-2">
          {Object.entries(yearlyData)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([year, data]) => (
              <div key={year} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{year}</span>
                <div className="text-right">
                  <div className="font-semibold">RM {data.total.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{data.count} requests</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Cost by Maintenance Type</h3>
        <div className="space-y-2">
          {Object.entries(typeAnalysis).map(([type, data]) => (
            <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium capitalize">{type}</span>
              <div className="text-right">
                <div className="font-semibold">RM {data.total.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{data.count} requests</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetMaintenance;