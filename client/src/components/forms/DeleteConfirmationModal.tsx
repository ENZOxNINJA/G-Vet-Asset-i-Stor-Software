import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAsset } from "@/contexts/AssetContext";
import { useInventory } from "@/contexts/InventoryContext";

const DeleteConfirmationModal = () => {
  const { toast } = useToast();
  const [deleteType, setDeleteType] = useState<"asset" | "inventory">("asset");
  
  // Asset context
  const {
    isDeleteModalOpen: isAssetDeleteModalOpen,
    setIsDeleteModalOpen: setIsAssetDeleteModalOpen,
    assetToDelete,
    setAssetToDelete,
  } = useAsset();
  
  // Inventory context
  const {
    isDeleteModalOpen: isInventoryDeleteModalOpen,
    setIsDeleteModalOpen: setIsInventoryDeleteModalOpen,
    itemToDelete,
    setItemToDelete,
  } = useInventory();

  // Determine which modal to show
  const isOpen = isAssetDeleteModalOpen || isInventoryDeleteModalOpen;
  
  // Set the type of deletion based on context
  useEffect(() => {
    if (assetToDelete) {
      setDeleteType("asset");
    } else if (itemToDelete) {
      setDeleteType("inventory");
    }
  }, [assetToDelete, itemToDelete]);

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/assets/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete asset",
      });
    },
  });

  // Delete inventory item mutation
  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/inventory/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete inventory item');
      }
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete inventory item",
      });
    },
  });

  const handleDelete = () => {
    if (deleteType === "asset" && assetToDelete) {
      deleteAssetMutation.mutate(assetToDelete.id);
    } else if (deleteType === "inventory" && itemToDelete) {
      deleteInventoryMutation.mutate(itemToDelete.id);
    }
  };

  const handleClose = () => {
    if (deleteType === "asset") {
      setIsAssetDeleteModalOpen(false);
      setAssetToDelete(null);
    } else {
      setIsInventoryDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Get the name of the item being deleted
  const getItemName = () => {
    if (deleteType === "asset" && assetToDelete) {
      return assetToDelete.name;
    } else if (deleteType === "inventory" && itemToDelete) {
      return itemToDelete.name;
    }
    return "";
  };

  // Get the item type for the confirmation message
  const getItemType = () => {
    return deleteType === "asset" ? "asset" : "inventory item";
  };

  const isPending = deleteAssetMutation.isPending || deleteInventoryMutation.isPending;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the {getItemType()} <strong>{getItemName()}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;