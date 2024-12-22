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
];

export default function ExportModal({
  isOpen,
  onClose,
  filters,
}: ExportModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["name"]);
  const [exportAll, setExportAll] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((current) =>
      current.includes(columnId)
        ? current.filter((id) => id !== columnId)
        : [...current, columnId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportStartups(selectedColumns, filters, exportAll);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      // Could add error handling UI here
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
                  checked={selectedColumns.includes(column.id)}
                  onCheckedChange={() => handleColumnToggle(column.id)}
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
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}