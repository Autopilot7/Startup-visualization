"use client"

import FilterBar from "@/components/dashboard/FilterBar"
import { Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, Plus, Download } from "lucide-react"
import StartupTable, { dummyStartupTableProps } from "@/components/dashboard/StartupTable"
import Title from "@/components/Title"

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row min-h-screen">
        <FilterBar />
        <main className="flex-1 p-6 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <Title>Dashboard</Title>
          <div className="flex gap-4">
            <Button>
              <Plus/> Add Startup
            </Button>
            <Button variant="outline">
              <Download/> Export
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              <Button variant="outline" className="font-normal w-full h-10 sm:w-auto">
                Sort By <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>Alphabetically</DropdownMenuItem>
              <DropdownMenuItem>Launch date</DropdownMenuItem>
              <DropdownMenuItem>Priority</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <StartupTable {...dummyStartupTableProps} />
        </Suspense>
        </main>
      </div>
    </div>
  )
}