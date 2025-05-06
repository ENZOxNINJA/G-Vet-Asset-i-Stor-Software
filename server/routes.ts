import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertInventoryItemSchema, 
  updateInventoryItemSchema,
  type InsertInventoryItem,
  type UpdateInventoryItem
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
