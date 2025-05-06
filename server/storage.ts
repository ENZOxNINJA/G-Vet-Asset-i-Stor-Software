import { 
  users, 
  type User, 
  type InsertUser,
  inventoryItems,
  type InventoryItem,
  type InsertInventoryItem,
  type UpdateInventoryItem,
  // New imports for asset management
  assets,
  type Asset,
  type InsertAsset,
  type UpdateAsset,
  suppliers,
  type Supplier,
  type InsertSupplier,
  type UpdateSupplier,
  assetMovements,
  type AssetMovement,
  type InsertMovement,
  type UpdateMovement
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inventoryItems: Map<number, InventoryItem>;
  private assets: Map<number, Asset>;
  private suppliers: Map<number, Supplier>;
  private assetMovements: Map<number, AssetMovement>;
  
  userCurrentId: number;
  inventoryCurrentId: number;
  assetCurrentId: number;
  supplierCurrentId: number;
  movementCurrentId: number;

  constructor() {
    this.users = new Map();
    this.inventoryItems = new Map();
    this.assets = new Map();
    this.suppliers = new Map();
    this.assetMovements = new Map();
    
    this.userCurrentId = 1;
    this.inventoryCurrentId = 1;
    this.assetCurrentId = 1;
    this.supplierCurrentId = 1;
    this.movementCurrentId = 1;
    
    // Add some initial data for demonstration
    this.seedInventory();
    this.seedAssets();
    this.seedSuppliers();
    this.seedUsers();
  }

  // User Operations
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

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }

    const updatedUser: User = {
      ...existingUser,
      ...userData
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
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

  // Asset CRUD Operations
  async getAllAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAssetById(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetByTag(assetTag: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(
      (asset) => asset.assetTag === assetTag,
    );
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.assetCurrentId++;
    const now = new Date();
    const asset: Asset = { 
      ...insertAsset, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAsset(id: number, updateAsset: UpdateAsset): Promise<Asset | undefined> {
    const existingAsset = this.assets.get(id);
    if (!existingAsset) {
      return undefined;
    }

    const updatedAsset: Asset = {
      ...existingAsset,
      ...updateAsset,
      updatedAt: new Date()
    };
    
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Supplier CRUD Operations
  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplierById(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierCurrentId++;
    const now = new Date();
    const supplier: Supplier = { 
      ...insertSupplier, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, updateSupplier: UpdateSupplier): Promise<Supplier | undefined> {
    const existingSupplier = this.suppliers.get(id);
    if (!existingSupplier) {
      return undefined;
    }

    const updatedSupplier: Supplier = {
      ...existingSupplier,
      ...updateSupplier,
      updatedAt: new Date()
    };
    
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Asset Movement Operations
  async getAllMovements(): Promise<AssetMovement[]> {
    return Array.from(this.assetMovements.values());
  }

  async getMovementsByAssetId(assetId: number): Promise<AssetMovement[]> {
    return Array.from(this.assetMovements.values()).filter(
      (movement) => movement.assetId === assetId
    );
  }

  async getMovementById(id: number): Promise<AssetMovement | undefined> {
    return this.assetMovements.get(id);
  }

  async createMovement(insertMovement: InsertMovement): Promise<AssetMovement> {
    const id = this.movementCurrentId++;
    const now = new Date();
    const movement: AssetMovement = { 
      ...insertMovement, 
      id,
      approvalDate: null,
      returnDate: null
    };
    this.assetMovements.set(id, movement);
    return movement;
  }

  async updateMovement(id: number, updateMovement: UpdateMovement): Promise<AssetMovement | undefined> {
    const existingMovement = this.assetMovements.get(id);
    if (!existingMovement) {
      return undefined;
    }

    const updatedMovement: AssetMovement = {
      ...existingMovement,
      ...updateMovement
    };
    
    this.assetMovements.set(id, updatedMovement);
    return updatedMovement;
  }

  async deleteMovement(id: number): Promise<boolean> {
    return this.assetMovements.delete(id);
  }

  // Seed data methods
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

  private seedAssets(): void {
    const assets: InsertAsset[] = [
      {
        assetTag: "HM-001-2023",
        name: "Dell Latitude 5420",
        description: "Business laptop with Intel Core i7 processor",
        category: "Computer",
        type: "Harta Modal",
        price: "1299.99",
        purchaseDate: new Date("2023-05-15"),
        supplier: "Dell Technologies",
        location: "IT Department",
        department: "IT",
        status: "active",
        condition: "good"
      },
      {
        assetTag: "HM-002-2023",
        name: "HP LaserJet Pro MFP",
        description: "Multifunction printer for office use",
        category: "Printer",
        type: "Harta Modal",
        price: "599.99",
        purchaseDate: new Date("2023-06-20"),
        supplier: "HP Inc.",
        location: "Admin Office",
        department: "Admin",
        status: "active",
        condition: "good"
      },
      {
        assetTag: "ABR-001-2023",
        name: "Logitech MX Keys",
        description: "Wireless keyboard with backlight",
        category: "Accessory",
        type: "Aset Bernilai Rendah",
        price: "119.99",
        purchaseDate: new Date("2023-01-10"),
        supplier: "Logitech",
        location: "Finance Department",
        department: "Finance",
        status: "active",
        condition: "good"
      },
      {
        assetTag: "ABR-002-2023",
        name: "Samsung 24\" Monitor",
        description: "Full HD LED monitor",
        category: "Computer Peripheral",
        type: "Aset Bernilai Rendah",
        price: "189.99",
        purchaseDate: new Date("2023-03-05"),
        supplier: "Samsung Electronics",
        location: "Marketing Department",
        department: "Marketing",
        status: "maintenance",
        condition: "fair"
      }
    ];

    assets.forEach(asset => {
      this.createAsset(asset);
    });
  }

  private seedSuppliers(): void {
    const suppliers: InsertSupplier[] = [
      {
        name: "Dell Technologies",
        contactPerson: "John Smith",
        phone: "+1-555-123-4567",
        email: "john.smith@dell.example.com",
        address: "123 Tech Way, Austin, TX 78758"
      },
      {
        name: "HP Inc.",
        contactPerson: "Sarah Johnson",
        phone: "+1-555-987-6543",
        email: "sarah.j@hp.example.com",
        address: "456 Computer Blvd, Palo Alto, CA 94304"
      },
      {
        name: "Logitech",
        contactPerson: "Michael Brown",
        phone: "+1-555-456-7890",
        email: "m.brown@logitech.example.com",
        address: "789 Input Drive, Newark, CA 94560"
      },
      {
        name: "Samsung Electronics",
        contactPerson: "Lisa Park",
        phone: "+1-555-789-0123",
        email: "lisa.park@samsung.example.com",
        address: "101 Display Road, San Jose, CA 95134"
      }
    ];

    suppliers.forEach(supplier => {
      this.createSupplier(supplier);
    });
  }

  private seedUsers(): void {
    const users: InsertUser[] = [
      {
        username: "admin",
        password: "admin123", // In a real app, this would be hashed
        fullName: "System Administrator",
        department: "IT",
        role: "admin"
      },
      {
        username: "asset_manager",
        password: "manager123", // In a real app, this would be hashed
        fullName: "Asset Manager",
        department: "Admin",
        role: "manager"
      },
      {
        username: "user1",
        password: "user123", // In a real app, this would be hashed
        fullName: "Regular User",
        department: "Finance",
        role: "user"
      }
    ];

    users.forEach(user => {
      this.createUser(user);
    });
  }
}

export const storage = new MemStorage();
