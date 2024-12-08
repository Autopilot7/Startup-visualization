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
import { fetchStartups } from "@/app/actions";

export default function Dashboard({ startups }: StartupTableProps) {
  const { isAuthenticated } = useContext(AuthContext);
  const [startupData, setStartupData] = useState<StartupTableProps['startups']>([]);
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const loadStartups = async () => {
      try {
        const data = await fetchStartups();
        setStartupData(data.startups);
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadStartups();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row min-h-screen">
        <FilterBar />
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
            <div className="flex-1 flex sm:justify-end items-center mr-5">
              {isAuthenticated && (
                <span className="text-gray-600 text-xl">Welcome, Elab!</span>
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
            <div>Loading...</div> // Show loading state
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <StartupTable startups={startupData} />
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}