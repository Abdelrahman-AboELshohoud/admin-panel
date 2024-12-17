
import { useState } from 'react'
import { Button } from "../../ui/button"
import {  CardContent } from "../../ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/table"
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Branch {
  id: string
  title: string
  sorting: number
  status: 'active' | 'blocked'
}

export default function BranchesManager() {
  const [branches, setBranches] = useState<Branch[]>([
    { id: '1', title: 'Kazan', sorting: 100, status: 'active' }
  ])
  const navigate = useNavigate()
  return (
    <div className="w-full ">
        <div className="text-2xl font-normal flex flex-row justify-between px-2 mb-4 ">Branches
        <Button variant="outline" className="add-button" onClick={() => {
          navigate('/control-panel/directories/add-branch')
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add a new branch
        </Button>
        </div>
      <div>
        <Tabs defaultValue="active" className="w-full bg-transparent">
          <TabsList className="bg-zinc-800 text-zinc-400 border-zinc-700 bg-transparent">
            <TabsTrigger 
              value="active"
              className="custom-tabs"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="blocked"
              className="custom-tabs"
            >
              Blocked
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4  bg-[#1C1C1E] rounded-xl p-4">
            <Table>
              <TableHeader className="">
                <TableRow className="hover:bg-transparent border-zinc-800">
                  <TableHead className="text-zinc-400 font-normal">Title</TableHead>
                  <TableHead className="text-zinc-400 font-normal text-right">Sorting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches
                  .filter(branch => branch.status === 'active')
                  .map(branch => (
                    <TableRow 
                      key={branch.id} 
                      className="hover:bg-zinc-800/50 border-zinc-800"
                    >
                      <TableCell className="text-zinc-100">{branch.title}</TableCell>
                      <TableCell className="text-zinc-100 text-right">{branch.sorting}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="blocked">
            <Table>
              <TableHeader className="bg-zinc-800/50">
                <TableRow className="hover:bg-transparent border-zinc-800">
                  <TableHead className="text-zinc-400 font-normal">Title</TableHead>
                  <TableHead className="text-zinc-400 font-normal text-right">Sorting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches
                  .filter(branch => branch.status === 'blocked')
                  .map(branch => (
                    <TableRow 
                      key={branch.id} 
                      className="hover:bg-zinc-800/50 border-zinc-800"
                    >
                      <TableCell className="text-zinc-100">{branch.title}</TableCell>
                      <TableCell className="text-zinc-100 text-right">{branch.sorting}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

