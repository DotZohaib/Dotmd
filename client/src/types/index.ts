// Medicine type for frontend use
export interface Medicine {
  id?: number;
  name: string;
  manufacturer: string;
  dosage: string;
  price: number;
  tax: number;
  availability: string;
  Packing?: string; // Added to match the Excel upload format
}

// Bill item type for frontend use
export interface BillItem {
  id?: number;
  medicineName: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
}

// Bill type for frontend use
export interface Bill {
  id?: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  dateCreated: string;
  itemCount: number;
  items: BillItem[];
}

// Recent search type for frontend use
export interface RecentSearch {
  term: string;
  timestamp: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  error?: string;
}
