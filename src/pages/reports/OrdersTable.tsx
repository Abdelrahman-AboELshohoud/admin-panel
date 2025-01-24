import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import MyTable from "../../components/common/table-components/MyTable";

interface Order {
  id: string;
  executor: string;
  totalOrders: number;
  paidCount: number;
  paidAmount: number;
  unpaidCount: number;
  unpaidAmount: number;
  cancelledCount: number;
  efficiency: string;
}

const orders: Order[] = [
  {
    id: "22287",
    executor: "Dolgov Dmitry",
    totalOrders: 1,
    paidCount: 0,
    paidAmount: 0,
    unpaidCount: 0,
    unpaidAmount: 0,
    cancelledCount: 0,
    efficiency: "0%",
  },
  // ... other orders
];

export default function OrdersTable() {
  const { t } = useTranslation();

  const handleDelete = (id: string) => {
    console.log(`Delete order with id: ${id}`);
    // Implement delete logic here
  };

  return (
    <MyTable
      headers={[
        t("orderstable.executor"),
        t("orderstable.totalOrders"),
        t("orderstable.paidCount"),
        t("orderstable.paidAmount"),
        t("orderstable.unpaidCount"),
        t("orderstable.unpaidAmount"),
        t("orderstable.cancelledCount"),
        t("orderstable.efficiency"),
        "",
      ]}
      rows={orders.map((order) => ({
        id: order.id,
        data: [
          `${order.id}, ${order.executor}`,
          order.totalOrders,
          order.paidCount,
          `${order.paidAmount} ₽`,
          order.unpaidCount,
          `${order.unpaidAmount} ₽`,
          order.cancelledCount,
          order.efficiency,
          <Button
            variant="destructive"
            className="h-8 w-8 rounded-full"
            onClick={() => handleDelete(order.id)}
          >
            <X />
          </Button>,
        ],
      }))}
    />
  );
}
