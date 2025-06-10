import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye,
  Search,
  Building2,
  Package,
  BarChart3,
  FileText,
  Shield,
  Clock,
  AlertCircle
} from "lucide-react";
import { Asset, InventoryItem } from "@shared/schema";

export default function VisitorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: assets } = useQuery<Asset[]>({
    queryKey: ["/api/assets"],
  });

  const { data: inventory } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const filteredAssets = assets?.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    return matchesSearch && asset.category.toLowerCase().includes(selectedCategory.toLowerCase());
  }) || [];

  const filteredInventory = inventory?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    return matchesSearch && item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-8 w-8 text-gray-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Visitor Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Read-only access to government asset and inventory information
              </p>
            </div>
          </div>

          {/* Access Notice */}
          <Card className="border-orange-200 bg-orange-50 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">Visitor Access Mode</h3>
                  <p className="text-sm text-orange-700">
                    You have read-only access to view assets and inventory. Contact your administrator for additional permissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Bar */}
          <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assets and inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Export (Admin Only)
            </Button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-700">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{assets?.length || 0}</div>
              <p className="text-blue-600 text-sm mt-1">Fixed Assets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-700">Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{inventory?.length || 0}</div>
              <p className="text-green-600 text-sm mt-1">Store Items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-700">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {new Set([
                  ...(assets?.map(a => a.category) || []),
                  ...(inventory?.map(i => i.category) || [])
                ]).size}
              </div>
              <p className="text-gray-600 text-sm mt-1">Unique Categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-purple-700">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-bold text-purple-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <p className="text-purple-600 text-sm mt-1">Data Sync</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Assets View */}
          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Government Assets</CardTitle>
                <CardDescription>
                  Fixed assets managed under KEW.PA framework - Read Only Access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAssets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No assets found matching your search criteria</p>
                    </div>
                  ) : (
                    filteredAssets.map((asset) => (
                      <div key={asset.id} className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="border-blue-300 text-blue-700">
                                {asset.assetTag}
                              </Badge>
                              <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Category:</span>
                                <div>{asset.category}</div>
                              </div>
                              <div>
                                <span className="font-medium">Department:</span>
                                <div>{asset.department || 'N/A'}</div>
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <Badge variant={asset.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                  {asset.status}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Location:</span>
                                <div>{asset.location || 'Not specified'}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-medium text-blue-700">RM {asset.originalPrice}</div>
                            <div className="text-sm text-gray-500">{asset.brand}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory View */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Store Inventory</CardTitle>
                <CardDescription>
                  Consumable items managed under KEW.PS framework - Read Only Access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInventory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No inventory items found matching your search criteria</p>
                    </div>
                  ) : (
                    filteredInventory.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg hover:bg-green-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="border-green-300 text-green-700">
                                {item.sku}
                              </Badge>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              {item.quantity <= (item.reorderLevel || 0) && (
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Category:</span>
                                <div>{item.category}</div>
                              </div>
                              <div>
                                <span className="font-medium">Quantity:</span>
                                <div className="flex items-center gap-2">
                                  {item.quantity}
                                  <Badge 
                                    variant={item.quantity > (item.reorderLevel || 0) ? "default" : "destructive"}
                                    className="text-xs"
                                  >
                                    {item.quantity > (item.reorderLevel || 0) ? "In Stock" : "Low Stock"}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Reorder Level:</span>
                                <div>{item.reorderLevel || 'Not set'}</div>
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                  {item.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-medium text-green-700">RM {item.price}</div>
                            <div className="text-sm text-gray-500">Per Unit</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports View */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
                <CardDescription>
                  Summary reports and analytics - Read Only Access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-700">Asset Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Active Assets:</span>
                          <span className="font-medium">{assets?.filter(a => a.status === 'active').length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Value:</span>
                          <span className="font-medium">
                            RM {assets?.reduce((sum, asset) => sum + Number(asset.originalPrice || 0), 0).toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Categories:</span>
                          <span className="font-medium">{new Set(assets?.map(a => a.category)).size || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-700">Inventory Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Active Items:</span>
                          <span className="font-medium">{inventory?.filter(i => i.status === 'active').length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Units:</span>
                          <span className="font-medium">{inventory?.reduce((sum, item) => sum + item.quantity, 0) || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Low Stock Items:</span>
                          <span className="font-medium text-orange-600">
                            {inventory?.filter(i => i.quantity <= (i.reorderLevel || 0)).length || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">Access Limitation Notice</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    As a visitor, you can view summary information but cannot access detailed reports, 
                    modify data, or export information. Contact your system administrator to request 
                    additional permissions or detailed reports.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}