import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, BarChart3, FileText, AlertTriangle } from "lucide-react";
import { InventoryItem } from "@shared/schema";

interface IStorInventoryCardProps {
  item: InventoryItem;
  onViewDetails: (id: number) => void;
  onManageStock: (id: number) => void;
}

export default function IStorInventoryCard({ item, onViewDetails, onManageStock }: IStorInventoryCardProps) {
  const isLowStock = item.quantity <= (item.reorderLevel || 0);
  
  return (
    <Card className="hover:shadow-md transition-shadow border-green-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle className="text-lg text-green-700">{item.name}</CardTitle>
              <Badge variant="outline" className="mt-1 border-green-300 text-green-700">
                SKU: {item.sku}
              </Badge>
            </div>
          </div>
          {isLowStock && (
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category:</span>
              <div className="font-medium">{item.category}</div>
            </div>
            <div>
              <span className="text-gray-500">Price:</span>
              <div className="font-medium">RM {item.price}</div>
            </div>
            <div>
              <span className="text-gray-500">Quantity:</span>
              <div className="font-medium flex items-center gap-2">
                {item.quantity}
                <Badge 
                  variant={isLowStock ? "destructive" : "default"}
                  className="text-xs"
                >
                  {isLowStock ? "Low Stock" : "In Stock"}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Reorder Level:</span>
              <div className="font-medium">{item.reorderLevel || 'Not set'}</div>
            </div>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-500">Status:</span>
            <Badge 
              variant={item.status === 'active' ? 'default' : 'secondary'}
              className="ml-2 text-xs"
            >
              {item.status}
            </Badge>
          </div>
          
          {item.description && (
            <div className="text-sm">
              <span className="text-gray-500">Description:</span>
              <div className="font-medium text-gray-700">{item.description}</div>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(item.id)}
              className="flex-1"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onManageStock(item.id)}
              className="flex-1 text-green-600 hover:bg-green-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              KEW.PS Forms
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}