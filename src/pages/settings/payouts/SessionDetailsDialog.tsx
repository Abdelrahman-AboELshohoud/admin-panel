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
import moment from "moment";
import { PayoutSession } from "../../../graphql/requests";

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("payouts.table.driver")}</TableHead>
                <TableHead>{t("payouts.table.amount")}</TableHead>
                <TableHead>{t("payouts.table.status")}</TableHead>
                <TableHead>{t("payouts.table.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.driverTransactions.nodes.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {transaction.driver?.firstName}{" "}
                    {transaction.driver?.lastName}
                  </TableCell>
                  <TableCell>
                    {transaction.amount} {transaction.currency}
                  </TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>
                    {moment(transaction.createdAt).format("DD.MM.YYYY HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MyDialog>
  );
}
