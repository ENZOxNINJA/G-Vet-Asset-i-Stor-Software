import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/SeparatedAppLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Loader2, 
  FileText,
  Pencil,
  Trash2,
  Eye,
  Star,
  Package,
  AlertTriangle
} from "lucide-react";
import { type InventoryItem } from "@shared/schema";
import { formatCurrency, cn } from "@/lib/utils";
import InstantFilter from "@/components/InstantFilter";

const Inventory = () => {
  const { toast } = useToast();
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['/api/inventory'],
    queryFn: async () => {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return response.json();
    }
  });

  // Check for highlighted item from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlight = urlParams.get('highlight');
    if (highlight) {
      setHighlightedItemId(highlight);
      setTimeout(() => setHighlightedItemId(null), 3000);
    }
  }, []);

  // Initialize filtered inventory
  useEffect(() => {
    if (inventory) {
      setFilteredInventory(inventory);
    }
  }, [inventory]);

  // Fuzzy search and filter function
  const applyFilters = (filters: Record<string, any>) => {
    if (!inventory) return;

    let filtered = [...inventory];

    // Apply search if provided
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.sku.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.location && item.location.toLowerCase().includes(searchTerm))
      );
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value || key === 'search') return;

      if (key === 'price' && typeof value === 'object') {
        if (value.min) {
          filtered = filtered.filter(item => 
            parseFloat(item.price?.toString() || '0') >= parseFloat(value.min)
          );
        }
        if (value.max) {
          filtered = filtered.filter(item => 
            parseFloat(item.price?.toString() || '0') <= parseFloat(value.max)
          );
        }
      } else if (key === 'quantity' && typeof value === 'object') {
        if (value.min) {
          filtered = filtered.filter(item => 
            item.quantity >= parseInt(value.min)
          );
        }
        if (value.max) {
          filtered = filtered.filter(item => 
            item.quantity <= parseInt(value.max)
          );
        }
      } else if (key === 'stockStatus') {
        if (value === 'in-stock') {
          filtered = filtered.filter(item => item.quantity > item.reorderLevel);
        } else if (value === 'low-stock') {
          filtered = filtered.filter(item => 
            item.quantity <= item.reorderLevel && item.quantity > 0
          );
        } else if (value === 'out-of-stock') {
          filtered = filtered.filter(item => item.quantity === 0);
        }
      } else {
        filtered = filtered.filter(item => 
          item[key as keyof InventoryItem]?.toString().toLowerCase() === value.toLowerCase()
        );
      }
    });

    setFilteredInventory(filtered);
  };

  // Filter configuration
  const filterConfigs = [
    { key: 'category', label: 'Category', type: 'select' as const },
    { key: 'location', label: 'Location', type: 'select' as const },
    { 
      key: 'stockStatus', 
      label: 'Stock Status', 
      type: 'select' as const,
      options: [
        { value: 'in-stock', label: 'In Stock' },
        { value: 'low-stock', label: 'Low Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' }
      ]
    },
    { key: 'price', label: 'Price Range', type: 'range' as const },
    { key: 'quantity', label: 'Quantity Range', type: 'range' as const },
  ];

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (item.quantity <= item.reorderLevel) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-muted-foreground">
              Track and manage your inventory items and stock levels
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Instant Filter */}
        <InstantFilter
          onFilter={applyFilters}
          configs={filterConfigs}
          data={inventory}
          searchPlaceholder="Search inventory by name, SKU, category, location..."
        />

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{filteredInventory.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredInventory.filter(item => 
                      item.quantity <= item.reorderLevel && item.quantity > 0
                    ).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredInventory.filter(item => item.quantity === 0).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      filteredInventory.reduce((sum, item) => 
                        sum + (parseFloat(item.price || '0') * item.quantity), 0
                      )
                    )}
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inventory Items ({filteredInventory.length})</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Complete inventory with real-time stock tracking and filtering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => {
                      const stockStatus = getStockStatus(item);
                      return (
                        <TableRow 
                          key={item.id}
                          className={cn(
                            "hover:bg-muted/50",
                            highlightedItemId === item.id.toString() && "bg-yellow-100 animate-pulse"
                          )}
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium flex items-center gap-2">
                                {item.name}
                                {highlightedItemId === item.id.toString() && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                SKU: {item.sku}
                              </div>
                              {item.description && (
                                <div className="text-sm text-muted-foreground">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{item.quantity}</div>
                              <div className="text-sm text-muted-foreground">
                                Reorder: {item.reorderLevel}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.price ? formatCurrency(item.price) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {item.location || 'Not specified'}
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>
                              {stockStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {inventory?.length === 0 ? 'No inventory items found' : 'No items match your filters'}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Inventory;
