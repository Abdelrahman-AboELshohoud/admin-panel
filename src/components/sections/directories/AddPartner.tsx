
import { useState } from 'react'
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { Input } from "../../ui/input"
import  Switch  from "../../common/Switch"
import { useNavigate } from 'react-router-dom'

export default function AddPartner() {
  const [isBlocked, setIsBlocked] = useState(false)
  const navigate = useNavigate()
  const organizationFields = [
    { label: "Name of the organization", type: "text" },
    { label: "Contract number", type: "text" },
    { label: "Date of the agreement", type: "text", defaultValue: "08.07.2023", className: "w-32" },
    { label: "Legal address", type: "text" },
    { label: "OGRn", type: "text" },
    { label: "inn", type: "text" },
    { label: "Full name of the director", type: "text" },
    { label: "Email", type: "email" },
    { label: "Bank", type: "text" },
    { label: "P/c", type: "text" },
    { label: "K/s", type: "text" },
    { label: "BIC", type: "text" },
    { label: "The Tax Service", type: "text" },
    { label: "Comment", type: "text" },
  ];

  return (
    <div className="min-h-scree">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-normal text-zinc-100">Add a new partner</h1>
        
        <Card className="card-shape">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <label className="text-sm text-zinc-100 flex items-center gap-1">
                Title
                <span className="text-amber-500">*</span>
              </label>
              <Input 
                className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3" 
                placeholder="."
              />
            </div>

            <div className="flex justify-between">
              <label className="text-sm text-zinc-100">Telephone</label>
              <Input 
                className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3" 
                placeholder="+7(000)000-00-00"
              />
            </div>

            <div className="flex justify-between">
              <label className="text-sm text-zinc-100">Partner's commission</label>
              <div className="flex gap-2 items-center  w-2/3">
                <Input 
                  className="bg-zinc-900 border-zinc-700 text-zinc-100" 
                  placeholder="."
                />
                <span className="text-zinc-400">%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Details */}
        <Card className="card-shape">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-normal text-zinc-400">Organization</h2>
            
            <div className="space-y-4">


{organizationFields.map((field, index) => (
  <div key={index} className="flex justify-between">
    <label className="text-sm text-zinc-100">{field.label}</label>
    <Input 
      type={field.type}
      defaultValue={field.defaultValue}
      className={`bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3 ${field.className || ''}`}
      placeholder="."
    />
  </div>
))}
            </div>
          </CardContent>
        </Card>

        {/* Block Toggle and Save */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-xl font-normal text-zinc-100">Block</label>
            <Switch
              disabled={false}
              checked={isBlocked}
              // onCheckedChange={setIsBlocked}
            />
          </div>
          
          <Button className="bg-[#B69D74] hover:bg-[#a08a65] text-zinc-900 px-8">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
