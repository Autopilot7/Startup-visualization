"use client"

import * as React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { GripVertical } from "lucide-react"

const filterCategories = [
  {
    name: 'Priority',
    options: ['All', 'P1', 'P2', 'P3']
  },
  {
    name: 'Status',
    options: ['All', 'Active', 'Inactive']
  },
  {
    name: "Phase",
    options: ["All", "Ideation", "Incubation", "Acceleration"]
  },
  {
    name: 'Category',
    options: ['All', 'Technology', 'Healthcare', 'Finance', 'Education', 'Others']
  },
  {
    name: "Launch date",
    options: ["All", "AY 2021", "AY 2022", "AY 2023", "AY 2024"]
  }
]

export default function FilterBar() {
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({})
  const [width, setWidth] = React.useState(300)
  const [isResizing, setIsResizing] = React.useState(false)
  const filterBarRef = React.useRef<HTMLDivElement>(null)

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
      setWidth(Math.max(200, Math.min(newWidth, 600)))
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

  return (
    <aside 
      ref={filterBarRef}
      className="bg-background border-r relative"
      style={{ width: `${width}px`, minWidth: '200px', maxWidth: '600px' }}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <Accordion type="multiple" className="w-full">
          {filterCategories.map((category, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2">
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
          ))}
        </Accordion>
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
  )
}
