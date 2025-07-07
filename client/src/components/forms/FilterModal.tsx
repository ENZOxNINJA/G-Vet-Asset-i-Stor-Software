import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventory } from "@/contexts/InventoryContext";
import { useAsset } from "@/contexts/AssetContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const assetTypes = [
  "Computing Equipment",
  "Office Equipment",
  "Furniture",
  "Vehicle",
  "Communication Equipment",
  "Other"
];

const assetCategories = [
  "Hardware",
  "Software",
  "Peripherals",
  "Networking",
  "Office Furniture",
  "Vehicles",
  "Electronics",
  "Other"
];

const inventoryCategories = [
  "Office Supplies", 
  "Electronics", 
  "Furniture", 
  "Kitchen Supplies", 
  "Cleaning Supplies", 
  "Tools", 
  "Other"
];

const assetConditions = [
  "New",
  "Good",
  "Fair",
  "Poor",
  "Damaged",
  "Being Repaired",
];

const assetStatuses = [
  "Active",
  "In Use",
  "In Storage",
  "In Maintenance",
  "Disposed",
  "Lost",
];

const departments = [
  "IT",
  "Finance",
  "HR",
  "Marketing",
  "Operations",
  "Sales",
  "Executive",
  "Legal",
  "Other"
];

const locations = [
  "Headquarters",
  "Branch Office",
  "Remote",
  "Warehouse",
  "Data Center",
  "Customer Site",
  "Other"
];

const FilterModal = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  
  // Get filter state from contexts
  const { 
    isFilterModalOpen: isInventoryFilterOpen, 
    setIsFilterModalOpen: setIsInventoryFilterOpen,
    filter: inventoryFilter,
    setFilter: setInventoryFilter
  } = useInventory();

  const { 
    isFilterModalOpen: isAssetFilterOpen, 
    setIsFilterModalOpen: setIsAssetFilterOpen,
    filter: assetFilter,
    setFilter: setAssetFilter
  } = useAsset();

  // Determine if the modal should be open
  const isOpen = isInventoryFilterOpen || isAssetFilterOpen;

  useEffect(() => {
    // Set the active tab based on which modal triggered the opening
    if (isInventoryFilterOpen) {
      setActiveTab("inventory");
    } else if (isAssetFilterOpen) {
      setActiveTab("asset");
    }
  }, [isInventoryFilterOpen, isAssetFilterOpen]);

  // Set up inventory filter form
  const inventoryForm = useForm({
    defaultValues: {
      category: inventoryFilter.category || "",
      minPrice: inventoryFilter.minPrice || "",
      maxPrice: inventoryFilter.maxPrice || "",
      stockStatus: inventoryFilter.stockStatus || "all",
      dateAdded: inventoryFilter.dateAdded || "",
    },
  });

  // Set up asset filter form
  const assetForm = useForm({
    defaultValues: {
      category: assetFilter.category || "",
      type: assetFilter.type || "",
      department: assetFilter.department || "",
      location: assetFilter.location || "",
      status: assetFilter.status || "",
      condition: assetFilter.condition || "",
      minPrice: assetFilter.minPrice || "",
      maxPrice: assetFilter.maxPrice || "",
      purchaseDateFrom: assetFilter.purchaseDateFrom || "",
      purchaseDateTo: assetFilter.purchaseDateTo || "",
    },
  });

  useEffect(() => {
    // Reset inventory form when filter changes
    inventoryForm.reset({
      category: inventoryFilter.category || "",
      minPrice: inventoryFilter.minPrice || "",
      maxPrice: inventoryFilter.maxPrice || "",
      stockStatus: inventoryFilter.stockStatus || "all",
      dateAdded: inventoryFilter.dateAdded || "",
    });
  }, [inventoryFilter, inventoryForm]);

  useEffect(() => {
    // Reset asset form when filter changes
    assetForm.reset({
      category: assetFilter.category || "",
      type: assetFilter.type || "",
      department: assetFilter.department || "",
      location: assetFilter.location || "",
      status: assetFilter.status || "",
      condition: assetFilter.condition || "",
      minPrice: assetFilter.minPrice || "",
      maxPrice: assetFilter.maxPrice || "",
      purchaseDateFrom: assetFilter.purchaseDateFrom || "",
      purchaseDateTo: assetFilter.purchaseDateTo || "",
    });
  }, [assetFilter, assetForm]);

  const handleClose = () => {
    if (activeTab === "inventory") {
      setIsInventoryFilterOpen(false);
    } else {
      setIsAssetFilterOpen(false);
    }
  };

  const handleResetInventory = () => {
    const resetFilter = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      stockStatus: "all",
      dateAdded: "",
    };
    
    setInventoryFilter(resetFilter);
    inventoryForm.reset(resetFilter);
  };

  const handleResetAsset = () => {
    const resetFilter = {
      search: "",
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
    };
    
    setAssetFilter(resetFilter);
    assetForm.reset(resetFilter);
  };

  const onInventorySubmit = (data: any) => {
    // Preserve the search query from the current filter
    setInventoryFilter({ ...data, search: inventoryFilter.search || "" });
    setIsInventoryFilterOpen(false);
  };

  const onAssetSubmit = (data: any) => {
    // Preserve the search query from the current filter
    setAssetFilter({ ...data, search: assetFilter.search || "" });
    setIsAssetFilterOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Filter Options</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Inventory Filter</TabsTrigger>
            <TabsTrigger value="asset">Asset Filter</TabsTrigger>
          </TabsList>
          
          {/* Inventory Filter */}
          <TabsContent value="inventory" className="space-y-4 py-4">
            <Form {...inventoryForm}>
              <form onSubmit={inventoryForm.handleSubmit(onInventorySubmit)} className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {/* Category */}
                  <FormField
                    control={inventoryForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Categories</SelectItem>
                            {inventoryCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Stock Status */}
                  <FormField
                    control={inventoryForm.control}
                    name="stockStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Stock Statuses" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Items</SelectItem>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock</SelectItem>
                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Price Range */}
                  <FormField
                    control={inventoryForm.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min Price"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={inventoryForm.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max Price"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Date Added */}
                  <FormField
                    control={inventoryForm.control}
                    name="dateAdded"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Date Added</FormLabel>
                        <div className="flex items-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal w-full",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : '')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {field.value && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => inventoryForm.setValue("dateAdded", "")}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="gap-2 sm:gap-0 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetInventory}
                  >
                    Reset Filters
                  </Button>
                  <div className="flex space-x-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Apply Filters</Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          {/* Asset Filter */}
          <TabsContent value="asset" className="space-y-4 py-4">
            <Form {...assetForm}>
              <form onSubmit={assetForm.handleSubmit(onAssetSubmit)} className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {/* Type */}
                  <FormField
                    control={assetForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Types</SelectItem>
                            {assetTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Category */}
                  <FormField
                    control={assetForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Categories</SelectItem>
                            {assetCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Department */}
                  <FormField
                    control={assetForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Departments</SelectItem>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Location */}
                  <FormField
                    control={assetForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Locations</SelectItem>
                            {locations.map(location => (
                              <SelectItem key={location} value={location}>{location}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Status */}
                  <FormField
                    control={assetForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            {assetStatuses.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Condition */}
                  <FormField
                    control={assetForm.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Conditions" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Conditions</SelectItem>
                            {assetConditions.map(condition => (
                              <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Price Range */}
                  <FormField
                    control={assetForm.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min Price"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={assetForm.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max Price"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Purchase Date Range */}
                  <FormField
                    control={assetForm.control}
                    name="purchaseDateFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Date From</FormLabel>
                        <div className="flex items-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal w-full",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(new Date(field.value), "PPP") : <span>From date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : '')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {field.value && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => assetForm.setValue("purchaseDateFrom", "")}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={assetForm.control}
                    name="purchaseDateTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Date To</FormLabel>
                        <div className="flex items-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal w-full",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(new Date(field.value), "PPP") : <span>To date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : '')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {field.value && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => assetForm.setValue("purchaseDateTo", "")}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="gap-2 sm:gap-0 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetAsset}
                  >
                    Reset Filters
                  </Button>
                  <div className="flex space-x-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Apply Filters</Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;