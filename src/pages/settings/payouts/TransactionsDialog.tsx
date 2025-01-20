import { useTranslation } from "react-i18next";
import { MyDialog } from "../../../components/common/dialogs/MyDialog";
import { Button } from "../../../components/ui/button";
import { format } from "date-fns";
import MyTable from "../../../components/common/table-components/MyTable";
import { ReactNode } from "react";

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

  const headers = [
    t("payouts.transactions.date"),
    t("payouts.transactions.amount"),
    t("payouts.transactions.status"),
  ];

  const rows = transactions.map((transaction) => ({
    id: transaction.id,
    data: [
      format(new Date(transaction.createdAt), "PPp"),
      `${transaction.amount} ${transaction.currency}`,
      transaction.status,
    ] as ReactNode[],
  }));

  return (
    <MyDialog
      title={t("payouts.methods.transactions")}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
    >
      <div className="space-y-4">
        {transactions.length > 0 ? (
          <MyTable headers={headers} rows={rows} />
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
