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
  ServiceOptionType,
  ServiceOptionIcon,
  type Service as ServiceType,
  Service,
} from "../../graphql/requests";
import { FaPlus } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import ServiceOptionsDialog from "../../components/services/ServiceOptionsDialog";
import { useState } from "react";

interface LeftCustomerEditProps {
  editing: boolean;
  service: Service;
  setService: (service: Service) => void;
}

export default function LeftCustomerEdit({
  editing,
  service,
  setService,
}: LeftCustomerEditProps) {
  const { t } = useTranslation();
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);

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

      <div className="flex flex-row justify-between items-start">
        <label className="flex w-1/3">{t("rightCustomerEdit.options")}</label>
        <div className="w-2/3 space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {t("leftCustomerEdit.serviceOptions.title")}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptionsDialog(true)}
            >
              {t("leftCustomerEdit.serviceOptions.manage")}
            </Button>
          </div>

          {service.options &&
            service.options.length > 0 &&
            service.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option.name}
                onChange={(e) => {
                  const newOptions = [...(service.options || [])];
                  newOptions[index] = {
                    ...newOptions[index],
                    name: e.target.value,
                  };
                  handleInputChange("options", newOptions);
                }}
                readOnly={!editing}
                className="custom-input text-gray-100"
              />
              <Select
                value={option.icon}
                onValueChange={(value) => {
                  const newOptions = [...(service.options || [])];
                  newOptions[index] = {
                    ...newOptions[index],
                    icon: value as ServiceOptionIcon,
                  };
                  handleInputChange("options", newOptions);
                }}
                disabled={!editing}
              >
                <SelectTrigger className="border-transparent bg-[#262628] h-full border-0 outline-transparent text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ServiceOptionIcon).map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          {editing && (
            <Button
              onClick={() => {
                const newOptions = [...(service.options || [])];
                newOptions.push({
                  id: `new_${Date.now()}`,
                  name: "",
                  icon: ServiceOptionIcon.Custom1,
                  type: ServiceOptionType.Free,
                });
                handleInputChange("options", newOptions);
              }}
              className="mt-2"
            >
              <FaPlus className="mr-2" />
              {t("rightCustomerEdit.addOption")}
            </Button>
          )}
        </div>
      </div>

      <ServiceOptionsDialog
        isOpen={showOptionsDialog}
        onClose={() => setShowOptionsDialog(false)}
        serviceId={service.id}
        currentOptions={
          service.options &&
          service.options.length > 0 &&
          service.options.map((option) => ({
            ...option,
            additionalFee: option.additionalFee ?? undefined,
          })) || []
        }
        onOptionsUpdate={(options) => handleInputChange("options", options)}
      />
    </div>
  );
}
