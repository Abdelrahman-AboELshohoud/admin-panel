
import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from "../../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Input } from '../../ui/input'

const PushMails = () => {
  const [dateRange, setDateRange] = useState({ start: '08.07.2023', end: '10.07.2023' })

  return (
    <Card className="w-full bg-transparent max-w-4xl  text-white border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Push Mails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 ">
        <div className="flex gap-6">
        {['Today', 'Yesterday', 'June', 'Period'].map((text) => (
        <Button key={text}  className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{text}</span>
        </Button>
      ))}
        <Input
              type="date"
              className="bg-[#1E1E1E] border-none text-white select-none"
              defaultValue="2023-07-08"
              />
            <Input
              type="date"
              className="bg-[#1E1E1E] border-none text-white select-none"
              defaultValue="2023-07-10"
              />
          <Button className="bg-zinc-800">Show</Button>
        </div>

        <Table className='items-center gap-6 p-4 bg-[#1C1C1E] rounded-xl col-span-4'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-none'>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className='hover:bg-transparent border-none'>
              <TableCell className='text-white'>08.07.2023</TableCell>
              <TableCell className='text-white'>Olrus Auto</TableCell>
              <TableCell className='text-white'>All</TableCell>
              <TableCell className='text-white'>10</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default PushMails
