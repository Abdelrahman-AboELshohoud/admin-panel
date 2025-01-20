import { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Driver, DriversListGQL, DriverFilter } from "../../graphql/requests";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/common/table-components/Pagination";
import MyTabs from "../../components/common/MyTabs";
import MyTable from "../../components/common/table-components/MyTable";
import DriversFilters from "../../components/pages/drivers/DriversFilters";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

export default function Drivers() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<DriverFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const fetchDrivers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await DriversListGQL({
        paging: {
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
        },
        filter: {
          ...filters,
          // status: activeTab.toUpperCase(),
        },
        // searchQuery,
      });

      if (response.data?.drivers) {
        setDrivers(response.data.drivers.nodes);
        setTotalCount(response.data.drivers.totalCount);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, searchQuery, activeTab]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleFilterChange = (newFilters: DriverFilter) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const headers = [
    t("drivers.columns.date_of_registration"),
    t("drivers.columns.photo"),
    t("drivers.columns.name"),
    t("drivers.columns.phone_number"),
    t("drivers.columns.rating"),
    t("drivers.columns.status"),
  ];

  const TabContent = () => (
    <>
      <DriversFilters
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
      />
      <div className="card-shape">
        <MyTable
          headers={headers}
          rows={drivers.map((driver) => ({
            id: driver.id,
            data: [
              format(new Date(driver.registrationTimestamp), "PPp"),
              driver.media?.address || "-",
              `${driver.firstName} ${driver.lastName}`,
              driver.mobileNumber,
              driver.rating?.toFixed(1) || "-",
              driver.status,
            ],
          }))}
          navigate={(id) => navigate(`/control-panel/drivers/${id}`)}
        />
      </div>

      {drivers && drivers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      )}
    </>
  );

  const tabs = [
    { title: t("tabs.active"), value: "active" },
    { title: t("tabs.blocked"), value: "blocked" },
    { title: t("tabs.inactive"), value: "inactive" },
  ];

  const tabsContent = [
    { value: "active", content: <TabContent /> },
    { value: "blocked", content: <TabContent /> },
    { value: "inactive", content: <TabContent /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-zinc-100">{t("drivers.title")}</h1>
        <Button
          variant="outline"
          onClick={() => navigate("/control-panel/drivers/add-driver")}
          className="gap-2 add-button"
        >
          <UserPlus size={16} />
          {t("drivers.buttons.add")}
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
