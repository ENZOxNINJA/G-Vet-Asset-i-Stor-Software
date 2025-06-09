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
  Package, 
  Truck, 
  ClipboardList, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Search,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";

const StoreManagementKEWPS = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch inventory data for KEW.PS operations
  const { data: inventory, isLoading } = useQuery({
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

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">KEW.PS Store Management System</h1>
          <p className="text-muted-foreground">
            Kewangan Pengurusan Stor - Malaysian Government Store Management Framework
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Receipts (KEW.PS-1)
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Stock Register (KEW.PS-3)
            </TabsTrigger>
            <TabsTrigger value="issuance" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Issuance (KEW.PS-8)
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Verification (KEW.PS-10)
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Stock Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Registered items</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
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
                  <p className="text-xs text-muted-foreground">Zero quantity</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
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
                  <CardTitle>KEW.PS Forms Overview</CardTitle>
                  <CardDescription>
                    Available store management forms and processes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <div>
                        <div className="font-medium">KEW.PS-1</div>
                        <div className="text-sm text-muted-foreground">Store Receipt Form</div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">KEW.PS-3</div>
                        <div className="text-sm text-muted-foreground">Stock Register/Card</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                      <div>
                        <div className="font-medium">KEW.PS-8</div>
                        <div className="text-sm text-muted-foreground">Individual Stock Request</div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                      <div>
                        <div className="font-medium">KEW.PS-10</div>
                        <div className="text-sm text-muted-foreground">Annual Store Verification</div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Scheduled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for store management
                  </CardDescription>
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
                        <span className="text-sm font-medium">Stock Health</span>
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
            </div>
          </TabsContent>

          {/* Store Receipts Tab - KEW.PS-1 */}
          <TabsContent value="receipts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Receipt Form (KEW.PS-1)</CardTitle>
                <CardDescription>
                  Record receipt of goods from suppliers or other government stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoreReceiptForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Register Tab - KEW.PS-3 */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Register (KEW.PS-3)</CardTitle>
                <CardDescription>
                  Perpetual inventory record showing all stock movements and balances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockRegisterView inventory={inventory || []} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issuance Tab - KEW.PS-8 */}
          <TabsContent value="issuance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Issuance (KEW.PS-8)</CardTitle>
                <CardDescription>
                  Process individual stock requests and issuance to end users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockIssuanceForm inventory={inventory || []} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab - KEW.PS-10 */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Verification (KEW.PS-10)</CardTitle>
                <CardDescription>
                  Annual store verification and stock count procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoreVerificationForm inventory={inventory || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Store Receipt Form Component (KEW.PS-1)
const StoreReceiptForm = () => {
  const [formData, setFormData] = useState({
    receiptNumber: '',
    receiptDate: format(new Date(), 'yyyy-MM-dd'),
    supplierName: '',
    itemDescription: '',
    quantity: '',
    unitPrice: '',
    totalValue: '',
    receivedBy: '',
    verifiedBy: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process KEW.PS-1 form submission
    console.log('KEW.PS-1 Receipt Data:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="receiptNumber">Receipt Number</Label>
          <Input
            id="receiptNumber"
            value={formData.receiptNumber}
            onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
            placeholder="e.g., RCP-2025-001"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="receiptDate">Receipt Date</Label>
          <Input
            id="receiptDate"
            type="date"
            value={formData.receiptDate}
            onChange={(e) => setFormData({...formData, receiptDate: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="supplierName">Supplier/Source</Label>
          <Input
            id="supplierName"
            value={formData.supplierName}
            onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
            placeholder="Supplier name or other government store"
            required
          />
        </div>

        <div>
          <Label htmlFor="receivedBy">Received By</Label>
          <Input
            id="receivedBy"
            value={formData.receivedBy}
            onChange={(e) => setFormData({...formData, receivedBy: e.target.value})}
            placeholder="Store officer name and position"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="itemDescription">Item Description</Label>
        <Textarea
          id="itemDescription"
          value={formData.itemDescription}
          onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
          placeholder="Detailed description of received items"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            placeholder="Number of units"
            required
          />
        </div>

        <div>
          <Label htmlFor="unitPrice">Unit Price (RM)</Label>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            value={formData.unitPrice}
            onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
            placeholder="Price per unit"
          />
        </div>

        <div>
          <Label htmlFor="totalValue">Total Value (RM)</Label>
          <Input
            id="totalValue"
            type="number"
            step="0.01"
            value={formData.totalValue}
            onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
            placeholder="Total receipt value"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Generate KEW.PS-1 Receipt
      </Button>
    </form>
  );
};

// Stock Register View Component (KEW.PS-3)
const StockRegisterView = ({ inventory }: { inventory: any[] }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Current Stock Register</h3>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generate KEW.PS-4 Summary
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Current Balance</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Reorder Level</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit || 'pcs'}</TableCell>
              <TableCell>{item.reorderLevel}</TableCell>
              <TableCell>
                {item.quantity === 0 ? (
                  <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                ) : item.quantity <= item.reorderLevel ? (
                  <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Stock Issuance Form Component (KEW.PS-8)
const StockIssuanceForm = ({ inventory }: { inventory: any[] }) => {
  const [formData, setFormData] = useState({
    requestNumber: '',
    requestDate: format(new Date(), 'yyyy-MM-dd'),
    applicantName: '',
    applicantDepartment: '',
    itemId: '',
    quantityRequested: '',
    purpose: '',
    approvedBy: ''
  });

  return (
    <div className="space-y-6">
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="requestNumber">Request Number</Label>
            <Input
              id="requestNumber"
              value={formData.requestNumber}
              onChange={(e) => setFormData({...formData, requestNumber: e.target.value})}
              placeholder="e.g., REQ-2025-001"
              required
            />
          </div>

          <div>
            <Label htmlFor="requestDate">Request Date</Label>
            <Input
              id="requestDate"
              type="date"
              value={formData.requestDate}
              onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="applicantName">Applicant Name</Label>
            <Input
              id="applicantName"
              value={formData.applicantName}
              onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
              placeholder="Name of requesting officer"
              required
            />
          </div>

          <div>
            <Label htmlFor="applicantDepartment">Department</Label>
            <Input
              id="applicantDepartment"
              value={formData.applicantDepartment}
              onChange={(e) => setFormData({...formData, applicantDepartment: e.target.value})}
              placeholder="Requesting department"
              required
            />
          </div>

          <div>
            <Label htmlFor="itemId">Stock Item</Label>
            <Select value={formData.itemId} onValueChange={(value) => setFormData({...formData, itemId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select stock item" />
              </SelectTrigger>
              <SelectContent>
                {inventory.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name} (Available: {item.quantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantityRequested">Quantity Requested</Label>
            <Input
              id="quantityRequested"
              type="number"
              value={formData.quantityRequested}
              onChange={(e) => setFormData({...formData, quantityRequested: e.target.value})}
              placeholder="Number of units needed"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="purpose">Purpose/Justification</Label>
          <Textarea
            id="purpose"
            value={formData.purpose}
            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            placeholder="Explain the purpose for this stock request"
            rows={3}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Submit KEW.PS-8 Request
        </Button>
      </form>
    </div>
  );
};

// Store Verification Form Component (KEW.PS-10)
const StoreVerificationForm = ({ inventory }: { inventory: any[] }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verification Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="verificationYear">Verification Year</Label>
              <Input
                id="verificationYear"
                value={new Date().getFullYear().toString()}
                readOnly
              />
            </div>
            
            <div>
              <Label htmlFor="verifierName">Verification Officer</Label>
              <Input
                id="verifierName"
                placeholder="Name of appointed verification officer"
              />
            </div>

            <div>
              <Label htmlFor="verificationDate">Verification Date</Label>
              <Input
                id="verificationDate"
                type="date"
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <Button className="w-full">
              Start Annual Verification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Items to Verify:</span>
                <span className="font-semibold">{inventory.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Items Verified:</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span>Discrepancies Found:</span>
                <span className="font-semibold text-red-600">0</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Progress:</span>
                <span className="font-semibold">0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">KEW.PS-11</div>
                <div className="text-sm text-muted-foreground">Performance Evaluation</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">KEW.PS-12</div>
                <div className="text-sm text-muted-foreground">Verification Certificate</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">KEW.PS-13</div>
                <div className="text-sm text-muted-foreground">Verification Report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreManagementKEWPS;