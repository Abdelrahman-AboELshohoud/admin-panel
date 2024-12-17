import { useState } from "react"
import { Card, CardContent } from "../../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import Switch from "../../common/Switch"

interface TimeSlot {
  id: number
  startTime: string
  endTime: string
  enabled: boolean
}

export default function SettingsConfig() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: 1, startTime: "00:00", endTime: "07:00", enabled: true },
    { id: 2, startTime: "08:00", endTime: "17:00", enabled: true },
    { id: 3, startTime: "18:00", endTime: "23:00", enabled: true },
    { id: 4, startTime: "20:00", endTime: "06:00", enabled: true },
  ])

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Schedule</h2>
          <p className="text-sm text-gray-400">Schedule settings</p>
        </div>

        <Card className="bg-[#2A2A2A] border-gray-700">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-100">Receiving period</label>
              <Button variant="outline" size="sm" className="text-[#D4AF37] border-[#D4AF37]">
                Add circle
              </Button>
            </div>
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">Circle {slot.id}</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="time"
                      value={slot.startTime}
                      className="bg-[#1E1E1E] border border-gray-700 rounded px-2 py-1 text-sm"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      className="bg-[#1E1E1E] border border-gray-700 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <Switch checked={slot.enabled} disabled={false} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-100">Status of new cars</label>
                <Select defaultValue="active">
                  <SelectTrigger className="w-[200px] bg-[#1E1E1E] border-gray-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Second phone</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Check car for theft</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Add "comfort" field</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Add "premium" field</label>
                <Switch checked={false} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Commission accounting</label>
                <Switch checked={true} disabled={false} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-100">Collect logs</label>
                <div className="flex items-center gap-4">
                  <Input type="number" value="25" className="w-16 bg-[#1E1E1E] border-gray-700" />
                  <Switch checked={true} disabled={false} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Disable auto-search</label>
                <div className="flex items-center gap-4">
                  <Input type="number" value="25" className="w-16 bg-[#1E1E1E] border-gray-700" />
                  <Switch checked={true} disabled={false} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Disable automatic distribution</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Enable "Economy" mode</label>
                <Switch checked={false} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Commission calculation</label>
                <Select defaultValue="percent">
                  <SelectTrigger className="w-[200px] bg-[#1E1E1E] border-gray-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Commission percentage</label>
                <Input type="number" value="15" className="w-16 bg-[#1E1E1E] border-gray-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Notification settings</h3>
              
              <div className="flex items-center justify-between">
                <label className="text-gray-100">New order notifications</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Order status notifications</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Car problem notifications</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Financial transaction notifications</label>
                <Switch checked={true} disabled={false} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2A2A2A] border-gray-700">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Security settings</h3>
              
              <div className="flex items-center justify-between">
                <label className="text-gray-100">Two-factor authentication</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Lock after failed login attempts</label>
                <Switch checked={true} disabled={false} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-100">Automatic logout on inactivity</label>
                <div className="flex items-center gap-4">
                  <Input type="number" value="30" className="w-16 bg-[#1E1E1E] border-gray-700" />
                  <span className="text-sm text-gray-400">min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-[#D4AF37] text-black hover:bg-[#C4A137] px-8">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
