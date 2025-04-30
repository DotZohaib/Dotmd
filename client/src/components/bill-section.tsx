import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { BillItem, Bill } from "@/types";
import { useBill } from "@/hooks/use-bill";

interface BillSectionProps {
  onPrintBill: () => void;
}

export default function BillSection({ onPrintBill }: BillSectionProps) {
  const { 
    billItems, 
    updateQuantity, 
    removeItem, 
    clearBill, 
    saveBill,
    billDetails,
    updateBillDetails
  } = useBill();
  
  const [subtotal, setSubtotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    // Calculate totals
    let newSubtotal = 0;
    let newTaxTotal = 0;
    
    billItems.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      const itemTax = item.tax * item.quantity;
      
      newSubtotal += itemSubtotal;
      newTaxTotal += itemTax;
    });
    
    setSubtotal(newSubtotal);
    setTaxTotal(newTaxTotal);
    setGrandTotal(newSubtotal + newTaxTotal);
    
    // Update bill details
    updateBillDetails({
      customerName,
      customerPhone,
      totalAmount: newSubtotal + newTaxTotal,
      dateCreated: new Date().toISOString(),
      itemCount: billItems.length
    });
  }, [billItems, customerName, customerPhone]);

  const handleSaveBill = () => {
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }
    
    if (billItems.length === 0) {
      alert("Bill is empty. Please add items.");
      return;
    }
    
    saveBill();
    onPrintBill();
  };

  return (
    <Card className="bg-white shadow rounded-lg mb-8">
      <CardHeader className="px-4 py-5 sm:px-6 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium text-gray-900">Current Bill</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearBill}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500 mr-2"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Clear Bill
          </Button>
          <Button 
            onClick={handleSaveBill}
            className="print:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Bill
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-0 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Tax (₹)</TableHead>
                <TableHead>Total (₹)</TableHead>
                <TableHead className="print:hidden">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billItems.length > 0 ? (
                billItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.medicineName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 print:hidden"
                          onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </Button>
                        <span className="mx-1">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 print:hidden"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>{(item.tax * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>{((item.price + item.tax) * item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="print:hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No items in the bill. Add items from search results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {billItems.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Subtotal:
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{subtotal.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Tax:
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{taxTotal.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Grand Total:
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    ₹{grandTotal.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <Input
                type="text"
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                type="text"
                id="customer-phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
