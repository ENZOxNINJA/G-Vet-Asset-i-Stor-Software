import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAsset } from "@/contexts/AssetContext";
import AppLayout from "@/components/AppLayout";
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
  Search, 
  Filter, 
  Loader2, 
  FileText,
  Pencil,
  Trash2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { type Asset } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import AssetFormModal from "@/components/AssetFormModal";

const Assets = () => {
  const { toast } = useToast();
  const {
    searchQuery,
    setSearchQuery,
    setIsFilterModalOpen,
    filter,
    setCurrentAsset,
    setIsAssetFormOpen,
    setIsDeleteModalOpen,
    setAssetToDelete,
  } = useAsset();

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsAssetFormOpen(true);
  };

  const handleDelete = (asset: Asset) => {
    setAssetToDelete(asset);
    setIsDeleteModalOpen(true);
  };

  const handleCreateNew = () => {
    setCurrentAsset(null);
    setIsAssetFormOpen(true);
  };

  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  // Apply filters and search
  const filteredAssets = assets?.filter((asset: Asset) => {
    // Search query filter
    if (searchQuery && 
        !asset.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filter.category && filter.category !== asset.category) {
      return false;
    }

    // Type filter
    if (filter.type && filter.type !== asset.type) {
      return false;
    }

    // Department filter
    if (filter.department && filter.department !== asset.department) {
      return false;
    }

    // Location filter
    if (filter.location && filter.location !== asset.location) {
      return false;
    }

    // Status filter
    if (filter.status && filter.status !== asset.status) {
      return false;
    }

    // Condition filter
    if (filter.condition && filter.condition !== asset.condition) {
      return false;
    }

    // Price range filter
    if (filter.minPrice && parseFloat(asset.price.toString()) < parseFloat(filter.minPrice)) {
      return false;
    }
    if (filter.maxPrice && parseFloat(asset.price.toString()) > parseFloat(filter.maxPrice)) {
      return false;
    }

    return true;
  }) || [];

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

  const getConditionBadge = (condition: string | null) => {
    if (!condition) return <Badge variant="outline">Unknown</Badge>;
    
    switch (condition.toLowerCase()) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800">Good</Badge>;
      case 'fair':
        return <Badge className="bg-blue-100 text-blue-800">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-yellow-100 text-yellow-800">Poor</Badge>;
      default:
        return <Badge variant="outline">{condition}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Assets</h2>
            <p className="text-muted-foreground">
              Manage and track all organization assets
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Register New Asset
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Asset Management</CardTitle>
            <CardDescription>
              View, filter and manage all registered assets.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or tag..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" onClick={handleOpenFilter}>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">No assets found</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1.5">
                  {searchQuery || Object.values(filter).some(Boolean)
                    ? "Try adjusting your search or filter criteria"
                    : "Start by registering your first asset"}
                </p>
                {!searchQuery && !Object.values(filter).some(Boolean) && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleCreateNew}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register New Asset
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Tag</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset: Asset) => (
                      <TableRow key={asset.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{asset.assetTag}</TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.category}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{asset.department || '-'}</TableCell>
                        <TableCell>{formatCurrency(Number(asset.price))}</TableCell>
                        <TableCell>{getStatusBadge(asset.status)}</TableCell>
                        <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(asset)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => handleDelete(asset)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Asset Form Modal */}
      <AssetFormModal />
    </AppLayout>
  );
};

export default Assets;