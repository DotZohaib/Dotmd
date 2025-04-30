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
    const testMedicines = [
      {
        name: "DICLORAN SR 100MG",
        manufacturer: "Abbott Labs",
        dosage: "100mg",
        price: 552.50,
        tax: 0.0,
        availability: "In Stock",
        Packing: "30'S",
        Rate: 552.50,
        Disc: 0.0
      },
      {
        name: "AMOXIL SYRUP (125MG)",
        manufacturer: "GlaxoSmithKline",
        dosage: "125mg/5ml",
        price: 107.32,
        tax: 0.0,
        availability: "In Stock",
        Packing: "90ML",
        Rate: 107.32,
        Disc: 0.0
      },
      {
        name: "ASCARD PLUS 239.4",
        manufacturer: "Sami Pharmaceuticals",
        dosage: "239.4mg",
        price: 217.73,
        tax: 0.0,
        availability: "Discount 1%",
        Packing: "10's",
        Rate: 217.73,
        Disc: 1.0
      },
      {
        name: "ATCOMID 50",
        manufacturer: "Atco Laboratories",
        dosage: "50mg",
        price: 408.00,
        tax: 0.0,
        availability: "Discount 18%",
        Packing: "20's",
        Rate: 408.00,
        Disc: 18.0
      },
      {
        name: "ATCOMID 100",
        manufacturer: "Atco Laboratories",
        dosage: "100mg",
        price: 595.00,
        tax: 0.0,
        availability: "Discount 11%",
        Packing: "10's",
        Rate: 595.00,
        Disc: 11.0
      },
      {
        name: "AZOMAX 250MG CAP.",
        manufacturer: "Pfizer Pakistan Ltd",
        dosage: "250mg",
        price: 980.00,
        tax: 10.0,
        availability: "In Stock",
        Packing: "6's",
        Rate: 980.00,
        Disc: 0.0
      },
      {
        name: "CEFSPAN 400 CAP.( BARRET )",
        manufacturer: "Barrett Hodgson",
        dosage: "400mg",
        price: 790.00,
        tax: 10.0,
        availability: "In Stock",
        Packing: "5's",
        Rate: 790.00,
        Disc: 0.0
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
