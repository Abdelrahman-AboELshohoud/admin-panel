import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '../../ui/button'
import { Calendar } from '../../ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui/popover'

import { cn } from '../../../lib/utils'
import { Card, CardContent } from '../../ui/card'
import OrdersTable from './OrdersTable'

type Transaction = {
  id: string
  period: string
  city: string
  carClass: string
  operationType: string
  status: string
  amount: number
}

export default function MoneyTransaction() {
  const [selectedCity, setSelectedCity] = React.useState('Kazan')
  const [selectedCarClass, setSelectedCarClass] = React.useState('All classes of cars')
  const [selectedOperation, setSelectedOperation] = React.useState('All types of operations')
  const [selectedPerformer, setSelectedPerformer] = React.useState('All performers/clients')
  const [dateRange, setDateRange] = React.useState<[Date | undefined, Date | undefined]>([
    undefined,
    undefined,
  ])
  const [selectedDateFilter, setSelectedDateFilter] = React.useState('all')

  const transactions: Transaction[] = [
    {
      id: '1',
      period: '01.01.2023 - 03.02.2023',
      city: 'Kazan',
      carClass: '-',
      operationType: 'Replenishment of the balance',
      status: 'Updated on 02/19/2023 14:18',
      amount: 1000,
    },
    {
      id: '2',
      period: '04.02.2023 - 05.02.2023',
      city: 'Moscow',
      carClass: 'Economy',
      operationType: 'Withdrawal',
      status: 'Updated on 02/20/2023 10:30',
      amount: 500,
    },
  ]

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)

  return (
    <div className="p-6 space-y-6 flex flex-col">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Monetary transactions</h1>
        
        <div className="flex flex-wrap gap-4">
          {[
            { value: selectedCity, onChange: setSelectedCity, placeholder: "Select city", options: [{ value: "Kazan", label: "Kazan" }] },
            { value: selectedCarClass, onChange: setSelectedCarClass, placeholder: "Select car class", options: [{ value: "All classes of cars", label: "All classes of cars" }] },
            { value: selectedOperation, onChange: setSelectedOperation, placeholder: "Select operation type", options: [{ value: "All types of operations", label: "All types of operations" }] },
            { value: selectedPerformer, onChange: setSelectedPerformer, placeholder: "Select performer/client", options: [{ value: "All performers/clients", label: "All performers/clients" }] },
          ].map(({ value, onChange, placeholder, options }) => (
            <Select key={placeholder} onValueChange={onChange} defaultValue={value}>
              <SelectTrigger className="w-[200px] rounded-full h-10 bg-[#282828] text-gray-100 placeholder:text-gray-500 custom-input">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {['all', 'today', 'yesterday', 'june'].map((filter) => (
            <Button
              key={filter}
              // variant={selectedDateFilter === filter ? 'secondary' : 'outline'}
              className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]"
              onClick={() => setSelectedDateFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal text-slate-200 bg-stone-700 hover:bg-stone-800 border-none hover:text-slate-200 select-none">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange[0] && dateRange[1] 
                  ? `${format(dateRange[0], 'dd.MM.yyyy')} - ${format(dateRange[1], 'dd.MM.yyyy')}`
                  : dateRange[0]
                  ? format(dateRange[0], 'dd.MM.yyyy')
                  : 'Pick a date range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange[0]}
                selected={{ from: dateRange[0], to: dateRange[1] }}
                onSelect={(range) => setDateRange([range?.from, range?.to])}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button className="ml-auto">Show</Button>
        </div>
      </div>

      <div className="rounded-lg">
        <OrdersTable />
      </div>

      <Card className='bg-transparent border-none'>
        <CardContent className="flex justify-between items-center py-3 px-5 bg-black rounded-full text-slate-200">
          <span className="font-semibold">Total:</span>
          <span className="text-lg font-bold">${totalAmount}</span>
        </CardContent>
      </Card>
    </div>
  )
}
