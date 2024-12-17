
import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from "../../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Input } from '../../ui/input'

const ForPartner = () => {
  const [dateRange, setDateRange] = useState({ start: '08.07.2023', end: '10.07.2023' })

  return (
    <Card className="w-full bg-transparent max-w-4xl  text-white border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">For Partner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 ">
        <div className=" gap-4 grid grid-cols-6">
          {[
  {
    defaultValue: "kazan",
    placeholder: "Select city",
    options: [
      { value: "kazan", label: "Kazan" },
    ]
  },
  {
    defaultValue: "olrusAuto",
    placeholder: "Select partner",
    options: [
      { value: "olrusAuto", label: "Olrus Auto" },
    ]
  },
  {
    defaultValue: "allPaymentTypes",
    placeholder: "Select payment type",
    options: [
      { value: "allPaymentTypes", label: "All payment types" },
    ]
  }
].map((select, index) => (
  <Select key={index} defaultValue={select.defaultValue}>
    <SelectTrigger className="w-full custom-input col-span-2">
      <SelectValue placeholder={select.placeholder} />
    </SelectTrigger>
    <SelectContent>
      {select.options.map(option => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
))}
        </div>

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
          <Button className="bg-zinc-800">Order report</Button>
        </div>

        <Table className='items-center gap-6 p-4 bg-[#1C1C1E] rounded-xl col-span-4'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-none'>
              <TableHead>Period</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Number of executors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className='hover:bg-transparent'>
              <TableCell>09.07.2023 - 09.07.2023</TableCell>
              <TableCell>Kazan</TableCell>
              <TableCell>-</TableCell>
              <TableCell>0</TableCell>
              <TableCell>1</TableCell>
              <TableCell>Current as of 10.07.2023 22:32</TableCell>
              <TableCell className='flex gap-2 items-center'>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700">
                      <X className="h-4 w-4" />
                    </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ForPartner
