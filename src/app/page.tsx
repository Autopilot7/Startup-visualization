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
import { filterCategories } from '@/lib/filters';
import { toast } from "sonner";

export default function Dashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const [startupData, setStartupData] = useState<StartupTableProps['startups']>([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filters, setFilters] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const [finalFilterString, setFinalFilterString] = useState("");


  // Sorting handler
  const handleSort = async (param: string) => {
    setLoading(true);
    try {
      // Construct the query string with both filters and sorting
      const searchString = searchQuery ? `name=${searchQuery}` : '';
      const orderingParam = `ordering=${param}`;

      const queryString = [
        filters ? filters : '',
        searchString,
        orderingParam
      ].filter(Boolean).join('&');

      setFinalFilterString(queryString);

      const data = await fetchStartupWithFilters(queryString);
      setStartupData(data.startups);
      setSortOrder(param);
    } catch (error) {
      toast.error(`Error in sort handler: ${error}`);
      console.error(`Error in sort handler: ${error}`);
    } finally {
      setLoading(false);
    }
  }

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

  // Listen for filter apply events
  const handleFilterApply = useCallback(async (event: CustomEvent) => {
    setLoading(true);
    try {
      const newFilters = event.detail;
      setFilters(newFilters);
      
      // Construct the filter string outside of setState
      const searchString = searchQuery ? `name=${searchQuery}` : '';
      const newFiltersAndSearch = newFilters
        ? searchString 
          ? `?${newFilters}&${searchString}`
          : `?${newFilters}`
        : searchString 
          ? `?${searchString}` 
          : '';

      // Fetch data
      setFinalFilterString(newFiltersAndSearch);
      const data = await fetchStartupWithFilters(newFiltersAndSearch);
      setStartupData(data.startups);
    } catch (error) {
      console.error("Error in filter apply handler:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Update the event listener to use 'filterChange' instead of 'applyFilters'
  useEffect(() => {
    window.addEventListener('filterChange', ((e: Event) => handleFilterApply(e as CustomEvent)) as EventListener);
    return () => {
      window.removeEventListener('filterChange', ((e: Event) => handleFilterApply(e as CustomEvent)) as EventListener);
    };
  }, [handleFilterApply]);

  // Function to format filter display
  const formatFilterDisplay = () => {
    const filterStrings = Object.entries(activeFilters)
      .filter(([_, values]) => values.length > 0)
      .map(([category, values]) => {
        // If "All" is selected, show all options for that category
        if (values.includes('All')) {
          const allOptions = filterCategories
            .find(fc => fc.name === category)
            ?.options
            .filter(opt => opt !== 'All') || [];
          return `${category}: ${allOptions.join(', ')}`;
        }
        // Otherwise show selected values
        return `${category}: ${values.join(', ')}`;
      });
    
    return filterStrings.length > 0 
      ? filterStrings.join(' • ') 
      : 'No filters applied';
  };

  // Handle search input change and fetch filtered results
  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);

    try {
      // Construct filtersAndSearch immediately
      const searchString = newSearchQuery ? `search=${newSearchQuery}` : '';
      const newFiltersAndSearch = filters
        ? searchString 
          ? `${filters}&${searchString}`
          : `${filters}`
        : searchString 
          ? `${searchString}` 
          : '';
      console.log("New filters and search: ", newFiltersAndSearch);
      // Fetch with the new search immediately
      setFinalFilterString(newFiltersAndSearch);
      const data = await fetchStartupWithFilters(newFiltersAndSearch);
      setStartupData(data.startups);
    } catch (error) {
      console.error("Error fetching filtered startups:", error);
    } finally {
      setLoading(false);
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
                  <Button 
                    variant="outline" 
                    onClick={() => setIsExportModalOpen(true)}
                  >
                    <Download /> Export
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 flex sm:justify-end items-center">
              {isAuthenticated && (
                <span className="text-gray-600 text-xl">Welcome, Elab!</span>
              )}
            </div>
          </div>
          <div className="mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {startupData.length} startup{startupData.length !== 1 ? 's' : ''} found
              </span>
              <span>•</span>
              <span className="italic">
                {formatFilterDisplay()}
              </span>
              {searchQuery && (
                <>
                  <span>•</span>
                  <span className="italic">
                    Search: "{searchQuery}"
                  </span>
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
                  onClick={() => handleSort('name')}
                  className="flex justify-between items-center"
                >
                  Alphabetically
                  {sortOrder === 'name' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSort('batch_name')}
                  className="flex justify-between items-center"
                >
                  Batch
                  {sortOrder === 'batch_name' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSort('priority_name')}
                  className="flex justify-between items-center"
                >
                  Priority
                  {sortOrder === 'priority_name' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <StartupTable startups={startupData} />
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