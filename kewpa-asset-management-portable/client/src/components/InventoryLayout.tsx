import { ReactNode } from "react";
import Header from "./Header";
import MainNavigation from "./MainNavigation";

type InventoryLayoutProps = {
  children: ReactNode;
};

const InventoryLayout = ({ children }: InventoryLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <MainNavigation />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default InventoryLayout;
