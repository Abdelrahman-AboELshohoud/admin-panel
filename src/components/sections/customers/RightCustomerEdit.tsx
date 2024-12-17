import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import  Switch from "../../common/Switch";

export default function RightCustomerEdit({ editing }: { editing: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">Short description</label>
        <Textarea
          placeholder="To write..."
          className="h-32 border-transparent resize-none outline-none focus:outline-none select-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label>Types of cars</label>
        </div>
        <div className="card-shape p-4">
          <ul className="space-y-2">
            {[
              "Lexus ES250",
              "BMW 5er(f10)",
              "Audi A6",
              "Genesis G80",
              "Toyota Camry",
              "Kia (K5,K900,Quoris)",
            ].map((car) => (
              <li key={car}>{car}</li>
            ))}
            <li className="text-gray-500">
              It is possible to make a pre-order
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[
          {
            label: "The number of addresses for creating an order",
            placeholder: "Select address option",
            options: [
              {
                value: "multiple",
                label:
                  "Allow multiple addresses to be selected, but only 1 is required",
              },
            ],
          },
          {
            label: "The tariff is available",
            placeholder: "Select availability",
            options: [
              {
                value: "everyone",
                label: "To everyone",
              },
            ],
          },
        ].map(({ label, placeholder, options }) => (
          <div key={label}>
            <label className="block mb-1">{label}</label>
            <Select>
              <SelectTrigger className="w-full rounded-full bg-[#282828] text-gray-100 cursor-pointer">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ value, label }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="cursor-pointer"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center font-bold ">
            Enabling the standby mode in the performer's application
          </label>
        </div>
        <div className="flex flex-col gap-4">
          {["Automatically by GPS", "Manually using the button"].map((mode) => (
            <div key={mode} className="flex items-center justify-between">
              <span>{mode}</span>
              <Switch checked={false} disabled={!editing} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row text-nowrp items-center gap-2">
        <div className="w-3/4">
          Tariff is available if the order is more than
        </div>
        <div className="flex flex-row rounded-full bg-[#282828] text-gray-100 px-4 py-2">
          <input
            type="number"
            defaultValue="3"
            className="placeholder:text-gray-500 bg-transparent border-none focus:outline-none focus:border-none"
          />
          <span>hours</span>
        </div>
      </div>
    </div>
  );
}
