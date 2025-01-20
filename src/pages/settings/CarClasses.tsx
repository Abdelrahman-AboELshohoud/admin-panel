import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import MyTable from "../../components/common/table-components/MyTable";
import MyTabs from "../../components/common/MyTabs";
import { ReactNode } from "react";

interface CarClassItem {
  name: string;
  branch: string;
  activityPeriod: string;
  status: string;
}

export default function CarClasses() {
  const { t } = useTranslation();
  const [_activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  const tabs = [
    { title: t("carClasses.tabs.active"), value: "active" },
    { title: t("carClasses.tabs.blocked"), value: "blocked" },
  ];

  const tabsContent = [
    { value: "active", content: <CarsTable items={[]} /> },
    { value: "blocked", content: <CarsTable items={[]} /> },
  ];

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-gray-100 font-semibold tracking-tight">
          {t("carClasses.title")}
        </h1>
        <Button
          className="gap-2 add-button"
          onClick={() => {
            navigate("/control-panel/directories/add-car-class");
          }}
        >
          <Plus className="h-4 w-4" />
          {t("carClasses.addButton")}
        </Button>
      </div>

      <MyTabs
        tabs={tabs}
        tabsContent={tabsContent}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

function CarsTable({ items }: { items: CarClassItem[] }) {
  const { t } = useTranslation();

  const headers = [
    t("carClasses.table.headers.branchAndType"),
    t("carClasses.table.headers.yearOfRelease"),
    t("carClasses.table.headers.assignACar"),
    t("carClasses.table.headers.city"),
  ];

  const rows = items.map((item) => ({
    id: item.name, // Using name as ID since no ID field available
    data: [
      item.name,
      item.branch,
      item.activityPeriod,
      item.status,
    ] as ReactNode[],
  }));

  return (
    <div>
      <div className="grid grid-cols-6 gap-6 mb-6 ">
        <Select>
          <SelectTrigger className="col-span-2 h-10 border-none custom-input">
            <SelectValue placeholder={t("carClasses.selects.cities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cities">
              {t("carClasses.selects.cities")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="col-span-2 h-10 border-none custom-input">
            <SelectValue placeholder={t("carClasses.selects.types")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="types">
              {t("carClasses.selects.types")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="card-shape">
        <MyTable headers={headers} rows={rows} />
      </div>
    </div>
  );
}
