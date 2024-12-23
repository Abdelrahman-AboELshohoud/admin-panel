import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const handleDelete = (id: string) => {
    console.log(`Delete order with id: ${id}`);
    // Implement delete logic here
  };

  return (
    <div className="p-4 bg-[#1C1C1E] rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{t('orderstable.executor')}</TableHead>
            <TableHead>{t('orderstable.totalOrders')}</TableHead>
            <TableHead>{t('orderstable.paidCount')}</TableHead>
            <TableHead>{t('orderstable.paidAmount')}</TableHead>
            <TableHead>{t('orderstable.unpaidCount')}</TableHead>
            <TableHead>{t('orderstable.unpaidAmount')}</TableHead>
            <TableHead>{t('orderstable.cancelledCount')}</TableHead>
            <TableHead>{t('orderstable.efficiency')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={orders[0].id} className="hover:bg-transparent">
            <TableCell>{`${orders[0].id}, ${orders[0].executor}`}</TableCell>
            <TableCell>{orders[0].totalOrders}</TableCell>
            <TableCell>{orders[0].paidCount}</TableCell>
            <TableCell>{`${orders[0].paidAmount} ₽`}</TableCell>
            <TableCell>{orders[0].unpaidCount}</TableCell>
            <TableCell>{`${orders[0].unpaidAmount} ₽`}</TableCell>
            <TableCell>{orders[0].cancelledCount}</TableCell>
            <TableCell>{orders[0].efficiency}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                className="h-8 w-8 rounded-full"
                onClick={() => handleDelete(orders[0].id)}
              >
                <X />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
