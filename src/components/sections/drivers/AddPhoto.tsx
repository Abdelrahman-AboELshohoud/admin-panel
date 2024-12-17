
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import Switch from '../../common/Switch'
import { useNavigate } from 'react-router-dom'


type PhotoRequirement = {
  id: string;
  label: string;
}

type FormSelectProps = {
  label: string;
  options: { value: string; label: string }[];
  defaultValue: string;
  onChange: (value: string) => void;
}

type PhotoSettings = {
  [key: string]: boolean;
}

const photoRequirements: PhotoRequirement[] = [
  { id: 'front', label: 'In front, so that the state number is visible' },
  { id: 'back', label: 'The back part so that the state is visible' },
  { id: 'right', label: 'Right side' },
  { id: 'left', label: 'Left side' },
  { id: 'cabin-front', label: 'The front of the cabin' },
  { id: 'cabin-back', label: 'The back of the cabin' },
  { id: 'trunk', label: 'Trunk' },
  { id: 'documents', label: 'Documents' },
]

const FormSelect: React.FC<FormSelectProps> = ({ label, options, defaultValue, onChange }) => (
  <div className="flex justify-between">
    <label className="text-sm text-zinc-400">{label}</label>
    <Select defaultValue={defaultValue} >
      <SelectTrigger className="w-2/3 bg-zinc-900 border-none text-slate-200 select-none rounded-full">
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

export default function DriverForm() {
  const [photoSettings, setPhotoSettings] = useState({})
  const navigate = useNavigate()
  

  // const handlePhotoToggle = (id: string) => {
  //   setPhotoSettings(prev => ({ ...prev, [id]: !prev[id] }))
  // }
  const formSelects = [
    {
      label: "City",
      options: [{ value: 'kazan', label: 'Kazan' }],
      defaultValue: "kazan"
    },
    {
      label: "Profession",
      options: [{ value: 'taxi', label: 'Taxi driver' }],
      defaultValue: "taxi"
    },
    {
      label: "Car class",
      options: [{ value: 'business', label: 'Business' }],
      defaultValue: "business"
    },
    {
      label: "Period",
      options: [
        { value: 'shift-start', label: 'At the start of the shift' },
        { value: '24h', label: 'Every 24 hours' },
        { value: 'weekly', label: 'Every week' },
        { value: 'monthly', label: 'Every month' },
      ],
      defaultValue: "shift-start"
    }
  ];

  const handleSelectChange = (label: string, value: string) => {
    setPhotoSettings(prev => ({ ...prev, [label]: value }))
  }

  return (
    <div className="min-h-screen mr-auto text-zinc-100 p-4">
      <Card className="max-w-2xl  bg-zinc-800 border-none flex flex-col w-2/3">
        <CardContent className="p-6 flex flex-col">

          <h1 className="text-2xl font-semibold mb-6 text-slate-200">Add</h1>
          
          <div className="space-y-6">


            {formSelects.map((select, index) => (
              <FormSelect
                key={index}
                label={select.label}
                options={select.options}
                defaultValue={select.defaultValue}
                onChange={(value) => handleSelectChange(select.label.toLowerCase(), value)}
              />
            ))}

            <div className="space-y-4">
              <label className="text-sm text-zinc-400">Which photos should I require</label>
              
              {photoRequirements.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">

                    <label htmlFor={item.id} className="text-sm text-slate-200">
                      {item.label}
                    </label>
                  </div>

                    <Switch 
                    checked={false}
                      // checked={photoSettings[item.id] || false}
                      disabled={false}
                    />
                </div>
              ))}
            </div>
          </div>

          <Button className="ml-auto mt-8 bg-primary px-6 hover:bg-primary/80 text-[#383838]">
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
