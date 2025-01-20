import { useEffect, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  OrderStatus,
  OrdersListGQL,
  // CancelOrderGQL,
  OrderSortFields,
  SortDirection,
} from "../../graphql/requests";
import { useNavigate } from "react-router-dom";
import MyTable from "../../components/common/table-components/MyTable";
import Pagination from "../../components/common/table-components/Pagination";
import moment from "moment";

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

      // if (filters.searchTerm) {
      //   filterObject.or = [
      //     { id: { iLike: `%${filters.searchTerm}%` } },
      //     { addresses: { iLike: `%${filters.searchTerm}%` } },
      //   ];
      // }

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
      console.log(response);
      if (response?.data) {
        setOrders(response.data.orders.nodes);
        setTotalCount(response.data.orders.totalCount);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleFilterChange = (
    key: keyof OrderFilters,
    value: number | string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateChange = (key: "start" | "end", value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [key]: value,
      },
    }));
  };

  const rows = orders?.map((order) => ({
    id: order.id,
    data: [
      order.id,
      moment(order.createdOn).format("DD/MM/YYYY HH:mm"),
      moment(order.expectedTimestamp).format("DD/MM/YYYY HH:mm "),
      order.status,
      `${order.rider?.firstName} ${order.rider?.lastName}`,
      order.driver
        ? `${order.driver?.firstName} ${order.driver?.lastName}`
        : t("common.notAssigned"),
      order.service?.name,
      `${order.costAfterCoupon} ${order.currency}`,
      order.addresses?.join(" → "),
    ],
  }));

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
            onChange={(e) => handleDateChange("start", e.target.value)}
          />
          <Input
            type="date"
            onChange={(e) => handleDateChange("end", e.target.value)}
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

      <MyTable
        headers={[
          t("orders.table.id"),
          t("orders.table.createdOn"),
          t("orders.table.expectedTime"),
          t("orders.table.status"),
          t("orders.table.rider"),
          t("orders.table.driver"),
          t("orders.table.service"),
          t("orders.table.cost"),
          t("orders.inputs.address"),
        ]}
        rows={rows}
        navigate={(id?: string) =>
          id && navigate(`/control-panel/orders/${id}`)
        }
      />

      <Pagination
        currentPage={filters.page}
        totalPages={Math.ceil(totalCount / filters.limit)}
        onPageChange={(page: number) => handleFilterChange("page", page)}
      />
    </div>
  );
}
