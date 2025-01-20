import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MyTable from "../../components/common/table-components/MyTable";
import MyTabs from "../../components/common/MyTabs";

interface Branch {
  id: string;
  title: string;
  sorting: number;
  status: "active" | "blocked";
}

export default function BranchesManager() {
  const { t } = useTranslation();
  const [branches, _setBranches] = useState<Branch[]>([
    { id: "1", title: "Kazan", sorting: 100, status: "active" },
  ]);
  const [_activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  const headers = [t("branches.table.title"), t("branches.table.sorting")];

  const tabs = [
    {
      title: "Active",
      value: "active",
    },
    {
      title: "Blocked",
      value: "blocked",
    },
  ];

  const tabsContent = [
    {
      value: "active",
      content: (
        <MyTable
          key="active"
          headers={headers}
          rows={branches
            .filter((branch) => branch.status === "active")
            .map((branch) => ({
              id: branch.id,
              data: [
                { data: branch.title },
                { data: branch.sorting, className: "text-right" },
              ],
            }))}
        />
      ),
    },
    {
      value: "blocked",
      content: (
        <MyTable
          key="blocked"
          headers={headers}
          rows={branches
            .filter((branch) => branch.status === "blocked")
            .map((branch) => ({
              id: branch.id,
              data: [
                { data: branch.title },
                { data: branch.sorting, className: "text-right" },
              ],
            }))}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="text-2xl font-normal flex flex-row justify-between px-2 mb-4">
        {t("branches.title")}
        <Button
          variant="outline"
          className="add-button"
          onClick={() => {
            navigate("/control-panel/directories/add-branch");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("branches.addButton")}
        </Button>
      </div>
      <div className="bg-[#1C1C1E] rounded-xl p-4">
        <MyTabs
          tabs={tabs}
          tabsContent={tabsContent}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
