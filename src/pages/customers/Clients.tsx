import { Button } from "../../components/ui/button";
import Switch from "../../components/common/Switch";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { UserPlus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import ClientRow from "./ClientsRow";
import ClientsFilters from "../../components/pages/drivers/DriversFilters";
import { Rider, RidersListGQL } from "../../graphql/requests";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const tabItems = [
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "inactive", label: "Inactive" },
];

const TableColumns = [
  "Registration Date",
  "Photo",
  "Name",
  "Mobile Number",
  "Status",
  "Orders",
];

const Clients = () => {
  const location = useLocation();
  const [clients, setClients] = useState<Rider[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const getAllClients = async () => {
      const res = await RidersListGQL({
        paging: {
          offset: 0,
          limit: 10,
        },
      });
      setClients(res?.data?.riders?.nodes);
    };
    getAllClients();
  }, []);

  const renderPagination = () => (
    <div className="flex items-center gap-2 mt-4">
      <Button variant="outline" size="icon" className="w-8 h-8">
        1
      </Button>
      <Button variant="outline" size="icon" className="w-8 h-8 text-gray-400">
        2
      </Button>
      <span className="text-gray-400">...</span>
      <Button variant="outline" size="icon" className="w-8 h-8 text-gray-400">
        7
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue={location.pathname.split("/")[3]} className="w-full">
        <TabsList className="bg-transparent hover:bg-transparent mb-6 w-full">
          {tabItems.map((tab) => (
            <TabsTrigger
              onClick={() => {
                navigate(`/control-panel/clients/${tab.value}`);
              }}
              key={tab.value}
              value={tab.value}
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
            >
              {t(`tabs.${tab.value}`)}
            </TabsTrigger>
          ))}
          <div className="ml-auto">
            <Button
              variant="outline"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                navigate("/control-panel/clients/add-client");
              }}
              className="gap-2 add-button"
            >
              <UserPlus size={16} />
              {t("clients.buttons.add")}
            </Button>
          </div>
        </TabsList>

        <TabsContent value={location.pathname.split("/")[3]}>
          <ClientsFilters />

          {location.pathname.split("/")[3] === "active" && (
            <div className="flex items-center gap-6 mb-6">
              <span className="text-sm text-gray-300">
                {t("clients.online")}
              </span>
              <Switch checked={false} disabled={false} />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                {TableColumns.map((column) => (
                  <TableHead key={column} className="text-gray-400">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients &&
                clients?.map((client: Rider) => (
                  <ClientRow
                    key={client.id}
                    data={client}
                    id={String(client.id)}
                  />
                ))}
            </TableBody>
          </Table>

          {renderPagination()}
        </TabsContent>

        <TabsContent value="blocked" />
        <TabsContent value="inactive" />
      </Tabs>
    </div>
  );
};

export default Clients;
