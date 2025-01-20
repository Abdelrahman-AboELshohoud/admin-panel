import { useTranslation } from "react-i18next";
import { MyDialog } from "../../../components/common/dialogs/MyDialog";
import moment from "moment";
import { PayoutSession } from "../../../graphql/requests";
import MyTable from "../../../components/common/table-components/MyTable";
import { ReactNode } from "react";

interface SessionDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  session: PayoutSession | null;
}

export default function SessionDetailsDialog({
  isOpen,
  onOpenChange,
  session,
}: SessionDetailsDialogProps) {
  const { t } = useTranslation();

  if (!session) return null;

  const headers = [
    t("payouts.table.driver"),
    t("payouts.table.amount"),
    t("payouts.table.status"),
    t("payouts.table.date"),
  ];

  const rows = session.driverTransactions.nodes.map((transaction) => ({
    id: transaction.id,
    data: [
      `${transaction.driver?.firstName} ${transaction.driver?.lastName}`,
      `${transaction.amount} ${transaction.currency}`,
      transaction.status,
      moment(transaction.createdAt).format("DD.MM.YYYY HH:mm"),
    ] as ReactNode[],
  }));

  return (
    <MyDialog
      title={t("payouts.sessionDetails.title")}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-400">
              {t("payouts.sessionDetails.created")}
            </h4>
            <p>{moment(session.createdAt).format("DD.MM.YYYY HH:mm")}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-400">
              {t("payouts.sessionDetails.amount")}
            </h4>
            <p>
              {session.totalAmount} {session.currency}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-400">
              {t("payouts.sessionDetails.status")}
            </h4>
            <p>{session.status}</p>
          </div>
          {session.processedAt && (
            <div>
              <h4 className="font-medium text-gray-400">
                {t("payouts.sessionDetails.processed")}
              </h4>
              <p>{moment(session.processedAt).format("DD.MM.YYYY HH:mm")}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-400 mb-4">
            {t("payouts.sessionDetails.transactions")}
          </h4>
          <MyTable headers={headers} rows={rows} />
        </div>
      </div>
    </MyDialog>
  );
}
