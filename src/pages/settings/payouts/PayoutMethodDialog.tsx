import { useTranslation } from "react-i18next";
import { MyDialog } from "../../../components/common/dialogs/MyDialog";
import { useState, useEffect } from "react";
import {
  PayoutMethod,
  CreatePayoutMethodGQL,
  UpdatePayoutMethodGQL,
  PayoutMethodType,
} from "../../../graphql/requests";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { toast } from "react-hot-toast";
import { Textarea } from "../../../components/ui/textarea";

interface PayoutMethodDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  method: PayoutMethod | null;
  supportedCurrencies: string[];
  onSuccess: () => void;
}

export default function PayoutMethodDialog({
  isOpen,
  onOpenChange,
  method,
  supportedCurrencies,
  onSuccess,
}: PayoutMethodDialogProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<PayoutMethod>>({
    name: "",
    type: PayoutMethodType.BankTransfer,
    currency: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name,
        type: method.type,
        currency: method.currency,
        description: method.description || "",
      });
    } else {
      setFormData({
        name: "",
        type: PayoutMethodType.BankTransfer,
        currency: "",
        description: "",
      });
    }
  }, [method, isOpen]);

  const handleInputChange = (
    field: keyof PayoutMethod,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!formData.name || !formData.currency) {
        toast.error(t("payouts.errors.requiredFields"));
        return;
      }

      if (method) {
        // Update existing method
        const response = await UpdatePayoutMethodGQL({
          id: method.id,
          update: {
            name: formData.name,
            type: formData.type as PayoutMethodType,
            currency: formData.currency,
            description: formData.description || "",
          },
        });

        if (response.data?.updatePayoutMethod) {
          toast.success(t("payouts.methods.updateSuccess"));
          onSuccess();
          onOpenChange(false);
        }
      } else {
        // Create new method
        const response = await CreatePayoutMethodGQL({
          input: {
            name: formData.name,
            type: formData.type as PayoutMethodType,
            currency: formData.currency,
            description: formData.description || "",
          },
        });

        if (response.data?.createPayoutMethod) {
          toast.success(t("payouts.methods.createSuccess"));
          onSuccess();
          onOpenChange(false);
        }
      }
    } catch (error) {
      console.error("Error saving payout method:", error);
      toast.error(
        method
          ? t("payouts.errors.updateMethodFailed")
          : t("payouts.errors.createMethodFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MyDialog
      title={method ? t("payouts.methods.edit") : t("payouts.methods.create")}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("payouts.methods.fields.name")}*
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={t("payouts.methods.placeholders.name")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("payouts.methods.fields.type")}*
          </label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleInputChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bank">
                {t("payouts.methods.types.bank")}
              </SelectItem>
              <SelectItem value="Cash">
                {t("payouts.methods.types.cash")}
              </SelectItem>
              <SelectItem value="Card">
                {t("payouts.methods.types.card")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("payouts.methods.fields.currency")}*
          </label>
          <Select
            value={formData.currency}
            onValueChange={(value) => handleInputChange("currency", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("payouts.methods.fields.description")}
          </label>
          <Textarea
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder={t("payouts.methods.placeholders.description")}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {method ? t("common.save") : t("common.create")}
          </Button>
        </div>
      </div>
    </MyDialog>
  );
}
