import { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button";
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
import DriverRow from "../../components/pages/drivers/DriverRow";
import DriversFilters from "../../components/pages/drivers/DriversFilters";
import { Driver, DriversListGQL, DriverFilter } from "../../graphql/requests";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/common/Pagination";

const ITEMS_PER_PAGE = 10;

const TableColumns = [
  "Date of registration",
  "Photo",
  "Name",
  "Phone number",
  "Rating",
  "Status",
  "Reviews count",
];

const tabItems = [
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "inactive", label: "Inactive" },
];

const Drivers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<DriverFilter>({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDrivers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await DriversListGQL({
        paging: {
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
        },
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
  }, [currentPage, filters, searchQuery]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleFilterChange = (newFilters: DriverFilter) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue={location.pathname.split("/")[3]} className="w-full">
        <TabsList className="bg-transparent hover:bg-transparent mb-6 w-full">
          {tabItems.map((tab) => (
            <TabsTrigger
              onClick={() => {
                navigate(`/control-panel/drivers/${tab.value}`);
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
              onClick={(e) => {
                e.preventDefault();
                navigate("/control-panel/drivers/add-driver");
              }}
              className="gap-2 add-button"
            >
              <UserPlus size={16} />
              {t("drivers.buttons.add")}
            </Button>
          </div>
        </TabsList>

        <TabsContent value={location.pathname.split("/")[3]}>
          <DriversFilters
            onFilterChange={handleFilterChange}
            onSearchChange={setSearchQuery}
            isLoading={isLoading}
          />
          <div className="card-shape">
            <Table>
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  {TableColumns.map((column) => (
                    <TableHead key={column} className="text-gray-400">
                      {t(
                        `drivers.columns.${column
                          .toLowerCase()
                          .replace(/\s+/g, "_")}`
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <td
                      colSpan={TableColumns.length}
                      className="text-center py-8"
                    >
                      {t("common.loading")}
                    </td>
                  </TableRow>
                ) : drivers.length > 0 ? (
                  drivers.map((driver) => (
                    <DriverRow
                      key={driver.id}
                      data={driver}
                      id={String(driver.id)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={TableColumns.length}
                      className="text-center py-8"
                    >
                      {t("drivers.no_results")}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {drivers.length > 0 && (
            <Pagination
              filters={filters}
              setFilters={setFilters}
              totalCount={totalCount}
              loading={isLoading}
              t={t}
            />
          )}
        </TabsContent>

        <TabsContent value="blocked" />
        <TabsContent value="inactive" />
      </Tabs>
    </div>
  );
};

export default Drivers;
