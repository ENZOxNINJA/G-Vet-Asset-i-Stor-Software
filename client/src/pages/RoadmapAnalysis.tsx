import AppLayout from "@/components/SeparatedAppLayout";
import RoadmapComplianceAnalysis from "@/components/RoadmapComplianceAnalysis";
import QRCodeDemo from "@/components/QRCodeDemo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RoadmapAnalysis() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/30 min-h-screen">
        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roadmap">Roadmap Compliance</TabsTrigger>
            <TabsTrigger value="qr-demo">QR Code System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roadmap" className="space-y-6">
            <RoadmapComplianceAnalysis />
          </TabsContent>
          
          <TabsContent value="qr-demo" className="space-y-6">
            <QRCodeDemo />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}