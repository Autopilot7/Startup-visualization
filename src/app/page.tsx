"use client";
import FilterBar from "@/components/dashboard/FilterBar";
import { Suspense, useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, Plus, Download } from "lucide-react";
import Link from "next/link";
import StartupTable, { StartupTableProps } from "@/components/dashboard/StartupTable";
import Title from "@/components/Title";
import { AuthContext } from "@/context/AuthContext";
import { fetchStartups, fetchStartupWithFilters } from "@/app/actions";

export default function Dashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const [startupData, setStartupData] = useState<StartupTableProps['startups']>([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAndSearchedData, setFilteredAndSearchedData] = useState<StartupTableProps['startups']>([]);

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
  useEffect(() => {
    const handleFilterApply = async (event: CustomEvent) => {
      setLoading(true);
      try {
        const data = await fetchStartupWithFilters(event.detail);
        console.log(data.startups);
        setStartupData(data.startups);
      } catch (error) {
        console.error("Error fetching filtered startups:", error);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('applyFilters', ((e: Event) => {
      handleFilterApply(e as CustomEvent);
    }) as EventListener);

    return () => {
      window.removeEventListener('applyFilters', ((e: Event) => {
        handleFilterApply(e as CustomEvent);
      }) as EventListener);
    };
  }, []);

  // Function to format filter display
  const formatFilterDisplay = () => {
    const filterStrings = Object.entries(activeFilters)
      .filter(([_, values]) => values.length > 0 && !values.includes('All'))
      .map(([category, values]) => `${category}: ${values.join(', ')}`);
    
    return filterStrings.length > 0 
      ? filterStrings.join(' • ') 
      : 'No filters applied';
  };

  // Update data when startupData or search changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAndSearchedData(startupData);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Separate startups into priority groups
    const startsWithQuery: typeof startupData = [];
    const containsInName: typeof startupData = [];
    const containsInDescription: typeof startupData = [];

    startupData.forEach(startup => {
      const name = startup.name.toLowerCase();
      const shortDesc = startup.short_description.toLowerCase();
      const longDesc = startup.long_description.toLowerCase();
      
      // Check if already added to a higher priority group to avoid duplicates
      if (name.startsWith(query)) {
        startsWithQuery.push(startup);
      } else if (name.includes(query)) {
        containsInName.push(startup);
      } else if (
        shortDesc.includes(query) || 
        longDesc.includes(query)
      ) {
        containsInDescription.push(startup);
      }
    });

    // Combine all results in priority order
    const searchResults = [
      ...startsWithQuery,
      ...containsInName,
      ...containsInDescription
    ];
    
    setFilteredAndSearchedData(searchResults);
  }, [startupData, searchQuery]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
                  <Button variant="outline">
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
                {filteredAndSearchedData.length} startup{filteredAndSearchedData.length !== 1 ? 's' : ''} found
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
                <DropdownMenuItem>Alphabetically</DropdownMenuItem>
                <DropdownMenuItem>Batch</DropdownMenuItem>
                <DropdownMenuItem>Priority</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <StartupTable startups={filteredAndSearchedData} />
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}