import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentSearches } from "@/lib/storage";
import { formatTimeAgo } from "@/lib/utils";
import { RecentSearch } from "@/types";
import { searchMedicines } from "@/hooks/use-medicines";

export default function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    const searches = getRecentSearches();
    setRecentSearches(searches);
  }, []);

  const handleApplyRecentSearch = async (term: string) => {
    const inputElement = document.getElementById("medicine-search") as HTMLInputElement;
    if (inputElement) {
      inputElement.value = term;
      
      // Trigger a search event
      const searchButton = document.querySelector("button:has(svg[stroke='currentColor'][d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'])");
      if (searchButton) {
        searchButton.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      }
    }
  };

  return (
    <Card className="bg-white shadow rounded-lg mb-8">
      <CardHeader className="px-4 py-5 sm:px-6">
        <CardTitle className="text-lg font-medium text-gray-900">Recent Searches</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-5 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentSearches.length > 0 ? (
            recentSearches.map((search, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-md p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleApplyRecentSearch(search.term)}
              >
                <h3 className="font-medium text-gray-900">{search.term}</h3>
                <p className="text-sm text-gray-500">
                  Searched {formatTimeAgo(search.timestamp)}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-4">
              <p className="text-gray-500">No recent searches found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
