'use client'

import * as React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { GripVertical, SlidersHorizontal } from "lucide-react"
import { filterCategories } from '@/lib/filters'

// Add prop type for onFilterChange
interface FilterBarProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedFilters')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  const [width, setWidth] = React.useState(300)
  const [isResizing, setIsResizing] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(true)
  const [isSmallScreen, setIsSmallScreen] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const filterBarRef = React.useRef<HTMLDivElement>(null)
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOpenItems = localStorage.getItem('openItems')
      return savedOpenItems ? JSON.parse(savedOpenItems) : []
    }
    return []
  })

  React.useEffect(() => {
    localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters))
  }, [selectedFilters])

  React.useEffect(() => {
    localStorage.setItem('openItems', JSON.stringify(openItems))
  }, [openItems])

  console.log(selectedFilters)

  const handleCheckboxChange = (category: string, option: string) => {
    setSelectedFilters(prev => {
      const updatedCategory = prev[category] ? [...prev[category]] : []
      const optionIndex = updatedCategory.indexOf(option)
      
      if (optionIndex > -1) {
        updatedCategory.splice(optionIndex, 1)
      } else {
        updatedCategory.push(option)
      }

      return { ...prev, [category]: updatedCategory }
    })
  }

  const startResizing = React.useCallback((mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true)

    const startWidth = width
    const startX = mouseDownEvent.clientX

    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = startWidth + mouseMoveEvent.clientX - startX
      setWidth(Math.max(250, Math.min(newWidth, 400)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [width])

  React.useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'ew-resize'
    } else {
      document.body.style.cursor = 'default'
    }

    return () => {
      document.body.style.cursor = 'default'
    }
  }, [isResizing])

  const toggleFilterVisibility = () => {
    setIsVisible(!isVisible)
  }

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768) // Adjust this value as needed
      if (isSmallScreen) {
        if (isVisible) {
          toggleFilterVisibility()
        }
      }
      else {
        if (!isVisible) {
          toggleFilterVisibility()
        }
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const resetFilters = () => {
    // Clear localStorage
    localStorage.removeItem('selectedFilters');
    localStorage.removeItem('openItems');
    
    // Clear selected filters state
    setSelectedFilters({});
  
    // Reset accordion open state
    setOpenItems([]);
    
    // Notify parent component
    if (onFilterChange) {
      onFilterChange({});
    }
    
    // Trigger filter reset event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('applyFilters', { 
        detail: '' 
      });
      window.dispatchEvent(event);
    }

    // Close mobile dialog if open
    if (isSmallScreen) {
      setIsDialogOpen(false);
    }
  };

  const handleApplyFilters = () => {
    // Create query parameters from selected filters
    const queryParams = new URLSearchParams();
    
    Object.entries(selectedFilters).forEach(([category, values]) => {
      // Skip if "All" is selected or no values
      if (!values.includes('All') && values.length > 0) {
        // Convert category name to lowercase for API
        const paramName = category.toLowerCase();
        // Join multiple values with commas
        queryParams.append(paramName+"_names", values.join(','));
      }
    });

    // Get the query string
    const filterString = queryParams.toString();
    
    // Call the fetchStartupWithFilters function from the parent component
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('applyFilters', { 
        detail: filterString 
      });
      window.dispatchEvent(event);
    }

    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }

    if (isSmallScreen) {
      setIsDialogOpen(false);
    }
  }

  const toggleAccordionItem = (itemValue: string) => {
    setOpenItems(prev => 
      prev.includes(itemValue) 
        ? prev.filter(value => value !== itemValue) 
        : [...prev, itemValue]
    )
  }

  return (
    <div className="flex">
      {!isSmallScreen && isVisible && (
        <aside 
          ref={filterBarRef}
          className="bg-background border-r relative"
          style={{ width: `${width}px`, minWidth: '250px', maxWidth: '400px' }}
        >
          <div className="flex flex-col h-auto">
            <div className="flex-grow overflow-auto p-4">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <Accordion type="multiple" className="w-full" value={openItems} onValueChange={setOpenItems}>
                {filterCategories.map((category, index) => {
                  const itemValue = `item-${index}`
                  return (
                    <AccordionItem value={itemValue} key={itemValue}>
                      <AccordionTrigger onClick={() => toggleAccordionItem(itemValue)}>
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className={`gap-2 flex ${['Priority', 'Status'].includes(category.name) ? 'flex-row space-x-2' : 'flex-col'}`}>
                          {category.options.map((option, optionIndex) => (
                            <div className="flex items-center space-x-2" key={optionIndex}>
                              <Checkbox 
                                id={`${category.name}-${optionIndex}`}
                                checked={selectedFilters[category.name]?.includes(option)}
                                onCheckedChange={() => handleCheckboxChange(category.name, option)}
                              />
                              <Label 
                                htmlFor={`${category.name}-${optionIndex}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
            <div className="p-4 space-y-2">
              <Button onClick={handleApplyFilters} className="w-full bg-black hover:bg-slate-800 active:bg-slate-700">
                Apply
              </Button>
              <Button 
                onClick={resetFilters} 
                variant="outline" 
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
          <div 
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-gray-300 hover:bg-gray-400 transition-colors"
            onMouseDown={startResizing}
          >
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 p-1">
              <GripVertical size={20} className="text-gray-500" />
            </div>
          </div>
        </aside>
      )}
      {isSmallScreen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTitle className="m-0 font-medium hidden">
            Filter Bar
          </DialogTitle>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 fixed bottom-4 right-4 z-50 rounded-full">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[60vw] max-w-auto h-[90vh] rounded-xl p-0">
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-auto p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <Accordion type="multiple" className="w-full" value={openItems} onValueChange={setOpenItems}>
                  {filterCategories.map((category, index) => {
                    const itemValue = `item-${index}`
                    return (
                      <AccordionItem value={itemValue} key={itemValue}>
                        <AccordionTrigger onClick={() => toggleAccordionItem(itemValue)}>
                          {category.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className={`gap-2 flex ${['Priority', 'Status'].includes(category.name) ? 'flex-row' : 'flex-col'}`}>
                            {category.options.map((option, optionIndex) => (
                              <div className="flex items-center space-x-2" key={optionIndex}>
                                <Checkbox 
                                  id={`${category.name}-${optionIndex}`}
                                  checked={selectedFilters[category.name]?.includes(option)}
                                  onCheckedChange={() => handleCheckboxChange(category.name, option)}
                                />
                                <Label 
                                  htmlFor={`${category.name}-${optionIndex}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
              <div className="p-4 space-y-2">
                <Button onClick={handleApplyFilters} className="w-full bg-black hover:bg-slate-800 active:bg-slate-700">
                  Apply
                </Button>
                <Button 
                  onClick={resetFilters} 
                  variant="outline" 
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
