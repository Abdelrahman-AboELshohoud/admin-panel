import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PaymentGatewayType,
  PaymentGatewaysGQL,
  CreatePaymentGatewayGQL,
  UpdatePaymentGatewayGQL,
  PaymentGatewayInput,
  ViewPaymentGatewayGQL,
} from "../../../graphql/requests";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Eye, Plus } from "lucide-react";
import Switch from "../../../components/common/form-elements/Switch";
import MyTable from "../../../components/common/table-components/MyTable";
import Promotions from "../copouns/Promotions";
import Payouts from "../payouts/Payouts";
import AddGatewayDialog from "./AddGatewayDialog";
import ViewGatewayDialog from "./ViewGatewayDialog";
import MyTabs from "../../../components/common/MyTabs";

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

export interface PaymentGatewayForm {
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
  const [viewDialog, setViewDialog] = useState<ViewDialogState>({
    isOpen: false,
    gateway: null,
    activeTab: "details",
    isEditing: false,
  });
  const [createDialog, setCreateDialog] = useState<CreateDialogState>({
    isOpen: false,
  });
  const [_activeTab, setActiveTab] = useState("gateways");

  const fetchPaymentGateways = async () => {
    try {
      setLoading(true);
      const response = await PaymentGatewaysGQL({});
      console.log(response.data.paymentGateways.nodes);
      if (Array.isArray(response.data.paymentGateways.nodes)) {
        setPaymentGateways(response.data.paymentGateways.nodes);
      } else {
        setPaymentGateways([]);
      }
    } catch (error) {
      console.error("Error fetching payment gateways:", error);
      setPaymentGateways([]);
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

  const headers = [
    t("payment.title"),
    t("payment.type"),
    t("payment.status"),
    t("common.actions"),
  ];

  const rows = (Array.isArray(paymentGateways) ? paymentGateways : []).map(
    (gateway) => ({
      id: gateway.id,
      data: [
        gateway.title,
        gateway.type,
        <Switch
          key={`switch-${gateway.id}`}
          checked={gateway.enabled}
          disabled={false}
          onChange={(checked) => handleStatusToggle(gateway.id, checked)}
        />,
        gateway.isDefault ? (
          <Badge key={`badge-${gateway.id}`} className="bg-green-600">
            {t("payment.labels.default")}
          </Badge>
        ) : null,
        <Button
          key={`button-${gateway.id}`}
          variant="outline"
          size="sm"
          onClick={async () => {
            const response = await ViewPaymentGatewayGQL({
              id: gateway.id,
            });
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
          className="text-gray-500 hover:text-gray-600"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t("common.manage")}
        </Button>,
      ],
    })
  );

  const tabs = [
    { title: t("payment.gateways"), value: "gateways" },
    { title: t("payment.payouts"), value: "payouts" },
    { title: t("payment.promotions"), value: "promotions" },
  ];

  const GatewaysContent = () => (
    <>
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

      {loading ? (
        <div className="text-center py-8 text-gray-400">
          {t("common.loading")}
        </div>
      ) : (
        <MyTable headers={headers} rows={rows} />
      )}
    </>
  );

  const tabsContent = [
    { value: "gateways", content: <GatewaysContent /> },
    { value: "payouts", content: <Payouts /> },
    { value: "promotions", content: <Promotions /> },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <MyTabs
        tabs={tabs}
        tabsContent={tabsContent}
        setActiveTab={setActiveTab}
      />

      <ViewGatewayDialog
        setViewDialog={setViewDialog}
        viewDialog={viewDialog}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
      <AddGatewayDialog
        createDialog={createDialog}
        setCreateDialog={setCreateDialog}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </div>
  );
}
