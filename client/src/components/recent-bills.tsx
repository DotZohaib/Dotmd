import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bill } from "@/types";
import { getBillsFromStorage } from "@/lib/storage";
import { useBill } from "@/hooks/use-bill";

export default function RecentBills() {
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const { loadBillFromHistory } = useBill();

  useEffect(() => {
    const bills = getBillsFromStorage();
    // Take only the last 5 bills
    setRecentBills(bills.slice(0, 5));
  }, []);

  const handlePrintBill = (bill: Bill) => {
    loadBillFromHistory(bill);
    setTimeout(() => {
      document.getElementById("print-bill-button")?.click();
    }, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-white shadow rounded-lg">
      <CardHeader className="px-4 py-5 sm:px-6">
        <CardTitle className="text-lg font-medium text-gray-900">Recent Bills</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-5 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total (₹)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBills.length > 0 ? (
                recentBills.map((bill, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>{formatDate(bill.dateCreated)}</TableCell>
                    <TableCell>{bill.itemCount}</TableCell>
                    <TableCell>₹{bill.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/90"
                          onClick={() => handlePrintBill(bill)}
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
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/90"
                          onClick={() => loadBillFromHistory(bill)}
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
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No recent bills found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
