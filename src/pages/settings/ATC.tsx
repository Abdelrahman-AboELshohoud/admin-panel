import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function ATC() {
  const { t } = useTranslation();

  return (
    <Card className="card-shape text-gray-100 w-1/2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("atc.title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <label htmlFor="ats-provider" className="text-sm font-medium">
            {t("atc.providerLabel")}
          </label>
          <Select defaultValue="disabled">
            <SelectTrigger id="ats-provider" className="custom-input">
              <SelectValue placeholder={t("atc.selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled">
                {t("atc.options.disable")}
              </SelectItem>
              <SelectItem value="custom">{t("atc.options.custom")}</SelectItem>
              <SelectItem value="runtel">{t("atc.options.runtel")}</SelectItem>
              <SelectItem value="sms">{t("atc.options.sms")}</SelectItem>
              <SelectItem value="common">{t("atc.options.common")}</SelectItem>
              <SelectItem value="runtel-new">
                {t("atc.options.runtelNew")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-1/3 ml-auto bg-primary hover:bg-primary/80 text-white"
          size="lg"
        >
          {t("atc.saveButton")}
        </Button>
      </CardContent>
    </Card>
  );
}
