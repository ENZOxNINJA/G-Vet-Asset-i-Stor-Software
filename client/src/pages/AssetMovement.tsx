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
  Trash2,
  ArrowRightLeft,
  CalendarIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { type Asset, type AssetMovement } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import MovementFormModal from "@/components/MovementFormModal";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

const AssetMovement = () => {
  const { toast } = useToast();
  const {
    setIsMovementModalOpen,
    setCurrentMovement,
  } = useAsset();
  
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all movements
  const { data: movements, isLoading: isLoadingMovements } = useQuery({
    queryKey: ['/api/movements'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/movements');
        if (!response.ok) {
          throw new Error('Failed to fetch movements');
        }
        return await response.json();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load asset movements",
        });
        throw error;
      }
    },
  });
  
  // Fetch all assets to get asset names
  const { data: assets, isLoading: isLoadingAssets } = useQuery({
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

  // Delete mutation
  const deleteMovement = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/movements/${id}`, {
        method: "DELETE",
      } as RequestInit);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Movement record deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/movements'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete movement: ${error}`,
      });
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (movement: AssetMovement) => {
    setCurrentMovement(movement);
    setIsMovementModalOpen(true);
  };

  const handleDelete = (movement: AssetMovement) => {
    if (window.confirm(`Are you sure you want to delete this movement record?`)) {
      deleteMovement.mutate(movement.id);
    }
  };

  const handleCreateNew = () => {
    setCurrentMovement(null);
    setIsMovementModalOpen(true);
  };

  // Filter movements based on search query
  const filteredMovements = movements?.filter((movement: AssetMovement) => {
    if (!searchQuery) return true;
    
    const asset = assets?.find((a: Asset) => a.id === movement.assetId);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      asset?.name.toLowerCase().includes(searchLower) ||
      asset?.assetTag.toLowerCase().includes(searchLower) ||
      movement.fromLocation.toLowerCase().includes(searchLower) ||
      movement.toLocation.toLowerCase().includes(searchLower) ||
      movement.type.toLowerCase().includes(searchLower) ||
      movement.status.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Get asset name by ID
  const getAssetName = (assetId: number) => {
    const asset = assets?.find((a: Asset) => a.id === assetId);
    return asset ? `${asset.assetTag} - ${asset.name}` : `Asset #${assetId}`;
  };

  // Badge for movement status
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved')) {
      return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
    } else if (statusLower.includes('pending')) {
      return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
    } else if (statusLower.includes('rejected')) {
      return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
    } else if (statusLower.includes('returned')) {
      return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  // Badge for movement type
  const getTypeBadge = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('transfer')) {
      return <Badge className="bg-primary-100 text-primary-800">{type}</Badge>;
    } else if (typeLower.includes('loan')) {
      return <Badge className="bg-purple-100 text-purple-800">{type}</Badge>;
    } else if (typeLower.includes('maintenance')) {
      return <Badge className="bg-orange-100 text-orange-800">{type}</Badge>;
    }
    return <Badge variant="outline">{type}</Badge>;
  };

  const isLoading = isLoadingMovements || isLoadingAssets;

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Asset Movement</h2>
            <p className="text-muted-foreground">
              Track and manage asset transfers and loans
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Movement
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <ArrowRightLeft className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Movement Records</CardTitle>
                <CardDescription>Manage asset transfers, loans and returns</CardDescription>
              </div>
            </div>
            <div className="relative flex-1 pt-4">
              <Search className="absolute left-2.5 top-6.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movements..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredMovements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">No movement records found</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1.5">
                  {searchQuery 
                    ? "Try adjusting your search criteria"
                    : "Start by creating your first asset movement record"}
                </p>
                {!searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleCreateNew}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Movement
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.map((movement: AssetMovement) => (
                      <TableRow key={movement.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{getAssetName(movement.assetId)}</TableCell>
                        <TableCell>{getTypeBadge(movement.type)}</TableCell>
                        <TableCell>{movement.fromLocation}</TableCell>
                        <TableCell>{movement.toLocation}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {movement.requestDate ? format(new Date(movement.requestDate), 'dd MMM yyyy') : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(movement.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(movement)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => handleDelete(movement)}
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
      
      {/* Movement Form Modal */}
      <MovementFormModal />
    </AppLayout>
  );
};

export default AssetMovement;