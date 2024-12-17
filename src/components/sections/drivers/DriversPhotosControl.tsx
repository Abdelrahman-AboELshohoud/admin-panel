import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import Switch from "../../common/Switch";

const PhotoControlForm: React.FC = () => {
  const [photoRequirements, setPhotoRequirements] = useState([
    { id: 1, label: "In front, so that the state number is visible", checked: true },
    { id: 2, label: "The back part so that the state is visible", checked: true },
    { id: 3, label: "Right side", checked: true },
    { id: 4, label: "Left side", checked: true },
    { id: 5, label: "The front of the cabin", checked: true },
    { id: 6, label: "The back of the cabin", checked: true },
    { id: 7, label: "Trunk", checked: true },
    { id: 8, label: "Documents", checked: true },
  ]);

  const toggleRequirement = (id: number) => {
    setPhotoRequirements(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-gray-400">Photo control</p>
          <h1 className="text-3xl font-semibold mt-2">Add</h1>
        </div>

        <Card className="bg-[#2A2A2A] border-gray-700">
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-100">City</label>
                  <Select defaultValue="kazan">
                    <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-white">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kazan">Kazan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-100">Profession</label>
                  <Select defaultValue="taxi">
                    <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-white">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="taxi">Taxi driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-100">Car class</label>
                  <Select defaultValue="business">
                    <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-white">
                      <SelectValue placeholder="Select car class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-100">Period</label>
                  <Select defaultValue="start">
                    <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-white">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">At the start of the shift</SelectItem>
                      <SelectItem value="24h">Every 24 hours</SelectItem>
                      <SelectItem value="week">Every week</SelectItem>
                      <SelectItem value="month">Every month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-gray-100">Which photos should I require</label>
                <div className="space-y-4">
                  {photoRequirements.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <label className="text-gray-300">
                        {item.label}
                      </label>
                      <Switch 
                        checked={item.checked} 
                        disabled={false}
                        // onChange={() => toggleRequirement(item.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-[#D4AF37] text-black hover:bg-[#C4A137] px-8">Save</Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoControlForm;
