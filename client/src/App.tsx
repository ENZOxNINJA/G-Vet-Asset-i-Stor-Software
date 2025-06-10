import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InventoryProvider } from "./contexts/InventoryContext";
import NotFound from "@/pages/not-found";
import Inventory from "@/pages/Inventory";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AssetProvider } from "./contexts/AssetContext";
import Dashboard from "@/pages/Dashboard";
import Assets from "@/pages/Assets";
import AssetRegistration from "@/pages/AssetRegistration";
import KEWPADashboard from "@/pages/KEWPADashboard";
import KEWPSDashboard from "@/pages/KEWPSDashboard";
import AssetRegistrationKEWPA from "@/pages/AssetRegistrationKEWPA";
import AssetInspection from "@/pages/AssetInspection";
import AssetMaintenance from "@/pages/AssetMaintenance";
import AssetVerification from "@/pages/AssetVerification";
import AssetMovement from "@/pages/AssetMovement";
import AssetSearch from "@/pages/AssetSearch";
import StoreManagementKEWPS from "@/pages/StoreManagementKEWPS";
import Suppliers from "@/pages/Suppliers";
import InfoTAsetIntegration from "@/pages/InfoTAsetIntegration";
import AdminControl from "@/pages/AdminControl";
import VisitorDashboard from "@/pages/VisitorDashboard";
import FilterModal from "@/components/FilterModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import ItemFormModal from "@/components/ItemFormModal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/assets" component={Assets} />
      <Route path="/suppliers" component={Suppliers} />
      
      {/* KEW.PA Framework Routes */}
      <Route path="/kewpa" component={KEWPADashboard} />
      <Route path="/asset-registration-kewpa" component={AssetRegistrationKEWPA} />
      <Route path="/asset-inspection" component={AssetInspection} />
      <Route path="/asset-maintenance" component={AssetMaintenance} />
      <Route path="/asset-verification" component={AssetVerification} />
      <Route path="/asset-movement" component={AssetMovement} />
      <Route path="/asset-search" component={AssetSearch} />
      
      {/* KEW.PS Framework Routes */}
      <Route path="/kewps" component={KEWPSDashboard} />
      <Route path="/store-management-kewps" component={StoreManagementKEWPS} />
      
      {/* Info-T Aset & iStor Integration */}
      <Route path="/info-t-integration" component={InfoTAsetIntegration} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="plt-asset-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AssetProvider>
            <InventoryProvider>
              <Toaster />
              <Router />
              {/* Global Modals */}
              <FilterModal />
              <DeleteConfirmationModal />
              <ItemFormModal />
            </InventoryProvider>
          </AssetProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
