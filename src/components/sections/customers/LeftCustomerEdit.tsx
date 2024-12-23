import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { Input } from "../../ui/input";
import Switch from "../../common/Switch";
import { useTranslation } from "react-i18next";

export default function LeftCustomerEdit({ editing }: { editing: boolean }) {
  const { t } = useTranslation();

  const options = [
    {
      label: t("leftCustomerEdit.branchLabel"),
      labelClass: "text-sm mb-1 block w-1/3",
      placeholder: t("leftCustomerEdit.branchPlaceholder"),
      options: [{ value: "kazan", label: t("leftCustomerEdit.kazan") }],
    },
    {
      label: t("leftCustomerEdit.professionLabel"),
      labelClass: "block mb-1 w-1/3",
      placeholder: t("leftCustomerEdit.professionPlaceholder"),
      options: [{ value: "taxi", label: t("leftCustomerEdit.taxiDriver") }],
    },
    {
      label: t("leftCustomerEdit.carClassLabel"),
      labelClass: "flex items-center mb-1 w-1/3",
      required: true,
      placeholder: t("leftCustomerEdit.carClassPlaceholder"),
      options: [{ value: "business", label: t("leftCustomerEdit.business") }],
    },
    {
      label: t("leftCustomerEdit.fareTypeLabel"),
      labelClass: "block mb-1 w-1/3",
      required: true,
      placeholder: t("leftCustomerEdit.fareTypePlaceholder"),
      options: [{ value: "type1", label: t("leftCustomerEdit.selectType") }],
    },
    {
      label: t("leftCustomerEdit.tariffAvailabilityLabel"),
      labelClass: "block mb-1 w-1/3",
      placeholder: t("leftCustomerEdit.tariffAvailabilityPlaceholder"),
      options: [{ value: "all", label: t("leftCustomerEdit.all") }],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="w-1/3">
            {t("leftCustomerEdit.name")}
            <span className="text-yellow-500 ml-1">*</span>
          </div>
          <Input
            type="text"
            placeholder={t("leftCustomerEdit.namePlaceholder")}
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
          t("leftCustomerEdit.website"),
          t("leftCustomerEdit.application"),
          t("leftCustomerEdit.dispatcher"),
          t("leftCustomerEdit.driverCurb"),
          t("leftCustomerEdit.personalAccount"),
          t("leftCustomerEdit.advancePayment"),
        ].map((item) => (
          <div key={item} className="flex items-center justify-between">
            <span>{item}</span>
            <Switch checked={false} disabled={!editing} />
          </div>
        ))}
        <div className="flex flex-row gap-4">
          <label className="flex items-center w-1/3">
            {t("leftCustomerEdit.sorting")}
          </label>
          <Input
            type="number"
            defaultValue="3"
            className="px-4 w-2/3 rounded-full bg-[#282828] text-gray-100 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-gray-300 text-sm">
              {t("leftCustomerEdit.fineCustomer")}
            </span>
            <Switch checked={false} disabled={!editing} />
          </div>
          <div className="flex flex-row gap-2">
            <span className="text-gray-300 text-sm">
              {t("leftCustomerEdit.fineAfterXMinutes")}
            </span>
            <input
              type="number"
              value="5"
              className="bg-transparent text-center w-1/6 text-white focus:outline-none bg-[#1E1E1E] rounded-full px-4 py-2"
            />
          </div>
          <div className="flex flex-row text-nowrp justify-between w-full items-center gap-2">
            <div className="w-3/4">{t("leftCustomerEdit.fineOn")}</div>
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
