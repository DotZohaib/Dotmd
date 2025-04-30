import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Medicine } from "@/types";
import { searchMedicines } from "@/hooks/use-medicines";
import { saveRecentSearch, getRecentSearches } from "@/lib/storage";

interface MedicineSearchProps {
  onSearch: (results: Medicine[]) => void;
}

export default function MedicineSearch({ onSearch }: MedicineSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const popularSearches = ["Paracetamol", "Aspirin", "Vitamin C"];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchMedicines(searchTerm);
      onSearch(results);
      saveRecentSearch(searchTerm);
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error searching medicines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 1) {
      try {
        const results = await searchMedicines(value, true);
        const suggestionTerms = results.map(med => med.name);
        setSuggestions(suggestionTerms);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    
    // Search for the specific medicine that was clicked
    setIsLoading(true);
    try {
      // Get all medicines that match the search term
      const results = await searchMedicines(suggestion);
      
      // Only show the exact medicine that was clicked (exact name match)
      const exactMatch = results.find(med => med.name === suggestion);
      
      if (exactMatch) {
        // If we found an exact match, only show that one
        onSearch([exactMatch]);
      } else if (results.length > 0) {
        // If no exact match but we have results, just show the first one
        onSearch([results[0]]);
      } else {
        // No results found
        onSearch([]);
      }
      
      saveRecentSearch(suggestion);
    } catch (error) {
      console.error("Error searching for specific medicine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchTerm(term);
    handleSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-8">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Medicine Information</h1>
            <p className="text-gray-600 mb-4">
              Search for medicine names to get complete information including price, tax, and availability.
            </p>
            
            <div className="relative" ref={suggestionsRef}>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                  <Input
                    type="text"
                    id="medicine-search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    placeholder="Search medicine name..."
                    className="block w-full rounded-none rounded-l-md pl-4 border-gray-300"
                  />
                  
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-md border border-gray-300 mt-1 max-h-60 overflow-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="relative inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                  <span>Search</span>
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {popularSearches.map((term, index) => (
                <span
                  key={index}
                  onClick={() => handlePopularSearchClick(term)}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
                >
                  Popular: {term}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-48 text-primary/20"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M3 9h6" />
              <path d="M3 15h6" />
              <path d="M15 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0" />
              <path d="M18 17v.01" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
