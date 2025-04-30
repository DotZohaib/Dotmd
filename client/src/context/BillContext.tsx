import React, { createContext, useState, useContext, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { BillItem, Bill } from "@/types";
import { saveBillToStorage, getNextBillId } from "@/lib/storage";
import { useLocation } from "wouter";

interface BillContextType {
  billItems: BillItem[];
  showBill: boolean;
  billDetails: Omit<Bill, 'id' | 'items'>;
  addToBill: (item: BillItem) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearBill: () => void;
  updateBillDetails: (details: Partial<Omit<Bill, 'id' | 'items'>>) => void;
  saveBill: () => void;
  loadBillFromHistory: (bill: Bill) => void;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export function BillProvider({ children }: { children: ReactNode }) {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [showBill, setShowBill] = useState(false);
  const [billDetails, setBillDetails] = useState<Omit<Bill, 'id' | 'items'>>({
    customerName: "",
    customerPhone: "",
    totalAmount: 0,
    dateCreated: new Date().toISOString(),
    itemCount: 0
  });
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Function to add an item to the bill
  const addToBill = useCallback((item: BillItem) => {
    setBillItems(prev => {
      // Check if item already exists
      const existingIndex = prev.findIndex(
        i => i.medicineName === item.medicineName
      );

      if (existingIndex >= 0) {
        // Update existing item - increment quantity
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        updated[existingIndex].total = 
          (updated[existingIndex].price + updated[existingIndex].tax) * 
          updated[existingIndex].quantity;
        
        // Make sure to preserve the packing and discount information
        if (item.packing && !updated[existingIndex].packing) {
          updated[existingIndex].packing = item.packing;
        }
        if (item.discount !== undefined && updated[existingIndex].discount === undefined) {
          updated[existingIndex].discount = item.discount;
        }
        
        setShowBill(true);
        return updated;
      } else {
        // Add new item - don't replace the previous items, just add to them
        setShowBill(true);
        return [...prev, item];
      }
    });

    toast({
      title: "Added to bill",
      description: `${item.medicineName} has been added to the bill.`,
    });
  }, [toast]);

  // Function to update quantity of an item in the bill
  const updateQuantity = useCallback((index: number, quantity: number) => {
    setBillItems(prev => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      // Preserve all item properties while updating total
      updated[index].total = 
        (updated[index].price + updated[index].tax) * quantity;
      return updated;
    });
  }, []);

  // Function to remove an item from the bill
  const removeItem = useCallback((index: number) => {
    setBillItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setShowBill(false);
      }
      return updated;
    });
  }, []);

  // Function to clear the bill
  const clearBill = useCallback(() => {
    setBillItems([]);
    setShowBill(false);
    setBillDetails({
      customerName: "",
      customerPhone: "",
      totalAmount: 0,
      dateCreated: new Date().toISOString(),
      itemCount: 0
    });

    toast({
      title: "Bill cleared",
      description: "All items have been removed from the bill.",
    });
  }, [toast]);

  // Function to update bill details
  const updateBillDetails = useCallback((details: Partial<typeof billDetails>) => {
    setBillDetails(prev => ({
      ...prev,
      ...details
    }));
  }, []);

  // Function to save the bill
  const saveBill = useCallback(() => {
    if (billItems.length === 0) {
      toast({
        title: "Cannot save empty bill",
        description: "Please add items to the bill before saving.",
        variant: "destructive",
      });
      return;
    }

    if (!billDetails.customerName) {
      toast({
        title: "Customer name required",
        description: "Please enter a customer name before saving the bill.",
        variant: "destructive",
      });
      return;
    }

    const billId = getNextBillId();
    const newBill: Bill = {
      id: billId,
      ...billDetails,
      dateCreated: new Date().toISOString(),
      items: billItems,
      itemCount: billItems.length
    };

    saveBillToStorage(newBill);

    toast({
      title: "Bill saved",
      description: `Bill #${billId} has been saved successfully.`,
    });

    // Don't clear the bill here as we want to keep it for printing
  }, [billItems, billDetails, toast]);

  // Function to load a bill from history
  const loadBillFromHistory = useCallback((bill: Bill) => {
    setBillItems(bill.items);
    setBillDetails({
      customerName: bill.customerName,
      customerPhone: bill.customerPhone,
      totalAmount: bill.totalAmount,
      dateCreated: bill.dateCreated,
      itemCount: bill.itemCount
    });
    setShowBill(true);
    
    // Navigate to home page if not already there
    if (location !== '/') {
      setLocation('/');
    }
  }, [location, setLocation]);

  return (
    <BillContext.Provider
      value={{
        billItems,
        showBill,
        billDetails,
        addToBill,
        updateQuantity,
        removeItem,
        clearBill,
        updateBillDetails,
        saveBill,
        loadBillFromHistory
      }}
    >
      {children}
    </BillContext.Provider>
  );
}

export function useBill() {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error("useBill must be used within a BillProvider");
  }
  return context;
}