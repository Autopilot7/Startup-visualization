"use client";
import FilterBar from "@/components/dashboard/FilterBar";
import { Suspense, useContext, useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, Plus, Download, Check } from "lucide-react";
import Link from "next/link";
import StartupTable, { StartupTableProps } from "@/components/dashboard/StartupTable";
import Title from "@/components/Title";
import { AuthContext } from "@/context/AuthContext";
import { fetchStartups, fetchStartupWithFilters } from "@/app/actions";
import ExportModal from "@/components/dashboard/ExportModal";
import { filterCategories } from "@/lib/filters";
import { toast } from "sonner";

export default function Dashboard() {
  const { isAuthenticated } = useContext(AuthContext);

  // Startups data, loading states, and modal
  const [startupData, setStartupData] = useState<StartupTableProps["startups"]>([]);
  const [loading, setLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filter states
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [filters, setFilters] = useState("");

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Sorting
  const [sortOrder, setSortOrder] = useState("name");

  // For debug or export
  const [finalFilterString, setFinalFilterString] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600); // 600 ms delay for debouncing
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Combined data fetch function
  const fetchCombinedData = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const queryParts: string[] = [];
      if (filters) queryParts.push(filters);
      if (debouncedSearchQuery) queryParts.push(`name=${debouncedSearchQuery}`);
      if (sortOrder) queryParts.push(`ordering=${sortOrder}`);
      queryParts.push(`page=${pageNum}`);

      const fullQueryString = queryParts.join("&");
      const data = await fetchStartupWithFilters(fullQueryString);
      
      if (pageNum === 1) {
        setStartupData(data.startups);
      } else {
        setStartupData(prev => [...prev, ...data.startups]);
      }
      
      setHasMore(data.next !== null);
      setTotalCount(data.count);
    } catch (error) {
      toast.error(`Error fetching data: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearchQuery, sortOrder]);

  // Update the useEffect that watches filter changes
  useEffect(() => {
    setPage(1); // Reset page when filters change
    fetchCombinedData(1);
  }, [filters, debouncedSearchQuery, sortOrder, fetchCombinedData]);

  // Add new useEffect for page changes
  useEffect(() => {
    if (page > 1) { // Only fetch if it's not the first page
      fetchCombinedData(page);
    }
  }, [page, fetchCombinedData]);

  // Initial load of startups
  useEffect(() => {
    const loadStartups = async () => {
      try {
        const data = await fetchStartups();
        setStartupData(data.startups);
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStartups();
  }, []);

  // Handle sorting by just updating state
  const handleSort = (param: string) => {
    setSortOrder(param);
  };

  // Handle search by just updating local search state
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Listen for filter change events
  const handleFilterApply = useCallback((event: CustomEvent) => {
    const newFilters = event.detail;
    setFilters(newFilters);
    console.log("Filter applied:", newFilters);
  }, []);

  // Listen for the 'filterChange' event
  useEffect(() => {
    const wrappedListener = (e: Event) => handleFilterApply(e as CustomEvent);
    window.addEventListener("filterChange", wrappedListener as EventListener);
    return () => {
      window.removeEventListener("filterChange", wrappedListener as EventListener);
    };
  }, [handleFilterApply]);

  // Function to format filter display
  const formatFilterDisplay = () => {
    const filterStrings = Object.entries(activeFilters)
      .filter(([_, values]) => values.length > 0)
      .map(([category, values]) => {
        if (values.includes("All")) {
          const allOptions =
            filterCategories
              .find((fc) => fc.name === category)
              ?.options.filter((opt) => opt !== "All") || [];
          return `${category}: ${allOptions.join(", ")}`;
        }
        return `${category}: ${values.join(", ")}`;
      });

    return filterStrings.length > 0 ? filterStrings.join(" • ") : "No filters applied";
  };

  // Update handleLoadMore
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row min-h-screen">
        <FilterBar onFilterChange={setActiveFilters} />
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row justify-items-start gap-4 mb-6">
            <Title>Dashboard</Title>
            <div className="flex gap-4">
              {isAuthenticated && (
                <div className="flex gap-4">
                  <Link href="/addstartup">
                    <Button className="bg-sky-500 hover:bg-sky-600 active:bg-blue-700">
                      <Plus /> Add Startup
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
                    <Download /> Export
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 flex sm:justify-end items-center">
              {isAuthenticated && <span className="text-gray-600 text-xl">Welcome, Elab!</span>}
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {startupData.length} of {totalCount} startup{totalCount !== 1 ? "s" : ""} found
              </span>
              <span>•</span>
              <span className="italic">{formatFilterDisplay()}</span>
              {searchQuery && (
                <>
                  <span>•</span>
                  <span className="italic">Search: &quot;{searchQuery}&quot;</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-4 mb-6">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search startups..."
                className="font-normal pl-10 w-full h-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="font-normal h-10 w-auto">
                  Sort By <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem
                  onClick={() => handleSort("name")}
                  className="flex justify-between items-center"
                >
                  Alphabetically
                  {sortOrder === "name" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSort("batch__name")}
                  className="flex justify-between items-center"
                >
                  Batch
                  {sortOrder === "batch__name" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSort("priority__name")}
                  className="flex justify-between items-center"
                >
                  Priority
                  {sortOrder === "priority__name" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <StartupTable 
                startups={startupData} 
                hasMore={hasMore} 
                onLoadMore={handleLoadMore} 
              />
            </Suspense>
          )}
        </main>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filters={finalFilterString}
      />
    </div>
  );
}