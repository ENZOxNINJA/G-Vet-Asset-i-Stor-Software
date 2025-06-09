import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

const AssetVerification = () => {
  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Asset Verification</h2>
          <p className="text-muted-foreground">
            Verify and approve registered assets
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <CheckSquare className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Verification Module</CardTitle>
                <CardDescription>Review and verify pending assets</CardDescription>
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

export default AssetVerification;