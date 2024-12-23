import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useTranslation } from "react-i18next";

export default function RightCustomerEdit({ editing }: { editing: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">
          {t("rightCustomerEdit.shortDescription")}
        </label>
        <Textarea
          placeholder={t("rightCustomerEdit.shortDescriptionPlaceholder")}
          className="h-32 border-transparent resize-none outline-none focus:outline-none select-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label>{t("rightCustomerEdit.typesOfCars")}</label>
        </div>
        <div className="card-shape p-4">
          <ul className="space-y-2">
            <li className="text-gray-500">Toyota Camry</li>
            <li className="text-gray-500">Honda Accord</li>
            <li className="text-gray-500">Ford Mustang</li>
            <li className="text-gray-500">Chevrolet Corvette</li>
            <li className="text-gray-500">BMW 3 Series</li>

            <li className="text-gray-500">{t("rightCustomerEdit.preOrder")}</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[
          {
            label: t("rightCustomerEdit.addressesLabel"),
            placeholder: t("rightCustomerEdit.addressesPlaceholder"),
            options: [
              {
                value: "multiple",
                label: t("rightCustomerEdit.addressesOption"),
              },
            ],
          },
          {
            label: t("rightCustomerEdit.tariffLabel"),
            placeholder: t("rightCustomerEdit.tariffPlaceholder"),
            options: [
              {
                value: "everyone",
                label: t("rightCustomerEdit.tariffOption"),
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
            {t("rightCustomerEdit.standbyMode")}
          </label>
        </div>
        <div className="flex flex-col gap-4">
          {t("rightCustomerEdit.standbyModes.auto")}
          {t("rightCustomerEdit.standbyModes.manual")}
        </div>
      </div>
      <div className="flex flex-row text-nowrp items-center gap-2">
        <div className="w-3/4">{t("rightCustomerEdit.tariffAvailability")}</div>
        <div className="flex flex-row rounded-full bg-[#282828] text-gray-100 px-4 py-2">
          <input
            type="number"
            defaultValue="3"
            className="placeholder:text-gray-500 bg-transparent border-none focus:outline-none focus:border-none"
          />
          <span>{t("rightCustomerEdit.hours")}</span>
        </div>
      </div>
    </div>
  );
}
