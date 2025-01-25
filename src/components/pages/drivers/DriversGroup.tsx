import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Pagination from "../../common/table-components/Pagination";
import MyTable from "../../common/table-components/MyTable";

enum FleetStatus {
  Active = "Active",
  Blocked = "Blocked",
}

interface Fleet {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  status: FleetStatus;
  accountNumber: string;
  commissionSharePercent: number;
  commissionShareFlat: number;
}

interface FleetFilters {
  status: FleetStatus | "all";
  city: string;
  search: string;
  page: number;
  limit: number;
}

export default function DriversGroups() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FleetFilters>({
    status: "all",
    city: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  const fetchFleets = async () => {
    try {
      setLoading(true);
      // Filter mock data based on filters
      let filteredFleets = [...fleets];

      if (filters.status !== "all") {
        filteredFleets = filteredFleets.filter(
          (fleet) => fleet.status === filters.status
        );
      }

      if (filters.city !== "all") {
        filteredFleets = filteredFleets.filter((fleet) =>
          fleet.address.toLowerCase().includes(filters.city.toLowerCase())
        );
      }

      if (filters.search) {
        filteredFleets = filteredFleets.filter(
          (fleet) =>
            fleet.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            fleet.phoneNumber.includes(filters.search)
        );
      }

      setFleets(filteredFleets);
      setTotalCount(filteredFleets.length);
    } catch (error) {
      console.error("Error fetching fleets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleets();
  }, [filters]);

  const handleTabChange = (value: FleetStatus | "all") => {
    setFilters((prev: FleetFilters) => ({ ...prev, status: value, page: 1 }));
  };

  const handleFilterChange = (
    key: keyof FleetFilters,
    value: string | number
  ) => {
    setFilters((prev: FleetFilters) => ({ ...prev, [key]: value }));
  };

  const headers = [
    t("common.name"),
    t("common.address"),
    t("common.phoneNumber"),
    t("common.commission"),
  ];

  const rows = fleets.map((fleet) => ({
    id: fleet.id,
    data: [
      fleet.name,
      fleet.address,
      fleet.phoneNumber,
      `${fleet.commissionSharePercent}% + ${fleet.commissionShareFlat}`,
    ],
  }));

  return (
    <div className="bg-background text-foreground p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("fleetDrivers")}</h1>
        <Button
          onClick={() => navigate("/control-panel/drivers-groups/add-group")}
          className="add-button"
        >
          <Plus className="mr-2 h-4 w-4" /> {t("add")}
        </Button>
      </div>

      <Tabs
        value={filters.status}
        onValueChange={(value: string) =>
          handleTabChange(value as FleetStatus | "all")
        }
        className="w-full"
      >
        <TabsList className="bg-transparent flex justify-start gap-4 mb-6">
          <TabsTrigger
            value="all"
            className="bg-transparent px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("all")}
          </TabsTrigger>
          <TabsTrigger
            value={FleetStatus.Active}
            className="bg-transparent px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("active")}
          </TabsTrigger>
          <TabsTrigger
            value={FleetStatus.Blocked}
            className="bg-transparent px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("blocked")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          value={filters.city}
          onValueChange={(value) => handleFilterChange("city", value)}
        >
          <SelectTrigger className="custom-input">
            <SelectValue placeholder={t("common.allCities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allCities")}</SelectItem>
            <SelectItem value="kazan">{t("kazan")}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder={t("common.search")}
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="custom-input"
        />
      </div>

      {loading ? (
        <div className="text-center py-4">{t("common.loading")}</div>
      ) : (
        <MyTable
          headers={headers}
          rows={rows}
          navigate={(id) =>
            navigate(`/control-panel/drivers-groups/fleet/${id}`)
          }
        />
      )}

      <Pagination
        currentPage={filters.page}
        totalPages={Math.ceil(totalCount / filters.limit)}
        onPageChange={(page: number) => handleFilterChange("page", page)}
      />
    </div>
  );
}
