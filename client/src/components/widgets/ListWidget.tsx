import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Widget } from "@/contexts/DashboardContext";
import { Asset, AssetMovement, InventoryItem, Supplier } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface ListWidgetProps {
  widget: Widget;
  data: any[];
  isLoading?: boolean;
}

const ListWidget = ({ widget, data, isLoading }: ListWidgetProps) => {
  const { title, config } = widget;
  const limit = config?.limit || 5;
  const sortBy = config?.sortBy || 'date';
  
  const filteredAndSortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let result = [...data];
    
    // Apply sorting
    if (sortBy === 'date') {
      result.sort((a, b) => {
        const dateA = a.requestDate || a.createdAt || a.updatedAt || 0;
        const dateB = b.requestDate || b.createdAt || b.updatedAt || 0;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'price') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }
    
    // Apply limit
    return result.slice(0, limit);
  }, [data, limit, sortBy]);

  // Render different list items based on data type
  const renderListItem = (item: any, index: number) => {
    // Determine the type of data
    if (item.type && item.assetId && (item.fromLocation || item.toLocation)) {
      // Looks like an AssetMovement
      return renderMovementItem(item as AssetMovement, index);
    } else if (item.assetTag && item.department) {
      // Looks like an Asset
      return renderAssetItem(item as Asset, index);
    } else if (item.sku && item.quantity !== undefined) {
      // Looks like an Inventory item
      return renderInventoryItem(item as InventoryItem, index);
    } else if (item.contactPerson) {
      // Looks like a Supplier
      return renderSupplierItem(item as Supplier, index);
    } else {
      // Generic fallback
      return (
        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
          <div className="font-medium">{item.name || `Item #${item.id}`}</div>
          <div className="text-xs text-muted-foreground">
            {item.updatedAt ? format(new Date(item.updatedAt), "MMM d, yyyy") : "N/A"}
          </div>
        </div>
      );
    }
  };

  const renderMovementItem = (item: AssetMovement, index: number) => {
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

    return (
      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
        <div>
          <div className="font-medium">{item.type}</div>
          <div className="text-xs text-muted-foreground">{item.fromLocation} → {item.toLocation}</div>
        </div>
        <div className="flex flex-col items-end">
          {getStatusBadge(item.status)}
          <div className="text-xs text-muted-foreground mt-1">
            {item.requestDate ? format(new Date(item.requestDate), "MMM d, yyyy") : "N/A"}
          </div>
        </div>
      </div>
    );
  };

  const renderAssetItem = (item: Asset, index: number) => {
    return (
      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">Tag: {item.assetTag}</div>
        </div>
        <div className="text-right">
          <div>{formatCurrency(Number(item.price))}</div>
          <div className="text-xs text-muted-foreground">{item.department || "No Dept."}</div>
        </div>
      </div>
    );
  };

  const renderInventoryItem = (item: InventoryItem, index: number) => {
    const getStockStatus = (quantity: number, reorderLevel?: number) => {
      const threshold = reorderLevel || 10;
      
      if (quantity <= 0) {
        return <Badge variant="destructive">Out of Stock</Badge>;
      } else if (quantity <= threshold) {
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      } else {
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      }
    };

    return (
      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 justify-end">
            <span>{item.quantity} in stock</span>
            {getStockStatus(item.quantity, item.reorderLevel)}
          </div>
          <div className="text-xs text-muted-foreground">{formatCurrency(Number(item.price))}</div>
        </div>
      </div>
    );
  };

  const renderSupplierItem = (item: Supplier, index: number) => {
    return (
      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">Contact: {item.contactPerson || "N/A"}</div>
        </div>
        <div className="text-xs text-muted-foreground">
          {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : "N/A"}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {data && data.length > 0 
            ? `Showing ${Math.min(limit, data.length)} of ${data.length} items`
            : 'No items available'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        ) : filteredAndSortedData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-center text-muted-foreground">No data available</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredAndSortedData.map(renderListItem)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListWidget;