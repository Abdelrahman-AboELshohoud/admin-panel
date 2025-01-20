import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MyDialog } from "../common/dialogs/MyDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "react-hot-toast";
import {
  ServiceOptionType,
  ServiceOptionIcon,
  ServiceOptionsListGQL,
  CreateServiceOptionGQL,
  UpdateServiceOptionGQL,
  SetOptionsOnServiceGQL,
} from "../../graphql/requests";
import MyTable from "../common/table-components/MyTable";

interface ServiceOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  currentOptions: any[];
  onOptionsUpdate: (options: any[]) => void;
}

export default function ServiceOptionsDialog({
  isOpen,
  onClose,
  serviceId,
  currentOptions,
  onOptionsUpdate,
}: ServiceOptionsDialogProps) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServiceOptions();
  }, []);

  const fetchServiceOptions = async () => {
    try {
      const response = await ServiceOptionsListGQL({});
      if (response.data?.serviceOptions) {
        setOptions(response.data.serviceOptions);
      }
    } catch (error) {
      console.error("Error fetching service options:", error);
      toast.error(t("leftCustomerEdit.serviceOptions.messages.error.fetch"));
    }
  };

  const handleCreateOption = async (option: any) => {
    try {
      setLoading(true);
      const response = await CreateServiceOptionGQL({
        input: {
          name: option.name,
          type: option.type,
          icon: option.icon,
          additionalFee: option.additionalFee,
        },
      });

      if (response.data?.createOneServiceOption) {
        toast.success(
          t("leftCustomerEdit.serviceOptions.messages.createSuccess")
        );
        fetchServiceOptions();
      }
    } catch (error) {
      console.error("Error creating service option:", error);
      toast.error(t("leftCustomerEdit.serviceOptions.messages.error.create"));
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handleUpdateOption = async (option: any) => {
    try {
      setLoading(true);
      const response = await UpdateServiceOptionGQL({
        id: option.id,
        update: {
          name: option.name,
          type: option.type,
          icon: option.icon,
          additionalFee: option.additionalFee,
        },
      });

      if (response.data?.updateOneServiceOption) {
        toast.success(
          t("leftCustomerEdit.serviceOptions.messages.updateSuccess")
        );
        fetchServiceOptions();
      }
    } catch (error) {
      console.error("Error updating service option:", error);
      toast.error(t("leftCustomerEdit.serviceOptions.messages.error.update"));
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handleSaveOptions = async () => {
    try {
      setLoading(true);
      const response = await SetOptionsOnServiceGQL({
        id: serviceId,
        relationIds: currentOptions.map((opt) => opt.id),
      });

      if (response.data?.setOptionsOnService) {
        onOptionsUpdate(currentOptions);
        toast.success(
          t("leftCustomerEdit.serviceOptions.messages.updateSuccess")
        );
        onClose();
      }
    } catch (error) {
      console.error("Error saving service options:", error);
      toast.error(t("leftCustomerEdit.serviceOptions.messages.error.update"));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: t("leftCustomerEdit.serviceOptions.fields.name"),
      accessor: "name",
    },
    {
      header: t("leftCustomerEdit.serviceOptions.fields.type"),
      accessor: "type",
    },
    {
      header: t("leftCustomerEdit.serviceOptions.fields.icon"),
      accessor: "icon",
    },
    { header: t("common.actions"), accessor: "actions" },
  ];

  return (
    <MyDialog
      isOpen={isOpen}
      onOpenChange={onClose}
      title={t("leftCustomerEdit.serviceOptions.title")}
      showCloseButton={false}
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setSelectedOption(null);
              setIsEditing(true);
            }}
          >
            {t("leftCustomerEdit.serviceOptions.actions.add")}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              placeholder={t("leftCustomerEdit.serviceOptions.fields.name")}
              value={selectedOption?.name || ""}
              onChange={(e) =>
                setSelectedOption((prev: any) => ({
                  ...prev!,
                  name: e.target.value,
                }))
              }
            />
            <Select
              value={selectedOption?.type || ServiceOptionType.Free}
              onValueChange={(value: ServiceOptionType) =>
                setSelectedOption((prev: any) => ({
                  ...prev!,
                  type: value,
                }))
              }
            >
              <SelectTrigger className="custom-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ServiceOptionType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(
                      `leftCustomerEdit.serviceOptions.types.${type.toLowerCase()}`
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedOption?.icon || ServiceOptionIcon.Custom1}
              onValueChange={(value: ServiceOptionIcon) =>
                setSelectedOption((prev: any) => ({
                  ...prev!,
                  icon: value,
                }))
              }
            >
              <SelectTrigger className="custom-input">
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
            {selectedOption?.type === ServiceOptionType.Paid && (
              <Input
                type="number"
                placeholder={t("leftCustomerEdit.serviceOptions.fields.fee")}
                value={selectedOption?.additionalFee || ""}
                onChange={(e) =>
                  setSelectedOption((prev: any) => ({
                    ...prev!,
                    additionalFee: Number(e.target.value),
                  }))
                }
              />
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="text-gray-600"
                onClick={() => {
                  setSelectedOption(null);
                  setIsEditing(false);
                }}
              >
                {t("leftCustomerEdit.serviceOptions.actions.cancel")}
              </Button>
              <Button
                onClick={() => {
                  if (selectedOption?.id) {
                    handleUpdateOption(selectedOption);
                  } else {
                    handleCreateOption(selectedOption!);
                  }
                }}
                disabled={loading}
              >
                {t("leftCustomerEdit.serviceOptions.actions.save")}
              </Button>
            </div>
          </div>
        ) : (
          <MyTable
            headers={columns.map((column) => column.header)}
            rows={
              options && options.length > 0
                ? options.map((option) => ({
                    id: option.id,
                    data: [
                      option.name,
                      t(
                        `leftCustomerEdit.serviceOptions.types.${
                          option.type === ServiceOptionType.Free
                            ? "free"
                            : option.type === ServiceOptionType.Paid
                            ? "paid"
                            : "twoway"
                        }`
                      ),
                      option.icon,
                      <div className="flex gap-2" key={option.id}>
                        <Button
                          variant="outline"
                          className="text-gray-600"
                          size="sm"
                          onClick={() => {
                            setSelectedOption(option);
                            setIsEditing(true);
                          }}
                        >
                          {t("common.edit")}
                        </Button>
                      </div>,
                    ],
                  }))
                : [
                    {
                      id: "no-data",
                      data: [
                        <td
                          colSpan={4}
                          className="text-center py-14"
                          key="no-data"
                        >
                          {t("common.noData")}
                        </td>,
                      ],
                    },
                  ]
            }
          />
        )}

        <div className="flex justify-end gap-2">
          <Button className="text-gray-600" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveOptions} disabled={loading}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </MyDialog>
  );
}
