import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  OrderStatus,
  RiderOrdersGQL,
  RiderOrdersQuery,
  OrderSortFields,
  SortDirection,
} from "../../graphql/requests";
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
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{t("orders.table.date")}</TableHead>
            <TableHead>{t("orders.table.status")}</TableHead>
            <TableHead>{t("orders.table.distance")}</TableHead>
            <TableHead>{t("orders.table.duration")}</TableHead>
            <TableHead>{t("orders.table.cost")}</TableHead>
            <TableHead>{t("orders.table.addresses")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-neutral-800">
              <TableCell>
                {new Date(order.createdOn).toLocaleDateString()}
                <br />
                <span className="text-sm text-gray-400">
                  {new Date(order.createdOn).toLocaleTimeString()}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.distanceBest}km</TableCell>
              <TableCell>{order.durationBest}min</TableCell>
              <TableCell>
                {order.costAfterCoupon} {order.currency}
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate">
                  {order.addresses.join(" → ")}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {orders.length === 0 && !loading && (
        <div className="text-center py-14 text-gray-400">
          {t("orders.noOrders")}
        </div>
      )}

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
