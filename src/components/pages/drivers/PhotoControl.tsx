import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MyTable from "../../common/table-components/MyTable";

export default function PhotoControl() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const headers = [
    t("photoControl.table.profession"),
    t("photoControl.table.carClass"),
    t("photoControl.table.city"),
  ];

  let rows: any[] = []; // Add rows data when available

  return (
    <div className="p-6 space-y-6 bg-background text-foreground min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("photoControl.title")}</h1>
        <Button
          variant="outline"
          size="sm"
          className="add-button border-none"
          onClick={() => {
            navigate("/control-panel/drivers-photo-control/add-photo");
          }}
        >
          <Plus className="h-4 w-4 mr-2 bg-transparent" />
          {t("photoControl.addButton")}
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-transparent hover:bg-transparent mb-6 ">
          <TabsTrigger
            value="active"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("photoControl.tabs.active")}
          </TabsTrigger>
          <TabsTrigger
            value="blocked"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("photoControl.tabs.blocked")}
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("photoControl.tabs.reports")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select>
          <SelectTrigger className="custom-input">
            <SelectValue placeholder={t("photoControl.selects.allCities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-cities">
              {t("photoControl.selects.allCities")}
            </SelectItem>
            <SelectItem value="new-york">
              {t("photoControl.selects.newYork")}
            </SelectItem>
            <SelectItem value="london">
              {t("photoControl.selects.london")}
            </SelectItem>
            <SelectItem value="paris">
              {t("photoControl.selects.paris")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="custom-input">
            <SelectValue placeholder={t("photoControl.selects.profession")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="driver">
              {t("photoControl.selects.driver")}
            </SelectItem>
            <SelectItem value="courier">
              {t("photoControl.selects.courier")}
            </SelectItem>
            <SelectItem value="delivery">
              {t("photoControl.selects.delivery")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="custom-input">
            <SelectValue placeholder={t("photoControl.selects.carClass")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="economy">
              {t("photoControl.selects.economy")}
            </SelectItem>
            <SelectItem value="comfort">
              {t("photoControl.selects.comfort")}
            </SelectItem>
            <SelectItem value="business">
              {t("photoControl.selects.business")}
            </SelectItem>
            <SelectItem value="premium">
              {t("photoControl.selects.premium")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="custom-input">
            <SelectValue placeholder={t("photoControl.selects.period")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shift-start">
              {t("photoControl.selects.shiftStart")}
            </SelectItem>
            <SelectItem value="24h">
              {t("photoControl.selects.every24Hours")}
            </SelectItem>
            <SelectItem value="week">
              {t("photoControl.selects.everyWeek")}
            </SelectItem>
            <SelectItem value="month">
              {t("photoControl.selects.everyMonth")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MyTable headers={headers} rows={rows} />
    </div>
  );
}
