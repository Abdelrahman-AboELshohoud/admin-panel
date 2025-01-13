import {  PaymentGatewayType } from "../../../graphql/requests";
import { Input } from "../../../components/ui/input";
import { useTranslation } from "react-i18next";
import { PaymentGatewayForm } from "./Payment";

export default function GatewayFields({
  formData,
  setFormData,
}: {
  formData: PaymentGatewayForm;
  setFormData: (data: PaymentGatewayForm) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 block mb-2">
            {t("payment.privateKey")}
          </label>
          <Input
            type="password"
            value={formData.privateKey}
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                privateKey: e.target.value,
              })
            }
          />
        </div>
        {formData.type === PaymentGatewayType.Stripe && (
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 block mb-2">
              {t("payment.publicKey")}
            </label>
            <Input
              value={formData.publicKey || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publicKey: e.target.value,
                })
              }
            />
          </div>
        )}
        {formData.type === PaymentGatewayType.PayPal && (
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 block mb-2">
              {t("payment.merchantId")}
            </label>
            <Input
              value={formData.merchantId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  merchantId: e.target.value,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
