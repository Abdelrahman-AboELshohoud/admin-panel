import { useTranslation } from "react-i18next";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { DriverFilter } from "../../../graphql/requests";

interface FilterOption {
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface DriversFiltersProps {
  onFilterChange?: (filter: DriverFilter) => void;
  onSearchChange?: (search: string) => void;
  isLoading?: boolean;
}

const filterOptions: FilterOption[] = [
  {
    placeholder: "drivers.filters.cities",
    options: [{ value: "all", label: "All cities" }],
  },
  {
    placeholder: "drivers.filters.profession",
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
    placeholder: "Drivers's Options",
    options: [{ value: "option1", label: "Option 1" }],
  },
];

const DriversFilters = ({
  onFilterChange,
  onSearchChange,
  isLoading,
}: DriversFiltersProps) => {
  const { t } = useTranslation();
  console.log(onFilterChange, onSearchChange, isLoading);
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {filterOptions.map((filter, index) => (
        <Select key={index}>
          <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
            <SelectValue placeholder={t(filter.placeholder)} />
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
};

export default DriversFilters;
