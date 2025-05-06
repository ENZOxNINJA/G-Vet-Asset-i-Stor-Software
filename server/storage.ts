import { 
  users, 
  type User, 
  type InsertUser,
  inventoryItems,
  type InventoryItem,
  type InsertInventoryItem,
  type UpdateInventoryItem
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Inventory CRUD Operations
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemById(id: number): Promise<InventoryItem | undefined>;
  getInventoryItemBySku(sku: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: UpdateInventoryItem): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inventoryItems: Map<number, InventoryItem>;
  userCurrentId: number;
  inventoryCurrentId: number;

  constructor() {
    this.users = new Map();
    this.inventoryItems = new Map();
    this.userCurrentId = 1;
    this.inventoryCurrentId = 1;
    
    // Add some initial inventory items for demonstration
    this.seedInventory();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Inventory CRUD Operations
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItemById(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async getInventoryItemBySku(sku: string): Promise<InventoryItem | undefined> {
    return Array.from(this.inventoryItems.values()).find(
      (item) => item.sku === sku,
    );
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.inventoryCurrentId++;
    const now = new Date();
    const item: InventoryItem = { 
      ...insertItem, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(id: number, updateItem: UpdateInventoryItem): Promise<InventoryItem | undefined> {
    const existingItem = this.inventoryItems.get(id);
    if (!existingItem) {
      return undefined;
    }

    const updatedItem: InventoryItem = {
      ...existingItem,
      ...updateItem,
      updatedAt: new Date()
    };
    
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }

  // Seed some initial data
  private seedInventory(): void {
    const items: InsertInventoryItem[] = [
      {
        name: "Wireless Keyboard",
        sku: "KB-1234",
        description: "A high-quality wireless keyboard with long battery life",
        category: "Electronics",
        price: "59.99",
        quantity: 24,
        reorderLevel: 10,
        status: "active"
      },
      {
        name: "Wireless Mouse",
        sku: "MS-5678",
        description: "Ergonomic wireless mouse with precision tracking",
        category: "Electronics",
        price: "39.99",
        quantity: 42,
        reorderLevel: 15,
        status: "active"
      },
      {
        name: "27\" Monitor",
        sku: "MN-9012",
        description: "27-inch 4K monitor with HDR support",
        category: "Electronics",
        price: "249.99",
        quantity: 5,
        reorderLevel: 8,
        status: "active"
      },
      {
        name: "USB-C Hub",
        sku: "HB-3456",
        description: "Multi-port USB-C hub with power delivery",
        category: "Accessories",
        price: "34.99",
        quantity: 0,
        reorderLevel: 20,
        status: "active"
      }
    ];

    items.forEach(item => {
      this.createInventoryItem(item);
    });
  }
}

export const storage = new MemStorage();
