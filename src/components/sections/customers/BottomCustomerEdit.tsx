import { Button } from "../../ui/button";
import { FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function BottomCustomerEdit() {
  const { t } = useTranslation();

  return (
    <div className="mt-8">
      <h3 className="text-xl mb-4 font-bold">{t("calculationOfDelivery")}</h3>
      <div className="space-y-4">
        <h4 className="text-lg font-bold">{t("basicOptions")}</h4>
        <div className="grid grid-cols-5 gap-4">
          {[
            {
              label: t("workingHours"),
              value: t("workingHoursValue"),
            },
            {
              label: t("typeOfCalculationCity"),
              value: t("typeOfCalculationValue"),
            },
            {
              label: t("typeOfCalculationOutOfTown"),
              value: t("typeOfCalculationValue"),
            },
            { label: t("anAirport"), value: t("anAirportValue") },
            { label: t("railway"), value: t("railwayValue") },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-sm mb-1">{label}</label>
              <div>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Exceptions */}
      <div className="mt-6">
        <h4 className="mb-4 text-lg font-bold">{t("exceptions")}</h4>
        <Button className="bg-black text-white">
          <FaPlus className="mr-2" />
          {t("addException")}
        </Button>
      </div>
    </div>
  );
}

