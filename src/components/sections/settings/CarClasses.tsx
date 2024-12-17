
import { Plus } from 'lucide-react'
import { useState } from "react"

import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'

interface NewsItem {
  name: string
  branch: string
  activityPeriod: string
  status: string
}

export default function CarClasses() {
  const [activeTab, setActiveTab] = useState("active")
  const navigate = useNavigate()

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-gray-100 font-semibold tracking-tight">Car Classes</h1>
        <Button className="gap-2 add-button" onClick={() => {
          navigate("/control-panel/directories/add-car-class")
        }}>
          <Plus className="h-4 w-4" />
          Add news
        </Button>
      </div>


        <Tabs defaultValue="active" className="w-full bg-transparent" onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-transparent">
            <TabsTrigger value="active" className='custom-tabs'>Active</TabsTrigger>
            <TabsTrigger value="blocked" className='custom-tabs'>Blocked</TabsTrigger>
          </TabsList>
          <TabsContent value="active" >
            <CarsTable items={[]} />
          </TabsContent>
          <TabsContent value="blocked" >
            <CarsTable items={[]} />
          </TabsContent>
        </Tabs>

    </div>
  )
}

function CarsTable({ items }: { items: NewsItem[] }) {
  return (
    <div>
      <div className="grid grid-cols-6 gap-6 mb-6 ">
        {['cities', 'types'].map((placeholder, index) => (
          <Select key={index}>
            <SelectTrigger className="col-span-2 h-10 border-none custom-input">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={placeholder.toLowerCase().replace(/\s+/g, '-')}>
                {placeholder}
              </SelectItem>
            </SelectContent>
          </Select>
        ))}
      </div>
    <div className='card-shape'>

    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent border-transparent'>
          <TableHead>Branch and type</TableHead>
          <TableHead>Year of release</TableHead>
          <TableHead>Assign a car</TableHead>
          <TableHead>City</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
            <TableRow className='hover:bg-transparent border-transparent'>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No items found
            </TableCell>
          </TableRow>
        ) : (
            items.map((item, index) => (
                <TableRow key={index} className='hover:bg-transparent border-transparent'>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.branch}</TableCell>
              <TableCell>{item.activityPeriod}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
        </div>
        </div>
  )
}

