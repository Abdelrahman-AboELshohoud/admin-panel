import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { Input } from "../../ui/input";
import Switch from "../../common/Switch";

export default function LeftCustomerEdit({ editing }: { editing: boolean }) {
  const options = [
    {
      label: "The branch where to staff work",
      labelClass: "text-sm mb-1 block w-1/3",
      placeholder: "Select city",
      options: [{ value: "kazan", label: "Kazan" }],
    },
    {
      label: "Profession",
      labelClass: "block mb-1 w-1/3",
      placeholder: "Select profession",
      options: [{ value: "taxi", label: "Taxi driver" }],
    },
    {
      label: "Car class",
      labelClass: "flex items-center mb-1 w-1/3",
      required: true,
      placeholder: "Select class",
      options: [{ value: "business", label: "Business" }],
    },
    {
      label: "Fare type for taxi",
      labelClass: "block mb-1 w-1/3",
      required: true,
      placeholder: "Select type",
      options: [{ value: "type1", label: "Select type" }],
    },
    {
      label: "Where is the tariff available?",
      labelClass: "block mb-1 w-1/3",
      placeholder: "Select availability",
      options: [{ value: "all", label: "All" }],
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="w-1/3">
            Name
            <span className="text-yellow-500 ml-1">*</span>
          </div>
          <Input
            type="text"
            placeholder="BUSINESS Light"
            className="w-2/3 rounded-full bg-[#282828] text-gray-100 placeholder:text-gray-500"
          />
        </div>

        {options.map(
          ({ label, labelClass, required, placeholder, options }) => (
            <div key={label} className="flex flex-row">
              <label className={labelClass}>
                {label}
                {required && <span className="text-yellow-500 ml-1">*</span>}
              </label>
              <Select>
                <SelectTrigger className="w-2/3 dark-input">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        )}
      </div>

      <div className="flex flex-col gap-4">
        {[
          "Website",
          "Application",
          "Dispatcher",
          "Driver (curb)",
          "Personal account",
          "To demand an advance payment",
        ].map((item) => (
          <div key={item} className="flex items-center justify-between">
            <span>{item}</span>
            <Switch checked={false} disabled={!editing} />
          </div>
        ))}
        <div className="flex flex-row gap-4">
          <label className="flex items-center w-1/3">Sorting</label>
          <Input
            type="number"
            defaultValue="3"
            className="px-4 w-2/3 rounded-full bg-[#282828] text-gray-100 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-gray-300 text-sm">
              Fine the customer for canceling the order when the contractor has
              already left
            </span>
            <Switch checked={false} disabled={!editing} />
          </div>
          <div className="flex flex-row gap-2">
            <span className="text-gray-300 text-sm">
              A fine after X minutes from when the driver left for the client
            </span>
            <input
              type="number"
              value="5"
              className="bg-transparent text-center w-1/6 text-white focus:outline-none bg-[#1E1E1E] rounded-full px-4 py-2"
            />
          </div>
          <div className="flex flex-row text-nowrp justify-between w-full items-center gap-2">
            <div className="w-3/4">Fine on</div>
            <div className="flex flex-row rounded-full bg-[#282828] text-gray-100 px-4 py-2">
              <input
                type="number"
                defaultValue="3"
                className="placeholder:text-gray-500 bg-transparent border-none focus:outline-none focus:border-none"
              />
              <span>₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
