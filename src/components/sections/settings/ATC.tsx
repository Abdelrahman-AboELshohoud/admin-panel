
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'

export default function ATC() {
  return (

      <Card className="card-shape text-gray-100 w-1/2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">External ATS</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <label htmlFor="ats-provider" className="text-sm font-medium">List of ATS Providers</label>
            <Select defaultValue="disabled">
              <SelectTrigger id="ats-provider" className='custom-input'>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">Disable</SelectItem>
                <SelectItem value="custom">Custom ATS</SelectItem>
                <SelectItem value="runtel">Runtel</SelectItem>
                <SelectItem value="sms">SMS-center</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="runtel-new">Runtel New</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-1/3 ml-auto bg-primary hover:bg-primary/80 text-white" 
            size="lg"
          >
            Save
          </Button>
        </CardContent>
      </Card>
  )
}
