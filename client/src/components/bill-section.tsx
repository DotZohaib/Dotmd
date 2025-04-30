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
import { downloadBillAsExcel } from "@/lib/excel";

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
    <Card className="card-gradient mb-8 overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 flex flex-row justify-between items-center bg-muted/30 border-b">
        <CardTitle className="text-lg sm:text-xl font-medium text-primary">
          <span className="inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Current Bill
          </span>
        </CardTitle>
        <div className="flex space-x-2 mobile-stack mobile-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearBill}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Clear
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              if (billItems.length === 0) {
                alert("Bill is empty. Please add items.");
                return;
              }
              
              const currentBill: Bill = {
                ...billDetails,
                id: 'temp-' + Date.now(),
                dateCreated: new Date().toISOString(),
                itemCount: billItems.length,
                items: billItems
              };
              
              downloadBillAsExcel(currentBill);
            }}
            className="print:hidden border-primary/30 text-primary hover:bg-primary/10"
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
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M8 13h2" />
              <path d="M8 17h2" />
              <path d="M14 13h2" />
              <path d="M14 17h2" />
            </svg>
            Download Excel
          </Button>
          <Button 
            onClick={handleSaveBill}
            className="print:hidden btn-gradient"
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
      <CardContent className="px-4 py-4 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="font-semibold">Medicine</TableHead>
                <TableHead className="font-semibold">Packing</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Price (₹)</TableHead>
                <TableHead className="font-semibold">Disc (%)</TableHead>
                <TableHead className="font-semibold">Tax (₹)</TableHead>
                <TableHead className="font-semibold">Total (₹)</TableHead>
                <TableHead className="font-semibold print:hidden">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billItems.length > 0 ? (
                billItems.map((item, index) => (
                  <TableRow key={index} className="table-row-hover">
                    <TableCell className="font-medium">{item.medicineName}</TableCell>
                    <TableCell>{item.packing || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full print:hidden"
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
                        <span className="mx-1 font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full print:hidden"
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
                    <TableCell>
                      {item.discount && item.discount > 0 ? (
                        <span className="pill pill-success badge-pulse">
                          {item.discount}%
                        </span>
                      ) : (
                        <span className="pill bg-gray-100 text-gray-800">0%</span>
                      )}
                    </TableCell>
                    <TableCell>{(item.tax * item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="font-medium text-primary">{((item.price + item.tax) * item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="print:hidden">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive rounded-full"
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
                  <TableCell colSpan={8} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-3 text-muted-foreground/60"
                      >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      <p className="mb-2 text-lg font-medium">Your bill is empty</p>
                      <p className="text-sm">Add items from search results to create a bill.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {billItems.length > 0 && (
              <TableFooter>
                <TableRow className="bg-muted/5 border-t border-muted">
                  <TableCell colSpan={6} className="text-right font-medium">
                    Subtotal:
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{subtotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="print:hidden"></TableCell>
                </TableRow>
                <TableRow className="bg-muted/5">
                  <TableCell colSpan={6} className="text-right font-medium">
                    Tax:
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{taxTotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="print:hidden"></TableCell>
                </TableRow>
                <TableRow className="bg-primary/5 border-t-2 border-primary/20">
                  <TableCell colSpan={6} className="text-right font-bold text-primary">
                    Grand Total:
                  </TableCell>
                  <TableCell className="font-bold text-lg text-primary">
                    ₹{grandTotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="print:hidden"></TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>

        {billItems.length > 0 && (
          <div className="mt-8 print-break-inside-avoid">
            <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
              <h3 className="text-md font-medium text-primary mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customer-name" className="block text-sm font-medium text-foreground/80 mb-1.5">
                    Customer Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="customer-phone" className="block text-sm font-medium text-foreground/80 mb-1.5">
                    Phone Number
                  </label>
                  <Input
                    type="text"
                    id="customer-phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                * Required fields must be filled before printing the bill.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
