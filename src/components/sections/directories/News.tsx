
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

interface NewsItem {
  name: string
  branch: string
  activityPeriod: string
  status: string
}

export default function News() {
  const [activeTab, setActiveTab] = useState("active")
  const navigate = useNavigate()

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">News</h1>
        <Button className="gap-2 add-button" onClick={() => {
          navigate("/control-panel/directories/add-news")
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
            <NewsTable items={[]} />
          </TabsContent>
          <TabsContent value="blocked" >
            <NewsTable items={[]} />
          </TabsContent>
        </Tabs>

    </div>
  )
}

function NewsTable({ items }: { items: NewsItem[] }) {
  return (
    <div className='card-shape'>
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent border-transparent'>
          <TableHead>Name</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Activity Period</TableHead>
          <TableHead>Status</TableHead>
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
  )
}

