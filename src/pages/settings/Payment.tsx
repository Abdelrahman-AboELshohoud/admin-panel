import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PaymentGatewayType,
  PaymentGatewaysGQL,
  CreatePaymentGatewayGQL,
  UpdatePaymentGatewayGQL,
  PaymentGatewayInput,
  ViewPaymentGatewayGQL,
} from "../../graphql/requests";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Eye, Plus } from "lucide-react";
import Switch from "../../components/common/Switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import Promotions from "./Promotions";
import Payouts from "./Payouts";

interface PaymentGateway {
  id: string;
  title: string;
  type: PaymentGatewayType;
  enabled: boolean;
  isDefault: boolean;
  privateKey: string;
  publicKey?: string;
  merchantId?: string;
  saltKey?: string;
  fees?: {
    fixed: number;
    percent: number;
    currency: string;
  }[];
  createdAt?: string;
  lastUsed?: string;
  transactionCount?: number;
  successRate?: number;
  configurations?: {
    key: string;
    value: string;
  }[];
  supportedCurrencies?: string[];
  webhookUrl?: string;
  ipnUrl?: string;
  sandboxMode?: boolean;
}

interface PaymentGatewayForm {
  title: string;
  type: PaymentGatewayType;
  enabled: boolean;
  privateKey: string;
  publicKey?: string;
  merchantId?: string;
  saltKey?: string;
}

interface ViewDialogState {
  isOpen: boolean;
  gateway: PaymentGateway | null;
  activeTab: "details" | "stats" | "config" | "edit";
  isEditing: boolean;
}

interface CreateDialogState {
  isOpen: boolean;
}

export default function Payment() {
  const { t } = useTranslation();
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [formData, setFormData] = useState<PaymentGatewayForm>({
    title: "",
    type: PaymentGatewayType.Stripe,
    enabled: true,
    privateKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);
  const [viewDialog, setViewDialog] = useState<ViewDialogState>({
    isOpen: false,
    gateway: null,
    activeTab: "details",
    isEditing: false,
  });
  const [createDialog, setCreateDialog] = useState<CreateDialogState>({
    isOpen: false,
  });

  const fetchPaymentGateways = async () => {
    try {
      setLoading(true);
      const response = await PaymentGatewaysGQL({});
      setPaymentGateways(response.data.paymentGateways);
      setHasAccess(true);
    } catch (error) {
      console.error("Error fetching payment gateways:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.privateKey) {
        console.error("Title and private key are required");
        return;
      }

      const input: PaymentGatewayInput = {
        title: formData.title,
        type: formData.type,
        enabled: formData.enabled,
        privateKey: formData.privateKey,
        publicKey: formData.publicKey,
        merchantId: formData.merchantId,
        saltKey: formData.saltKey,
      };

      if (viewDialog.gateway) {
        await UpdatePaymentGatewayGQL({
          id: viewDialog.gateway.id,
          input,
        });
      } else {
        await CreatePaymentGatewayGQL({
          input,
        });
      }
      await fetchPaymentGateways();
      setViewDialog((prev) => ({ ...prev, isOpen: false, isEditing: false }));
      setCreateDialog((prev) => ({ ...prev, isOpen: false }));
      resetForm();
    } catch (error) {
      console.error("Error saving payment gateway:", error);
    }
  };

  const handleStatusToggle = async (id: string, enabled: boolean) => {
    try {
      const gateway = paymentGateways.find((g) => g.id === id);
      if (gateway) {
        const input: PaymentGatewayInput = {
          title: gateway.title,
          type: gateway.type,
          enabled: enabled,
          privateKey: gateway.privateKey,
          publicKey: gateway.publicKey,
          merchantId: gateway.merchantId,
          saltKey: gateway.saltKey,
        };

        await UpdatePaymentGatewayGQL({
          id,
          input,
        });
        await fetchPaymentGateways();
      }
    } catch (error) {
      console.error("Error updating payment gateway status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: PaymentGatewayType.Stripe,
      enabled: true,
      privateKey: "",
    });
  };

  const renderGatewayFields = () => {
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
                setFormData((prev) => ({
                  ...prev,
                  privateKey: e.target.value,
                }))
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
                  setFormData((prev) => ({
                    ...prev,
                    publicKey: e.target.value,
                  }))
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
                  setFormData((prev) => ({
                    ...prev,
                    merchantId: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGatewayCard = (gateway: PaymentGateway) => (
    <Card key={gateway.id} className="card-shape border-transparent">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-gray-200">{gateway.title}</CardTitle>
            <CardDescription className="text-gray-400">
              {gateway.type}
            </CardDescription>
          </div>
          {gateway.isDefault && (
            <Badge className="bg-green-600">
              {t("payment.labels.default")}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-gray-400">{t("payment.status")}</label>
          <Switch
            checked={gateway.enabled}
            disabled={false}
            onChange={(checked) => handleStatusToggle(gateway.id, checked)}
          />
        </div>
        <Separator className="bg-gray-700" />
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const response = await ViewPaymentGatewayGQL({ id: gateway.id });
              const gatewayDetails = response.data.paymentGateway;

              setFormData({
                title: gatewayDetails.title,
                type: gatewayDetails.type,
                enabled: gatewayDetails.enabled,
                privateKey: gatewayDetails.privateKey,
                publicKey: gatewayDetails.publicKey,
                merchantId: gatewayDetails.merchantId,
                saltKey: gatewayDetails.saltKey,
              });
              setViewDialog({
                isOpen: true,
                gateway: gatewayDetails,
                activeTab: "details",
                isEditing: false,
              });
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            {t("common.manage")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCreateDialog = () => (
    <Dialog
      open={createDialog.isOpen}
      onOpenChange={(open) => setCreateDialog({ isOpen: open })}
    >
      <DialogContent className="card-shape max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-200">
            {t("payment.addGateway")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="space-y-2">
            <label className="text-gray-400 block">{t("payment.title")}</label>
            <Input
              value={formData.title}
              required
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 block">{t("payment.type")}</label>
            <Select
              value={formData.type}
              onValueChange={(value: PaymentGatewayType) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="w-full custom-input">
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

          {renderGatewayFields()}

          <div className="flex items-center gap-2">
            <Switch
              disabled={false}
              checked={formData.enabled}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, enabled: checked }))
              }
            />
            <label className="text-gray-400">
              {t("payment.enableGateway")}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setCreateDialog({ isOpen: false });
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("common.create")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderViewDialog = () => (
    <Dialog
      open={viewDialog.isOpen}
      onOpenChange={(open) =>
        setViewDialog((prev) => ({ ...prev, isOpen: open, isEditing: false }))
      }
    >
      <DialogContent className="card-shape max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between p-4">
            <span className="text-gray-200">{viewDialog.gateway?.title}</span>
            <Badge
              className="text-gray-200"
              variant={viewDialog.gateway?.enabled ? "default" : "outline"}
            >
              {viewDialog.gateway?.enabled
                ? t("common.enabled")
                : t("common.disabled")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="h-[60vh] mt-4 pr-4 custom-scrollbar overflow-y-auto ">
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
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
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
                    setFormData((prev) => ({ ...prev, type: value }))
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
              {renderGatewayFields()}
              <div className="flex justify-end gap-4 mt-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setViewDialog((prev) => ({ ...prev, isEditing: false }));
                  }}
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
                      new Date(
                        viewDialog.gateway.createdAt
                      ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className=" text-gray-400">
                    {t("payment.lastUsed")}
                  </label>
                  <p className="text-gray-200">
                    {viewDialog.gateway?.lastUsed &&
                      new Date(
                        viewDialog.gateway.lastUsed
                      ).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <label className=" text-gray-400">
                    {t("payment.supportedCurrencies")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {viewDialog.gateway?.supportedCurrencies?.map(
                      (currency) => (
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

              {viewDialog.gateway?.fees &&
                viewDialog.gateway.fees.length > 0 && (
                  <div className="mt-6 mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-200">
                      {t("payment.fees.title")}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {viewDialog.gateway.fees.map((fee, index) => (
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
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setViewDialog((prev) => ({ ...prev, isEditing: true }))
                  }
                >
                  {t("common.edit")}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="gateways" className="w-full">
        <TabsList className="flex gap-4 w-fit bg-transparent">
          <TabsTrigger value="gateways" className="custom-tabs">
            {t("payment.gateways")}
          </TabsTrigger>
          <TabsTrigger value="payouts" className="custom-tabs">
            {t("payment.payouts")}
          </TabsTrigger>
          <TabsTrigger value="promotions" className="custom-tabs">
            {t("payment.promotions")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gateways">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-200">
              {t("payment.title")}
            </h1>
            <Button
              onClick={() => {
                resetForm();
                setCreateDialog({ isOpen: true });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("payment.addGateway")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8 text-gray-400">
                {t("common.loading")}
              </div>
            ) : paymentGateways && paymentGateways.length > 0 ? (
              paymentGateways.map(renderGatewayCard)
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">
                {t("payment.noGateways")}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payouts">
          <Payouts />
        </TabsContent>

        <TabsContent value="promotions">
          <Promotions />
        </TabsContent>
      </Tabs>

      {renderViewDialog()}
      {renderCreateDialog()}
    </div>
  );
}
