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
import { useTranslation } from "react-i18next"

const notificationSettings = [
  { id: 'dispatcherOrder', label: 'orderCreatedDispatch' },
  { id: 'orderCreated', label: 'orderCreatedApp' },
  { id: 'accepted', label: 'accepted' },
  { id: 'preparing', label: 'inProgress' },
  { id: 'ready', label: 'ready' },
  { id: 'pickup', label: 'pickup' },
  { id: 'newOrder', label: 'newOrder' },
  { id: 'assignedExecutor', label: 'executorAssigned' },
  { id: 'driverWillStart', label: 'driverWillStart' },
  { id: 'newPreliminaryOrder', label: 'newPreliminaryOrder' },
  { id: 'executorAcceptedOrder', label: 'executorAcceptedOrder', defaultValue: 'sms' },
  { id: 'executorArrived', label: 'executorArrived', defaultValue: 'sms' },
  { id: 'paidWaiting', label: 'paidWaiting' },
  { id: 'orderExecution', label: 'orderExecution' },
  { id: 'completedPaid', label: 'completedPaid', defaultValue: 'sms' },
  { id: 'orderCancelled', label: 'orderCancelled', defaultValue: 'push' },
  { id: 'executorRejected', label: 'executorRejected' },
  { id: 'executorDelayed', label: 'executorDelayed' },
  { id: 'preliminaryOrderExecution', label: 'preliminaryOrderExecution' },
  { id: 'overdueOrder', label: 'overdueOrder' },
  { id: 'executorAcceptedPreliminary', label: 'executorAcceptedPreliminary' },
  { id: 'executorCancelled', label: 'executorCancelled' },
  { id: 'driverNotFound', label: 'driverNotFound' },
  { id: 'cancelledByDriver', label: 'cancelledByDriver' },
  { id: 'orderedByMistake', label: 'orderedByMistake' },
  { id: 'executorRequestedCancel', label: 'executorRequestedCancel' },
  { id: 'waitingTooLong', label: 'waitingTooLong' },
  { id: 'differentVehicle', label: 'differentVehicle' },
  { id: 'executorDifferentRoute', label: 'executorDifferentRoute' },
  { id: 'unhappyWithVehicle', label: 'unhappyWithVehicle' },
]

export default function Notifications() {
  const { t } = useTranslation()
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
            {t('customerNotifications.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {notificationSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between pr-16"
            >
              <span className="text-sm">{t(`customerNotifications.${setting.label}`)}</span>
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
                  <SelectItem value="nothing">{t('customerNotifications.nothing')}</SelectItem>
                  <SelectItem value="sms">{t('customerNotifications.smsToClient')}</SelectItem>
                  <SelectItem value="push">{t('customerNotifications.pushToClient')}</SelectItem>
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
        {t('customerNotifications.save')}
      </Button>
    </div>
  )
}

