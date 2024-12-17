import React, { useState } from "react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

interface FormData {
  title: string;
  branch: string;
  profession: string;
  carClass: string;
  tariff: string;
  orderClass: string;
  priority: string;
}

const DriverForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    branch: "",
    profession: "",
    carClass: "",
    tariff: "business-lite",
    orderClass: "",
    priority: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSelectChange = (id: string) => (value: string) => {
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="p-6 space-y-6">
        <h3 className="text-2xl text-white mb-4">Add Group</h3>
      <Card className="w-1/2 bg-zinc-900 text-white card-shape border-none">

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <FormField
              label="Title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
            />

            <FormSelect
              label="The branch where the group works"
              id="branch"
              value={formData.branch}
              onValueChange={handleSelectChange("branch")}
              options={[{ value: "kazan", label: "Kazan" }]}
            />

            <FormSelect
              label="Profession"
              id="profession"
              value={formData.profession}
              onValueChange={handleSelectChange("profession")}
              options={[{ value: "taxi-driver", label: "Taxi driver" }]}
            />

            <FormSelect
              label="Car class"
              id="carClass"
              value={formData.carClass}
              onValueChange={handleSelectChange("carClass")}
              options={[{ value: "business", label: "Business" }]}
            />

            <div className="space-y-2">
              <label>Tariffs</label>
              <RadioGroup
                value={formData.tariff}
                onValueChange={handleSelectChange("tariff")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business-lite" id="business-lite" />
                  <label htmlFor="business-lite">Business Lite</label>
                </div>
              </RadioGroup>
            </div>

            <FormSelect
              label="What classes of orders will the group see?"
              id="orderClass"
              value={formData.orderClass}
              onValueChange={handleSelectChange("orderClass")}
              options={[{ value: "business", label: "Business" }]}
            />

            <FormField
              label="Priority when distribution of orders?"
              id="priority"
              value={formData.priority}
              onChange={handleInputChange}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="ml-auto bg-[#B69C76] hover:bg-[#A38B65] text-gray-800"
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, value, onChange }) => (
  <div className="space-y-2">
    <label htmlFor={id}>{label}</label>
    <Input
      id={id}
      value={value}
      onChange={onChange}
      className="bg-zinc-800 border-zinc-700"
    />
  </div>
);

interface FormSelectProps {
  label: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const FormSelect: React.FC<FormSelectProps> = ({ label, id, value, onValueChange, options }) => (
  <div className="space-y-2">
    <label>{label}</label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-zinc-800 border-zinc-700">
        <SelectValue placeholder={`Select ${id}`} />
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
);

export default DriverForm;
