import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MyDialog } from "../common/MyDialog";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ServiceOption } from "../../graphql/requests";
import Switch from "../common/Switch";

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>
                {t("leftCustomerEdit.serviceOptions.fields.name")}
              </TableHead>
              <TableHead>
                {t("leftCustomerEdit.serviceOptions.fields.type")}
              </TableHead>
              <TableHead>
                {t("leftCustomerEdit.serviceOptions.fields.fee")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableOptions.map((option) => (
              <TableRow key={option.id}>
                <TableCell>
                  <Switch
                    checked={selected.has(option.id)}
                    onChange={() => handleToggleOption(option.id)}
                    disabled={false}
                  />
                </TableCell>
                <TableCell>{option.name}</TableCell>
                <TableCell>{option.type}</TableCell>
                <TableCell>{option.additionalFee || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
