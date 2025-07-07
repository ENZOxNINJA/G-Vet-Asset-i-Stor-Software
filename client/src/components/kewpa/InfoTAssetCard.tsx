import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, QrCode, FileText, Eye } from "lucide-react";
import { Asset } from "@shared/schema";

interface InfoTAssetCardProps {
  asset: Asset;
  onViewDetails: (id: number) => void;
  onScanQR: (assetTag: string) => void;
}

export default function InfoTAssetCard({ asset, onViewDetails, onScanQR }: InfoTAssetCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg text-blue-700">{asset.name}</CardTitle>
              <Badge variant="outline" className="mt-1 border-blue-300 text-blue-700">
                {asset.assetTag}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onScanQR(asset.assetTag)}
            className="text-blue-600 hover:bg-blue-50"
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category:</span>
              <div className="font-medium">{asset.category}</div>
            </div>
            <div>
              <span className="text-gray-500">Department:</span>
              <div className="font-medium">{asset.department || 'N/A'}</div>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <Badge 
                variant={asset.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {asset.status}
              </Badge>
            </div>
            <div>
              <span className="text-gray-500">Value:</span>
              <div className="font-medium">RM {asset.originalPrice}</div>
            </div>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-500">Location:</span>
            <div className="font-medium">{asset.location || 'Not specified'}</div>
          </div>
          
          {asset.brand && (
            <div className="text-sm">
              <span className="text-gray-500">Brand/Model:</span>
              <div className="font-medium">{asset.brand} {asset.model}</div>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(asset.id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-blue-600 hover:bg-blue-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              KEW.PA Forms
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}