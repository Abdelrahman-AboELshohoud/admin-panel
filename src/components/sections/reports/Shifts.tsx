import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { Button } from "../../ui/button"
import { Calendar } from "../../ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'

interface Employee {
  name: string
  timeOfEntry: string
  exitTime: string
  ipAddress: string
}

export default function Shifts() {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const employees: Employee[] = [
    {
      name: "Ibrahim Mansour Mohamed",
      timeOfEntry: "12.07.2023, 13:19",
      exitTime: "Now on the site",
      ipAddress: "94.25.168.115"
    },
    {
      name: "Gutax Manager",
      timeOfEntry: "12.07.2023, 11:38",
      exitTime: "Now on the site",
      ipAddress: "78.85.38.65"
    },
    {
      name: "Misbakhov Fail Gumarovich",
      timeOfEntry: "12.07.2023, 08:04",
      exitTime: "Now on the site",
      ipAddress: "85.249.29.29"
    }
  ]

  return (
    <div className="min-h-screen border-none text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">{t('shifts.employeeSessionTimeReport')}</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Select defaultValue="kazan">
          <SelectTrigger className="w-[200px] custom-input">
            <SelectValue placeholder={t('shifts.selectLocation')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kazan">{t('shifts.kazan')}</SelectItem>
            <SelectItem value="moscow">{t('shifts.moscow')}</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[200px] custom-input">
            <SelectValue placeholder={t('shifts.selectProfession')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('shifts.allProfessions')}</SelectItem>
            <SelectItem value="developer">{t('shifts.developer')}</SelectItem>
            <SelectItem value="manager">{t('shifts.manager')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{t('shifts.today')}</span>
        </Button>
        <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{t('shifts.yesterday')}</span>
        </Button>
        <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{t('shifts.june')}</span>
        </Button>
        <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{t('shifts.period')}</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-gray-800">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd.MM.yyyy') : t('shifts.startDate')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-gray-800">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd.MM.yyyy') : t('shifts.endDate')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="ml-auto">{t('shifts.orderReport')}</Button>
      </div>

      <div className="p-4 bg-[#1C1C1E] rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-transparent hover:bg-transparent h-12 text-gray-300">
              <TableHead>{t('shifts.employee')}</TableHead>
              <TableHead>{t('shifts.timeOfEntry')}</TableHead>
              <TableHead>{t('shifts.exitTime')}</TableHead>
              <TableHead>{t('shifts.ipAddress')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={index} className="border-transparent hover:bg-transparent pb-4">
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.timeOfEntry}</TableCell>
                <TableCell>{employee.exitTime}</TableCell>
                <TableCell>{employee.ipAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
