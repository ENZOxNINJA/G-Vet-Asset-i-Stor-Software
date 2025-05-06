import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useInventory } from "@/contexts/InventoryContext";
import { inventoryItemFormSchema } from "@shared/schema";
import { type InventoryItem } from "@shared/schema";
import { Upload } from "lucide-react";
import { useEffect } from "react";

const ItemFormModal = () => {
  const { toast } = useToast();
  const { 
    isItemFormOpen, 
    setIsItemFormOpen, 
    currentItem, 
    setCurrentItem 
  } = useInventory();

  // Set up form with react-hook-form
  const form = useForm({
    resolver: zodResolver(inventoryItemFormSchema),
    defaultValues: {
      name: currentItem?.name || "",
      sku: currentItem?.sku || "",
      category: currentItem?.category || "",
      price: currentItem?.price ? parseFloat(currentItem.price.toString()).toFixed(2) : "",
      quantity: currentItem?.quantity?.toString() || "0",
      reorderLevel: currentItem?.reorderLevel?.toString() || "10",
      description: currentItem?.description || "",
      status: currentItem?.status || "active",
    },
  });

  // Update form values when currentItem changes
  useEffect(() => {
    if (currentItem) {
      form.reset({
        name: currentItem.name,
        sku: currentItem.sku,
        category: currentItem.category,
        price: parseFloat(currentItem.price.toString()).toFixed(2),
        quantity: currentItem.quantity.toString(),
        reorderLevel: currentItem.reorderLevel?.toString() || "10",
        description: currentItem.description || "",
        status: currentItem.status,
      });
    } else {
      form.reset({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "0",
        reorderLevel: "10",
        description: "",
        status: "active",
      });
    }
  }, [currentItem, form]);

  // Create new item mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/inventory', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      setIsItemFormOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add item",
      });
    },
  });

  // Update item mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; formData: any }) => {
      const response = await apiRequest('PATCH', `/api/inventory/${data.id}`, data.formData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      setIsItemFormOpen(false);
      setCurrentItem(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update item",
      });
    },
  });

  // Submit handler
  const onSubmit = (data: any) => {
    if (currentItem) {
      // Update existing item
      updateMutation.mutate({ id: currentItem.id, formData: data });
    } else {
      // Create new item
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    setIsItemFormOpen(false);
    setCurrentItem(null);
    form.reset();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isItemFormOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {currentItem ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SKU */}
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. KB-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                          <SelectItem value="Furniture">Furniture</SelectItem>
                          <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reorder Level */}
              <FormField
                control={form.control}
                name="reorderLevel"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Reorder Level</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter item description" 
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Item Image */}
              <div className="col-span-2">
                <Label>Item Image</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex flex-col space-y-2 mt-2"
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="active" />
                          <Label htmlFor="active" className="font-normal">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="inactive" id="inactive" />
                          <Label htmlFor="inactive" className="font-normal">Inactive</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormModal;
