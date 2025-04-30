import { useState } from "react";
import MedicineSearch from "@/components/medicine-search";
import SearchResults from "@/components/search-results";
import BillSection from "@/components/bill-section";
import RecentSearches from "@/components/recent-searches";
import RecentBills from "@/components/recent-bills";
import PrintBill from "@/components/print-bill";
import { Medicine } from "@/types";
import { useBill } from "@/hooks/use-bill";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { billItems, showBill, billDetails } = useBill();
  const [selectedForPrint, setSelectedForPrint] = useState<boolean>(false);

  const handleSearch = (results: Medicine[]) => {
    // Only update search results and show them if we have results
    if (results && results.length > 0) {
      setSearchResults(results);
      setShowResults(true);
    } else {
      // If no results, show a message or handle accordingly
      setShowResults(false);
    }
  };

  const handlePrintBill = () => {
    setSelectedForPrint(true);
    setTimeout(() => {
      window.print();
      setSelectedForPrint(false);
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MedicineSearch onSearch={handleSearch} />
      
      {showResults && (
        <SearchResults 
          results={searchResults} 
        />
      )}
      
      {showBill && (
        <BillSection 
          onPrintBill={handlePrintBill}
        />
      )}
      
      <RecentSearches />
      
      <RecentBills />
      
      <div className="hidden print:block">
        {selectedForPrint && <PrintBill />}
      </div>
    </div>
  );
}
