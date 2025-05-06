import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertInventoryItemSchema, 
  updateInventoryItemSchema,
  type InsertInventoryItem,
  type UpdateInventoryItem,
  // New imports for asset management
  insertAssetSchema,
  updateAssetSchema,
  type InsertAsset,
  type UpdateAsset,
  insertSupplierSchema,
  updateSupplierSchema,
  type InsertSupplier,
  type UpdateSupplier,
  insertMovementSchema,
  updateMovementSchema,
  type InsertMovement,
  type UpdateMovement,
  insertUserSchema,
  type InsertUser
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // =========== User Routes ===========
  
  // Get all users
  app.get("/api/users", async (_req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create new user
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const parseResult = insertUserSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(parseResult.data.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(parseResult.data);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // =========== Inventory Routes ===========
  
  // Get all inventory items
  app.get("/api/inventory", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getAllInventoryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });

  // Get inventory item by ID
  app.get("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const item = await storage.getInventoryItemById(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });

  // Create new inventory item
  app.post("/api/inventory", async (req: Request, res: Response) => {
    try {
      const parseResult = insertInventoryItemSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Convert string values to numbers
      const newItemData: InsertInventoryItem = {
        ...parseResult.data,
        price: parseResult.data.price,
        quantity: Number(parseResult.data.quantity),
        reorderLevel: parseResult.data.reorderLevel ? Number(parseResult.data.reorderLevel) : 10
      };
      
      // Check if SKU already exists
      const existingItem = await storage.getInventoryItemBySku(newItemData.sku);
      if (existingItem) {
        return res.status(409).json({ message: "An item with this SKU already exists" });
      }
      
      const newItem = await storage.createInventoryItem(newItemData);
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating inventory item:", error);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  // Update inventory item
  app.patch("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const parseResult = updateInventoryItemSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if item exists
      const existingItem = await storage.getInventoryItemById(id);
      if (!existingItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      // If SKU is being updated, check if new SKU already exists
      if (parseResult.data.sku && parseResult.data.sku !== existingItem.sku) {
        const skuExists = await storage.getInventoryItemBySku(parseResult.data.sku);
        if (skuExists) {
          return res.status(409).json({ message: "An item with this SKU already exists" });
        }
      }
      
      // Convert string values to numbers
      const updateData: UpdateInventoryItem = {
        ...parseResult.data
      };
      
      if (updateData.quantity !== undefined) {
        updateData.quantity = Number(updateData.quantity);
      }
      
      if (updateData.reorderLevel !== undefined) {
        updateData.reorderLevel = Number(updateData.reorderLevel);
      }
      
      const updatedItem = await storage.updateInventoryItem(id, updateData);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  // Delete inventory item
  app.delete("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Check if item exists
      const existingItem = await storage.getInventoryItemById(id);
      if (!existingItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      const success = await storage.deleteInventoryItem(id);
      
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete inventory item" });
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  // =========== Asset Routes ===========
  
  // Get all assets
  app.get("/api/assets", async (_req: Request, res: Response) => {
    try {
      const assets = await storage.getAllAssets();
      res.json(assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  // Get asset by ID
  app.get("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const asset = await storage.getAssetById(id);
      
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.json(asset);
    } catch (error) {
      console.error("Error fetching asset:", error);
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });

  // Create new asset
  app.post("/api/assets", async (req: Request, res: Response) => {
    try {
      const parseResult = insertAssetSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if asset tag already exists
      const existingAsset = await storage.getAssetByTag(parseResult.data.assetTag);
      if (existingAsset) {
        return res.status(409).json({ message: "An asset with this tag already exists" });
      }
      
      const newAsset = await storage.createAsset(parseResult.data);
      res.status(201).json(newAsset);
    } catch (error) {
      console.error("Error creating asset:", error);
      res.status(500).json({ message: "Failed to create asset" });
    }
  });

  // Update asset
  app.patch("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const parseResult = updateAssetSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if asset exists
      const existingAsset = await storage.getAssetById(id);
      if (!existingAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      // If asset tag is being updated, check if new tag already exists
      if (parseResult.data.assetTag && parseResult.data.assetTag !== existingAsset.assetTag) {
        const tagExists = await storage.getAssetByTag(parseResult.data.assetTag);
        if (tagExists) {
          return res.status(409).json({ message: "An asset with this tag already exists" });
        }
      }
      
      const updatedAsset = await storage.updateAsset(id, parseResult.data);
      res.json(updatedAsset);
    } catch (error) {
      console.error("Error updating asset:", error);
      res.status(500).json({ message: "Failed to update asset" });
    }
  });

  // Delete asset
  app.delete("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Check if asset exists
      const existingAsset = await storage.getAssetById(id);
      if (!existingAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      const success = await storage.deleteAsset(id);
      
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete asset" });
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      res.status(500).json({ message: "Failed to delete asset" });
    }
  });

  // =========== Supplier Routes ===========
  
  // Get all suppliers
  app.get("/api/suppliers", async (_req: Request, res: Response) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  // Get supplier by ID
  app.get("/api/suppliers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const supplier = await storage.getSupplierById(id);
      
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      res.json(supplier);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  // Create new supplier
  app.post("/api/suppliers", async (req: Request, res: Response) => {
    try {
      const parseResult = insertSupplierSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const newSupplier = await storage.createSupplier(parseResult.data);
      res.status(201).json(newSupplier);
    } catch (error) {
      console.error("Error creating supplier:", error);
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  // Update supplier
  app.patch("/api/suppliers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const parseResult = updateSupplierSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if supplier exists
      const existingSupplier = await storage.getSupplierById(id);
      if (!existingSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      const updatedSupplier = await storage.updateSupplier(id, parseResult.data);
      res.json(updatedSupplier);
    } catch (error) {
      console.error("Error updating supplier:", error);
      res.status(500).json({ message: "Failed to update supplier" });
    }
  });

  // Delete supplier
  app.delete("/api/suppliers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Check if supplier exists
      const existingSupplier = await storage.getSupplierById(id);
      if (!existingSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      const success = await storage.deleteSupplier(id);
      
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete supplier" });
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // =========== Asset Movement Routes ===========
  
  // Get all asset movements
  app.get("/api/movements", async (_req: Request, res: Response) => {
    try {
      const movements = await storage.getAllMovements();
      res.json(movements);
    } catch (error) {
      console.error("Error fetching asset movements:", error);
      res.status(500).json({ message: "Failed to fetch asset movements" });
    }
  });

  // Get movements for a specific asset
  app.get("/api/assets/:assetId/movements", async (req: Request, res: Response) => {
    try {
      const assetId = parseInt(req.params.assetId, 10);
      
      if (isNaN(assetId)) {
        return res.status(400).json({ message: "Invalid asset ID format" });
      }
      
      // Check if asset exists
      const asset = await storage.getAssetById(assetId);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      const movements = await storage.getMovementsByAssetId(assetId);
      res.json(movements);
    } catch (error) {
      console.error("Error fetching asset movements:", error);
      res.status(500).json({ message: "Failed to fetch asset movements" });
    }
  });

  // Get movement by ID
  app.get("/api/movements/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const movement = await storage.getMovementById(id);
      
      if (!movement) {
        return res.status(404).json({ message: "Movement record not found" });
      }
      
      res.json(movement);
    } catch (error) {
      console.error("Error fetching movement:", error);
      res.status(500).json({ message: "Failed to fetch movement" });
    }
  });

  // Create new movement
  app.post("/api/movements", async (req: Request, res: Response) => {
    try {
      const parseResult = insertMovementSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if asset exists
      const asset = await storage.getAssetById(parseResult.data.assetId);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      const newMovement = await storage.createMovement(parseResult.data);
      
      // If this is a transfer, update the asset's location
      if (parseResult.data.type === "transfer" && parseResult.data.status === "approved") {
        await storage.updateAsset(parseResult.data.assetId, {
          location: parseResult.data.toLocation
        });
      }
      
      res.status(201).json(newMovement);
    } catch (error) {
      console.error("Error creating movement:", error);
      res.status(500).json({ message: "Failed to create movement" });
    }
  });

  // Update movement
  app.patch("/api/movements/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const parseResult = updateMovementSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Check if movement exists
      const existingMovement = await storage.getMovementById(id);
      if (!existingMovement) {
        return res.status(404).json({ message: "Movement record not found" });
      }
      
      const updatedMovement = await storage.updateMovement(id, parseResult.data);
      
      // If this is approving a transfer, update the asset's location
      if (existingMovement.type === "transfer" && 
          existingMovement.status !== "approved" && 
          parseResult.data.status === "approved") {
        await storage.updateAsset(existingMovement.assetId, {
          location: existingMovement.toLocation
        });
      }
      
      res.json(updatedMovement);
    } catch (error) {
      console.error("Error updating movement:", error);
      res.status(500).json({ message: "Failed to update movement" });
    }
  });

  // Delete movement
  app.delete("/api/movements/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Check if movement exists
      const existingMovement = await storage.getMovementById(id);
      if (!existingMovement) {
        return res.status(404).json({ message: "Movement record not found" });
      }
      
      const success = await storage.deleteMovement(id);
      
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete movement record" });
      }
    } catch (error) {
      console.error("Error deleting movement:", error);
      res.status(500).json({ message: "Failed to delete movement" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
