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
  ClipboardCheck, 
  Search, 
  Calendar, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  FileText
} from "lucide-react";
import { format } from "date-fns";

const AssetInspection = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInspection, setSelectedInspection] = useState<any>(null);

  // Fetch inspections
  const { data: inspections, isLoading } = useQuery({
    queryKey: ['/api/inspections'],
    queryFn: async () => {
      const response = await fetch('/api/inspections');
      if (!response.ok) throw new Error('Failed to fetch inspections');
      return response.json();
    }
  });

  // Fetch assets for inspection assignment
  const { data: assets } = useQuery({
    queryKey: ['/api/assets'],
    queryFn: async () => {
      const response = await fetch('/api/assets');
      if (!response.ok) throw new Error('Failed to fetch assets');
      return response.json();
    }
  });

  // Create new inspection
  const createInspectionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inspections', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inspection created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inspections'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create inspection.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      assigned: { color: "bg-blue-100 text-blue-800", label: "Assigned" },
      "in-progress": { color: "bg-yellow-100 text-yellow-800", label: "In Progress" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      certified: { color: "bg-purple-100 text-purple-800", label: "Certified" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.assigned;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleCreateInspection = (data: any) => {
    createInspectionMutation.mutate({
      ...data,
      inspectionYear: new Date().getFullYear().toString(),
      status: 'assigned'
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Asset Inspection Management</h1>
          <p className="text-muted-foreground">
            KEW.PA-11, KEW.PA-12, KEW.PA-13 - Asset Inspection and Verification System
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              New Inspection
            </TabsTrigger>
            <TabsTrigger value="conduct" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Conduct Inspection
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports & Certificates
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inspections?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inspections?.filter((i: any) => i.status === 'completed').length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Successfully completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inspections?.filter((i: any) => i.status === 'in-progress').length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Currently ongoing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certified</CardTitle>
                  <Award className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inspections?.filter((i: any) => i.status === 'certified').length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">With certificates</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Inspections</CardTitle>
                <CardDescription>
                  Latest asset inspection activities and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inspection Year</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Assets Inspected</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspections?.map((inspection: any) => (
                      <TableRow key={inspection.id}>
                        <TableCell>{inspection.inspectionYear}</TableCell>
                        <TableCell className="capitalize">{inspection.inspectionType}</TableCell>
                        <TableCell>{inspection.department}</TableCell>
                        <TableCell>{inspection.inspectorName}</TableCell>
                        <TableCell>
                          {inspection.totalAssetsInspected}/{inspection.totalAssetsRegistered}
                        </TableCell>
                        <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInspection(inspection)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Inspection Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Asset Inspection</CardTitle>
                <CardDescription>
                  Set up a new inspection assignment following KEW.PA-11 procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InspectionForm onSubmit={handleCreateInspection} assets={assets || []} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conduct Inspection Tab */}
          <TabsContent value="conduct" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conduct Asset Inspection</CardTitle>
                <CardDescription>
                  Record inspection findings and update asset status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConductInspectionForm inspections={inspections || []} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inspection Reports & Certificates</CardTitle>
                <CardDescription>
                  Generate KEW.PA-12 (Reports) and KEW.PA-13 (Certificates)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReportsCertificatesSection inspections={inspections || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Inspection Form Component
const InspectionForm = ({ onSubmit, assets }: { onSubmit: (data: any) => void; assets: any[] }) => {
  const [formData, setFormData] = useState({
    inspectionType: '',
    department: '',
    division: '',
    inspectorName: '',
    inspectorPosition: '',
    assignedDate: format(new Date(), 'yyyy-MM-dd'),
    totalAssetsRegistered: assets?.length || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      inspectionType: '',
      department: '',
      division: '',
      inspectorName: '',
      inspectorPosition: '',
      assignedDate: format(new Date(), 'yyyy-MM-dd'),
      totalAssetsRegistered: assets?.length || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="inspectionType">Inspection Type</Label>
          <Select 
            value={formData.inspectionType} 
            onValueChange={(value) => setFormData({...formData, inspectionType: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select inspection type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Annual Inspection</SelectItem>
              <SelectItem value="quarterly">Quarterly Inspection</SelectItem>
              <SelectItem value="spot">Spot Check</SelectItem>
              <SelectItem value="verification">Verification Exercise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="department">Department/Ministry</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            placeholder="e.g., Perbendaharaan Malaysia"
            required
          />
        </div>

        <div>
          <Label htmlFor="division">Division/Branch</Label>
          <Input
            id="division"
            value={formData.division}
            onChange={(e) => setFormData({...formData, division: e.target.value})}
            placeholder="e.g., Bahagian ICT"
          />
        </div>

        <div>
          <Label htmlFor="inspectorName">Inspector Name</Label>
          <Input
            id="inspectorName"
            value={formData.inspectorName}
            onChange={(e) => setFormData({...formData, inspectorName: e.target.value})}
            placeholder="Full name of appointed inspector"
            required
          />
        </div>

        <div>
          <Label htmlFor="inspectorPosition">Inspector Position</Label>
          <Input
            id="inspectorPosition"
            value={formData.inspectorPosition}
            onChange={(e) => setFormData({...formData, inspectorPosition: e.target.value})}
            placeholder="Official position/title"
            required
          />
        </div>

        <div>
          <Label htmlFor="assignedDate">Assignment Date</Label>
          <Input
            id="assignedDate"
            type="date"
            value={formData.assignedDate}
            onChange={(e) => setFormData({...formData, assignedDate: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Create Inspection Assignment
        </Button>
      </div>
    </form>
  );
};

// Conduct Inspection Form Component
const ConductInspectionForm = ({ inspections }: { inspections: any[] }) => {
  const [selectedInspection, setSelectedInspection] = useState('');
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="selectInspection">Select Inspection</Label>
        <Select value={selectedInspection} onValueChange={setSelectedInspection}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an active inspection" />
          </SelectTrigger>
          <SelectContent>
            {inspections
              .filter(i => i.status === 'assigned' || i.status === 'in-progress')
              .map((inspection) => (
                <SelectItem key={inspection.id} value={inspection.id.toString()}>
                  {inspection.inspectionYear} - {inspection.department} ({inspection.inspectionType})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {selectedInspection && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Record Inspection Findings</h3>
          <p className="text-sm text-muted-foreground">
            This section would contain the detailed inspection form for recording individual asset findings,
            updating asset conditions, and marking completion status.
          </p>
        </div>
      )}
    </div>
  );
};

// Reports and Certificates Section
const ReportsCertificatesSection = ({ inspections }: { inspections: any[] }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">KEW.PA-12</CardTitle>
            <CardDescription>Inspection Summary Reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate consolidated inspection reports for management review
            </p>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate KEW.PA-12 Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">KEW.PA-13</CardTitle>
            <CardDescription>Annual Inspection Certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Issue official certificates for completed annual inspections
            </p>
            <Button variant="outline" className="w-full">
              <Award className="h-4 w-4 mr-2" />
              Generate KEW.PA-13 Certificate
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections
                .filter(i => i.status === 'completed' || i.status === 'certified')
                .map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell className="capitalize">{inspection.inspectionType}</TableCell>
                    <TableCell>{inspection.inspectionYear}</TableCell>
                    <TableCell>{inspection.department}</TableCell>
                    <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Award className="h-4 w-4 mr-1" />
                          Certificate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    assigned: { color: "bg-blue-100 text-blue-800", label: "Assigned" },
    "in-progress": { color: "bg-yellow-100 text-yellow-800", label: "In Progress" },
    completed: { color: "bg-green-100 text-green-800", label: "Completed" },
    certified: { color: "bg-purple-100 text-purple-800", label: "Certified" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.assigned;
  return <Badge className={config.color}>{config.label}</Badge>;
};

export default AssetInspection;