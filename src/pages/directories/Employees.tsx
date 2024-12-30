import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import { Operator, UsersListGQL } from "../../graphql/requests";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Employees() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("working");
  const [filters, setFilters] = useState({
    city: "",
    position: "",
    partner: "",
    search: "",
    searchBy: "",
  });
  const [users, setUsers] = useState<Operator[]>([]);
  const [hasAccess, setHasAccess] = useState(true);

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

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="bg-transparent mb-2">
          <TabsTrigger value="working" className="custom-tabs">
            {t("employees.tabs.working")}
          </TabsTrigger>
          <TabsTrigger value="invitations" className="custom-tabs">
            {t("employees.tabs.invitations")}
          </TabsTrigger>
          <TabsTrigger value="blocked" className="custom-tabs">
            {t("employees.tabs.blocked")}
          </TabsTrigger>
        </TabsList>

        {["working", "invitations", "blocked"].map((tab) => (
          <TabsContent key={tab} value={tab}>
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

            <div className="card-shape">
              <Table>
                <TableHeader>
                  <TableRow className="border-transparent text-slate-300 hover:bg-transparent">
                    <TableHead>{t("employees.table.fullName")}</TableHead>
                    <TableHead>{t("employees.table.jobTitle")}</TableHead>
                    <TableHead>{t("employees.table.email")}</TableHead>
                    <TableHead>{t("employees.table.phone")}</TableHead>
                    {tab === "invitations" && (
                      <TableHead>{t("employees.table.actions")}</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hasAccess ? (
                    staff.map((member) => (
                      <TableRow
                        key={member.id}
                        className="border-transparent hover:bg-transparent py-2 h-14"
                        onClick={() =>
                          navigate(
                            `/control-panel/directories/employees/${member.id}`
                          )
                        }
                      >
                        <TableCell className="text-zinc-100">
                          <div className="flex items-center gap-2">
                            {member.firstName} {member.lastName}
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-100">
                          {member.role?.title}
                        </TableCell>
                        <TableCell className="text-zinc-100">
                          {member.email}
                        </TableCell>
                        <TableCell className="text-zinc-100">
                          {member.mobileNumber}
                        </TableCell>
                        {tab === "invitations" && (
                          <TableCell className="text-zinc-100 flex gap-4">
                            <Button className="bg-transparent border-green-500 border-2 text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-md">
                              {t("employees.actions.sendAgain")}
                            </Button>
                            <Button className="bg-transparent border-red-500 border-2 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-md">
                              {t("employees.actions.cancel")}
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-zinc-100"
                      >
                        {t("employees.errors.noAccess")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
