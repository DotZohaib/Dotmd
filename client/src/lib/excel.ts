import { Medicine, BillItem, Bill } from "@/types";

// Function to download medicines as Excel file
export const downloadMedicinesAsExcel = async (medicines: Medicine[], quantities?: Record<string, number>) => {
  // We'll use a simple CSV approach since we don't have ExcelJS on the client side
  // Create CSV content
  const headers = [
    "Medicine Name", 
    "Packing", 
    "Price (₹)", 
    "Disc (%)", 
    "Tax (%)", 
    "Quantity", 
    "Final Price (₹)"
  ];
  
  let csvContent = headers.join(",") + "\n";
  
  medicines.forEach(medicine => {
    // Get discount percentage from the Disc field
    const discountPercent = medicine.Disc || 0;
    
    // Get quantity
    const quantity = quantities?.[medicine.name] || 1;
    
    // Calculate final price
    const discountFactor = (100 - discountPercent) / 100;
    const priceAfterDiscount = medicine.price * discountFactor;
    const taxAmount = medicine.tax > 1 ? medicine.tax : (medicine.price * (medicine.tax / 100));
    const finalPrice = (priceAfterDiscount + taxAmount) * quantity;
    
    const row = [
      `"${medicine.name.replace(/"/g, '""')}"`,
      `"${medicine.Packing || 'N/A'}"`,
      medicine.price.toFixed(2),
      discountPercent.toString() + '%',
      medicine.tax.toString() + '%',
      quantity.toString(),
      finalPrice.toFixed(2)
    ];
    
    csvContent += row.join(",") + "\n";
  });
  
  // If we have more than 10 items, add a total row
  if (medicines.length >= 10) {
    let totalValue = 0;
    
    medicines.forEach(medicine => {
      const discountPercent = medicine.Disc || 0;
      
      const quantity = quantities?.[medicine.name] || 1;
      const discountFactor = (100 - discountPercent) / 100;
      const priceAfterDiscount = medicine.price * discountFactor;
      const taxAmount = medicine.tax > 1 ? medicine.tax : (medicine.price * (medicine.tax / 100));
      const finalPrice = (priceAfterDiscount + taxAmount) * quantity;
      
      totalValue += finalPrice;
    });
    
    csvContent += `\n"Total Value",,,,,,${totalValue.toFixed(2)}\n`;
  }
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `medicines_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to download bill as Excel file
export const downloadBillAsExcel = (bill: Bill) => {
  // Headers for bill
  const headers = [
    "Medicine Name",
    "Packing",
    "Quantity",
    "Price (₹)",
    "Disc (%)",
    "Tax (₹)",
    "Final Price (₹)"
  ];
  
  let csvContent = "MediSearch Pharmacy\n";
  csvContent += `Bill #: ${bill.id}\n`;
  csvContent += `Date: ${new Date(bill.dateCreated).toLocaleDateString()}\n`;
  csvContent += `Customer: ${bill.customerName}\n`;
  csvContent += `Phone: ${bill.customerPhone}\n\n`;
  
  csvContent += headers.join(",") + "\n";
  
  // Add bill items
  bill.items.forEach(item => {
    // Use the discount percentage if available, otherwise 0%
    let discPercent = item.discount !== undefined ? `${item.discount}%` : "0%";
    
    const row = [
      `"${item.medicineName.replace(/"/g, '""')}"`,
      `"${item.packing || 'N/A'}"`, // Use packing information if available
      item.quantity.toString(),
      item.price.toFixed(2),
      discPercent,
      item.tax.toFixed(2),
      item.total.toFixed(2)
    ];
    
    csvContent += row.join(",") + "\n";
  });
  
  // Add totals
  const subtotal = bill.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxTotal = bill.items.reduce((acc, item) => acc + (item.tax * item.quantity), 0);
  
  csvContent += `\nSubtotal,,,,"${subtotal.toFixed(2)}"\n`;
  csvContent += `Tax,,,,"${taxTotal.toFixed(2)}"\n`;
  csvContent += `Grand Total,,,,"${bill.totalAmount.toFixed(2)}"\n`;
  
  // If we have 10 or more items, highlight the total value
  if (bill.items.length >= 10) {
    csvContent += `\n"Total Value (${bill.items.length} items)",,,,"${bill.totalAmount.toFixed(2)}"\n`;
    csvContent += `"Special pricing may apply for bulk orders!"\n`;
  }
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `bill_${bill.id}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
