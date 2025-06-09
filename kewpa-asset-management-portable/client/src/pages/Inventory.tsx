import InventoryLayout from "@/components/InventoryLayout";
import ActionBar from "@/components/ActionBar";
import InventoryTable from "@/components/InventoryTable";
import ItemFormModal from "@/components/ItemFormModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import FilterModal from "@/components/FilterModal";

const Inventory = () => {
  return (
    <InventoryLayout>
      <ActionBar />
      <InventoryTable />
      <ItemFormModal />
      <DeleteConfirmationModal />
      <FilterModal />
    </InventoryLayout>
  );
};

export default Inventory;
