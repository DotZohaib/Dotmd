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
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medicine } from "@/types";
import { useBill } from "@/hooks/use-bill";
import { downloadMedicinesAsExcel } from "@/lib/excel";

interface SearchResultsProps {
  results: Medicine[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  const { addToBill } = useBill();
  const [isPrinting, setIsPrinting] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Set default quantity of 1 for any new medicines
  useEffect(() => {
    const newQuantities = { ...quantities };
    results.forEach(medicine => {
      if (newQuantities[medicine.name] === undefined) {
        newQuantities[medicine.name] = 1;
      }
    });
    setQuantities(newQuantities);
  }, [results]);
  
  const updateQuantity = (medicineName: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [medicineName]: Math.max(1, newQuantity)
    }));
  };
  
  const getDiscountPercent = (medicine: Medicine) => {
    if (medicine.availability.includes('Discount')) {
      return parseFloat(medicine.availability.replace('Discount ', ''));
    }
    return 0;
  };
  
  const calculateFinalPrice = (medicine: Medicine, quantity: number) => {
    const discountPercent = getDiscountPercent(medicine);
    const discountFactor = (100 - discountPercent) / 100;
    const priceAfterDiscount = medicine.price * discountFactor;
    const taxAmount = medicine.tax > 1 ? medicine.tax : (medicine.price * (medicine.tax / 100));
    const totalWithTax = priceAfterDiscount + taxAmount;
    
    return totalWithTax * quantity;
  };
  
  const handleAddToBill = (medicine: Medicine) => {
    const quantity = quantities[medicine.name] || 1;
    const discountPercent = getDiscountPercent(medicine);
    const discountFactor = (100 - discountPercent) / 100;
    const priceAfterDiscount = medicine.price * discountFactor;
    const taxAmount = medicine.tax > 1 ? medicine.tax : (medicine.price * (medicine.tax / 100));
    
    addToBill({
      medicineName: medicine.name,
      quantity: quantity,
      price: priceAfterDiscount,
      tax: taxAmount,
      total: calculateFinalPrice(medicine, quantity)
    });
  };

  const handlePrintResults = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleDownloadExcel = () => {
    downloadMedicinesAsExcel(results, quantities);
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Search Results
          </span>
        </CardTitle>
        <div className="flex space-x-2 mobile-stack mobile-center">
          <Button 
            className="btn-gradient"
            size="sm"
            onClick={handleDownloadExcel}
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
            variant="outline" 
            size="sm"
            onClick={handlePrintResults}
            className="print:hidden hover:bg-secondary"
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
              className="text-gray-600 mr-2"
            >
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-4 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="font-semibold">Medicine Name</TableHead>
                <TableHead className="font-semibold">Packing</TableHead>
                <TableHead className="font-semibold">Price (₹)</TableHead>
                <TableHead className="font-semibold">Disc (%)</TableHead>
                <TableHead className="font-semibold">Tax (%)</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Final Price (₹)</TableHead>
                <TableHead className="font-semibold print:hidden">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((medicine, index) => (
                  <TableRow key={index} className="table-row-hover">
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.manufacturer}</TableCell>
                    <TableCell>{medicine.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {medicine.availability.includes('Discount') ? 
                        <span className="pill pill-success badge-pulse">
                          {medicine.availability.replace('Discount ', '')}
                        </span> : 
                        <span className="pill bg-gray-100 text-gray-800">
                          0%
                        </span>
                      }
                    </TableCell>
                    <TableCell>{medicine.tax}%</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full"
                          onClick={() => updateQuantity(medicine.name, (quantities[medicine.name] || 1) - 1)}
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
                        <Input 
                          type="number" 
                          value={quantities[medicine.name] || 1} 
                          onChange={(e) => updateQuantity(medicine.name, parseInt(e.target.value) || 1)}
                          className="w-12 h-8 text-center p-0 border-primary/30 focus:border-primary"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full"
                          onClick={() => updateQuantity(medicine.name, (quantities[medicine.name] || 1) + 1)}
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
                    <TableCell className="font-medium text-primary">
                      ₹{calculateFinalPrice(medicine, quantities[medicine.name] || 1).toFixed(2)}
                    </TableCell>
                    <TableCell className="print:hidden">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToBill(medicine)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary border-primary/30"
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
                          className="mr-1"
                        >
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Add to Bill
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
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
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                      <p className="mb-2 text-lg font-medium">No medicines found</p>
                      <p className="text-sm">Try a different search term or upload a medicine database.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {results.length >= 10 && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
              <p className="text-sm font-medium text-primary mb-1">Bulk Order Detected</p>
              <p className="text-xs text-muted-foreground">You have {results.length} items in your results. Special pricing may apply for bulk orders.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
