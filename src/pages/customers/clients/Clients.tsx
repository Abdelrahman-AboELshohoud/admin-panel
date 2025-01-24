import { Button } from "../../../components/ui/button";
import Switch from "../../../components/common/form-elements/Switch";
import { UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import MyTabs from "../../../components/common/MyTabs";
import ClientsFilters from "../../../components/pages/drivers/DriversFilters";
import { Rider, RidersListGQL } from "../../../graphql/requests";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Pagination from "../../../components/common/table-components/Pagination";
import MyTable from "../../../components/common/table-components/MyTable";
import moment from "moment";

const tabItems = [
  { value: "active", title: "Active" },
  { value: "blocked", title: "Blocked" },
  { value: "inactive", title: "Inactive" },
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
  const TableContent = () => {
    return (
      <>
        <ClientsFilters />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-sm text-gray-300">{t("clients.online")}</span>
            <Switch checked={false} disabled={false} />
          </div>
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
        <MyTable
          headers={TableColumns}
          rows={clients.map((client) => ({
            id: client.id,
            data: [
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
            ],
          }))}
          navigate={(id) =>
            id &&
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
      </>
    );
  };

  const tabsContent = [
    {
      value: "active",
      content: <TableContent />,
    },
    {
      value: "blocked",
      content: <TableContent />,
    },
    {
      value: "inactive",
      content: <TableContent />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6 ">
        <MyTabs
          tabs={tabItems}
          tabsContent={tabsContent}
          setActiveTab={(value) => navigate(`/control-panel/clients/${value}`)}
        />
      </div>
    </div>
  );
};

export default Clients;
