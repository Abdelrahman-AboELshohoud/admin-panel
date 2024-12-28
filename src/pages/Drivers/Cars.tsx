import { Button } from "../../components/ui/button";
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
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { UserPlus } from "lucide-react";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
} from "../../components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import CarRow from "../../components/pages/drivers/CarRow";
import { DriversListGQL } from "../../graphql/requests";
import { useCallback, useEffect, useState } from "react";
import { t } from "i18next";
import Pagination from "../../components/common/Pagination";

const ITEMS_PER_PAGE = 10;

const tabItems = [
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "inactive", label: "Inactive" },
];

const Cars = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    city: "all",
    company: "all",
    carType: "all",
    color: "all",
    autoOption: "all",
    rental: "all",
    search: "",
  });

  const getDriverCars = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await DriversListGQL({
        paging: {
          offset: (filters.page - 1) * filters.limit,
          limit: filters.limit,
        },
      });

      if (response.data) {
        setCars(response.data.drivers.nodes);
        setTotalCount(response.data.drivers.totalCount);
      }
    } catch (error) {
      console.error("Error fetching driver cars:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    getDriverCars();
  }, [getDriverCars]);

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
              {tab.label}
            </TabsTrigger>
          ))}
          <div className="ml-auto">
            <Button variant="outline" className="gap-2 add-button">
              <UserPlus size={16} />
              {t("add")}
            </Button>
          </div>
        </TabsList>

        <TabsContent value={location.pathname.split("/")[3]}></TabsContent>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Select
            value={filters.city}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, city: value }))
            }
          >
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.company}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, company: value }))
            }
          >
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.carType}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, carType: value }))
            }
          >
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All types of cars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types of cars</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.color}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, color: value }))
            }
          >
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All car colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All car colors</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.autoOption}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, autoOption: value }))
            }
          >
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All auto options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All auto options</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.rental}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, rental: value }))
            }
          >
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="Rental cars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rental cars</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search by brand, model, state..."
            className="bg-[#1E1E1E] border-none"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />

          <div className="col-span-2 flex justify-end">
            <Button
              className="bg-black text-white hover:bg-black/90 px-8"
              onClick={() => {
                setFilters((prev) => ({ ...prev, page: 1 }));
                getDriverCars();
              }}
            >
              {t("show")}
            </Button>
          </div>
        </div>
        <div className="card-shape">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-gray-400">
                  {t("cars.carPlate")}
                </TableHead>
                <TableHead className="text-gray-400">
                  {t("drivers.driver.title")}
                </TableHead>
                <TableHead className="text-gray-400">
                  {t("cars.carProductionYear")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <td colSpan={3} className="text-center py-14">
                    {t("common.loading")}
                  </td>
                </TableRow>
              ) : cars.length > 0 ? (
                cars.map((car: any) => <CarRow key={car.id} car={car} />)
              ) : (
                <TableRow>
                  <td colSpan={3} className="text-center py-14">
                    {t("common.no_results")}
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {cars.length > 0 && (
          <Pagination
            filters={filters}
            setFilters={setFilters}
            totalCount={totalCount}
            loading={isLoading}
            t={t}
          />
        )}
      </Tabs>
    </div>
  );
};

export default Cars;
