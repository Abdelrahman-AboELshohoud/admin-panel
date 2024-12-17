
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpDown, Pencil } from 'lucide-react'

export default function ClientSettings() {
  return (
    <div className="min-h-screen bg-zinc-900 p-4 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold mb-6">Client Application</h1>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Select defaultValue="demo">
              <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Demo mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demo">Demo mode</SelectItem>
                <SelectItem value="live">Live mode</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch id="unauthorized" />
              <Label htmlFor="unauthorized">Restrict unauthorized client usage</Label>
            </div>
          </div>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label>SMS resend interval</Label>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="60 sec" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 sec</SelectItem>
                      <SelectItem value="60">60 sec</SelectItem>
                      <SelectItem value="90">90 sec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>SMS lifetime</Label>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="5 min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 min</SelectItem>
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="10">10 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Show additional client profile fields</Label>
                  <Select defaultValue="email">
                    <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Email" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="profile" />
                  <Label htmlFor="profile">
                    Require profile completion in mobile app after authorization
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Delivery Welcome Screen</h2>

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label>Request address selection</Label>
                  <Select defaultValue="never">
                    <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Never" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="first">First time only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Welcome header</Label>
                  <Input className="bg-zinc-800 border-zinc-700" placeholder="Enter welcome header" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Order screen text</Label>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea 
                    className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                    defaultValue="ATTENTION! High traffic on roads! We recommend using the 'pre-order' service."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="tips" />
                  <Label htmlFor="tips">Show tips for driver</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="terminal" />
                  <Label htmlFor="terminal">Show "Payment via driver's terminal"</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Block</div>
                <div className="font-medium text-center">Visibility</div>
                <div className="font-medium text-center">Sorting</div>

                {[
                  "Cash",
                  "Bank card",
                  "Quick payment system",
                  "Personal account",
                  "Bonus account",
                  "Terminal",
                  "Corporate balance"
                ].map((item, i) => (
                  <React.Fragment key={i}>
                    <div>{item}</div>
                    <div className="flex justify-center">
                      <Switch />
                    </div>
                    <div className="flex justify-center">
                      <Button variant="ghost" size="icon">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
