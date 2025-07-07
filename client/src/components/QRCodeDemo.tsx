import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Scan, Package, Building2, MapPin, Users } from "lucide-react";

interface QRCodeData {
  type: 'asset' | 'inventory' | 'location' | 'unit';
  id: string | number;
  code: string;
  metadata?: Record<string, any>;
}

export default function QRCodeDemo() {
  const [selectedType, setSelectedType] = useState<'asset' | 'inventory' | 'location' | 'unit'>('asset');
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [sampleCode, setSampleCode] = useState('');

  const qrTypes = [
    { type: 'asset' as const, label: 'Asset', icon: Package, color: 'bg-blue-500' },
    { type: 'inventory' as const, label: 'Inventory', icon: Building2, color: 'bg-green-500' },
    { type: 'location' as const, label: 'Location', icon: MapPin, color: 'bg-orange-500' },
    { type: 'unit' as const, label: 'Unit', icon: Users, color: 'bg-purple-500' }
  ];

  const generateSampleQR = () => {
    const samples: Record<string, QRCodeData> = {
      asset: {
        type: 'asset',
        id: 1001,
        code: 'AST-2025-001',
        metadata: {
          registrationNumber: 'KEW-PA-001-2025',
          generatedAt: new Date().toISOString(),
          system: 'KEW.PA'
        }
      },
      inventory: {
        type: 'inventory',
        id: 2001,
        code: 'INV-STK-001',
        metadata: {
          generatedAt: new Date().toISOString(),
          system: 'KEW.PS'
        }
      },
      location: {
        type: 'location',
        id: 3001,
        code: 'LOC-BLDG-A-001',
        metadata: {
          generatedAt: new Date().toISOString(),
          system: 'KEW-LOCATION'
        }
      },
      unit: {
        type: 'unit',
        id: 4001,
        code: 'UNIT-HQ-001',
        metadata: {
          generatedAt: new Date().toISOString(),
          system: 'KEW-UNIT'
        }
      }
    };

    setQrData(samples[selectedType]);
    setSampleCode(JSON.stringify(samples[selectedType], null, 2));
  };

  const downloadQR = () => {
    if (!qrData) return;
    
    // Create a mock download (in real implementation, this would generate actual QR code)
    const link = document.createElement('a');
    link.download = `qr-${qrData.type}-${qrData.code}.png`;
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">QR Code Generation System</h3>
        <p className="text-sm text-muted-foreground">
          Demonstrate the enhanced QR code tracking system for assets, inventory, locations, and units.
        </p>
      </div>

      {/* QR Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {qrTypes.map(({ type, label, icon: Icon, color }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            className={`h-20 flex-col gap-2 ${selectedType === type ? color : ''}`}
            onClick={() => setSelectedType(type)}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </div>

      {/* QR Generation Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass card-hover border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Generate QR Code
            </CardTitle>
            <CardDescription>
              Create QR codes for {selectedType} tracking and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sample-code">Sample Code ID</Label>
              <Input
                id="sample-code"
                placeholder={`Enter ${selectedType} code...`}
                className="glass"
              />
            </div>
            
            <Button onClick={generateSampleQR} className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              Generate Sample QR Code
            </Button>

            {qrData && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {qrData.type}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={downloadQR}>
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
                
                {/* Mock QR Code Display */}
                <div className="aspect-square bg-white border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">QR Code Preview</p>
                    <p className="text-xs text-muted-foreground">{qrData.code}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass card-hover border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              QR Code Data
            </CardTitle>
            <CardDescription>
              JSON structure embedded in the QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qrData ? (
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Type: <span className="text-primary">{qrData.type}</span></div>
                  <div className="font-medium">ID: <span className="text-primary">{qrData.id}</span></div>
                  <div className="font-medium">Code: <span className="text-primary">{qrData.code}</span></div>
                </div>
                
                <div>
                  <Label className="text-xs">Complete JSON Data:</Label>
                  <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-auto max-h-48 mt-1">
                    {sampleCode}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Scan className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Generate a QR code to see the data structure</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card className="glass card-hover border-border/50">
        <CardHeader>
          <CardTitle>QR Code System Features</CardTitle>
          <CardDescription>
            Enhanced tracking capabilities for government compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Asset QR Codes (KEW.PA)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Registration number tracking</li>
                <li>• Asset tag identification</li>
                <li>• Maintenance scheduling</li>
                <li>• Transfer documentation</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Inventory QR Codes (KEW.PS)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SKU and batch tracking</li>
                <li>• Stock level monitoring</li>
                <li>• Expiry date management</li>
                <li>• Store verification</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Location QR Codes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• GPS coordinate mapping</li>
                <li>• Building/room identification</li>
                <li>• Asset location verification</li>
                <li>• Access control integration</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Unit QR Codes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Department identification</li>
                <li>• Multi-unit coordination</li>
                <li>• Transfer authorization</li>
                <li>• Responsibility tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}