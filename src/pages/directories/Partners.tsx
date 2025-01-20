import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MyTable from "../../components/common/table-components/MyTable";
import MyTabs from "../../components/common/MyTabs";

interface Partner {
  id: number;
  name: string;
  sort: number;
}

export default function Partners() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const partners: Partner[] = [
    { id: 1, name: "Kalina", sort: 4 },
    { id: 2, name: "Altynbaev", sort: 3 },
    { id: 3, name: "Olrus Auto", sort: 1 },
  ];

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headers = [t("partners.tableHeadName"), t("partners.tableHeadSort")];

  const rows = filteredPartners.map((partner) => ({
    id: partner.id.toString(),
    data: [
      <Link to="#" className="text-primary hover:underline">
        {partner.name}
      </Link>,
      partner.sort,
    ],
  }));

  const tabLabels = [
    { title: "active", value: "active" },
    { title: "blocked", value: "blocked" },
  ];

  const tabContents = [
    {
      value: "active",
      content: (
        <div className="p-4 bg-[#383838] rounded-xl shadow-lg shadow-[#282828] border-none">
          <MyTable headers={headers} rows={rows} />
        </div>
      ),
    },
    {
      value: "blocked",
      content: (
        <div className="text-center py-6 text-muted-foreground">
          {t("partners.noBlockedPartners")}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t("partners.title")}</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            navigate("/control-panel/directories/add-partner");
          }}
        >
          <Plus className="h-4 w-4" />
          {t("partners.addNewPartner")}
        </Button>
      </div>

      <div className="mt-4">
        <Input
          placeholder={t("partners.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm custom-input"
        />
      </div>

      <div className="mt-4">
        <MyTabs
          tabs={tabLabels}
          tabsContent={tabContents}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
