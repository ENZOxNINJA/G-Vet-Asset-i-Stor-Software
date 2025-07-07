import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAsset } from "@/contexts/AssetContext";
import { assetFormSchema } from "@shared/schema";
import { type Asset } from "@shared/schema";
import { Upload, CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

// KEW.PA Asset Categories based on Malaysian Government standards
const assetCategories = [
  "Peralatan dan Kelengkapan ICT", // ICT Equipment and Accessories
  "Perabot", // Furniture
  "Kenderaan", // Vehicles
  "Mesin dan Jentera", // Machinery and Equipment
  "Peralatan Elektrik", // Electrical Equipment
  "Peralatan Komunikasi", // Communication Equipment
  "Peralatan Saintifik", // Scientific Equipment
  "Lain-lain", // Others
];

const acquisitionMethods = [
  "Pembelian", // Purchase
  "Hibah", // Grant/Gift
  "Sewa Beli", // Hire Purchase
  "Pemindahan", // Transfer
  "Pinjaman", // Loan
  "Lain-lain", // Others
];

const assetOrigins = [
  "Tempatan", // Local
  "Luar Negara", // Foreign
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

const AssetFormModal = () => {
  const { toast } = useToast();
  const { 
    isAssetFormOpen, 
    setIsAssetFormOpen, 
    currentAsset, 
    setCurrentAsset 
  } = useAsset();

  // Set up form with react-hook-form for KEW.PA compliance
  const form = useForm({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      registrationNumber: currentAsset?.registrationNumber || "",
      nationalCode: currentAsset?.nationalCode || "",
      name: currentAsset?.name || "",
      assetTag: currentAsset?.assetTag || "",
      category: currentAsset?.category || "",
      subCategory: currentAsset?.subCategory || "",
      type: currentAsset?.type || "",
      brand: currentAsset?.brand || "",
      model: currentAsset?.model || "",
      origin: currentAsset?.origin || "",
      engineType: currentAsset?.engineType || "",
      chassisNumber: currentAsset?.chassisNumber || "",
      vehicleRegistration: currentAsset?.vehicleRegistration || "",
      warrantyPeriod: currentAsset?.warrantyPeriod || "",
      originalPrice: currentAsset?.originalPrice ? parseFloat(currentAsset.originalPrice.toString()).toFixed(2) : "",
      currentValue: currentAsset?.currentValue ? parseFloat(currentAsset.currentValue.toString()).toFixed(2) : "",
      acquisitionMethod: currentAsset?.acquisitionMethod || "",
      acquisitionDate: currentAsset?.acquisitionDate || format(new Date(), "yyyy-MM-dd"),
      receivedDate: currentAsset?.receivedDate || format(new Date(), "yyyy-MM-dd"),
      purchaseOrderNumber: currentAsset?.purchaseOrderNumber || "",
      deliveryOrderNumber: currentAsset?.deliveryOrderNumber || "",
      supplierName: currentAsset?.supplierName || "",
      supplierAddress: currentAsset?.supplierAddress || "",
      location: currentAsset?.location || "",
      department: currentAsset?.department || "",
      division: currentAsset?.division || "",
      status: currentAsset?.status || "active",
      condition: currentAsset?.condition || "good",
      assetType: currentAsset?.assetType || "capital",
      specifications: currentAsset?.specifications || "",
      notes: currentAsset?.notes || "",
      description: currentAsset?.description || "",
    },
  });

  // Update form values when currentAsset changes
  useEffect(() => {
    if (currentAsset) {
      form.reset({
        registrationNumber: currentAsset.registrationNumber || "",
        nationalCode: currentAsset.nationalCode || "",
        name: currentAsset.name,
        assetTag: currentAsset.assetTag,
        category: currentAsset.category,
        subCategory: currentAsset.subCategory || "",
        type: currentAsset.type,
        brand: currentAsset.brand || "",
        model: currentAsset.model || "",
        origin: currentAsset.origin || "",
        engineType: currentAsset.engineType || "",
        chassisNumber: currentAsset.chassisNumber || "",
        vehicleRegistration: currentAsset.vehicleRegistration || "",
        warrantyPeriod: currentAsset.warrantyPeriod || "",
        originalPrice: currentAsset.originalPrice ? parseFloat(currentAsset.originalPrice.toString()).toFixed(2) : "",
        currentValue: currentAsset.currentValue ? parseFloat(currentAsset.currentValue.toString()).toFixed(2) : "",
        acquisitionMethod: currentAsset.acquisitionMethod || "",
        acquisitionDate: currentAsset.acquisitionDate || format(new Date(), "yyyy-MM-dd"),
        receivedDate: currentAsset.receivedDate || format(new Date(), "yyyy-MM-dd"),
        purchaseOrderNumber: currentAsset.purchaseOrderNumber || "",
        deliveryOrderNumber: currentAsset.deliveryOrderNumber || "",
        supplierName: currentAsset.supplierName || "",
        supplierAddress: currentAsset.supplierAddress || "",
        location: currentAsset.location || "",
        department: currentAsset.department || "",
        division: currentAsset.division || "",
        status: currentAsset.status,
        condition: currentAsset.condition || "good",
        assetType: currentAsset.assetType || "capital",
        specifications: currentAsset.specifications || "",
        notes: currentAsset.notes || "",
        description: currentAsset.description || "",
      });
    } else {
      form.reset({
        registrationNumber: "",
        nationalCode: "",
        name: "",
        assetTag: "",
        category: "",
        subCategory: "",
        type: "",
        brand: "",
        model: "",
        origin: "",
        engineType: "",
        chassisNumber: "",
        vehicleRegistration: "",
        warrantyPeriod: "",
        originalPrice: "",
        currentValue: "",
        acquisitionMethod: "",
        acquisitionDate: format(new Date(), "yyyy-MM-dd"),
        receivedDate: format(new Date(), "yyyy-MM-dd"),
        purchaseOrderNumber: "",
        deliveryOrderNumber: "",
        supplierName: "",
        supplierAddress: "",
        location: "",
        department: "",
        division: "",
        status: "active",
        condition: "good",
        assetType: "capital",
        specifications: "",
        notes: "",
        description: "",
      });
    }
  }, [currentAsset, form]);

  // Create new asset mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Transform form data to match API expectations
      const assetData = {
        ...data,
        originalPrice: parseFloat(data.originalPrice),
        currentValue: data.currentValue ? parseFloat(data.currentValue) : null,
      };
      const response = await apiRequest('POST', '/api/assets', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Asset added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      setIsAssetFormOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add asset",
      });
    },
  });

  // Update asset mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; formData: any }) => {
      const response = await apiRequest('PATCH', `/api/assets/${data.id}`, data.formData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Asset updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      setIsAssetFormOpen(false);
      setCurrentAsset(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update asset",
      });
    },
  });

  // Submit handler
  const onSubmit = (data: any) => {
    if (currentAsset) {
      // Update existing asset
      updateMutation.mutate({ id: currentAsset.id, formData: data });
    } else {
      // Create new asset
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    setIsAssetFormOpen(false);
    setCurrentAsset(null);
    form.reset();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isAssetFormOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {currentAsset ? "Edit Asset" : "Register New Asset"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information Section */}
              <div className="col-span-2">
                <h3 className="text-base font-medium mb-3 pb-1 border-b">Basic Information</h3>
              </div>
              
              {/* Asset Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter asset name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Asset Tag */}
              <FormField
                control={form.control}
                name="assetTag"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Asset Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Asset Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Asset Type</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          {assetTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          {assetCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
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

              {/* Purchase Date */}
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
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
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department and Location Section */}
              <div className="col-span-2">
                <h3 className="text-base font-medium mb-3 pb-1 border-b">Location Information</h3>
              </div>

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. IT Department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Main Office, Floor 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Supplier */}
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dell" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status and Condition Section */}
              <div className="col-span-2">
                <h3 className="text-base font-medium mb-3 pb-1 border-b">Status Information</h3>
              </div>

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {assetStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Condition */}
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Condition</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {assetConditions.map(condition => (
                            <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        placeholder="Enter asset description" 
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Asset Image */}
              <div className="col-span-2">
                <Label>Asset Image</Label>
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
                {isPending ? "Saving..." : "Save Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetFormModal;