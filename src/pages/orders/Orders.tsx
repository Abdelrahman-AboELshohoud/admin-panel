import { useEffect, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useTranslation } from "react-i18next";
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
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  OrderStatus,
  OrdersListGQL,
  // CancelOrderGQL,
  OrderSortFields,
  SortDirection,
} from "../../graphql/requests";
import { useNavigate } from "react-router-dom";

interface OrderFilters {
  status?: OrderStatus;
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  page: number;
  limit: number;
}

export default function Orders() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filterObject: any = {};

      if (filters.status) {
        filterObject.status = { eq: filters.status };
      }

      if (filters.searchTerm) {
        filterObject.or = [
          { id: { iLike: `%${filters.searchTerm}%` } },
          { addresses: { iLike: `%${filters.searchTerm}%` } },
        ];
      }

      if (filters.dateRange?.start && filters.dateRange?.end) {
        filterObject.createdOn = {
          between: {
            lower: new Date(filters.dateRange.start).toISOString(),
            upper: new Date(filters.dateRange.end).toISOString(),
          },
        };
      }

      const response = await OrdersListGQL({
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
      if (response?.data?.orders) {
        setOrders(response.data.orders.items);
        setTotalCount(response.data.orders.totalCount);
        setHasAccess(true);
      }
      setHasAccess(false);
    } catch (error) {
      setHasAccess(false);
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleFilterChange = (key: keyof OrderFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  };

  // const handleCancelOrder = async (orderId: string) => {
  //   try {
  //     await CancelOrderGQL({ orderId });
  //     fetchOrders(); // Refresh the list
  //   } catch (error) {
  //     console.error("Error canceling order:", error);
  //   }
  // };

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">{t("orders.orderHeader")}</h2>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <FaMapLocationDot size={20} />
            {t("orders.mapButton")}
          </Button>
          <Button
            onClick={() => navigate("/control-panel/orders/create")}
            className="gap-2"
          >
            <IoIosAddCircleOutline size={20} />
            {t("orders.newOrderButton")}
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-4 gap-4">
        <Input
          placeholder={t("orders.inputs.orderNumber")}
          onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          className="bg-background"
        />

        <Select
          onValueChange={(value) =>
            handleFilterChange("status", value as OrderStatus)
          }
        >
          <SelectTrigger className="custom-input">
            <SelectValue placeholder={t("orders.statusFilter.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("orders.statusFilter.all")}</SelectItem>
            {Object.values(OrderStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {t(`orders.statusFilter.${status.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            type="date"
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                start: e.target.value,
              })
            }
          />
          <Input
            type="date"
            onChange={(e) =>
              handleFilterChange("dateRange", {
                ...filters.dateRange,
                end: e.target.value,
              })
            }
          />
        </div>

        <Button
          onClick={() => fetchOrders()}
          disabled={loading}
          className="w-fit ml-auto"
        >
          {loading ? t("common.loading") : t("common.apply")}
        </Button>
      </div>

      <div className="text-gray-100 h-full flex card-shape">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none h-12">
              <TableHead>{t("orders.table.createdOn")}</TableHead>
              <TableHead>{t("orders.table.expectedTime")}</TableHead>
              <TableHead>{t("orders.table.status")}</TableHead>
              <TableHead>{t("orders.inputs.client")}</TableHead>
              <TableHead>{t("orders.table.cost")}</TableHead>
              <TableHead>{t("orders.inputs.address")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow className="hover:bg-transparent mb-4">
                <TableCell
                  colSpan={7}
                  className="text-center py-14 text-lg font-medium"
                >
                  {t("orders.noOrders")}
                </TableCell>
              </TableRow>
            )}
            {orders &&
              orders.length > 0 &&
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-transparent border-none h-12"
                  onClick={() => {
                    navigate(`/control-panel/orders/${order.id}`);
                  }}
                >
                  <TableCell>
                    {new Date(order.createdOn).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(order.expectedTimestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === OrderStatus.Finished
                          ? "default"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.rider?.firstName} {order.rider?.lastName}
                  </TableCell>
                  <TableCell>
                    {order.costAfterCoupon} {order.currency}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {order.addresses?.join(" → ")}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => handleFilterChange("page", filters.page - 1)}
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
          onClick={() => handleFilterChange("page", filters.page + 1)}
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
