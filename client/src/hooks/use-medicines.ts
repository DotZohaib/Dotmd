import { useState, useEffect } from "react";
import { Medicine } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const useMedicinesData = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/medicines');
      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast({
        title: "Failed to load medicines",
        description: "Please try again or check your connection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return { medicines, isLoading, refetch: fetchMedicines };
};

// Function to search medicines from API
export const searchMedicines = async (query: string, suggestionsOnly: boolean = false): Promise<Medicine[]> => {
  try {
    const endpoint = suggestionsOnly 
      ? `/api/medicines/suggestions?query=${encodeURIComponent(query)}` 
      : `/api/medicines/search?query=${encodeURIComponent(query)}`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching medicines:', error);
    return [];
  }
};

export default useMedicinesData;
