import { Button } from "../../../components/ui/button";
import Switch from "../../../components/common/Switch";
import { UserPlus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

import ClientsFilters from "../../../components/pages/drivers/DriversFilters";
import { Rider, RidersListGQL } from "../../../graphql/requests";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Pagination from "../../../components/common/Pagination";
import MyTable from "../../../components/common/MyTable";
import moment from "moment";

const tabItems = [
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "inactive", label: "Inactive" },
];

const Clients = () => {
  const location = useLocation();
  const [clients, setClients] = useState<Rider[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const TableColumns = [
    t("common.id"),
    t("clients.table.registrationDate"),
    t("clients.table.photo"),
    t("clients.table.name"),
    t("clients.table.mobileNumber"),
    t("clients.table.status"),
    t("clients.table.orders"),
  ];
  useEffect(() => {
    const getAllClients = async () => {
      const res = await RidersListGQL({
        paging: {
          offset: (currentPage - 1) * 10,
          limit: 10,
        },
      });
      setClients(res?.data?.riders?.nodes);
      setTotalPages(Math.ceil((res?.data?.riders?.totalCount || 0) / 10));
    };
    getAllClients();
  }, [currentPage]);

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue={location.pathname.split("/")[3]} className="w-full">
        <TabsList className="bg-transparent hover:bg-transparent mb-6 w-full">
          {tabItems &&
            tabItems.length > 0 &&
            tabItems.map((tab) => (
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
          <MyTable
            headers={TableColumns}
            rows={clients.map((client) => [
              client.id,
              <>
                {moment(client.registrationTimestamp).format("DD.MM.YYYY")}
                <br />
                {moment(client.registrationTimestamp).format("HH:mm A ")}
              </>,
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={client.media?.address || "/placeholder-image.jpg"}
                alt="client"
              />,
              <div className="flex items-center gap-1">
                <div className="font-medium text-gray-400">
                  {client.firstName}
                </div>
                <div className="text-sm">{client.lastName}</div>
              </div>,
              <div className="text-sm">
                {client.mobileNumber || t("notAssigned")}
              </div>,
              <div className="text-sm">
                {t(
                  `clients.client.status.${
                    client.status.charAt(0).toLowerCase() +
                    client.status.slice(1)
                  }`
                )}
              </div>,
              <div className="text-sm">{client?.orders?.totalCount || 0}</div>,
            ])}
            navigate={(id: string) =>
              navigate(
                `/control-panel/clients/${
                  location.pathname.split("/")[3]
                }/${id}/profile`
              )
            }
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>

        <TabsContent value="blocked" />
        <TabsContent value="inactive" />
      </Tabs>
    </div>
  );
};

export default Clients;
