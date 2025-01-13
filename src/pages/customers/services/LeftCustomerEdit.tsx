import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

import { Input } from "../../../components/ui/input";
import Switch from "../../../components/common/Switch";
import { useTranslation } from "react-i18next";
import {
  ServicePaymentMethod,
  type Service as ServiceType,
  Service,
  ServiceOption,
  ServiceOptionsListGQL,
} from "../../../graphql/requests";
import { Button } from "../../../components/ui/button";
import ServiceOptionsDialog from "../../../components/services/ServiceOptionsDialog";
import { useState, useEffect } from "react";
import AddServiceOptionsDialog from "../../../components/services/AddServiceOptionsDialog";

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
  const [showAddOptionsDialog, setShowAddOptionsDialog] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<ServiceOption[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await ServiceOptionsListGQL({});
        if (response.data?.serviceOptions) {
          setAvailableOptions(response.data.serviceOptions);
        }
      } catch (error) {
        console.error("Error fetching service options:", error);
      }
    };
    fetchOptions();
  }, []);

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

      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {t("leftCustomerEdit.serviceOptions.title")}
          </h3>
          {editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptionsDialog(true)}
            >
              {t("leftCustomerEdit.serviceOptions.manage")}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {service.options?.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-zinc-900 rounded"
            >
              <span className="flex-1">{option.name}</span>
              <span className="text-gray-400">{option.icon}</span>
              {option.additionalFee && (
                <span className="text-gray-400">+{option.additionalFee}</span>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowAddOptionsDialog(true)}
          >
            {t("leftCustomerEdit.serviceOptions.addMore")}
          </Button>
        )}
      </div>

      <ServiceOptionsDialog
        isOpen={showOptionsDialog}
        onClose={() => setShowOptionsDialog(false)}
        serviceId={service.id}
        currentOptions={service.options || []}
        onOptionsUpdate={(options) => handleInputChange("options", options)}
      />

      <AddServiceOptionsDialog
        isOpen={showAddOptionsDialog}
        onClose={() => setShowAddOptionsDialog(false)}
        availableOptions={availableOptions}
        selectedOptions={service.options || []}
        onOptionsSelect={(newOptions) => {
          const updatedOptions = [...(service.options || []), ...newOptions];
          handleInputChange("options", updatedOptions);
        }}
      />
    </div>
  );
}
