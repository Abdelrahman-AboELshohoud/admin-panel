import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import {
  PayoutSession,
  PayoutMethod,
  PayoutsGQL,
  PayoutMethodsGQL,
  CreatePayoutSessionFieldsGQL,
} from "../../../graphql/requests";
import { format } from "date-fns";
import MyTableWithHeader from "../../../components/common/table-components/MyTableWithHeader";
import Pagination from "../../../components/common/table-components/Pagination";
import CreateSessionDialog from "./CreateSessionDialog";
import AutoPayoutDialog from "./AutoPayoutDialog";
import PayoutMethodDialog from "./PayoutMethodDialog";
import SessionDetailsDialog from "./SessionDetailsDialog";
import PayoutTransactionsDialog from "./PayoutTransactionsDialog";

const PayoutsHeader = ({ onCreateSession, onExport }: any) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{t("payouts.title")}</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport}>
          {t("payouts.export")}
        </Button>
        <Button onClick={onCreateSession}>
          {t("payouts.createSession.title")}
        </Button>
      </div>
    </div>
  );
};

export default function Payouts() {
  const { t } = useTranslation();
  const [payoutSessions, setPayoutSessions] = useState<PayoutSession[]>([]);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [selectedSession, setSelectedSession] = useState<PayoutSession | null>(
    null
  );
  const [selectedMethod, _setSelectedMethod] = useState<PayoutMethod | null>(
    null
  );
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showMethodDialog, setShowMethodDialog] = useState(false);
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false);
  const [showAutoPayoutDialog, setShowAutoPayoutDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);
  const [showTransactionsDialog, setShowTransactionsDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");

  const fetchPayouts = async () => {
    try {
      const response = await PayoutsGQL({
        sessionsPaging: {
          offset: (currentPage - 1) * 10,
          limit: 10,
        },
      });

      if (response.data) {
        setPayoutSessions(response.data.payoutSessions.nodes);
        setTotalPages(Math.ceil(response.data.payoutSessions.totalCount / 10));
      }
    } catch (error) {
      console.error("Error fetching payouts:", error);
    }
  };

  const fetchPayoutMethods = async () => {
    try {
      const response = await PayoutMethodsGQL();
      if (response.data) {
        setPayoutMethods(response.data.payoutMethods);
      }
    } catch (error) {
      console.error("Error fetching payout methods:", error);
    }
  };

  const fetchCreateSessionFields = async () => {
    try {
      const response = await CreatePayoutSessionFieldsGQL({});
      if (response.data) {
        // setCreateSessionFields(response.data.createPayoutSessionFields);
        setSupportedCurrencies(response.data.supportedCurrencies);
      }
    } catch (error) {
      console.error("Error fetching session fields:", error);
    }
  };

  const handleExport = () => {
    // Implement export functionality here
    console.log("Exporting data...");
  };

  useEffect(() => {
    fetchPayouts();
    fetchPayoutMethods();
    fetchCreateSessionFields();
  }, [currentPage]);

  const headers = [
    t("payouts.table.date"),
    t("payouts.table.amount"),
    t("payouts.table.status"),
    t("payouts.table.actions"),
  ];

  const rows = payoutSessions.map((session) => ({
    id: session.id,
    data: [
      format(new Date(session.createdAt), "PPp"),
      `${session.totalAmount} ${session.currency}`,
      session.status,
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedSession(session);
            setShowSessionDialog(true);
          }}
        >
          {t("common.view")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedSession(session);
            setShowAutoPayoutDialog(true);
          }}
        >
          {t("payouts.autoPayout")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedSessionId(session.id);
            setShowTransactionsDialog(true);
          }}
        >
          {t("payouts.viewTransactions")}
        </Button>
      </div>,
    ],
  }));

  return (
    <div className="space-y-4">
      <MyTableWithHeader
        Header={() => (
          <PayoutsHeader
            onCreateSession={() => setShowCreateSessionDialog(true)}
            onExport={handleExport}
          />
        )}
        headers={headers}
        rows={rows}
        navigate={() => {}}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <CreateSessionDialog
        isOpen={showCreateSessionDialog}
        onOpenChange={setShowCreateSessionDialog}
        currencies={supportedCurrencies}
        payoutMethods={payoutMethods}
        onSuccess={fetchPayouts}
      />

      <AutoPayoutDialog
        isOpen={showAutoPayoutDialog}
        onOpenChange={setShowAutoPayoutDialog}
        payoutMethods={payoutMethods}
        payoutSessions={payoutSessions}
        onSuccess={fetchPayouts}
      />

      <PayoutMethodDialog
        isOpen={showMethodDialog}
        onOpenChange={setShowMethodDialog}
        method={selectedMethod}
        supportedCurrencies={supportedCurrencies}
        onSuccess={fetchPayoutMethods}
      />

      <SessionDetailsDialog
        isOpen={showSessionDialog}
        onOpenChange={setShowSessionDialog}
        session={selectedSession}
      />

      <PayoutTransactionsDialog
        isOpen={showTransactionsDialog}
        onOpenChange={setShowTransactionsDialog}
        payoutSessionId={selectedSessionId}
      />
    </div>
  );
}
