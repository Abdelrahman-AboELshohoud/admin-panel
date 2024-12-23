import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface VehicleFormData {
  branch: string
  make: string
  model: string
  year: string
  class: string
}

const MOCK_DATA = {
  branches: ['Any', 'North', 'South', 'East', 'West'],
  makes: ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes'],
  models: {
    Toyota: ['Camry', 'Corolla', 'RAV4'],
    Honda: ['Civic', 'Accord', 'CR-V'],
    Ford: ['F-150', 'Mustang', 'Explorer'],
    BMW: ['3 Series', '5 Series', 'X5'],
    Mercedes: ['C-Class', 'E-Class', 'GLC'],
  },
  years: Array.from({ length: 30 }, (_, i) => (2024 - i).toString()),
  classes: ['Economy', 'Business', 'Premium', 'Luxury']
}

interface FormSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
}

function FormSelect({ label, value, onChange, options, placeholder }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-200">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full custom-input">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function AddClass() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<VehicleFormData>({
    branch: '',
    make: '',
    model: '',
    year: '',
    class: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const availableModels = formData.make ? MOCK_DATA.models[formData.make as keyof typeof MOCK_DATA.models] : []

  return (
    <div className="min-h-screen bg-transparent flex flex-col p-4">
      <h1 className="text-2xl font-bold text-white mb-6">{t('addVehicle.title')}</h1>
      <Card className="w-2/3 card-shape">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormSelect
              label={t('addVehicle.branch')}
              value={formData.branch}
              onChange={(value) => setFormData(prev => ({ ...prev, branch: value }))}
              options={MOCK_DATA.branches}
              placeholder={t('addVehicle.any')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label={t('addVehicle.brand')}
                value={formData.make}
                onChange={(value) => setFormData(prev => ({ ...prev, make: value, model: '' }))}
                options={MOCK_DATA.makes}
                placeholder={t('addVehicle.selectBrand')}
              />
              <FormSelect
                label={t('addVehicle.type')}
                value={formData.model}
                onChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                options={availableModels}
                placeholder={t('addVehicle.selectType')}
              />
            </div>
            <FormSelect
              label={t('addVehicle.year')}
              value={formData.year}
              onChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
              options={MOCK_DATA.years}
              placeholder={t('addVehicle.any')}
            />
            <FormSelect
              label={t('addVehicle.class')}
              value={formData.class}
              onChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
              options={MOCK_DATA.classes}
              placeholder={t('addVehicle.selectClass')}
            />
            <Button 
              type="submit" 
              className="px-6 py-2 ml-auto mt-2 bg-primary hover:bg-primary/80 text-black hover:text-white transition"
            >
              {t('addVehicle.save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
};