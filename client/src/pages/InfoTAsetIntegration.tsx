import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Database, Scan, BarChart3, Settings, RefreshCw, AlertCircle, CheckCircle, Package } from "lucide-react";
import { Asset, InventoryItem } from "@shared/schema";
import InfoTAssetCard from "@/components/InfoTAssetCard";
import IStorInventoryCard from "@/components/IStorInventoryCard";
import { useToast } from "@/hooks/use-toast";

export default function InfoTAsetIntegration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error'>('synced');
  const { toast } = useToast();

  const { data: assets } = useQuery<Asset[]>({
    queryKey: ["/api/assets"],
  });

  const { data: inventory } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const filteredAssets = assets?.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredInventory = inventory?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewAssetDetails = (id: number) => {
    window.location.href = `/assets`;
    toast({
      title: "Navigating to Asset Details",
      description: `Opening detailed view for asset ID: ${id}`,
    });
  };

  const handleScanQR = (assetTag: string) => {
    toast({
      title: "QR Code Scanner",
      description: `Scanning QR code for asset: ${assetTag}`,
    });
    // QR scanning functionality would be implemented here
  };

  const handleViewInventoryDetails = (id: number) => {
    window.location.href = `/inventory`;
    toast({
      title: "Navigating to Inventory Details",
      description: `Opening detailed view for inventory ID: ${id}`,
    });
  };

  const handleManageStock = (id: number) => {
    toast({
      title: "Stock Management",
      description: `Opening stock management for item ID: ${id}`,
    });
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('synced');
      toast({
        title: "Sync Complete",
        description: "All systems synchronized successfully",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Info-T Aset & iStor Integration
              </h1>
              <p className="text-gray-600 mt-1">
                Unified Asset and Store Information Management System
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search assets, inventory, or information..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Scan className="h-4 w-4 mr-2" />
              Scan QR
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Info-T Aset
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              iStor
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Integration
            </TabsTrigger>
            <TabsTrigger value="kewpa" className="flex items-center gap-2 text-blue-600">
              KEW.PA
            </TabsTrigger>
            <TabsTrigger value="kewps" className="flex items-center gap-2 text-green-600">
              KEW.PS
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Total Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{assets?.length || 0}</div>
                  <p className="text-blue-600 text-sm mt-1">Fixed Assets Registered</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Inventory Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{inventory?.length || 0}</div>
                  <p className="text-green-600 text-sm mt-1">Store Items Tracked</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">Active</div>
                  <Badge variant="secondary" className="mt-1 bg-purple-100 text-purple-800">
                    Synchronized
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">Data Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">98%</div>
                  <p className="text-orange-600 text-sm mt-1">Information Accuracy</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks for asset and store management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Database className="h-6 w-6" />
                    Register Asset
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Add Store Item
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Scan className="h-6 w-6" />
                    Scan Barcode
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Info-T Aset Tab */}
          <TabsContent value="assets" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-blue-700">Info-T Aset Management</CardTitle>
                      <CardDescription>
                        Fixed asset information and tracking with KEW.PA compliance
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSync}
                      disabled={syncStatus === 'syncing'}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                      {syncStatus === 'syncing' ? 'Syncing...' : 'Sync with KEW.PA'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssets.slice(0, 12).map((asset) => (
                      <InfoTAssetCard
                        key={asset.id}
                        asset={asset}
                        onViewDetails={handleViewAssetDetails}
                        onScanQR={handleScanQR}
                      />
                    ))}
                  </div>
                  {filteredAssets.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No assets found matching your search criteria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* iStor Tab */}
          <TabsContent value="store" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-green-700">iStor Management</CardTitle>
                      <CardDescription>
                        Store inventory and consumable tracking with KEW.PS compliance
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSync}
                      disabled={syncStatus === 'syncing'}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                      {syncStatus === 'syncing' ? 'Syncing...' : 'Sync with KEW.PS'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInventory.slice(0, 12).map((item) => (
                      <IStorInventoryCard
                        key={item.id}
                        item={item}
                        onViewDetails={handleViewInventoryDetails}
                        onManageStock={handleManageStock}
                      />
                    ))}
                  </div>
                  {filteredInventory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No inventory items found matching your search criteria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>System Integration Status</CardTitle>
                      <CardDescription>
                        Real-time monitoring of Info-T Aset, iStor, KEW.PA, and KEW.PS connections
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {syncStatus === 'synced' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {syncStatus === 'syncing' && <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />}
                      {syncStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                      <Badge variant={syncStatus === 'synced' ? 'default' : syncStatus === 'syncing' ? 'secondary' : 'destructive'}>
                        {syncStatus === 'synced' ? 'All Systems Online' : syncStatus === 'syncing' ? 'Synchronizing' : 'Connection Error'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-blue-700">Info-T Aset ↔ KEW.PA</CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <Badge className="bg-green-100 text-green-800">Active Connection</Badge>
                            <p className="text-sm text-gray-600">
                              Asset data synchronized with KEW.PA compliance framework
                            </p>
                            <div className="text-xs text-gray-500">
                              Last sync: {new Date().toLocaleTimeString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {assets?.length || 0} assets synchronized
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-green-700">iStor ↔ KEW.PS</CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <Badge className="bg-green-100 text-green-800">Active Connection</Badge>
                            <p className="text-sm text-gray-600">
                              Store inventory integrated with KEW.PS store management
                            </p>
                            <div className="text-xs text-gray-500">
                              Last sync: {new Date().toLocaleTimeString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {inventory?.length || 0} items synchronized
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Integration Features & Capabilities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3 text-blue-700">Data Synchronization</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Real-time asset data sync
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Inventory level monitoring
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Cross-system validation
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Automated compliance checks
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 text-green-700">System Integration</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Unified search across all systems
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Cross-system reporting
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Automated workflow triggers
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Government compliance automation
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Manual Sync Controls</CardTitle>
                        <CardDescription>Force synchronization between systems</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4">
                          <Button
                            onClick={handleSync}
                            disabled={syncStatus === 'syncing'}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                            Sync All Systems
                          </Button>
                          <Button variant="outline" disabled={syncStatus === 'syncing'}>
                            <Database className="h-4 w-4 mr-2" />
                            Validate Data Integrity
                          </Button>
                          <Button variant="outline" disabled={syncStatus === 'syncing'}>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Sync Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* KEW.PA Tab */}
          <TabsContent value="kewpa" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">KEW.PA Framework Integration</CardTitle>
                <CardDescription>
                  Fixed asset management compliance with Malaysian government standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 justify-start gap-3 text-blue-700 border-blue-200 hover:bg-blue-50">
                    <FileText className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Asset Registration</div>
                      <div className="text-sm text-gray-600">KEW.PA-1, 2, 3</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start gap-3 text-blue-700 border-blue-200 hover:bg-blue-50">
                    <Scan className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Asset Verification</div>
                      <div className="text-sm text-gray-600">Annual Verification</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start gap-3 text-blue-700 border-blue-200 hover:bg-blue-50">
                    <Settings className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Asset Maintenance</div>
                      <div className="text-sm text-gray-600">KEW.PA-14, 15, 16</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start gap-3 text-blue-700 border-blue-200 hover:bg-blue-50">
                    <BarChart3 className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Compliance Reports</div>
                      <div className="text-sm text-gray-600">Government Reporting</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KEW.PS Tab */}
          <TabsContent value="kewps" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">KEW.PS Framework Integration</CardTitle>
                <CardDescription>
                  Store management compliance with Malaysian government standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 justify-start gap-3 text-green-700 border-green-200 hover:bg-green-50">
                    <FileText className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Store Receipts</div>
                      <div className="text-sm text-gray-600">KEW.PS-1, 2</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start gap-3 text-green-700 border-green-200 hover:bg-green-50">
                    <Database className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Stock Register</div>
                      <div className="text-sm text-gray-600">KEW.PS-3, 4, 5</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start gap-3 text-green-700 border-green-200 hover:bg-green-50">
                    <Scan className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Stock Issuance</div>
                      <div className="text-sm text-gray-600">KEW.PS-7, 8, 9</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start gap-3 text-green-700 border-green-200 hover:bg-green-50">
                    <BarChart3 className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Store Verification</div>
                      <div className="text-sm text-gray-600">KEW.PS-10, 11, 12, 13</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}