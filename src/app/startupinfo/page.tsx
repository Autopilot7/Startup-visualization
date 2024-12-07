"use client";
import { StartupInfo } from "@/components/Startupinfo";
import Title from "@/components/Title";  // Import Title component nếu cần thiết
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import FilterBar from "@/components/dashboard/FilterBar"


export default function Startupinfo() {
  return (
    <div className="center">
        <div className=" flex flex-row justify-center">
            <StartupInfo/> {/* Truyền type là "create" */}
        </div>
    </div>
  )
}
