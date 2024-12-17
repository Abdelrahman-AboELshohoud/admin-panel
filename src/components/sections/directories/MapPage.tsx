import { useState } from "react";
import Switch from "../../common/Switch";

import Map from "../../common/Map";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
interface District {
  name: string;
  category: string;
}

const districts: Record<string, District[]> = {
  City: [
    { name: "City", category: "city" },
    { name: "Aircraft building district", category: "city" },
    { name: "Azino", category: "city" },
    { name: "Konstantinovka", category: "city" },
    { name: "Tsaritsyno", category: "city" },
    { name: "Derbyshki", category: "city" },
    { name: "Slides", category: "city" },
    { name: "Boriskovo", category: "city" },
    { name: "Slides 2", category: "city" },
    { name: "Sovetsky district", category: "city" },
    { name: "Moskovsky district", category: "city" },
    { name: "Kirovsky district", category: "city" },
    { name: "Novo-Savinovsky", category: "city" },
    { name: "Centre", category: "city" },
  ],
  "Suburban Areas": [
    { name: "The countryside", category: "suburban" },
    { name: "Suburb 1", category: "suburban" },
    { name: "Suburb 2", category: "suburban" },
    { name: "Tatarstan District", category: "suburban" },
  ],
  Transportation: [
    { name: "An airport", category: "transport" },
    { name: "Railway station", category: "transport" },
  ],
  Other: [{ name: "Order acceptance area", category: "other" }],
};

function Switches() {
  const [activeDistricts, setActiveDistricts] = useState<
    Record<string, boolean>
  >({});

  const handleToggle = (districtName: string) => {
    setActiveDistricts((prev) => ({
      ...prev,
      [districtName]: !prev[districtName],
    }));
  };
  const navigate = useNavigate();

  return (
    <div className=" bg-transparent text-zinc-100 p-4 ml-4 rounded-lg flex justify-between">
      <div className="flex flex-col w-1/2  gap-4">
        {districts["City"].map((district) => (
          <div
            key={district.name}
            className="flex items-center justify-between"
          >
            <label htmlFor={district.name} className="text-sm">
              {district.name}
            </label>
            <Switch
              disabled={false}
              checked={activeDistricts[district.name] || false}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col ml-4 w-1/2  gap-4">
        {["Suburban Areas", "Transportation", "Other"].map((category) => (
          <div key={category} className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-400">{category}</h3>
            {districts[category].map((district) => (
              <div
                key={district.name}
                className="flex items-center justify-between"
              >
                <label htmlFor={district.name} className="text-sm">
                  {district.name}
                </label>
                <Switch
                  disabled={false}
                  checked={activeDistricts[district.name] || false}
                />
              </div>
            ))}
          </div>
        ))}
            <Button className="add-button w-fit ml-auto mt-4" onClick={()=>{
              navigate("/control-panel/directories/add-in-map")
            }}>
             <Plus className="mr-2" />Add in map
            </Button>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <div className="flex flex-col bg-transparent p-4">
      <div className="flex-grow flex flex-col items-center mb-4">
        <h1 className="text-3xl font-bold text-zinc-100 mb-4 w-full pl-12">
          Districts
        </h1>
        <Map />
      </div>
      <Switches />
    </div>
  );
}
