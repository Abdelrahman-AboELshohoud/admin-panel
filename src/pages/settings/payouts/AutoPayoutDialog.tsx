import { useTranslation } from "react-i18next";
import { MyDialog } from "../../../components/common/dialogs/MyDialog";
import { useState } from "react";
import {
  PayoutMethod,
  PayoutSession,
  RunAutoPayoutGQL,
} from "../../../graphql/requests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { toast } from "react-hot-toast";

interface AutoPayoutForm {
  payoutMethodId: string;
  payoutSessionId: string;
}

interface AutoPayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payoutMethods: PayoutMethod[];
  payoutSessions: PayoutSession[];
  onSuccess: () => void;
}

export default function AutoPayoutDialog({
  isOpen,
  onOpenChange,
  payoutMethods,
  payoutSessions,
  onSuccess,
}: AutoPayoutDialogProps) {
  const { t } = useTranslation();
  const [autoPayoutData, setAutoPayoutData] = useState<AutoPayoutForm>({
    payoutMethodId: "",
    payoutSessionId: "",
  });

  const handleAutoPayout = async () => {
    try {
      if (!autoPayoutData.payoutMethodId || !autoPayoutData.payoutSessionId) {
        toast.error(t("payouts.errors.requiredFields"));
        return;
      }

      const response = await RunAutoPayoutGQL({
        input: {
          payoutMethodId: autoPayoutData.payoutMethodId,
          payoutSessionId: autoPayoutData.payoutSessionId,
        },
      });

      if (response.data?.runAutoPayout) {
        toast.success(t("payouts.autoPayout.success"));
        onSuccess();
        onOpenChange(false);
        setAutoPayoutData({
          payoutMethodId: "",
          payoutSessionId: "",
        });
      }
    } catch (error) {
      console.error("Error running auto payout:", error);
      toast.error(t("payouts.errors.autoPayoutFailed"));
    }
  };

  return (
    <MyDialog
      title={t("payouts.autoPayout.title")}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t("payouts.autoPayout.session")}
          </label>
          <Select
            value={autoPayoutData.payoutSessionId}
            onValueChange={(value) =>
              setAutoPayoutData((prev) => ({ ...prev, payoutSessionId: value }))
            }
          >
            <SelectTrigger className="w-full custom-input">
              <SelectValue
                placeholder={t("payouts.autoPayout.selectSession")}
              />
            </SelectTrigger>
            <SelectContent>
              {payoutSessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {session.currency} - {session.totalAmount}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t("payouts.autoPayout.method")}
          </label>
          <Select
            value={autoPayoutData.payoutMethodId}
            onValueChange={(value) =>
              setAutoPayoutData((prev) => ({ ...prev, payoutMethodId: value }))
            }
          >
            <SelectTrigger className="w-full custom-input">
              <SelectValue placeholder={t("payouts.autoPayout.selectMethod")} />
            </SelectTrigger>
            <SelectContent>
              {payoutMethods
                .filter(
                  (method) =>
                    method.currency ===
                    payoutSessions.find(
                      (s) => s.id === autoPayoutData.payoutSessionId
                    )?.currency
                )
                .map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name} ({method.currency})
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
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleAutoPayout}>{t("common.start")}</Button>
        </div>
      </div>
    </MyDialog>
  );
}
