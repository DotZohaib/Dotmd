import { useState } from "react";
import { Button } from "@/components/ui/button";
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

  const handleAddToBill = (medicine: Medicine) => {
    addToBill({
      medicineName: medicine.name,
      quantity: 1,
      price: medicine.price,
      tax: medicine.price * (medicine.tax / 100),
      total: medicine.price + (medicine.price * (medicine.tax / 100))
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
    downloadMedicinesAsExcel(results);
  };

  return (
    <Card className="bg-white shadow rounded-lg mb-8">
      <CardHeader className="px-4 py-5 sm:px-6 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium text-gray-900">Search Results</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
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
              className="text-green-600 mr-2"
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
      <CardContent className="px-4 py-0 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Packing</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Disc (%)</TableHead>
                <TableHead>Tax (%)</TableHead>
                <TableHead className="print:hidden">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((medicine, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.manufacturer}</TableCell>
                    <TableCell>{medicine.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {medicine.availability.includes('Discount') ? 
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          {medicine.availability.replace('Discount ', '')}
                        </Badge> : 
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                          0%
                        </Badge>
                      }
                    </TableCell>
                    <TableCell>{medicine.tax}%</TableCell>
                    <TableCell className="print:hidden">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleAddToBill(medicine)}
                        className="text-primary hover:text-primary/90"
                      >
                        Add to Bill
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No medicines found. Try a different search term.
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
