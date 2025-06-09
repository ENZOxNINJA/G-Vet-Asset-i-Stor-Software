import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Database, Scan, BarChart3, Settings } from "lucide-react";
import { Asset, InventoryItem } from "@shared/schema";

export default function InfoTAsetIntegration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

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
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-700">Info-T Aset Management</CardTitle>
                  <CardDescription>
                    Fixed asset information and tracking system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAssets.slice(0, 10).map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-blue-300 text-blue-700">
                              {asset.assetTag}
                            </Badge>
                            <h3 className="font-semibold">{asset.name}</h3>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {asset.category} • {asset.department} • {asset.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">RM {asset.originalPrice || '0.00'}</div>
                          <div className="text-sm text-gray-500">{asset.brand}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* iStor Tab */}
          <TabsContent value="store" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">iStor Management</CardTitle>
                  <CardDescription>
                    Store inventory and consumable tracking system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredInventory.slice(0, 10).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-green-300 text-green-700">
                              {item.sku}
                            </Badge>
                            <h3 className="font-semibold">{item.name}</h3>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {item.category} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">RM {item.price}</div>
                          <Badge 
                            variant={item.quantity > (item.reorderLevel || 0) ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {item.quantity > (item.reorderLevel || 0) ? "In Stock" : "Low Stock"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Integration Status</CardTitle>
                  <CardDescription>
                    Connection between Info-T Aset, iStor, KEW.PA, and KEW.PS systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h3 className="font-semibold text-blue-700 mb-2">Info-T Aset ↔ KEW.PA</h3>
                        <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          Asset data synchronized with KEW.PA compliance framework
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg bg-green-50">
                        <h3 className="font-semibold text-green-700 mb-2">iStor ↔ KEW.PS</h3>
                        <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          Store inventory integrated with KEW.PS store management
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Integration Features</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Real-time data synchronization</li>
                        <li>• Unified search across all systems</li>
                        <li>• Cross-system reporting and analytics</li>
                        <li>• Compliance validation and alerts</li>
                        <li>• Automated workflow triggers</li>
                      </ul>
                    </div>
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