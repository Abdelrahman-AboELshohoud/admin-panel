import React from 'react'
import { Button } from '../../ui/button'
import { Pencil, Plus, X } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { useNavigate } from 'react-router-dom'

interface Address {
  name: string
  address: string
}

export default function Addresses() {
  const addresses: Address[] = [
    { name: 'John Doe', address: '123 Main St' },
    { name: 'Jane Smith', address: '456 Elm St' },
  ]
  const navigate = useNavigate()


  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Addresses</h1>
        <Button variant="outline" onClick={() => {
          navigate("/control-panel/directories/add-address")
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add address
        </Button>
      </div>
<div className='card-shape p-4 text-white'>

      <Table>
        <TableHeader>
          <TableRow className='border-transparent hover:bg-transparent'>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address, index) => (
            <TableRow key={index} className='border-transparent hover:bg-transparent'>
              <TableCell>{address.name}</TableCell>
              <TableCell>{address.address}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-3xl">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-black bg-red-500 hover:bg-red-600 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
</div>
    </div>
  )
}
