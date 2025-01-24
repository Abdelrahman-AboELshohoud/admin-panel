import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTranslation } from "react-i18next";
import { Operator, UsersListGQL } from "../../graphql/requests";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyTable from "../../components/common/table-components/MyTable";
import MyTabs from "../../components/common/MyTabs";

export default function Employees() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Operator[]>([]);
  const [hasAccess, setHasAccess] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    position: "",
    partner: "",
    search: "",
    searchBy: "",
  });

  const AllUsers = async () => {
    try {
      const res = await UsersListGQL({});
      setUsers(res.data.operators.nodes);
      setHasAccess(true);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setHasAccess(false);
    }
  };

  const staff = users || [];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    AllUsers();
  }, []);

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }

  const getTableHeaders = (tab: string) => {
    const headers = [
      t("employees.table.fullName"),
      t("employees.table.jobTitle"),
      t("employees.table.email"),
      t("employees.table.phone"),
    ];
    if (tab === "invitations") {
      headers.push(t("employees.table.actions"));
    }
    return headers;
  };

  const getTableRows = (tab: string) => {
    return staff.map((member) => {
      const baseData = [
        member.firstName + " " + member.lastName,
        member.role?.title || "",
        member.email,
        member.mobileNumber,
      ];

      if (tab === "invitations") {
        return {
          id: member.id,
          data: [
            ...baseData,
            <div className="flex gap-4">
              <Button className="bg-transparent border-green-500 border-2 text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-md">
                {t("employees.actions.sendAgain")}
              </Button>
              <Button className="bg-transparent border-red-500 border-2 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-md">
                {t("employees.actions.cancel")}
              </Button>
            </div>,
          ],
        };
      }

      return {
        id: member.id,
        data: baseData,
      };
    });
  };

  const TabContent = ({ tab }: { tab: string }) => {
    return (
      <>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Select
            value={filters.city}
            onValueChange={(value) => handleFilterChange("city", value)}
          >
            <SelectTrigger className="custom-input">
              <SelectValue placeholder={t("employees.filters.allCities")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("employees.filters.allCities")}
              </SelectItem>
              <SelectItem value="kazan">
                {t("employees.filters.kazan")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.position}
            onValueChange={(value) => handleFilterChange("position", value)}
          >
            <SelectTrigger className="custom-input">
              <SelectValue placeholder={t("employees.filters.post")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("employees.filters.allPosts")}
              </SelectItem>
              <SelectItem value="administrator">
                {t("employees.filters.administrator")}
              </SelectItem>
              <SelectItem value="partnerEmployee">
                {t("employees.filters.partnerEmployee")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.partner}
            onValueChange={(value) => handleFilterChange("partner", value)}
          >
            <SelectTrigger className="custom-input">
              <SelectValue placeholder={t("employees.filters.partners")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("employees.filters.allPartners")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder={t("employees.search.fullName")}
            className="bg-zinc-900 border-zinc-700 text-zinc-100"
          />
          <Input
            value={filters.searchBy}
            onChange={(e) => handleFilterChange("searchBy", e.target.value)}
            placeholder={t("employees.search.toFind")}
            className="bg-black border-zinc-700 text-zinc-100"
          />
        </div>

        {hasAccess ? (
          <MyTable
            headers={getTableHeaders(tab)}
            rows={getTableRows(tab)}
            navigate={(id?: string) =>
              navigate(id ? `/control-panel/directories/employees/${id}` : "")
            }
          />
        ) : (
          <div className="text-center text-zinc-100 py-20">
            {t("employees.errors.noAccess")}
          </div>
        )}
      </>
    );
  };

  const tabItems = [
    { value: "working", title: t("employees.tabs.working") },
    { value: "invitations", title: t("employees.tabs.invitations") },
    { value: "blocked", title: t("employees.tabs.blocked") },
  ];

  const tabsContent = tabItems.map((tab) => ({
    value: tab.value,
    content: <TabContent tab={tab.value} />,
  }));

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-zinc-100">{t("employees.title")}</h1>
        {hasAccess && (
          <div>
            <Button
              onClick={() =>
                navigate("/control-panel/directories/roles-management")
              }
              className="add-button"
            >
              {t("employees.manageRoles")}
            </Button>
            <Button
              onClick={() =>
                navigate("/control-panel/directories/employees/add")
              }
              className="add-button"
            >
              {t("employees.addNew")}
            </Button>
          </div>
        )}
      </div>

      <MyTabs
        tabs={tabItems}
        tabsContent={tabsContent}
        setActiveTab={(value) =>
          navigate(`/control-panel/directories/employees/${value}`)
        }
      />
    </div>
  );
}
