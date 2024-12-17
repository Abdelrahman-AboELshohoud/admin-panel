
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { useState } from "react"

const notificationSettings = [
  { id: 'dispatcherOrder', label: 'Order created through dispatch' },
  { id: 'orderCreated', label: 'Order created through app' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'preparing', label: 'In Progress' },
  { id: 'ready', label: 'Ready' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'newOrder', label: 'New Order' },
  { id: 'assignedExecutor', label: 'Executor Assigned' },
  { id: 'driverWillStart', label: 'Driver will start after current order' },
  { id: 'newPreliminaryOrder', label: 'New Preliminary Order' },
  { id: 'executorAcceptedOrder', label: 'Executor Accepted Order', defaultValue: 'sms' },
  { id: 'executorArrived', label: 'Executor Arrived', defaultValue: 'sms' },
  { id: 'paidWaiting', label: 'Paid Waiting' },
  { id: 'orderExecution', label: 'Order Execution' },
  { id: 'completedPaid', label: 'Completed and Paid', defaultValue: 'sms' },
  { id: 'orderCancelled', label: 'Order Cancelled', defaultValue: 'push' },
  { id: 'executorRejected', label: 'Executor Rejected Assigned Order' },
  { id: 'executorDelayed', label: 'Executor is Delayed' },
  { id: 'preliminaryOrderExecution', label: 'Preliminary Order Execution' },
  { id: 'overdueOrder', label: 'Overdue Order' },
  { id: 'executorAcceptedPreliminary', label: 'Executor Accepted Preliminary Order' },
  { id: 'executorCancelled', label: 'Executor Cancelled Order' },
  { id: 'driverNotFound', label: 'Driver Not Found' },
  { id: 'cancelledByDriver', label: 'Cancelled by Driver' },
  { id: 'orderedByMistake', label: 'Ordered by Mistake' },
  { id: 'executorRequestedCancel', label: 'Executor Requested Cancellation' },
  { id: 'waitingTooLong', label: 'Waiting Too Long' },
  { id: 'differentVehicle', label: 'Different Vehicle Arrived' },
  { id: 'executorDifferentRoute', label: 'Executor Took Different Route' },
  { id: 'unhappyWithVehicle', label: 'Unhappy with Vehicle Model' },
]

export default function Notifications() {
  const [settings, setSettings] = useState<Record<string, string>>(() => {
    return Object.fromEntries(
      notificationSettings.map(setting => [
        setting.id,
        setting.defaultValue || 'nothing'
      ])
    )
  })

  const handleSave = () => {
    console.log('Saving settings:', settings)
  }

  return (
    <div className="min-h-screen flex flex-col gap-6 px-20">
      <Card className="w-full mx-auto card-shape text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
           Customer Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {notificationSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center  justify-between pr-16"
            >
              <span className="text-sm">{setting.label}</span>
              <Select
                value={settings[setting.id]}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, [setting.id]: value }))
                }
              >
                <SelectTrigger className="w-[200px] custom-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nothing">Nothing</SelectItem>
                  <SelectItem value="sms">SMS to client</SelectItem>
                  <SelectItem value="push">PUSH to client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>
            <Button 
              className="px-6 py-2 bg-[#C2A98B] hover:bg-[#B39B7D] text-black ml-auto " 
              onClick={handleSave}
            >
              Save
            </Button>
    </div>
  )
}

