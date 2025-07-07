import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAsset } from "@/contexts/AssetContext";
import { z } from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { type Asset, type AssetMovement } from "@shared/schema";

// Create a form schema based on the movement insert schema but with string validation
const movementFormSchema = z.object({
  assetId: z.string().min(1, { message: "Asset is required" }),
  fromLocation: z.string().min(1, { message: "From location is required" }),
  toLocation: z.string().min(1, { message: "To location is required" }),
  requestedBy: z.string().min(1, { message: "Requester is required" }),
  approvedBy: z.string().optional(),
  requestDate: z.date({ message: "Request date is required" }),
  expectedReturnDate: z.date().nullable().optional(),
  type: z.string().min(1, { message: "Movement type is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  notes: z.string().optional(),
});

const movementTypes = ["Transfer", "Loan", "Maintenance"];
const movementStatuses = ["Pending", "Approved", "Rejected", "Returned"];

// Mock users for the demo (in production, we'd fetch these from the database)
const users = [
  { id: 1, name: "Admin User" },
  { id: 2, name: "Department Manager" },
  { id: 3, name: "Asset Manager" },
];

const MovementFormModal = () => {
  const { toast } = useToast();
  const { 
    isMovementModalOpen, 
    setIsMovementModalOpen, 
    currentMovement, 
    setCurrentMovement 
  } = useAsset();

  // Set up form with react-hook-form
  const form = useForm({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      assetId: currentMovement ? String(currentMovement.assetId) : "",
      fromLocation: currentMovement?.fromLocation || "",
      toLocation: currentMovement?.toLocation || "",
      requestedBy: currentMovement ? String(currentMovement.requestedBy) : "1", // Default to admin user
      approvedBy: currentMovement?.approvedBy ? String(currentMovement.approvedBy) : "",
      requestDate: currentMovement?.requestDate ? new Date(currentMovement.requestDate) : new Date(),
      expectedReturnDate: currentMovement?.expectedReturnDate ? new Date(currentMovement.expectedReturnDate) : null,
      type: currentMovement?.type || "Transfer",
      status: currentMovement?.status || "Pending",
      notes: currentMovement?.notes || "",
    },
  });

  // Fetch all assets for the dropdown
  const { data: assets } = useQuery({
    queryKey: ['/api/assets'],
    queryFn: async () => {
      const response = await fetch('/api/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      return await response.json();
    },
  });

  // Get the selected asset details
  const selectedAsset = useMemo(() => {
    if (!assets) return null;
    
    const assetId = currentMovement?.assetId || parseInt(form.getValues().assetId || "0");
    if (!assetId) return null;
    
    return assets.find((asset: Asset) => asset.id === assetId);
  }, [assets, currentMovement, form]);

  // Update form values when currentMovement changes
  useEffect(() => {
    if (isMovementModalOpen) {
      form.reset({
        assetId: currentMovement ? String(currentMovement.assetId) : "",
        fromLocation: currentMovement?.fromLocation || (selectedAsset?.location || ""),
        toLocation: currentMovement?.toLocation || "",
        requestedBy: currentMovement ? String(currentMovement.requestedBy) : "1",
        approvedBy: currentMovement?.approvedBy ? String(currentMovement.approvedBy) : "",
        requestDate: currentMovement?.requestDate ? new Date(currentMovement.requestDate) : new Date(),
        expectedReturnDate: currentMovement?.expectedReturnDate ? new Date(currentMovement.expectedReturnDate) : null,
        type: currentMovement?.type || "Transfer",
        status: currentMovement?.status || "Pending",
        notes: currentMovement?.notes || "",
      });
    }
  }, [currentMovement, isMovementModalOpen, selectedAsset, form]);

  // When asset changes, update fromLocation
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'assetId' && assets) {
        const selectedAssetId = parseInt(value.assetId as string || "0");
        const asset = assets.find((a: Asset) => a.id === selectedAssetId);
        if (asset) {
          form.setValue('fromLocation', asset.location || '');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, assets]);

  // API mutations
  const createMovement = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/movements", {
        method: "POST",
        body: JSON.stringify(data),
      } as RequestInit);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Movement record created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/movements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      setIsMovementModalOpen(false);
      setCurrentMovement(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create movement: ${error}`,
      });
    },
  });

  const updateMovement = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest(`/api/movements/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      } as RequestInit);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Movement record updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/movements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      setIsMovementModalOpen(false);
      setCurrentMovement(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update movement: ${error}`,
      });
    },
  });

  const onSubmit = (formData: z.infer<typeof movementFormSchema>) => {
    // Convert form data to API format
    const movementData = {
      assetId: parseInt(formData.assetId),
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      requestedBy: parseInt(formData.requestedBy),
      approvedBy: formData.approvedBy ? parseInt(formData.approvedBy) : null,
      requestDate: formData.requestDate,
      expectedReturnDate: formData.expectedReturnDate,
      type: formData.type,
      status: formData.status,
      notes: formData.notes,
    };

    if (currentMovement) {
      // Update existing movement
      updateMovement.mutate({ id: currentMovement.id, data: movementData });
    } else {
      // Create new movement
      createMovement.mutate(movementData);
    }
  };

  const handleClose = () => {
    setIsMovementModalOpen(false);
    setCurrentMovement(null);
    form.reset();
  };

  const isLoan = form.watch('type') === 'Loan';
  const isLoading = createMovement.isPending || updateMovement.isPending;

  return (
    <Dialog open={isMovementModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {currentMovement ? "Edit Movement Record" : "Register New Asset Movement"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {/* Asset Selection */}
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <Select
                    disabled={!!currentMovement}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets?.map((asset: Asset) => (
                        <SelectItem key={asset.id} value={asset.id.toString()}>
                          {asset.assetTag} - {asset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From Location */}
              <FormField
                control={form.control}
                name="fromLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Location</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={!!currentMovement}
                        placeholder="Current location" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* To Location */}
              <FormField
                control={form.control}
                name="toLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Destination location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Movement Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movement Type</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                      disabled={!!currentMovement}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {movementTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {movementStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Requested By */}
              <FormField
                control={form.control}
                name="requestedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requested By</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select requester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Approved By */}
              <FormField
                control={form.control}
                name="approvedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approved By</FormLabel>
                    <Select 
                      value={field.value || ""} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Not approved yet</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Request Date */}
              <FormField
                control={form.control}
                name="requestDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Request Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expected Return Date - Only show for loans */}
              {isLoan && (
                <FormField
                  control={form.control}
                  name="expectedReturnDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expected Return Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional details about this movement"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentMovement ? "Update" : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MovementFormModal;