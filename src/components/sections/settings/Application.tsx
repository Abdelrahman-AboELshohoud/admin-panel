import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Button } from '../../ui/button'
import { Pencil } from 'lucide-react'
import Switch from '../../common/Switch'

interface PaymentMethod {
  id: string
  name: string
  visible: boolean
}

export default function Application() {
  const [demoMode, setDemoMode] = useState(false)
  const [restrictUnauthorized, setRestrictUnauthorized] = useState(false)
  const [smsResendInterval, setSmsResendInterval] = useState('60')
  const [smsLifetime, setSmsLifetime] = useState('5')
  const [additionalFields, setAdditionalFields] = useState('email')
  const [requireProfile, setRequireProfile] = useState(false)
  const [addressRequest, setAddressRequest] = useState('never')
  const [welcomeTitle, setWelcomeTitle] = useState('')
  const [welcomeText, setWelcomeText] = useState('')
  const [showDriverTips, setShowDriverTips] = useState(false)
  const [showDriverTerminal, setShowDriverTerminal] = useState(false)
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'cash', name: 'Cash', visible: true },
    { id: 'card', name: 'Bank Card', visible: true },
    { id: 'fast', name: 'Fast Payment System', visible: false },
    { id: 'personal', name: 'Personal Account', visible: true },
    { id: 'bonus', name: 'Bonus Account', visible: true },
    { id: 'terminal', name: 'Terminal', visible: true },
    { id: 'corporate', name: 'Corporate Balance', visible: true },
  ])

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id ? { ...method, visible: !method.visible } : method
      )
    )
  }

  const [orderScreenText, setOrderScreenText] = useState(
    'ATTENTION! High traffic on roads! We recommend using the "pre-order" service.'
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className='card-shape border-none text-gray-100'>
        <CardHeader>
          <CardTitle className='text-2xl'>Application for clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="demo-mode">Demo Mode</label>
            <Select value={demoMode ? 'enabled' : 'disabled'} onValueChange={(v: string) => setDemoMode(v === 'enabled')}>
              <SelectTrigger className="w-[180px] custom-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="restrict">Restrict unauthorized clients</label>
            <Switch
            disabled={!restrictUnauthorized}
              checked={restrictUnauthorized}
            />
          </div>

          <div className="space-y-4">
            {[
              { label: 'SMS Resend Interval', value: smsResendInterval, onChange: setSmsResendInterval, options: [30, 60, 90] },
              { label: 'SMS Lifetime', value: smsLifetime, onChange: setSmsLifetime, options: [3, 5, 10] }
            ].map(({ label, value, onChange, options }) => (
              <div key={label} className="flex items-center justify-between">
                <label>{label}</label>
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="w-[180px] custom-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(opt => (
                      <SelectItem key={opt} value={opt.toString()}>{opt} {label.includes('Interval') ? 'sec' : 'min'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label>Show Additional Profile Fields</label>
              <Select value={additionalFields} onValueChange={setAdditionalFields}>
                <SelectTrigger className="w-[180px] custom-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label>Require Profile Completion</label>
              <Switch
              disabled={!requireProfile}
                checked={requireProfile}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='card-shape border-none text-gray-100'>
        <CardHeader>
          <CardTitle className='text-lg'>Welcome Screen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <label>Address Request</label>
            <Select value={addressRequest} onValueChange={setAddressRequest}>
              <SelectTrigger className='custom-input w-1/2'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="first">First Visit</SelectItem>
                <SelectItem value="always">Always</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Welcome Title</label>
            <Input
              value={welcomeTitle}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) => setWelcomeTitle(e.target.value)}
              placeholder="Enter welcome title"
            />
          </div>

          <div className="space-y-2">
            <label>Welcome Text</label>
            <Textarea 
              value={welcomeText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWelcomeText(e.target.value)}
              placeholder="Enter welcome message"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label>Show Driver Tips</label>
              <Switch
              disabled={!showDriverTips}
                checked={showDriverTips}
              />
            </div>

            <div className="flex items-center justify-between">
              <label>Show Driver Terminal Payment</label>
              <Switch
              disabled
                checked={showDriverTerminal}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='card-shape border-none text-gray-100'>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Order Screen Text

          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea className='min-h-[100px]'
             value={orderScreenText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrderScreenText(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className='card-shape border-none text-gray-100'>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between py-2">
                <span>{method.name}</span>
                <div className="flex items-center gap-4">
                  <Switch
                  disabled
                    checked={method.visible}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
