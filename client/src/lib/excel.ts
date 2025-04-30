import { Medicine, BillItem, Bill } from "@/types";

// Function to download medicines as Excel file
export const downloadMedicinesAsExcel = async (medicines: Medicine[]) => {
  // We'll use a simple CSV approach since we don't have ExcelJS on the client side
  // Create CSV content
  const headers = ["Medicine Name", "Manufacturer", "Dosage", "Price (₹)", "Tax (%)", "Availability"];
  
  let csvContent = headers.join(",") + "\n";
  
  medicines.forEach(medicine => {
    const row = [
      `"${medicine.name.replace(/"/g, '""')}"`,
      `"${medicine.manufacturer.replace(/"/g, '""')}"`,
      `"${medicine.dosage.replace(/"/g, '""')}"`,
      medicine.price.toFixed(2),
      medicine.tax.toString(),
      `"${medicine.availability.replace(/"/g, '""')}"`
    ];
    
    csvContent += row.join(",") + "\n";
  });
  
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
    "Quantity",
    "Price (₹)",
    "Tax (₹)",
    "Total (₹)"
  ];
  
  let csvContent = "MediSearch Pharmacy\n";
  csvContent += `Bill #: ${bill.id}\n`;
  csvContent += `Date: ${new Date(bill.dateCreated).toLocaleDateString()}\n`;
  csvContent += `Customer: ${bill.customerName}\n`;
  csvContent += `Phone: ${bill.customerPhone}\n\n`;
  
  csvContent += headers.join(",") + "\n";
  
  // Add bill items
  bill.items.forEach(item => {
    const row = [
      `"${item.medicineName.replace(/"/g, '""')}"`,
      item.quantity.toString(),
      (item.price * item.quantity).toFixed(2),
      (item.tax * item.quantity).toFixed(2),
      ((item.price + item.tax) * item.quantity).toFixed(2)
    ];
    
    csvContent += row.join(",") + "\n";
  });
  
  // Add totals
  const subtotal = bill.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxTotal = bill.items.reduce((acc, item) => acc + (item.tax * item.quantity), 0);
  
  csvContent += `\nSubtotal,,"${subtotal.toFixed(2)}"\n`;
  csvContent += `Tax,,"${taxTotal.toFixed(2)}"\n`;
  csvContent += `Grand Total,,"${bill.totalAmount.toFixed(2)}"\n`;
  
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
