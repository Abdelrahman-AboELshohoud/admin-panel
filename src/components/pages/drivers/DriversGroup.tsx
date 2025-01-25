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
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Pagination from "../../common/table-components/Pagination";
import MyTable from "../../common/table-components/MyTable";
import { Fleet, FleetFilter, FleetsListGQL } from "../../../graphql/requests";

interface FleetFilters {
  filter?: FleetFilter;
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
    filter: undefined,
    search: "",
    page: 1,
    limit: 10,
  });

  const fetchFleets = async () => {
    try {
      setLoading(true);
      const response = await FleetsListGQL({
        paging: {
          offset: (filters.page - 1) * filters.limit,
          limit: filters.limit,
        },
        filter: filters.filter,
      });

      if (response.data?.fleets) {
        const filteredFleets = response.data.fleets.nodes.filter(
          (fleet: Fleet) =>
            fleet.name.toLowerCase().includes(filters.search.toLowerCase())
        );
        setFleets(filteredFleets);
        setTotalCount(response.data.fleets.totalCount);
      }
    } catch (error) {
      console.error("Error fetching fleets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleets();
  }, [filters]);

  const handleFilterChange = (
    key: keyof FleetFilters,
    value: string | number | FleetFilter | undefined
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
      fleet.address || "",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          value={filters.filter?.name?.eq || "all"}
          onValueChange={(value) =>
            handleFilterChange(
              "filter",
              value === "all" ? undefined : { name: { eq: value } }
            )
          }
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
