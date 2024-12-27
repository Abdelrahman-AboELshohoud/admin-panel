import { useState, useEffect, useCallback } from "react";
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
import DriverRow from "../../components/sections/drivers/DriverRow";
import DriversFilters from "../../components/sections/drivers/DriversFilters";
import {
  Driver,
  DriversListGQL,
  DriverSearchGQL,
  DriverFilter,
} from "../../graphql/requests";
import { useTranslation } from "react-i18next";

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
        filter: {
          ...filters,
          ...(searchQuery && {
            or: [
              { firstName: { ilike: `%${searchQuery}%` } },
              { lastName: { ilike: `%${searchQuery}%` } },
              { phone: { ilike: `%${searchQuery}%` } },
            ],
          }),
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

  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const maxVisiblePages = 5;
    const pages = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key="1"
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => setCurrentPage(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) pages.push(<span key="dots1">...</span>);
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant="outline"
          size="icon"
          className={`w-8 h-8 ${
            currentPage === i ? "bg-primary text-white" : "text-gray-400"
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<span key="dots2">...</span>);
      pages.push(
        <Button
          key={totalPages}
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          {t("common.previous")}
        </Button>
        {pages}
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          {t("common.next")}
        </Button>
      </div>
    );
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

          {drivers.length > 0 && renderPagination()}
        </TabsContent>

        <TabsContent value="blocked" />
        <TabsContent value="inactive" />
      </Tabs>
    </div>
  );
};

export default Drivers;
