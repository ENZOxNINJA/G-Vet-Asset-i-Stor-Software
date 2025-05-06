import { Plus, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useInventory } from "@/contexts/InventoryContext";

const ActionBar = () => {
  const { 
    setIsItemFormOpen, 
    setIsFilterModalOpen, 
    searchQuery, 
    setSearchQuery,
    setCurrentItem,
  } = useInventory();

  const handleNewItem = () => {
    setCurrentItem(null);
    setIsItemFormOpen(true);
  };

  const handleFilterOpen = () => {
    setIsFilterModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div className="relative w-full md:w-64">
        <Input
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleFilterOpen}
        >
          <Filter className="h-5 w-5" />
          Filter
        </Button>
        <Button
          className="flex items-center gap-1"
          onClick={handleNewItem}
        >
          <Plus className="h-5 w-5" />
          New Item
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
