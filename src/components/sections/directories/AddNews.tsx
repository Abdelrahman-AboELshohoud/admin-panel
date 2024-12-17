import { useState } from "react"
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import Switch from "../../common/Switch"
import { Button } from "../../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { cn } from "../../../lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "../../ui/calendar"


export default function AddNewsForm() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [isBlocked, setIsBlocked] = useState(false)


  const renderDateButton = ( {date, placeholder}: {date: Date | undefined, placeholder: string}) => (
    <Button
      variant="outline"
      className={cn(
        "flex justify-start text-left font-normal bg-background w-full",
        !date && "text-muted-foreground"
      )}
    >
      <Calendar className="mr-2 h-4 w-4" />
      {date ? format(date, "dd.MM.yyyy") : placeholder}
    </Button>
  )
  


  return (
    <div className="min-h-screen bg-background p-4 dark">
      <Card className="card-shape w-2/3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add News</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm">
              Title <span className="text-destructive">*</span>
            </label>
            <Input id="title" placeholder="Enter title" className="custom-input" />
          </div>

          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm">
              Branch <span className="text-destructive">*</span>
            </label>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder="Not selected" />
              </SelectTrigger>
              <SelectContent>
                {['Branch 1', 'Branch 2', 'Branch 3'].map((branch, index) => (
                  <SelectItem key={index} value={`branch${index + 1}`}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm">Description</label>
            <Textarea
              id="description"
              placeholder="Write description..."
              className="min-h-[100px] bg-[#121212] resize-none outline-none focus:outline-none select-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Activity Period</label>
            <div className="flex gap-4">
              {['Start date', 'End date'].map((placeholder: string, index) => (
                <Popover key={index} >
                  <PopoverTrigger asChild className="bg-[#121212] hover:bg-[#666]">
                    {renderDateButton({date: index === 0 ? startDate : endDate, placeholder})}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <CalendarComponent
                      mode="single" 
                      selected={index === 0 ? startDate : endDate}
                      onSelect={index === 0 ? setStartDate : setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="push" className="text-sm">Push Notification</label>
            <Textarea
              id="push"
              placeholder="Write push notification..."
              className="min-h-[100px] bg-[#121212] resize-none outline-none focus:outline-none select-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label>Block</label>
              <Switch
                checked={isBlocked}
                // onCheckedChange={setIsBlocked}
                disabled={false}
              />
            </div>
            <button className="bg-primary text-black px-8 w-[100px] hover:bg-primary/80 transition rounded-md py-2">
              Save
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
