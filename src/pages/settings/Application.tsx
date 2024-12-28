import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import Switch from "../../components/common/Switch";

interface PaymentMethod {
  id: string;
  name: string;
  visible: boolean;
}

export default function Application() {
  const { t } = useTranslation();
  const [demoMode, setDemoMode] = useState(false);
  const [restrictUnauthorized, _setRestrictUnauthorized] = useState(false);
  const [smsResendInterval, setSmsResendInterval] = useState("60");
  const [smsLifetime, setSmsLifetime] = useState("5");
  const [additionalFields, setAdditionalFields] = useState("email");
  const [requireProfile, _setRequireProfile] = useState(false);
  const [addressRequest, setAddressRequest] = useState("never");
  const [welcomeTitle, setWelcomeTitle] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const [showDriverTips, _setShowDriverTips] = useState(false);
  const [showDriverTerminal, _setShowDriverTerminal] = useState(false);

  const [paymentMethods, _setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "cash", name: t("application.paymentMethods.cash"), visible: true },
    {
      id: "card",
      name: t("application.paymentMethods.bankCard"),
      visible: true,
    },
    {
      id: "fast",
      name: t("application.paymentMethods.fastPayment"),
      visible: false,
    },
    {
      id: "personal",
      name: t("application.paymentMethods.personalAccount"),
      visible: true,
    },
    {
      id: "bonus",
      name: t("application.paymentMethods.bonusAccount"),
      visible: true,
    },
    {
      id: "terminal",
      name: t("application.paymentMethods.terminal"),
      visible: true,
    },
    {
      id: "corporate",
      name: t("application.paymentMethods.corporateBalance"),
      visible: true,
    },
  ]);

  const [orderScreenText, setOrderScreenText] = useState(
    t("application.orderScreenText")
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="card-shape border-none text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl">{t("application.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="demo-mode">{t("application.demoMode")}</label>
            <Select
              value={demoMode ? "enabled" : "disabled"}
              onValueChange={(v: string) => setDemoMode(v === "enabled")}
            >
              <SelectTrigger className="w-[180px] custom-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">
                  {t("application.enabled")}
                </SelectItem>
                <SelectItem value="disabled">
                  {t("application.disabled")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="restrict">
              {t("application.restrictUnauthorized")}
            </label>
            <Switch
              disabled={!restrictUnauthorized}
              checked={restrictUnauthorized}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label>{t("application.smsResendInterval")}</label>
              <Select
                value={smsResendInterval}
                onValueChange={setSmsResendInterval}
              >
                <SelectTrigger className="w-[180px] custom-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 {t("application.sec")}</SelectItem>
                  <SelectItem value="60">60 {t("application.sec")}</SelectItem>
                  <SelectItem value="90">90 {t("application.sec")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label>{t("application.smsLifetime")}</label>
              <Select value={smsLifetime} onValueChange={setSmsLifetime}>
                <SelectTrigger className="w-[180px] custom-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 {t("application.min")}</SelectItem>
                  <SelectItem value="5">5 {t("application.min")}</SelectItem>
                  <SelectItem value="10">10 {t("application.min")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label>{t("application.showAdditionalProfileFields")}</label>
              <Select
                value={additionalFields}
                onValueChange={setAdditionalFields}
              >
                <SelectTrigger className="w-[180px] custom-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    {t("application.email")}
                  </SelectItem>
                  <SelectItem value="none">{t("application.none")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label>{t("application.requireProfileCompletion")}</label>
              <Switch disabled={!requireProfile} checked={requireProfile} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shape border-none text-gray-100">
        <CardHeader>
          <CardTitle className="text-lg">
            {t("application.welcomeScreen")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <label>{t("application.addressRequest")}</label>
            <Select value={addressRequest} onValueChange={setAddressRequest}>
              <SelectTrigger className="custom-input w-1/2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">{t("application.never")}</SelectItem>
                <SelectItem value="first">
                  {t("application.firstVisit")}
                </SelectItem>
                <SelectItem value="always">
                  {t("application.always")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>{t("application.welcomeTitle")}</label>
            <Input
              value={welcomeTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setWelcomeTitle(e.target.value)
              }
              placeholder={t("application.enterWelcomeTitle")}
            />
          </div>

          <div className="space-y-2">
            <label>{t("application.welcomeText")}</label>
            <Textarea
              value={welcomeText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setWelcomeText(e.target.value)
              }
              placeholder={t("application.enterWelcomeMessage")}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label>{t("application.showDriverTips")}</label>
              <Switch disabled={!showDriverTips} checked={showDriverTips} />
            </div>

            <div className="flex items-center justify-between">
              <label>{t("application.showDriverTerminalPayment")}</label>
              <Switch disabled checked={showDriverTerminal} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shape border-none text-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t("application.orderScreenText")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="min-h-[100px]"
            value={orderScreenText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setOrderScreenText(e.target.value)
            }
          />
        </CardContent>
      </Card>

      <Card className="card-shape border-none text-gray-100">
        <CardHeader>
          <CardTitle>{t("application.paymentMethods.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between py-2"
              >
                <span>{method.name}</span>
                <div className="flex items-center gap-4">
                  <Switch disabled checked={method.visible} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
