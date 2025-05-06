import { pgTable, text, serial, decimal, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  department: text("department"),
  role: text("role").default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  department: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Assets Schema (Based on G-ASSET system)
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  assetTag: text("asset_tag").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  type: text("type").notNull(), // e.g., Harta Modal, Aset Bernilai Rendah
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: date("purchase_date").notNull(),
  supplier: text("supplier"),
  location: text("location"),
  department: text("department"),
  status: text("status").notNull().default("active"), // active, maintenance, disposed
  condition: text("condition").default("good"), // good, fair, poor
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAssetSchema = createInsertSchema(assets)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const updateAssetSchema = createInsertSchema(assets)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type UpdateAsset = z.infer<typeof updateAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// Asset Movement (for tracking loans, transfers, etc.)
export const assetMovements = pgTable("asset_movements", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  requestedBy: integer("requested_by").notNull(), // user id
  approvedBy: integer("approved_by"), // user id
  requestDate: timestamp("request_date").defaultNow(),
  approvalDate: timestamp("approval_date"),
  returnDate: timestamp("return_date"), // for loans
  expectedReturnDate: date("expected_return_date"), // for loans
  type: text("type").notNull(), // loan, transfer, maintenance
  status: text("status").notNull().default("pending"), // pending, approved, rejected, returned
  notes: text("notes"),
});

export const insertMovementSchema = createInsertSchema(assetMovements)
  .omit({ id: true, approvalDate: true, returnDate: true });

export const updateMovementSchema = createInsertSchema(assetMovements)
  .omit({ id: true, requestDate: true })
  .partial();

export type InsertMovement = z.infer<typeof insertMovementSchema>;
export type UpdateMovement = z.infer<typeof updateMovementSchema>;
export type AssetMovement = typeof assetMovements.$inferSelect;

// Suppliers
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const updateSupplierSchema = createInsertSchema(suppliers)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type UpdateSupplier = z.infer<typeof updateSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Legacy Inventory Items Schema - keeping for backward compatibility
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").default(10),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const updateInventoryItemSchema = createInsertSchema(inventoryItems)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type UpdateInventoryItem = z.infer<typeof updateInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Validation schema for frontend form with additional validation rules
export const inventoryItemFormSchema = insertInventoryItemSchema.extend({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a valid number",
  }),
  quantity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Quantity must be a valid number",
  }),
  reorderLevel: z.string().refine((val) => val === "" || (!isNaN(parseInt(val)) && parseInt(val) >= 0), {
    message: "Reorder level must be a valid number",
  }).optional(),
});

// Asset validation schema for frontend form
export const assetFormSchema = insertAssetSchema.extend({
  name: z.string().min(1, "Name is required"),
  assetTag: z.string().min(1, "Asset tag is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Asset type is required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a valid number",
  }),
  purchaseDate: z.string().min(1, "Purchase date is required"),
});

// The inventory filter type for search and filtering
export type InventoryFilter = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  stockStatus?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  dateAdded?: string;
};

// The asset filter type for search and filtering
export type AssetFilter = {
  search?: string;
  category?: string;
  type?: string;
  department?: string;
  location?: string;
  status?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
};
