import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useInventory } from "@/contexts/InventoryContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { type InventoryFilter } from "@shared/schema";

const FilterModal = () => {
  const { toast } = useToast();
  const {
    isFilterModalOpen,
    setIsFilterModalOpen,
    filter,
    setFilter
  } = useInventory();

  const [localFilter, setLocalFilter] = useState<InventoryFilter>(filter);

  // Update local filter when parent filter changes
  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter(localFilter);
    setIsFilterModalOpen(false);
    toast({
      title: "Filters Applied",
      description: "The inventory list has been filtered",
    });
  };

  const handleResetFilters = () => {
    const resetFilter: InventoryFilter = {
      category: "",
      minPrice: "",
      maxPrice: "",
      stockStatus: "all",
      dateAdded: "",
    };
    setLocalFilter(resetFilter);
  };

  return (
    <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Filter Items</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleApplyFilters} className="space-y-4">
          {/* Category Filter */}
          <div>
            <Label className="font-medium">Category</Label>
            <Select
              value={localFilter.category || ""}
              onValueChange={(value) => setLocalFilter({ ...localFilter, category: value })}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <Label className="font-medium">Price Range</Label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <div>
                <Input
                  type="text"
                  placeholder="Min $"
                  value={localFilter.minPrice || ""}
                  onChange={(e) => setLocalFilter({ ...localFilter, minPrice: e.target.value })}
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Max $"
                  value={localFilter.maxPrice || ""}
                  onChange={(e) => setLocalFilter({ ...localFilter, maxPrice: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div>
            <Label className="font-medium">Stock Status</Label>
            <RadioGroup
              className="mt-2 space-y-2"
              value={localFilter.stockStatus || "all"}
              onValueChange={(value: "all" | "in-stock" | "low-stock" | "out-of-stock") => 
                setLocalFilter({ ...localFilter, stockStatus: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-stock" />
                <Label htmlFor="all-stock" className="font-normal">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-stock" id="in-stock" />
                <Label htmlFor="in-stock" className="font-normal">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low-stock" id="low-stock" />
                <Label htmlFor="low-stock" className="font-normal">Low Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="out-of-stock" id="out-of-stock" />
                <Label htmlFor="out-of-stock" className="font-normal">Out of Stock</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Added */}
          <div>
            <Label className="font-medium">Date Added</Label>
            <Select
              value={localFilter.dateAdded || ""}
              onValueChange={(value) => setLocalFilter({ ...localFilter, dateAdded: value })}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Any Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button type="submit">
              Apply Filters
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
