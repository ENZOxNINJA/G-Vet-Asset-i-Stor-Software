import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InventoryProvider } from "./contexts/InventoryContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
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

function AuthenticatedRouter() {
  const { isAuthenticated, user, hasPermission, login } = useAuth();

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  // Route access control based on user role and permissions
  const canAccessAdmin = user?.role === 'admin';
  const canAccessManager = ['admin', 'manager'].includes(user?.role || '');
  const canWrite = hasPermission('write');
  const canRead = hasPermission('read');

  return (
    <Switch>
      {/* Default dashboard based on user role */}
      <Route path="/" component={user?.role === 'visitor' ? VisitorDashboard : Dashboard} />
      
      {/* Basic access for all authenticated users */}
      {canRead && (
        <>
          <Route path="/inventory" component={Inventory} />
          <Route path="/assets" component={Assets} />
          <Route path="/suppliers" component={Suppliers} />
          <Route path="/visitor-dashboard" component={VisitorDashboard} />
        </>
      )}
      
      {/* Write access required */}
      {canWrite && (
        <>
          <Route path="/asset-registration" component={AssetRegistration} />
          <Route path="/asset-registration-kewpa" component={AssetRegistrationKEWPA} />
          <Route path="/asset-movement" component={AssetMovement} />
          <Route path="/store-management-kewps" component={StoreManagementKEWPS} />
        </>
      )}
      
      {/* Manager and Admin access */}
      {canAccessManager && (
        <>
          <Route path="/kewpa" component={KEWPADashboard} />
          <Route path="/kewps" component={KEWPSDashboard} />
          <Route path="/asset-inspection" component={AssetInspection} />
          <Route path="/asset-maintenance" component={AssetMaintenance} />
          <Route path="/asset-verification" component={AssetVerification} />
          <Route path="/asset-search" component={AssetSearch} />
          <Route path="/info-t-integration" component={InfoTAsetIntegration} />
        </>
      )}
      
      {/* Admin only access */}
      {canAccessAdmin && (
        <Route path="/admin-control" component={AdminControl} />
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="plt-asset-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AssetProvider>
              <InventoryProvider>
                <Toaster />
                <AuthenticatedRouter />
                {/* Global Modals */}
                <FilterModal />
                <DeleteConfirmationModal />
                <ItemFormModal />
              </InventoryProvider>
            </AssetProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
