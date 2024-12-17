import { X } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

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
  const handleDelete = (id: string) => {
    console.log(`Delete order with id: ${id}`);
    // Implement delete logic here
  };

  return (
    <div className="p-4 bg-[#1C1C1E] rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Executor</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Paid Count</TableHead>
            <TableHead>Paid Amount</TableHead>
            <TableHead>Unpaid Count</TableHead>
            <TableHead>Unpaid Amount</TableHead>
            <TableHead>Cancelled Count</TableHead>
            <TableHead>Efficiency</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-transparent">
              <TableCell>{`${order.id}, ${order.executor}`}</TableCell>
              <TableCell>{order.totalOrders}</TableCell>
              <TableCell>{order.paidCount}</TableCell>
              <TableCell>{`${order.paidAmount} ₽`}</TableCell>
              <TableCell>{order.unpaidCount}</TableCell>
              <TableCell>{`${order.unpaidAmount} ₽`}</TableCell>
              <TableCell>{order.cancelledCount}</TableCell>
              <TableCell>{order.efficiency}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleDelete(order.id)}
                >
                  <X />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
