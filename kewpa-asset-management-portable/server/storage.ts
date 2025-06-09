import { 
  users, type User, type InsertUser,
  assets, type Asset, type InsertAsset, type UpdateAsset,
  assetMovements, type AssetMovement, type InsertMovement, type UpdateMovement,
  suppliers, type Supplier, type InsertSupplier, type UpdateSupplier,
  inventoryItems, type InventoryItem, type InsertInventoryItem, type UpdateInventoryItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User Operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Inventory CRUD Operations
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemById(id: number): Promise<InventoryItem | undefined>;
  getInventoryItemBySku(sku: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: UpdateInventoryItem): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;

  // Asset CRUD Operations
  getAllAssets(): Promise<Asset[]>;
  getAssetById(id: number): Promise<Asset | undefined>;
  getAssetByTag(assetTag: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: UpdateAsset): Promise<Asset | undefined>;
  deleteAsset(id: number): Promise<boolean>;
  
  // Supplier CRUD Operations
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: UpdateSupplier): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;
  
  // Asset Movement Operations
  getAllMovements(): Promise<AssetMovement[]>;
  getMovementsByAssetId(assetId: number): Promise<AssetMovement[]>;
  getMovementById(id: number): Promise<AssetMovement | undefined>;
  createMovement(movement: InsertMovement): Promise<AssetMovement>;
  updateMovement(id: number, movement: UpdateMovement): Promise<AssetMovement | undefined>;
  deleteMovement(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User Operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Inventory Operations
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return db.select().from(inventoryItems).orderBy(desc(inventoryItems.createdAt));
  }

  async getInventoryItemById(id: number): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async getInventoryItemBySku(sku: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.sku, sku));
    return item;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const now = new Date();
    const [newItem] = await db.insert(inventoryItems)
      .values({
        ...item,
        status: item.status || 'active',
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return newItem;
  }

  async updateInventoryItem(id: number, item: UpdateInventoryItem): Promise<InventoryItem | undefined> {
    const [updatedItem] = await db.update(inventoryItems)
      .set({
        ...item,
        updatedAt: new Date()
      })
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Asset Operations
  async getAllAssets(): Promise<Asset[]> {
    return db.select().from(assets).orderBy(desc(assets.createdAt));
  }

  async getAssetById(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }

  async getAssetByTag(assetTag: string): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.assetTag, assetTag));
    return asset;
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const now = new Date();
    const [newAsset] = await db.insert(assets)
      .values({
        ...asset,
        status: asset.status || 'active',
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return newAsset;
  }

  async updateAsset(id: number, updateData: UpdateAsset): Promise<Asset | undefined> {
    const [updatedAsset] = await db.update(assets)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(assets.id, id))
      .returning();
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    const result = await db.delete(assets).where(eq(assets.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Supplier Operations
  async getAllSuppliers(): Promise<Supplier[]> {
    return db.select().from(suppliers).orderBy(suppliers.name);
  }

  async getSupplierById(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const now = new Date();
    const [newSupplier] = await db.insert(suppliers)
      .values({
        ...supplier,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return newSupplier;
  }

  async updateSupplier(id: number, updateData: UpdateSupplier): Promise<Supplier | undefined> {
    const [updatedSupplier] = await db.update(suppliers)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(suppliers.id, id))
      .returning();
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Asset Movement Operations
  async getAllMovements(): Promise<AssetMovement[]> {
    return db.select().from(assetMovements).orderBy(desc(assetMovements.requestDate));
  }

  async getMovementsByAssetId(assetId: number): Promise<AssetMovement[]> {
    return db.select()
      .from(assetMovements)
      .where(eq(assetMovements.assetId, assetId))
      .orderBy(desc(assetMovements.requestDate));
  }

  async getMovementById(id: number): Promise<AssetMovement | undefined> {
    const [movement] = await db.select().from(assetMovements).where(eq(assetMovements.id, id));
    return movement;
  }

  async createMovement(movement: InsertMovement): Promise<AssetMovement> {
    const [newMovement] = await db.insert(assetMovements)
      .values({
        ...movement,
        status: movement.status || 'pending',
        requestDate: movement.requestDate || new Date(),
        approvalDate: null,
        returnDate: null
      })
      .returning();
    return newMovement;
  }

  async updateMovement(id: number, updateData: UpdateMovement): Promise<AssetMovement | undefined> {
    const [updatedMovement] = await db.update(assetMovements)
      .set(updateData)
      .where(eq(assetMovements.id, id))
      .returning();
    return updatedMovement;
  }

  async deleteMovement(id: number): Promise<boolean> {
    const result = await db.delete(assetMovements).where(eq(assetMovements.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();