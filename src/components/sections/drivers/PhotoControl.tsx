
import React from "react"
import { Button } from "../../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { useNavigate } from "react-router-dom"

type TabValue = "active" | "blocked" | "reports"
type Period = "shift-start" | "24h" | "week" | "month"

interface PhotoControlEntry {
  profession: string
  carClass: string
  city: string
}

export default function PhotoControl() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6 bg-background text-foreground min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Photo control</h1>
        <Button variant="outline" size="sm" className="add-button border-none" onClick={() => {
          navigate("/control-panel/drivers-photo-control/add-photo")
        }}>
          <Plus className="h-4 w-4 mr-2 bg-transparent" />
          Add photo control
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList  className="bg-transparent hover:bg-transparent mb-6 ">
          <TabsTrigger value="active"  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary">Active</TabsTrigger>
          <TabsTrigger value="blocked"  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary">Blocked</TabsTrigger>
          <TabsTrigger value="reports"  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary">Reports</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select>
          <SelectTrigger className="custom-input">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            {["All cities", "New York", "London", "Paris"].map((city) => (
              <SelectItem key={city} value={city.toLowerCase().replace(" ", "-")}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="custom-input">
            <SelectValue placeholder="Profession" />
          </SelectTrigger>
          <SelectContent>
            {["Driver", "Courier", "Delivery"].map((profession) => (
              <SelectItem key={profession} value={profession.toLowerCase()}>
                {profession}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="custom-input">
            <SelectValue placeholder="Car class" />
          </SelectTrigger>
          <SelectContent>
            {["Economy", "Comfort", "Business", "Premium"].map((carClass) => (
              <SelectItem key={carClass} value={carClass.toLowerCase()}>
                {carClass}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="custom-input">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            {[
              { value: "shift-start", label: "At the start of the shift" },
              { value: "24h", label: "Every 24 hours" },
              { value: "week", label: "Every week" },
              { value: "month", label: "Every month" },
            ].map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader className="bg-transparent hover:bg-transparent">
          <TableRow className="bg-transparent hover:bg-transparent">
            <TableHead>Profession</TableHead>
            <TableHead>Car class</TableHead>
            <TableHead>City</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Add table rows here when you have data */}
        </TableBody>
      </Table>
    </div>
  )
}
