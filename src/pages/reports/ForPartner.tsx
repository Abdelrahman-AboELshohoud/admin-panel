import { useTranslation } from "react-i18next";
import { Download, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import MyTable from "../../components/common/table-components/MyTable";
import { Input } from "../../components/ui/input";

const ForPartner = () => {
  const { t } = useTranslation();

  const selectOptions = {
    city: [{ value: "kazan", label: t("cityOptions.kazan") }],
    partner: [{ value: "olrusAuto", label: t("partnerOptions.olrusAuto") }],
    paymentType: [
      {
        value: "allPaymentTypes",
        label: t("paymentTypeOptions.allPaymentTypes"),
      },
    ],
  };

  const periodButtons = ["today", "yesterday", "june", "period"];

  return (
    <Card className="w-full bg-transparent max-w-4xl text-white border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("forPartner")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="gap-4 grid grid-cols-6">
          <Select defaultValue="kazan">
            <SelectTrigger className="w-full custom-input col-span-2">
              <SelectValue placeholder={t("selectCity")} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.city.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="olrusAuto">
            <SelectTrigger className="w-full custom-input col-span-2">
              <SelectValue placeholder={t("selectPartner")} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.partner.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="allPaymentTypes">
            <SelectTrigger className="w-full custom-input col-span-2">
              <SelectValue placeholder={t("selectPaymentType")} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.paymentType.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-6">
          {periodButtons.map((period) => (
            <Button
              key={period}
              className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]"
            >
              <span>{t(`periodButtons.${period}`)}</span>
            </Button>
          ))}
          <Input
            type="date"
            className="bg-[#1E1E1E] border-none text-white select-none"
            defaultValue="2023-07-08"
          />
          <Input
            type="date"
            className="bg-[#1E1E1E] border-none text-white select-none"
            defaultValue="2023-07-10"
          />
          <Button className="bg-zinc-800">{t("orderReport")}</Button>
        </div>

        <div className="bg-[#1C1C1E] rounded-xl">
          <MyTable
            headers={[
              t("tableHeaders.period"),
              t("tableHeaders.city"),
              t("tableHeaders.partner"),
              t("tableHeaders.payment"),
              t("tableHeaders.executors"),
              t("tableHeaders.status"),
              "",
            ]}
            rows={[
              {
                id: "1",
                data: [
                  "09.07.2023 - 09.07.2023",
                  t("cityOptions.kazan"),
                  "-",
                  "0",
                  "1",
                  t("currentAsOf", { date: "10.07.2023 22:32" }),
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>,
                ],
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ForPartner;
