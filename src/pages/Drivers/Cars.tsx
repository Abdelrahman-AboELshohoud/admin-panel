import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { UserPlus } from "lucide-react";
import { Driver, DriversListGQL } from "../../graphql/requests";
import { useCallback, useEffect, useState } from "react";
import { t } from "i18next";
import Pagination from "../../components/common/table-components/Pagination";
import MyTable from "../../components/common/table-components/MyTable";
import MyTabs from "../../components/common/MyTabs";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Cars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Driver[]>([]);
  const [_isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [_activeTab, setActiveTab] = useState("active");
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

  const columns = [
    { header: t("cars.carPlate"), accessor: "carPlate" },
    { header: t("drivers.driver.title"), accessor: "driver" },
    { header: t("cars.carProductionYear"), accessor: "productionYear" },
    { header: t("cars.callSign"), accessor: "callSign" },
    { header: t("cars.carLicensePlateNumber"), accessor: "carLicense" },
    { header: t("cars.type"), accessor: "carType" },
    { header: t("cars.partner"), accessor: "partner" },
  ];

  const TabContent = () => (
    <>
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
      <div>
        <MyTable
          headers={columns.map((column) => column.header)}
          rows={cars.map((car: Driver) => ({
            id: car.id,
            data: [
              <img
                className="w-12 h-12 rounded-md object-cover"
                alt={"no plate"}
                src={car.carPlate || ""}
              />,
              `${car.firstName} ${car.lastName || ""}`,
              car.carProductionYear || t("common.notAssigned"),
              t("common.notAssigned"),
              car.carPlate || t("common.notAssigned"),
              "Bussiness",
            ],
          }))}
          navigate={(id) => navigate(`/control-panel/cars/active/${id}/active`)}
        />
      </div>

      {cars.length > 0 && (
        <Pagination
          currentPage={filters.page}
          totalPages={Math.ceil(totalCount / filters.limit)}
          onPageChange={(page: number) =>
            setFilters((prev) => ({ ...prev, page: page }))
          }
        />
      )}
    </>
  );

  const tabs = [
    { title: "Active", value: "active" },
    { title: "Blocked", value: "blocked" },
    { title: "Inactive", value: "inactive" },
  ];

  const tabsContent = [
    { value: "active", content: <TabContent /> },
    { value: "blocked", content: <TabContent /> },
    { value: "inactive", content: <TabContent /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-zinc-100">{t("cars.title")}</h1>
        <Button variant="outline" className="gap-2 add-button">
          <UserPlus size={16} />
          {t("add")}
        </Button>
      </div>

      <MyTabs
        tabs={tabs}
        tabsContent={tabsContent}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default Cars;
