import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"

interface OrganizationDetails {
  organizationName: string
  taxiServiceName: string
  legalAddress: string
  postalAddress: string
  directorName: string
  directorPosition: string
  accountantName: string
  inn: string
  kpp: string
  ogrn: string
  phone: string
  email: string
  website: string
  contactPerson: {
    lastName: string
    firstName: string
    middleName: string
    phone: string
    email: string
  }
}

export default function OrganizationDetails() {
  const [logoImage, setLogoImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 dark">
      <Card className="mx-auto max-w-4xl card-shape">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="organizationName">Full Organization Name</label>
                    <Input id="organizationName" placeholder="LLC 'Infotrans'" className="bg-muted custom-input" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="taxiServiceName">Taxi Service Name</label>
                    <Input id="taxiServiceName" placeholder="Milly" className="bg-muted custom-input" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="legalAddress">Legal Address</label>
                    <Input id="legalAddress" placeholder="RT. Pestrechinsky district..." className="bg-muted custom-input" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postalAddress">Postal Address</label>
                    <Input id="postalAddress" placeholder="RT. Pestrechinsky district..." className="bg-muted custom-input" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="phone">Organization Phone</label>
                    <Input id="phone" type="tel" placeholder="+7(900)000-00-00" className="bg-muted custom-input" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email">Organization Email</label>
                    <Input id="email" type="email" placeholder="email@example.com" className="bg-muted custom-input" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="website">Website</label>
                    <Input id="website" type="url" placeholder="https://example.com" className="bg-muted custom-input" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Person</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="contactLastName">Last Name</label>
                      <Input id="contactLastName" className="bg-muted custom-input" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactFirstName">First Name</label>
                      <Input id="contactFirstName" className="bg-muted custom-input" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactMiddleName">Middle Name</label>
                      <Input id="contactMiddleName" className="bg-muted custom-input" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="contactPhone">Contact Phone</label>
                      <Input id="contactPhone" type="tel" placeholder="+7(900)000-00-00" className="bg-muted custom-input" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactEmail">Contact Email</label>
                      <Input id="contactEmail" type="email" placeholder="email@example.com" className="bg-muted custom-input" />
                    </div>
                  </div>
                </div>

              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-64 w-64">
                    <AvatarImage src={logoImage || "/organization-logo.svg"} alt="Organization Logo" />
                    <AvatarFallback>OL</AvatarFallback>
                  </Avatar>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                    id="logo-upload"
                  />

                    <Button className="w-full cursor-pointer add-button text-white" onClick={() => document.getElementById('logo-upload')?.click()}>Upload Logo</Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Recommended: 256x256px or larger</p>
                    <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="directorName">Director's Full Name</label>
                    <Input id="directorName" placeholder="Full name" className="bg-muted custom-input" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="directorPosition">Position</label>
                    <Input id="directorPosition" placeholder="Director" className="bg-muted custom-input" />
                  </div>
                  
                </div>
                
                <div className="grid gap-6 grid-cols-1">
                  <div className="col-span-1 flex flex-col gap-2">
                    <label htmlFor="inn">INN</label>
                    <Input id="inn" placeholder="1686012898" className="bg-muted custom-input"  />
                  </div>
                  <div className="col-span-1 flex flex-col gap-2">
                    <label htmlFor="kpp">KPP</label>
                    <Input id="kpp" placeholder="168601001" className="bg-muted custom-input" />
                  </div>
                  <div className="col-span-1 flex flex-col gap-2">
                    <label htmlFor="ogrn">OGRN</label>
                    <Input id="ogrn" placeholder="1221600048779" className="bg-muted custom-input" />
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="ml-auto bg-primary text-black hover:bg-primary/80 px-6 py-2 rounded-md">Save</button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
