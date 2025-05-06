import { createContext, useContext, useState, ReactNode } from "react";
import { type Asset, type AssetFilter, type AssetMovement } from "@shared/schema";

interface AssetContextType {
  // Asset form state
  isAssetFormOpen: boolean;
  setIsAssetFormOpen: (isOpen: boolean) => void;
  currentAsset: Asset | null;
  setCurrentAsset: (asset: Asset | null) => void;
  
  // Delete modal state
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  assetToDelete: Asset | null;
  setAssetToDelete: (asset: Asset | null) => void;
  
  // Filter modal state
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (isOpen: boolean) => void;
  filter: AssetFilter;
  setFilter: (filter: AssetFilter) => void;
  
  // Movement modal state
  isMovementModalOpen: boolean;
  setIsMovementModalOpen: (isOpen: boolean) => void;
  currentMovement: AssetMovement | null;
  setCurrentMovement: (movement: AssetMovement | null) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider = ({ children }: { children: ReactNode }) => {
  // Asset form state
  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  
  // Filter modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<AssetFilter>({
    category: "",
    type: "",
    department: "",
    location: "",
    status: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    purchaseDateFrom: "",
    purchaseDateTo: "",
  });
  
  // Movement modal state
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [currentMovement, setCurrentMovement] = useState<AssetMovement | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const value = {
    isAssetFormOpen,
    setIsAssetFormOpen,
    currentAsset,
    setCurrentAsset,
    
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    assetToDelete,
    setAssetToDelete,
    
    isFilterModalOpen,
    setIsFilterModalOpen,
    filter,
    setFilter,
    
    isMovementModalOpen,
    setIsMovementModalOpen,
    currentMovement,
    setCurrentMovement,
    
    searchQuery,
    setSearchQuery,
  };

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAsset = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error("useAsset must be used within an AssetProvider");
  }
  return context;
};