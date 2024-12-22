import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { useState } from "react";
import { exportStartups } from "@/app/actions";
import { toast } from 'sonner';
import { Loader2, Download } from "lucide-react";

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: string;
}

const AVAILABLE_COLUMNS = [
  { id: "short_description", label: "Short Description"},
  { id: "description", label: "Description" },
  { id: "email", label: "Email" },
  { id: "linkedin_url", label: "LinkedIn URL" },
  { id: "facebook_url", label: "Facebook URL" },
  { id: "category", label: "Category", filter_param: "category_names" },
  { id: "status", label: "Status", filter_param: "status_names" },
  { id: "priority", label: "Priority", filter_param: "priority_names" },
  { id: "phases", label: "Phases", filter_param: "phases_names" },
  { id: "batch", label: "Batch", filter_param: "batch_names" },
  { id: "members", label: "Members" },
  { id: "advisors", label: "Advisors" },
  { id: "pitch_deck", label: "Pitch Deck" },
  { id: "avatar", label: "Avatar" },
  { id: "all", label: "All" },
];

export default function ExportModal({
  isOpen,
  onClose,
  filters,
}: ExportModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["all"]);
  const [exportAll, setExportAll] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleColumnToggle = (columnId: string) => {
    if (columnId === "all") {
      setSelectedColumns(current => {
        if (!current.includes("all")) {
          return [...current, "all"];
        }
        return current.filter(id => id !== "all");
      });
    } else {
      setSelectedColumns((current) => {
        const withoutAll = current.filter(id => id !== "all");
        return withoutAll.includes(columnId)
          ? withoutAll.filter((id) => id !== columnId)
          : [...withoutAll, columnId]
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await exportStartups(selectedColumns, filters, exportAll);
      
      if (!response.ok) {
        throw new Error(`Export failed with status: ${response.status}`);
      }
      
      // Convert ArrayBuffer to Blob
      const blob = new Blob([response.data], { type: 'text/csv' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `startups-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      onClose(); // Close the modal after successful export
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export startups');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Startups</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h4 className="font-medium">Select columns to export:</h4>
            {AVAILABLE_COLUMNS.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={column.id}
                  checked={
                    column.id === "all" 
                      ? selectedColumns.includes("all") 
                      : selectedColumns.includes(column.id)
                  }
                  onCheckedChange={() => handleColumnToggle(column.id)}
                  disabled={selectedColumns.includes("all") && column.id !== "all"}
                  className="w-5 h-5"
                />
                <Label htmlFor={column.id}>{column.label}</Label>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Export scope:</h4>
            <RadioGroup
              defaultValue={exportAll ? "all" : "filtered"}
              onValueChange={(value: string) => setExportAll(value === "all")}
            >
              <div className="flex items-center space-x-2">
                <Radio value="filtered" id="filtered" />
                <Label htmlFor="filtered">
                  Export filtered startups
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Radio value="all" id="all" />
                <Label htmlFor="all">
                  Export all startups
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedColumns.length === 0 || isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}