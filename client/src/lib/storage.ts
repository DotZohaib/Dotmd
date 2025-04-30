import { RecentSearch, Bill } from "@/types";

// Local storage keys
const RECENT_SEARCHES_KEY = "medisearch_recent_searches";
const BILLS_KEY = "medisearch_bills";
const LAST_BILL_ID_KEY = "medisearch_last_bill_id";

// Function to save a recent search term
export const saveRecentSearch = (term: string): RecentSearch[] => {
  const searches = getRecentSearches();
  
  // Check if term already exists
  const existingIndex = searches.findIndex(s => s.term.toLowerCase() === term.toLowerCase());
  
  if (existingIndex >= 0) {
    // Update timestamp of existing search
    searches[existingIndex].timestamp = Date.now();
  } else {
    // Add new search
    searches.unshift({
      term,
      timestamp: Date.now()
    });
    
    // Keep only the last 10 searches
    if (searches.length > 10) {
      searches.pop();
    }
  }
  
  // Sort by most recent
  searches.sort((a, b) => b.timestamp - a.timestamp);
  
  // Save to local storage
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  
  return searches;
};

// Function to get recent searches
export const getRecentSearches = (): RecentSearch[] => {
  const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
  if (!storedSearches) return [];
  
  try {
    return JSON.parse(storedSearches);
  } catch (error) {
    console.error("Error parsing recent searches:", error);
    return [];
  }
};

// Function to save a bill
export const saveBillToStorage = (bill: Bill): void => {
  const bills = getBillsFromStorage();
  
  // Add new bill
  bills.unshift(bill);
  
  // Save to local storage
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  
  // Update last bill ID
  const billNumber = parseInt(bill.id!.replace(/\D/g, ''), 10);
  localStorage.setItem(LAST_BILL_ID_KEY, billNumber.toString());
};

// Function to get all bills
export const getBillsFromStorage = (): Bill[] => {
  const storedBills = localStorage.getItem(BILLS_KEY);
  if (!storedBills) return [];
  
  try {
    return JSON.parse(storedBills);
  } catch (error) {
    console.error("Error parsing bills:", error);
    return [];
  }
};

// Function to get the next bill ID
export const getNextBillId = (): string => {
  const lastId = localStorage.getItem(LAST_BILL_ID_KEY);
  const nextId = lastId ? parseInt(lastId, 10) + 1 : 1;
  
  // Format as B0001, B0002, etc.
  return `B${nextId.toString().padStart(4, '0')}`;
};

// Function to delete a bill
export const deleteBillFromStorage = (billId: string): void => {
  const bills = getBillsFromStorage();
  const updatedBills = bills.filter(bill => bill.id !== billId);
  
  localStorage.setItem(BILLS_KEY, JSON.stringify(updatedBills));
};
