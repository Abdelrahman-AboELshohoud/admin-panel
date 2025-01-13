import { useTranslation } from "react-i18next";
import { MyDialog } from "../../../components/common/MyDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { format } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface TransactionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: Transaction[];
}

export default function TransactionsDialog({
  isOpen,
  onOpenChange,
  transactions,
}: TransactionsDialogProps) {
  const { t } = useTranslation();

  return (
    <MyDialog
      title={t("payouts.methods.transactions")}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
    >
      <div className="space-y-4">
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("payouts.transactions.date")}</TableHead>
                <TableHead>{t("payouts.transactions.amount")}</TableHead>
                <TableHead>{t("payouts.transactions.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.createdAt), "PPp")}
                  </TableCell>
                  <TableCell>
                    {transaction.amount} {transaction.currency}
                  </TableCell>
                  <TableCell>{transaction.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">
            {t("payouts.transactions.noData")}
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
        </div>
      </div>
    </MyDialog>
  );
}
