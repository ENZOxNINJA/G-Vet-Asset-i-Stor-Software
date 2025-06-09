import { createContext, useContext, useState, ReactNode } from "react";
import { type InventoryItem, type InventoryFilter } from "@shared/schema";

interface InventoryContextType {
  // Item form state
  isItemFormOpen: boolean;
  setIsItemFormOpen: (isOpen: boolean) => void;
  currentItem: InventoryItem | null;
  setCurrentItem: (item: InventoryItem | null) => void;
  
  // Delete modal state
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  itemToDelete: InventoryItem | null;
  setItemToDelete: (item: InventoryItem | null) => void;
  
  // Filter modal state
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (isOpen: boolean) => void;
  filter: InventoryFilter;
  setFilter: (filter: InventoryFilter) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  // Item form state
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  
  // Filter modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<InventoryFilter>({
    category: "",
    minPrice: "",
    maxPrice: "",
    stockStatus: "all",
    dateAdded: "",
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const value = {
    isItemFormOpen,
    setIsItemFormOpen,
    currentItem,
    setCurrentItem,
    
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    setItemToDelete,
    
    isFilterModalOpen,
    setIsFilterModalOpen,
    filter,
    setFilter,
    
    searchQuery,
    setSearchQuery,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
