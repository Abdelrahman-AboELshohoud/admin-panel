import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import Switch from "../../common/Switch";
import { useState } from "react";
import Map from "../../common/Map";

export default function AddInMap() {
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [formData, setFormData] = useState({
    type: "city",
    title: "",
    sorting: "100",
    ratioTo: "0",
    ratioFrom: "0",
  });

  return (
    <div className="min-h-screen bg-transparent text-gray-300 p-4">
      <Card className=" card-shape p-6 mb-4">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">Add</h1>

          <div className="flex  gap-4 text-gray-100">
            <div className="w-1/2 flex flex-col gap-2">
              <label htmlFor="area-type ">Type of area *</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full custom-input">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="countryside">The countryside</SelectItem>
                  <SelectItem value="airport">An airport</SelectItem>
                  <SelectItem value="railway">Railway station</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/2 flex flex-col gap-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                placeholder="Enter..."
                className="border-none focus:ring-0 text-gray-100 focus-visible:ring-0 custom-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
          </div>


            <div className="flex flex-row gap-2 justify-between text-gray-200">
 
            <div className="flex flex-col gap-2">
              <label>Sorting</label>
              <Input
                type="number"
                className="custom-input"
                value={formData.sorting}
                onChange={(e) =>
                  setFormData({ ...formData, sorting: e.target.value })
                }
              />
            </div>
              <div key="district-ratio" className="flex flex-col gap-2">
                <label>District ratio</label>
                <div className="flex w-full gap-4 ">
                  {[
                    { label: "from", stateKey: "ratioFrom" },
                    { label: "to", stateKey: "ratioTo" },
                  ].map(
                    ({
                      label,
                      stateKey,
                    }: {
                      label: string;
                      stateKey: string;
                    }) => (
                      <div key={label} className="">
                        <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="custom-input"
                          value={formData[stateKey as keyof typeof formData]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [stateKey]: e.target.value,
                            })
                          }
                          />
                        <span>%</span>
                          </div>
                          <span className="pl-2">{label}</span>
                      </div>
                    )
                  )}
             
              </div>
            </div>
          </div>
        </div>
      </Card>
                  <div className="flex justify-center">
                  <Map />
                  </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-6">
          <label
            htmlFor="show-districts"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show all districts on the map
          </label>
          <Switch
            checked={showAllDistricts}
            disabled={false}
            // onCheckedChange={(checked) => setShowAllDistricts(checked)}
          />
        </div>

        <Button className="bg-[#B69F7D] hover:bg-[#A38D6B] text-black">
          Save
        </Button>
      </div>
    </div>
  );
}
