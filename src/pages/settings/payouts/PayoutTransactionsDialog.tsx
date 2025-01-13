import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { PayooutSessionTransactionsGQL } from "../../../graphql/requests";
import { format } from "date-fns";
import { MyDialog } from "../../../components/common/MyDialog";
import MyTableWithHeader from "../../../components/common/MyTableWithHeader";
import Pagination from "../../../components/common/Pagination";

interface PayoutTransactionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payoutSessionId: string;
}

const TransactionsHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{t("payouts.transactions.title")}</h2>
      <Button variant="outline">{t("payouts.export")}</Button>
    </div>
  );
};

export default function PayoutTransactionsDialog({
  isOpen,
  onOpenChange,
  payoutSessionId,
}: PayoutTransactionsDialogProps) {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    if (!payoutSessionId) return;

    try {
      const response = await PayooutSessionTransactionsGQL({
        id: payoutSessionId,
        paging: {
          offset: (currentPage - 1) * 10,
          limit: 10,
        },
      });

      if (response.data) {
        setTransactions(response.data.payoutSessionTransactions.nodes);
        setTotalPages(
          Math.ceil(response.data.payoutSessionTransactions.totalCount / 10)
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, currentPage, payoutSessionId]);

  const headers = [
    t("payouts.transactions.date"),
    t("payouts.transactions.driver"),
    t("payouts.transactions.amount"),
    t("payouts.transactions.status"),
  ];

  const rows = transactions.map((transaction) => [
    format(new Date(transaction.createdAt), "PPp"),
    `${transaction.driver.firstName} ${transaction.driver.lastName}`,
    `${transaction.amount} ${transaction.currency}`,
    transaction.status,
  ]);

  return (
    <MyDialog
      title={t("payouts.transactions.dialogTitle")}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="max-w-4xl"
    >
      <div className="space-y-4">
        <MyTableWithHeader
          Header={TransactionsHeader}
          headers={headers}
          rows={rows}
          navigate={() => {}}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </MyDialog>
  );
}
