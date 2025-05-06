import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

const AssetMovement = () => {
  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Asset Movement</h2>
          <p className="text-muted-foreground">
            Track and manage asset transfers and loans
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <ArrowRightLeft className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Movement Module</CardTitle>
                <CardDescription>Manage asset transfers, loans and returns</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center p-12 border border-dashed rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium">Coming Soon</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This feature is under development and will be available soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AssetMovement;