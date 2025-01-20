import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MyDialog } from "../common/dialogs/MyDialog";
import { Button } from "../ui/button";
import { ServiceOption } from "../../graphql/requests";
import Switch from "../common/form-elements/Switch";
import MyTable from "../common/table-components/MyTable";

interface AddServiceOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableOptions: ServiceOption[];
  selectedOptions: ServiceOption[];
  onOptionsSelect: (options: ServiceOption[]) => void;
}

export default function AddServiceOptionsDialog({
  isOpen,
  onClose,
  availableOptions,
  selectedOptions,
  onOptionsSelect,
}: AddServiceOptionsDialogProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedOptions.map((opt) => opt.id))
  );

  const handleToggleOption = (optionId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelected(newSelected);
  };

  const handleSave = () => {
    const selectedOptionsList = availableOptions.filter((opt) =>
      selected.has(opt.id)
    );
    onOptionsSelect(selectedOptionsList);
    onClose();
  };

  return (
    <MyDialog
      title={t("leftCustomerEdit.serviceOptions.addOptions")}
      isOpen={isOpen}
      onOpenChange={onClose}
      showCloseButton={false}
    >
      <div className="space-y-4">
        <MyTable
          headers={[
            "",
            t("leftCustomerEdit.serviceOptions.fields.name"),
            t("leftCustomerEdit.serviceOptions.fields.type"),
            t("leftCustomerEdit.serviceOptions.fields.fee"),
          ]}
          rows={availableOptions.map((option) => ({
            id: option.id,
            data: [
              <Switch
                checked={selected.has(option.id)}
                onChange={() => handleToggleOption(option.id)}
                disabled={false}
              />,
              option.name,
              option.type,
              option.additionalFee || "-",
            ],
          }))}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave}>{t("common.add")}</Button>
        </div>
      </div>
    </MyDialog>
  );
}
