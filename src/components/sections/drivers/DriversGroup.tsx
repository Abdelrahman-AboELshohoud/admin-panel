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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

const mockFleets: Fleet[] = [
  {
    id: "1",
    name: "Premium Fleet Services",
    address: "123 Main St, Kazan",
    phoneNumber: "+7 (999) 123-4567",
    status: FleetStatus.Active,
    accountNumber: "ACC123456",
    commissionSharePercent: 15,
    commissionShareFlat: 100,
  },
  {
    id: "2",
    name: "City Drivers Co",
    address: "456 Oak Ave, Kazan",
    phoneNumber: "+7 (999) 765-4321",
    status: FleetStatus.Blocked,
    accountNumber: "ACC789012",
    commissionSharePercent: 12,
    commissionShareFlat: 75,
  },
  {
    id: "3",
    name: "Express Fleet",
    address: "789 Pine Rd, Moscow",
    phoneNumber: "+7 (999) 246-8135",
    status: FleetStatus.Active,
    accountNumber: "ACC345678",
    commissionSharePercent: 18,
    commissionShareFlat: 150,
  },
];

export default function DriversGroups() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fleets, setFleets] = useState<Fleet[]>(mockFleets);
  const [totalCount, setTotalCount] = useState(mockFleets.length);
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
      let filteredFleets = [...mockFleets];

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

  const handleFilterChange = (key: keyof FleetFilters, value: string) => {
    setFilters((prev: FleetFilters) => ({ ...prev, [key]: value, page: 1 }));
  };

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
        onValueChange={handleTabChange}
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
            <SelectValue placeholder={t("allCities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCities")}</SelectItem>
            <SelectItem value="kazan">{t("kazan")}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder={t("search")}
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="custom-input"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent py-2">
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("address")}</TableHead>
            <TableHead>{t("phoneNumber")}</TableHead>
            <TableHead>{t("commission")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fleets.map((fleet: Fleet) => (
            <TableRow
              key={fleet.id}
              className="hover:bg-transparent cursor-pointer h-12"
              onClick={() =>
                navigate(`/control-panel/drivers-groups/fleet/${fleet.id}`)
              }
            >
              <TableCell>{fleet.name}</TableCell>
              <TableCell>{fleet.address}</TableCell>
              <TableCell>{fleet.phoneNumber}</TableCell>
              <TableCell>
                {fleet.commissionSharePercent}% + {fleet.commissionShareFlat}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {loading && <div className="text-center py-4">{t("common.loading")}</div>}

      {!loading && fleets.length === 0 && (
        <div className="text-center py-4 text-gray-500">{t("noFleets")}</div>
      )}

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() =>
            setFilters((prev: FleetFilters) => ({
              ...prev,
              page: prev.page - 1,
            }))
          }
          disabled={filters.page === 1 || loading}
        >
          {t("common.previous")}
        </Button>
        <span>
          {t("common.page")} {filters.page} /{" "}
          {Math.ceil(totalCount / filters.limit)}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setFilters((prev: FleetFilters) => ({
              ...prev,
              page: prev.page + 1,
            }))
          }
          disabled={
            filters.page >= Math.ceil(totalCount / filters.limit) || loading
          }
        >
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
}
