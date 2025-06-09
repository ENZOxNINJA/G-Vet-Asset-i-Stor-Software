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
  Star
} from "lucide-react";
import { type Asset } from "@shared/schema";
import { formatCurrency, cn } from "@/lib/utils";
import InstantFilter from "@/components/InstantFilter";

const Assets = () => {
  const { toast } = useToast();
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [highlightedAssetId, setHighlightedAssetId] = useState<string | null>(null);

  const { data: assets, isLoading } = useQuery({
    queryKey: ['/api/assets'],
    queryFn: async () => {
      const response = await fetch('/api/assets');
      if (!response.ok) throw new Error('Failed to fetch assets');
      return response.json();
    }
  });

  // Check for highlighted asset from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlight = urlParams.get('highlight');
    if (highlight) {
      setHighlightedAssetId(highlight);
      setTimeout(() => setHighlightedAssetId(null), 3000);
    }
  }, []);

  // Initialize filtered assets
  useEffect(() => {
    if (assets) {
      setFilteredAssets(assets);
    }
  }, [assets]);

  // Fuzzy search and filter function
  const applyFilters = (filters: Record<string, any>) => {
    if (!assets) return;

    let filtered = [...assets];

    // Apply search if provided
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.assetTag.toLowerCase().includes(searchTerm) ||
        asset.category.toLowerCase().includes(searchTerm) ||
        (asset.department && asset.department.toLowerCase().includes(searchTerm)) ||
        (asset.brand && asset.brand.toLowerCase().includes(searchTerm)) ||
        (asset.model && asset.model.toLowerCase().includes(searchTerm)) ||
        (asset.description && asset.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value || key === 'search') return;

      if (key === 'purchasePrice' && typeof value === 'object') {
        if (value.min) {
          filtered = filtered.filter(asset => 
            parseFloat(asset.purchasePrice?.toString() || '0') >= parseFloat(value.min)
          );
        }
        if (value.max) {
          filtered = filtered.filter(asset => 
            parseFloat(asset.purchasePrice?.toString() || '0') <= parseFloat(value.max)
          );
        }
      } else if (key === 'purchaseDate' && typeof value === 'object') {
        if (value.from) {
          filtered = filtered.filter(asset => 
            asset.purchaseDate && asset.purchaseDate >= value.from
          );
        }
        if (value.to) {
          filtered = filtered.filter(asset => 
            asset.purchaseDate && asset.purchaseDate <= value.to
          );
        }
      } else {
        filtered = filtered.filter(asset => 
          asset[key as keyof Asset]?.toString().toLowerCase() === value.toLowerCase()
        );
      }
    });

    setFilteredAssets(filtered);
  };

  // Filter configuration
  const filterConfigs = [
    { key: 'category', label: 'Category', type: 'select' as const },
    { key: 'type', label: 'Type', type: 'select' as const },
    { key: 'department', label: 'Department', type: 'select' as const },
    { key: 'location', label: 'Location', type: 'select' as const },
    { key: 'status', label: 'Status', type: 'select' as const },
    { key: 'condition', label: 'Condition', type: 'select' as const },
    { key: 'brand', label: 'Brand', type: 'select' as const },
    { key: 'purchasePrice', label: 'Purchase Price', type: 'range' as const },
    { key: 'purchaseDate', label: 'Purchase Date', type: 'date' as const },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'disposed': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold mb-2">Assets Management</h1>
            <p className="text-muted-foreground">
              Manage and track your organization's assets
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Asset
          </Button>
        </div>

        {/* Instant Filter */}
        <InstantFilter
          onFilter={applyFilters}
          configs={filterConfigs}
          data={assets}
          searchPlaceholder="Search assets by name, tag, category, department..."
        />

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Assets ({filteredAssets.length})</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Complete list of organizational assets with filtering and search capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Info</TableHead>
                    <TableHead>Category & Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <TableRow 
                        key={asset.id}
                        className={cn(
                          "hover:bg-muted/50",
                          highlightedAssetId === asset.id.toString() && "bg-yellow-100 animate-pulse"
                        )}
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              {asset.name}
                              {highlightedAssetId === asset.id.toString() && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Tag: {asset.assetTag}
                            </div>
                            {asset.brand && (
                              <div className="text-sm text-muted-foreground">
                                {asset.brand} {asset.model && `• ${asset.model}`}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline">{asset.category}</Badge>
                            {asset.type && (
                              <div className="text-sm text-muted-foreground">{asset.type}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {asset.department || 'Not assigned'}
                          </div>
                          {asset.location && (
                            <div className="text-sm text-muted-foreground">
                              📍 {asset.location}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(asset.status)}>
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getConditionColor(asset.condition || '')}>
                            {asset.condition || 'Not specified'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {asset.purchasePrice ? formatCurrency(asset.purchasePrice) : 'N/A'}
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {assets?.length === 0 ? 'No assets found' : 'No assets match your filters'}
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

export default Assets;