import { Input } from '../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

export default function CMCSettings() {
  return (
    <div className="min-h-screen bg-background p-4 flex items-start">
      <Card className="w-1/2 card-shape text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">CMC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="provider" className="block text-sm font-medium text-gray-100">Select CMC Provider</label>
            <Select defaultValue="60">
              <SelectTrigger id="provider" className='custom-input'>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 sec.</SelectItem>
                <SelectItem value="120">120 sec.</SelectItem>
                <SelectItem value="180">180 sec.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="login" className="block text-sm font-medium text-gray-100">Login</label>
            <Input
              id="login"
              placeholder="5 min."
              className="bg-gray-200/20 border-transparent text-black placeholder:text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="5 min."
              className="bg-gray-200/20 border-transparent text-black placeholder:text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signature" className="block text-sm font-medium text-gray-100">Signature</label>
            <Input
              id="signature"
              placeholder="5 min."
              className="bg-gray-200/20 border-transparent text-black placeholder:text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="server" className="block text-sm font-medium text-gray-100">Server Address</label>
            <Input
              id="server"
              placeholder="5 min."
              className="bg-gray-200/20 border-transparent text-black placeholder:text-gray-800"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
