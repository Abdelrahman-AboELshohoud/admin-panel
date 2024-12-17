import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface FilterOption {
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
}

const filterOptions: FilterOption[] = [
  {
    placeholder: "All cities",
    options: [{ value: "all", label: "All cities" }],
  },
  {
    placeholder: "Profession",
    options: [{ value: "taxi", label: "Taxi driver" }],
  },
  {
    placeholder: "A group of performers",
    options: [{ value: "group1", label: "Group 1" }],
  },
  {
    placeholder: "Partners",
    options: [{ value: "partner1", label: "Partner 1" }],
  },
  {
    placeholder: "Car class",
    options: [{ value: "business", label: "Business" }],
  },
  {
    placeholder: "The color of the car",
    options: [{ value: "black", label: "Black" }],
  },
  {
    placeholder: "Auto Options",
    options: [{ value: "option1", label: "Option 1" }],
  },
  {
    placeholder: "Performer's Options",
    options: [{ value: "option1", label: "Option 1" }],
  },
];

const DriversFilters = () => (
  <div className="grid grid-cols-3 gap-4 mb-6">
    {filterOptions.map((filter, index) => (
      <Select key={index}>
        <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
          <SelectValue placeholder={filter.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filter.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ))}
    <Input
      placeholder="Search by name, phone, poses..."
      className="bg-[#1E1E1E] border-none"
    />
  </div>
);

export default DriversFilters;
