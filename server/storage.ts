import { Storage, MemoryStorage, DatabaseStorage } from "./storage";

let storageInstance: Storage | null = null;

export function initializeStorage(): Storage {
  if (storageInstance) {
    return storageInstance;
  }

  const storageType = process.env.STORAGE_TYPE || 'memory';

  if (storageType === 'database') {
    try {
      // Test database connection first
      storageInstance = new DatabaseStorage();
      console.log("✅ Database storage initialized successfully");
    } catch (error) {
      console.warn("⚠️  Database connection failed, falling back to memory storage");
      console.warn("Error:", error instanceof Error ? error.message : error);
      storageInstance = new MemoryStorage();
    }
  } else {
    storageInstance = new MemoryStorage();
    console.log("✅ Memory storage initialized successfully");
  }

  return storageInstance;
}

export { storage, type IStorage } from "./database-storage";