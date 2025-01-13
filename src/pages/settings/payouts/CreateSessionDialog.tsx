import { useTranslation } from "react-i18next";
import { MyDialog } from "../../../components/common/MyDialog";
import { useState } from "react";
import {
  PayoutMethod,
  CreatePayoutSessionGQL,
} from "../../../graphql/requests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { toast } from "react-hot-toast";

interface CreateSessionForm {
  currency: string;
  minimumAmount: number;
  description: string;
  payoutMethodIds: string[];
}

interface CreateSessionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currencies: string[];
  payoutMethods: PayoutMethod[];
  onSuccess: () => void;
}

export default function CreateSessionDialog({
  isOpen,
  onOpenChange,
  currencies,
  payoutMethods,
  onSuccess,
}: CreateSessionDialogProps) {
  const { t } = useTranslation();
  const [newSession, setNewSession] = useState<CreateSessionForm>({
    currency: "",
    minimumAmount: 0,
    description: "",
    payoutMethodIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSession = async () => {
    try {
      setIsSubmitting(true);

      if (
        !newSession.currency ||
        !newSession.minimumAmount ||
        newSession.payoutMethodIds.length === 0
      ) {
        toast.error(t("payouts.errors.requiredFields"));
        return;
      }

      const response = await CreatePayoutSessionGQL({
        input: {
          currency: newSession.currency,
          minimumAmount: newSession.minimumAmount,
          description: newSession.description,
          payoutMethodIds: newSession.payoutMethodIds,
        },
      });

      if (response.data?.createPayoutSession) {
        toast.success(t("payouts.createSession.success"));
        onSuccess();
        onOpenChange(false);
        setNewSession({
          currency: "",
          minimumAmount: 0,
          description: "",
          payoutMethodIds: [],
        });
      }
    } catch (error: any) {
      console.error("Error creating payout session:", error);
      if (error?.message?.includes("No drivers to payout")) {
        toast.error(t("payouts.errors.noDrivers"));
      } else {
        toast.error(t("payouts.errors.createFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MyDialog
      title={t("payouts.createSession.title")}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t("payouts.createSession.currency")}
          </label>
          <Select
            value={newSession.currency}
            onValueChange={(value) =>
              setNewSession((prev) => ({ ...prev, currency: value }))
            }
          >
            <SelectTrigger className="w-full custom-input">
              <SelectValue
                placeholder={t("payouts.createSession.selectCurrency")}
              />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t("payouts.createSession.minimumAmount")}
          </label>
          <Input
            type="number"
            value={newSession.minimumAmount}
            onChange={(e) =>
              setNewSession((prev) => ({
                ...prev,
                minimumAmount: parseFloat(e.target.value),
              }))
            }
            className="w-full custom-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t("payouts.createSession.description")}
          </label>
          <Input
            value={newSession.description}
            onChange={(e) =>
              setNewSession((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full custom-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t("payouts.createSession.payoutMethods")}
          </label>
          <Select
            value={newSession.payoutMethodIds.join(",")}
            onValueChange={(value) =>
              setNewSession((prev) => ({
                ...prev,
                payoutMethodIds: value.split(",").filter(Boolean),
              }))
            }
          >
            <SelectTrigger className="w-full custom-input">
              <SelectValue
                placeholder={t("payouts.createSession.selectMethods")}
              />
            </SelectTrigger>
            <SelectContent>
              {payoutMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            className="text-gray-600"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreateSession} disabled={isSubmitting}>
            {t("common.create")}
          </Button>
        </div>
      </div>
    </MyDialog>
  );
}
