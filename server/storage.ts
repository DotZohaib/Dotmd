import { users, type User, type InsertUser, type Medicine, type InsertMedicine } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Medicine related methods
  getAllMedicines(): Promise<Medicine[]>;
  getMedicineById(id: number): Promise<Medicine | undefined>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  searchMedicines(query: string): Promise<Medicine[]>;
  getMedicineSuggestions(query: string): Promise<Medicine[]>;
  clearMedicines(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private medicines: Map<number, Medicine>;
  currentUserId: number;
  currentMedicineId: number;

  constructor() {
    this.users = new Map();
    this.medicines = new Map();
    this.currentUserId = 1;
    this.currentMedicineId = 1;
    
    // Add some initial test data for development
    this.initializeTestData();
  }

  private initializeTestData() {
    // Add sample medicines for development
    const testMedicines: InsertMedicine[] = [
      {
        name: "Paracetamol",
        manufacturer: "ABC Pharma",
        dosage: "500mg",
        price: 5.50,
        tax: 5,
        availability: "In Stock"
      },
      {
        name: "Aspirin",
        manufacturer: "XYZ Healthcare",
        dosage: "100mg",
        price: 3.75,
        tax: 5,
        availability: "In Stock"
      },
      {
        name: "Vitamin C",
        manufacturer: "Health Supplements Inc.",
        dosage: "1000mg",
        price: 12.99,
        tax: 12,
        availability: "Low Stock"
      }
    ];
    
    // Create sample medicines
    for (const medicine of testMedicines) {
      this.createMedicine(medicine);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Medicine methods
  async getAllMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }
  
  async getMedicineById(id: number): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }
  
  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const id = this.currentMedicineId++;
    const medicine: Medicine = { ...insertMedicine, id };
    this.medicines.set(id, medicine);
    return medicine;
  }
  
  async searchMedicines(query: string): Promise<Medicine[]> {
    query = query.toLowerCase();
    return Array.from(this.medicines.values()).filter(medicine => {
      return (
        medicine.name.toLowerCase().includes(query) ||
        medicine.manufacturer.toLowerCase().includes(query) ||
        medicine.dosage.toLowerCase().includes(query)
      );
    });
  }
  
  async getMedicineSuggestions(query: string): Promise<Medicine[]> {
    // For suggestions, just return medicines whose names start with the query
    // Limit to 5 suggestions
    query = query.toLowerCase();
    return Array.from(this.medicines.values())
      .filter(medicine => medicine.name.toLowerCase().includes(query))
      .slice(0, 5);
  }
  
  async clearMedicines(): Promise<void> {
    this.medicines.clear();
    this.currentMedicineId = 1;
  }
}

export const storage = new MemStorage();
