import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, Plus, PlusCircle, ArrowRightLeft, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAsset } from "@/contexts/AssetContext";
import AssetFormModal from "@/components/forms/AssetFormModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { type Asset } from "@shared/schema";

const AssetRegistration = () => {
  const { toast } = useToast();
  const { setIsAssetFormOpen, setCurrentAsset } = useAsset();
  const [activeTab, setActiveTab] = useState("registration");

  // Load recent assets
  const { data: assets, isLoading } = useQuery({
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
          description: "Failed to load assets",
        });
        throw error;
      }
    },
  });

  const handleAddNewAsset = () => {
    setCurrentAsset(null);
    setIsAssetFormOpen(true);
  };

  // Extract recent assets (last 5)
  const recentAssets = assets?.slice(0, 5) || [];

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') || statusLower.includes('in use')) {
      return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
    } else if (statusLower.includes('storage')) {
      return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
    } else if (statusLower.includes('maintenance')) {
      return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
    } else if (statusLower.includes('disposed') || statusLower.includes('lost')) {
      return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Asset Registration</h2>
            <p className="text-muted-foreground">
              Register and document new assets
            </p>
          </div>
          <Button onClick={handleAddNewAsset}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Register New Asset
          </Button>
        </div>

        <Tabs 
          defaultValue="registration" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="recent">Recent Assets</TabsTrigger>
            <TabsTrigger value="guide">Registration Guide</TabsTrigger>
          </TabsList>
          <TabsContent value="registration">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Clipboard className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>Registration Module</CardTitle>
                    <CardDescription>Add new assets to the system</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={handleAddNewAsset}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Plus className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-lg font-medium">Register New Asset</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add a new asset to the inventory system
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <ArrowRightLeft className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Asset Transfer</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Transfer assets between departments or locations
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Bulk Registration</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Import multiple assets at once from a spreadsheet
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Registration Process</h3>
                      <p className="text-sm text-amber-700">
                        All newly registered assets will require verification by an authorized user before being marked as active in the system.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recently Registered Assets</CardTitle>
                <CardDescription>The most recently registered assets in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : recentAssets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No assets have been registered yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={handleAddNewAsset}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Register Your First Asset
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset Tag</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentAssets.map((asset: Asset) => (
                          <TableRow key={asset.id}>
                            <TableCell className="font-medium">{asset.assetTag}</TableCell>
                            <TableCell>{asset.name}</TableCell>
                            <TableCell>{asset.type}</TableCell>
                            <TableCell>{asset.department || '-'}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(asset.price.toString()))}</TableCell>
                            <TableCell>{getStatusBadge(asset.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Asset Registration Guide</CardTitle>
                <CardDescription>Learn how to properly register assets in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <h3>Asset Registration Process</h3>
                  <p>
                    Proper asset registration is critical for maintaining accurate records of all organization assets.
                    Follow these steps to ensure consistent and complete asset information:
                  </p>
                  
                  <ol className="ml-6 space-y-2">
                    <li>
                      <strong>Prepare asset information</strong> - Gather all asset details including 
                      purchase documentation, warranty information, and technical specifications.
                    </li>
                    <li>
                      <strong>Assign a unique asset tag</strong> - Use the organization's asset tagging 
                      system to create a unique identifier.
                    </li>
                    <li>
                      <strong>Complete all required fields</strong> - Ensure accuracy in critical fields 
                      like purchase date, value, and department assignment.
                    </li>
                    <li>
                      <strong>Submit for verification</strong> - After registration, assets must be 
                      verified by an authorized user.
                    </li>
                    <li>
                      <strong>Attach documentation</strong> - Upload any relevant purchase orders,
                      warranty documents, or user manuals.
                    </li>
                  </ol>
                  
                  <h3 className="mt-6">Asset Tag Format</h3>
                  <p>
                    Asset tags should follow the format: <code>[Department Code]-[Sequential Number]-[Year]</code>
                  </p>
                  <p>
                    For example: <code>IT-0042-2023</code> for an IT department asset, or 
                    <code>FIN-0013-2023</code> for a Finance department asset.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Asset Form Modal */}
      <AssetFormModal />
    </AppLayout>
  );
};

export default AssetRegistration;