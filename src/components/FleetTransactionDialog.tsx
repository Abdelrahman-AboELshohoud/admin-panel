import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import {
  CreateFleetTransactionGQL,
  TransactionAction,
} from "../graphql/requests";
import { MyDialog } from "./common/dialogs/MyDialog";

interface FleetTransactionDialogProps {
  fleetId: string;
  currencies: string[];
  onSuccess?: () => void;
}

export function FleetTransactionDialog({
  fleetId,
  currencies,
  onSuccess,
}: FleetTransactionDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    action: TransactionAction.Recharge,
    amount: 0,
    currency: currencies[0] || "USD",
    rechargeType: "BANK_TRANSFER",
    deductType: "",
    description: "",
    refrenceNumber: "",
  });

  const uniqueCurrencies = [...new Set(currencies)];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (
      formData.action === TransactionAction.Recharge &&
      !formData.rechargeType
    ) {
      newErrors.rechargeType = "Please select a recharge type";
    }

    if (formData.action === TransactionAction.Deduct && !formData.deductType) {
      newErrors.deductType = "Please select a deduct type";
    }

    if (!formData.refrenceNumber) {
      newErrors.refrenceNumber = "Please enter a reference number";
    }

    if (!formData.description) {
      newErrors.description = "Please enter a description";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await CreateFleetTransactionGQL({
        input: {
          fleetId,
          action: formData.action,
          amount: formData.amount,
          currency: formData.currency,
          rechargeType:
            formData.action === TransactionAction.Recharge
              ? formData.rechargeType
              : undefined,
          deductType:
            formData.action === TransactionAction.Deduct
              ? formData.deductType
              : undefined,
          description: formData.description,
          refrenceNumber: formData.refrenceNumber,
        },
      });

      console.log(response);
      setFormData({
        action: TransactionAction.Recharge,
        amount: 0,
        currency: currencies[0] || "USD",
        rechargeType: "",
        deductType: "",
        description: "",
        refrenceNumber: "",
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating transaction:", error);
      setErrors({ submit: "Failed to create transaction" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyDialog
      trigger={
        <Button variant="outline" className="w-fit add-button">
          {t("fleet.financials.createTransaction")}
        </Button>
      }
      title={t("fleet.financials.newTransaction")}
      isOpen={open}
      onOpenChange={setOpen}
      className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto"
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {errors.submit && (
          <div className="text-red-500 text-sm">{errors.submit}</div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>{t("fleet.financials.action")}</label>
            <Select
              value={formData.action}
              onValueChange={(value: TransactionAction) =>
                setFormData((prev) => ({ ...prev, action: value }))
              }
            >
              <SelectTrigger
                defaultValue={formData.action}
                className="bg-[#1E1E1E] text-gray-100 border-transparent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransactionAction.Recharge}>
                  {t("fleet.financials.recharge")}
                </SelectItem>
                <SelectItem value={TransactionAction.Deduct}>
                  {t("fleet.financials.deduct")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>{t("fleet.financials.amount")}</label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value),
                }))
              }
              required
              className="bg-gray-50"
            />
            {errors.amount && (
              <div className="text-red-500 text-sm">{errors.amount}</div>
            )}
          </div>

          <div className="space-y-2">
            <label>{t("fleet.financials.currency")}</label>
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, currency: value }))
              }
            >
              <SelectTrigger
                defaultValue={formData.currency}
                className="bg-[#1E1E1E] text-gray-100 border-transparent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uniqueCurrencies &&
                  uniqueCurrencies.length > 0 &&
                  uniqueCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {formData.action === TransactionAction.Recharge && (
            <div className="space-y-2">
              <label>{t("fleet.financials.rechargeType")}</label>
              <Select
                value={formData.rechargeType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, rechargeType: value }))
                }
              >
                <SelectTrigger
                  defaultValue={formData.rechargeType}
                  className="bg-[#1E1E1E] text-gray-100 border-transparent"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">
                    {t("fleet.financials.bankTransfer")}
                  </SelectItem>
                  <SelectItem value="CASH">
                    {t("fleet.financials.cash")}
                  </SelectItem>
                  <SelectItem value="CREDIT_CARD">
                    {t("fleet.financials.creditCard")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.rechargeType && (
                <div className="text-red-500 text-sm">
                  {errors.rechargeType}
                </div>
              )}
            </div>
          )}

          {formData.action === TransactionAction.Deduct && (
            <div className="space-y-2">
              <label>{t("fleet.financials.deductType")}</label>
              <Select
                value={formData.deductType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, deductType: value }))
                }
              >
                <SelectTrigger
                  defaultValue={formData.deductType}
                  className="bg-[#1E1E1E] text-gray-100 border-transparent  "
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WITHDRAWAL">
                    {t("fleet.financials.withdrawal")}
                  </SelectItem>
                  <SelectItem value="SERVICE_FEE">
                    {t("fleet.financials.serviceFee")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.deductType && (
                <div className="text-red-500 text-sm">{errors.deductType}</div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label>{t("fleet.financials.reference")}</label>
            <Input
              value={formData.refrenceNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  refrenceNumber: e.target.value,
                }))
              }
              className="bg-[#1E1E1E] text-gray-100"
            />
            {errors.refrenceNumber && (
              <div className="text-red-500 text-sm">
                {errors.refrenceNumber}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label>{t("fleet.financials.description")}</label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="bg-[#1E1E1E] text-gray-100"
            />
            {errors.description && (
              <div className="text-red-500 text-sm">{errors.description}</div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={loading} className="w-fit">
            {loading
              ? t("common.loading")
              : t("fleet.financials.createTransaction")}
          </Button>
        </div>
      </form>
    </MyDialog>
  );
}
