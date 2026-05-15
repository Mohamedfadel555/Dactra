import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePerceptionAPI } from "./../api/perceptionAPI";

export function useMedicineSearch(delay = 400) {
  const { searchMedicines } = usePerceptionAPI();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ["medicines", "search", debouncedQuery],
    queryFn: () => searchMedicines(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
    placeholderData: [],
  });

  const updateQuery = useCallback((val) => setQuery(val), []);
  const clearQuery = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return { query, updateQuery, clearQuery, suggestions, isFetching };
}
