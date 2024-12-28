import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import Switch from "../../components/common/Switch";
import { useTranslation } from "react-i18next";
import {
  ServicePaymentMethod,
  type Service as ServiceType,
} from "../../graphql/requests";

interface LeftCustomerEditProps {
  editing: boolean;
  service: ServiceType;
  setService: (service: ServiceType) => void;
}

export default function LeftCustomerEdit({
  editing,
  service,
  setService,
}: LeftCustomerEditProps) {
  const { t } = useTranslation();

  const handleInputChange = (key: keyof ServiceType, value: any) => {
    setService({ ...service, [key]: value });
  };

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
            value={service?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            readOnly={!editing}
            className="custom-input w-1/2 text-gray-100"
          />
        </div>

        <div className="flex flex-row justify-between">
          <label className="flex items-center w-1/3">
            {t("leftCustomerEdit.baseFare")}
          </label>
          <Input
            type="number"
            value={service?.baseFare || 0}
            onChange={(e) =>
              handleInputChange("baseFare", Number(e.target.value))
            }
            readOnly={!editing}
            className="custom-input w-1/2 text-gray-100"
          />
        </div>

        <div className="flex flex-row justify-between">
          <label className="flex items-center w-1/3">
            {t("leftCustomerEdit.perHundredMeters")}
          </label>
          <Input
            type="number"
            value={service?.perHundredMeters || 0}
            onChange={(e) =>
              handleInputChange("perHundredMeters", Number(e.target.value))
            }
            readOnly={!editing}
            className="custom-input w-1/2 text-gray-100"
          />
        </div>

        <div className="flex flex-row justify-between">
          <label className="flex items-center w-1/3">
            {t("leftCustomerEdit.perMinuteDrive")}
          </label>
          <Input
            type="number"
            value={service?.perMinuteDrive || 0}
            onChange={(e) =>
              handleInputChange("perMinuteDrive", Number(e.target.value))
            }
            readOnly={!editing}
            className="custom-input w-1/2 text-gray-100"
          />
        </div>

        <div className="flex flex-row justify-between">
          <label className="flex items-center w-1/3">
            {t("leftCustomerEdit.perMinuteWait")}
          </label>
          <Input
            type="number"
            value={service?.perMinuteWait || 0}
            onChange={(e) =>
              handleInputChange("perMinuteWait", Number(e.target.value))
            }
            readOnly={!editing}
            className="custom-input w-1/2 text-gray-100"
          />
        </div>

        <div className="flex flex-row justify-between">
          <label className="flex items-center w-1/3">
            {t("leftCustomerEdit.minimumFee")}
          </label>
          <Input
            type="number"
            value={service?.minimumFee || 0}
            onChange={(e) =>
              handleInputChange("minimumFee", Number(e.target.value))
            }
            readOnly={!editing}
            className="custom-input w-1/2 text-gray-100"
          />
        </div>

        <div className="flex flex-row justify-between">
          <label className="flex items-center w-1/3">
            {t("leftCustomerEdit.paymentMethod")}
          </label>
          <Select
            value={service?.paymentMethod}
            onValueChange={(value) => handleInputChange("paymentMethod", value)}
            disabled={!editing}
          >
            <SelectTrigger className="w-1/2 rounded-full custom-input text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ServicePaymentMethod).map((method) => (
                <SelectItem key={method} value={method}>
                  {t(`paymentMethods.${method.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <span>{t("leftCustomerEdit.twoWayAvailable")}</span>
          <Switch
            checked={service?.twoWayAvailable || false}
            disabled={!editing}
            onChange={(checked) =>
              handleInputChange("twoWayAvailable", checked)
            }
          />
        </div>
      </div>
    </div>
  );
}
