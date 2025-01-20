import { useEffect, useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import MyTable from "../../../components/common/table-components/MyTable";
import {
  OrderStatus,
  RiderOrdersGQL,
  RiderOrdersQuery,
  OrderSortFields,
  SortDirection,
} from "../../../graphql/requests";
import { useTranslation } from "react-i18next";

interface ClientOrdersProps {
  riderId: string;
}

interface OrderFilters {
  status: OrderStatus | "all";
  dateRange: {
    start: string;
    end: string;
  };
  page: number;
  limit: number;
}

export default function ClientOrders({ riderId }: ClientOrdersProps) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<
    RiderOrdersQuery["rider"]["orders"]["nodes"]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    status: "all",
    dateRange: {
      start: new Date().toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
    page: 1,
    limit: 10,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Build filter object based on selected filters
      const filterObject: any = {};

      if (filters.status !== "all") {
        filterObject.status = { eq: filters.status };
      }

      if (filters.dateRange.start && filters.dateRange.end) {
        filterObject.createdOn = {
          between: {
            lower: new Date(filters.dateRange.start).toISOString(),
            upper: new Date(filters.dateRange.end).toISOString(),
          },
        };
      }

      const response = await RiderOrdersGQL({
        riderId,
        filter: filterObject,
        paging: {
          limit: filters.limit,
          offset: (filters.page - 1) * filters.limit,
        },
        sorting: [
          {
            field: OrderSortFields.CreatedOn,
            direction: SortDirection.Desc,
          },
        ],
      });

      if (response?.data?.rider?.orders) {
        setOrders(response.data.rider.orders.nodes);
        setTotalCount(response.data.rider.orders.totalCount);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (riderId) {
      fetchOrders();
    }
  }, [riderId, filters]);

  const handleFilterChange = (key: keyof OrderFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset page when filters change
      page: key !== "page" ? 1 : value,
    }));
  };

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Finished:
        return "default";
      case OrderStatus.DriverCanceled:
        return "outline";
      case OrderStatus.RiderCanceled:
        return "destructive";
      default:
        return "default";
    }
  };

  const headers = [
    t("orders.table.date"),
    t("orders.table.status"),
    t("orders.table.distance"),
    t("orders.table.duration"),
    t("orders.table.cost"),
    t("orders.table.addresses"),
  ];

  const rows = loading
    ? [
        {
          id: "loading",
          data: <div className="text-center py-4">{t("common.loading")}</div>,
        },
      ]
    : orders.length === 0
    ? [
        {
          id: "no-data",
          data: (
            <div className="text-center py-14 text-gray-400">
              {t("orders.noOrders")}
            </div>
          ),
        },
      ]
    : orders.map((order) => ({
        id: order.id,
        data: [
          <>
            {new Date(order.createdOn).toLocaleDateString()}
            <br />
            <span className="text-sm text-gray-400">
              {new Date(order.createdOn).toLocaleTimeString()}
            </span>
          </>,
          <Badge variant={getStatusBadgeVariant(order.status)}>
            {order.status}
          </Badge>,
          `${order.distanceBest}km`,
          `${order.durationBest}min`,
          `${order.costAfterCoupon} ${order.currency}`,
          <div className="max-w-xs truncate">
            {order.addresses.join(" → ")}
          </div>,
        ],
      }));

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="grid grid-cols-3 gap-4">
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="bg-[#1E1E1E] border-none">
            <SelectValue placeholder={t("orders.filters.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("orders.filters.allStatuses")}
            </SelectItem>
            {Object.values(OrderStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {t(`orders.filters.${status.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                start: e.target.value,
              })
            }
            className="bg-[#1E1E1E] border-none"
          />
          <Input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                end: e.target.value,
              })
            }
            className="bg-[#1E1E1E] border-none"
          />
        </div>

        <Button
          onClick={() => handleFilterChange("page", 1)}
          className="bg-[#C2A87D] hover:bg-[#b39a6f] text-black"
          disabled={loading}
        >
          {loading ? t("common.loading") : t("common.apply")}
        </Button>
      </div>

      {/* Orders Table */}
      <MyTable headers={headers} rows={rows} />

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => handleFilterChange("page", filters.page - 1)}
          disabled={filters.page === 1 || loading}
          variant="outline"
        >
          {t("common.previous")}
        </Button>

        <span className="text-gray-400">
          {t("common.page")} {filters.page} /{" "}
          {Math.ceil(totalCount / filters.limit)}
        </span>

        <Button
          onClick={() => handleFilterChange("page", filters.page + 1)}
          disabled={
            filters.page >= Math.ceil(totalCount / filters.limit) || loading
          }
          variant="outline"
        >
          {t("common.next")}
        </Button>
      </div>

      {/* Summary Section */}
      <div className="flex justify-between items-center bg-[#1E1E1E] p-4 rounded-lg">
        <span>{t("orders.summary.total")}</span>
        <span>
          {orders
            .reduce((sum, order) => sum + (order.costAfterCoupon || 0), 0)
            .toFixed(2)}
          {orders[0]?.currency}
        </span>
      </div>
    </div>
  );
}
