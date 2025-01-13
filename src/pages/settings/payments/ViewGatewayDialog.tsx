import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Switch from "../../../components/common/Switch";
import { useTranslation } from "react-i18next";
import { PaymentGatewayType } from "../../../graphql/requests";
import GatewayFields from "./GatewayFields";
import { MyDialog } from "../../../components/common/MyDialog";
import { PaymentGatewayForm } from "./Payment";

export default function ViewGatewayDialog({
  setViewDialog,
  viewDialog,
  formData,
  setFormData,
  handleSubmit,
  resetForm,
}: {
  setViewDialog: (data: typeof viewDialog) => void;
  viewDialog: any;
  formData: PaymentGatewayForm;
  setFormData: (data: PaymentGatewayForm) => void;
  handleSubmit: () => void;
  resetForm: () => void;
}) {
  const { t } = useTranslation();
  return (
    <MyDialog
      isOpen={viewDialog.isOpen}
      onOpenChange={(open) =>
        setViewDialog((prev: any) => ({
          ...prev,
          isOpen: open,
          isEditing: false,
        }))
      }
      title={
        <div className="flex items-center justify-between">
          <span className="text-gray-200">{viewDialog.gateway?.title}</span>
          <Badge
            className="text-gray-200"
            variant={viewDialog.gateway?.enabled ? "default" : "outline"}
          >
            {viewDialog.gateway?.enabled
              ? t("common.enabled")
              : t("common.disabled")}
          </Badge>
        </div>
      }
      className="max-w-3xl"
      showCloseButton={false}
    >
      <div className="h-[50vh] flex flex-col gap-4 mt-4 pr-4 custom-scrollbar overflow-y-auto ">
        {viewDialog.isEditing ? (
          <div className=" flex flex-col gap-10 h-full">
            <div className="space-y-2">
              <label className="text-gray-400 block mb-2">
                {t("payment.title")}
              </label>
              <Input
                value={formData.title}
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-gray-400 block mb-2">
                {t("payment.type")}
              </label>
              <Select
                value={formData.type}
                onValueChange={(value: PaymentGatewayType) =>
                  setFormData({
                    ...formData,
                    type: value,
                  })
                }
              >
                <SelectTrigger className="w-1/2 custom-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentGatewayType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <GatewayFields formData={formData} setFormData={setFormData} />
            <div className="flex justify-end gap-4 mt-auto">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setViewDialog((prev: any) => ({ ...prev, isEditing: false }));
                }}
                className="text-gray-600 hover:text-gray-700"
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSubmit}>{t("common.save")}</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className=" text-gray-400">{t("payment.type")}</label>
                <p className="text-gray-200">{viewDialog.gateway?.type}</p>
              </div>
              <div>
                <label className=" text-gray-400">
                  {t("payment.createdAt")}
                </label>
                <p className="text-gray-200">
                  {viewDialog.gateway?.createdAt &&
                    new Date(viewDialog.gateway.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className=" text-gray-400">
                  {t("payment.lastUsed")}
                </label>
                <p className="text-gray-200">
                  {viewDialog.gateway?.lastUsed &&
                    new Date(viewDialog.gateway.lastUsed).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <label className=" text-gray-400">
                  {t("payment.supportedCurrencies")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {viewDialog.gateway?.supportedCurrencies?.map(
                    (currency: string) => (
                      <Badge
                        key={currency}
                        variant="outline"
                        className="text-gray-200"
                      >
                        {currency}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>

            {viewDialog.gateway?.fees && viewDialog.gateway.fees.length > 0 && (
              <div className="mt-6 mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">
                  {t("payment.fees.title")}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {viewDialog.gateway.fees.map((fee: any, index: number) => (
                    <Card
                      key={index}
                      className="bg-transparent m-2  border-transparent"
                    >
                      <CardHeader>
                        <CardTitle className="text-gray-300">
                          {fee.currency}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <p className=" text-gray-400">
                            {t("payment.fees.fixed")}: {fee.fixed}
                          </p>
                          <p className=" text-gray-400">
                            {t("payment.fees.percent")}: {fee.percent}%
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card className="bg-transparent border-transparent">
                <CardHeader>
                  <CardTitle className="text-gray-300">
                    {t("payment.stats.transactions")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-200">
                    {viewDialog.gateway?.transactionCount || 0}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-transparent border-transparent ">
                <CardHeader>
                  <CardTitle className="text-gray-300">
                    {t("payment.stats.successRate")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-200">
                    {viewDialog.gateway?.successRate || 0}%
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              {viewDialog.gateway?.type === PaymentGatewayType.Stripe && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className=" text-gray-400">
                      {t("payment.publicKey")}
                    </label>
                    <p className="text-gray-200 font-mono bg-gray-900 p-2 rounded">
                      {viewDialog.gateway.publicKey}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className=" text-gray-400">
                      {t("payment.webhookUrl")}
                    </label>
                    <p className="text-gray-200 font-mono bg-gray-900 p-2 rounded">
                      {viewDialog.gateway.webhookUrl}
                    </p>
                  </div>
                </>
              )}
              {viewDialog.gateway?.type === PaymentGatewayType.PayPal && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className=" text-gray-400">
                      {t("payment.merchantId")}
                    </label>
                    <p className="text-gray-200 font-mono bg-gray-900 p-2 rounded">
                      {viewDialog.gateway.merchantId}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className=" text-gray-400">
                      {t("payment.ipnUrl")}
                    </label>
                    <p className="text-gray-200 font-mono bg-gray-900 p-2 rounded">
                      {viewDialog.gateway.ipnUrl}
                    </p>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <label className="text-gray-400 mb-2">
                  {t("payment.sandboxMode")}
                </label>
                <Switch
                  checked={viewDialog.gateway?.sandboxMode || false}
                  disabled={true}
                  onChange={() => {}}
                />
              </div>
            </div>
            <div className="flex justify-end mt-auto">
              <Button
                variant="outline"
                onClick={() =>
                  setViewDialog((prev: any) => ({ ...prev, isEditing: true }))
                }
                className="text-gray-600 hover:text-gray-700"
              >
                {t("common.edit")}
              </Button>
            </div>
          </>
        )}
      </div>
    </MyDialog>
  );
}
