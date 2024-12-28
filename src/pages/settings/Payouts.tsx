import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { MyDialog } from "../../components/common/MyDialog";
import {
  PayoutMethodType,
  PayoutSessionStatus,
  PayoutsGQL,
  PayoutMethodsGQL,
  ViewPayoutMethodGQL,
  CreatePayoutMethodGQL,
  UpdatePayoutMethodGQL,
  ViewPayoutSessionGQL,
  PayooutSessionTransactionsGQL,
  ExportToCsvGQL,
  RunAutoPayoutGQL,
  SaveManualPayoutItemGQL,
  UpdatePayoutSessionGQL,
  CreatePayoutSessionGQL,
  CreatePayoutSessionFieldsGQL,
} from "../../graphql/requests";

interface PayoutSession {
  id: string;
  currency: string;
  createdAt: string;
  processedAt?: string;
  totalAmount: number;
  status: string;
  payoutMethods: Array<{
    id: string;
    type: PayoutMethodType;
    name: string;
    description?: string;
    currency: string;
    balance: number;
    media?: {
      address: string;
    };
  }>;
  driverTransactions: {
    nodes: Array<{
      amount: number;
      currency: string;
      status: string;
      createdAt: string;
      driver: {
        firstName?: string;
        lastName?: string;
        media?: {
          address: string;
        };
      };
    }>;
  };
}

interface PayoutMethod {
  id: string;
  name: string;
  description?: string;
  type: PayoutMethodType;
  currency: string;
  privateKey?: string;
  publicKey?: string;
  saltKey?: string;
  merchantId?: string;
  media?: {
    address: string;
  };
}

interface PayoutFilters {
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  currency?: string;
}

export default function Payouts() {
  const { t } = useTranslation();
  const [payoutSessions, setPayoutSessions] = useState<PayoutSession[]>([]);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [selectedSession, setSelectedSession] = useState<PayoutSession | null>(
    null
  );
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showMethodDialog, setShowMethodDialog] = useState(false);
  const [filters, setFilters] = useState<PayoutFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);
  const [statistics, setStatistics] = useState<{
    pendingAmount: number;
    lastPayoutAmount: number;
    currency: string;
  } | null>(null);

  // Fetch payout data
  const fetchPayoutData = async () => {
    try {
      setIsLoading(true);
      const response = await PayoutsGQL({
        sessionsPaging: {
          offset: (currentPage - 1) * 10,
          limit: 10,
        },
        currency: filters.currency,
      });

      if (response.data) {
        setSupportedCurrencies(response.data.supportedCurrencies);
        setStatistics(response.data.payoutStatistics);
        setPayoutSessions(response.data.payoutSessions.nodes);
      }
    } catch (error) {
      console.error("Error fetching payout data:", error);
      toast.error(t("payouts.errors.fetchFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch payout methods
  const fetchPayoutMethods = async () => {
    try {
      const response = await PayoutMethodsGQL();
      if (response.data?.payoutMethods) {
        setPayoutMethods(response.data.payoutMethods);
      }
    } catch (error) {
      console.error("Error fetching payout methods:", error);
      toast.error(t("payouts.errors.methodsFetchFailed"));
    }
  };

  useEffect(() => {
    fetchPayoutData();
    fetchPayoutMethods();
  }, [currentPage, filters]);

  // Create new payout session
  const handleCreateSession = async () => {
    try {
      const fieldsResponse = await CreatePayoutSessionFieldsGQL({});
      const sessionResponse = await CreatePayoutSessionGQL({
        input: {
          currency: "USD",
          minimumAmount: 100,
          description: "",
          payoutMethodIds: payoutMethods.map((method) => method.id),
        },
      });

      if (sessionResponse.data?.createPayoutSession) {
        toast.success(t("payouts.success.sessionCreated"));
        fetchPayoutData();
      }
    } catch (error) {
      console.error("Error creating payout session:", error);
      toast.error(t("payouts.errors.sessionCreateFailed"));
    }
  };

  // Update payout session
  const handleUpdateSession = async (
    sessionId: string,
    status: PayoutSessionStatus
  ) => {
    try {
      await UpdatePayoutSessionGQL({
        id: sessionId,
        update: {
          status,
        },
      });
      toast.success(t("payouts.success.sessionUpdated"));
      fetchPayoutData();
    } catch (error) {
      console.error("Error updating payout session:", error);
      toast.error(t("payouts.errors.sessionUpdateFailed"));
    }
  };

  // Handle manual payout
  const handleManualPayout = async (
    driverId: string,
    amount: number,
    currency: string
  ) => {
    try {
      await SaveManualPayoutItemGQL({
        driverIds: [driverId],
        payoutAmount: amount,
        currency,
      });
      toast.success(t("payouts.success.manualPayoutCreated"));
      fetchPayoutData();
    } catch (error) {
      console.error("Error creating manual payout:", error);
      toast.error(t("payouts.errors.manualPayoutFailed"));
    }
  };

  // Run auto payout
  const handleAutoPayout = async () => {
    try {
      await RunAutoPayoutGQL({
        input: {
          payoutMethodId: payoutMethods[0]?.id,
          payoutSessionId: payoutSessions[0]?.id,
        },
      });
      toast.success(t("payouts.success.autoPayoutStarted"));
      fetchPayoutData();
    } catch (error) {
      console.error("Error running auto payout:", error);
      toast.error(t("payouts.errors.autoPayoutFailed"));
    }
  };

  // Export to CSV
  const handleExport = async (sessionId: string) => {
    try {
      const response = await ExportToCsvGQL({
        input: {
          payoutSessionId: sessionId,
        },
      });

      if (response.data?.exportSessionToCsv) {
        window.open(response.data.exportSessionToCsv, "_blank");
      }
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error(t("payouts.errors.exportFailed"));
    }
  };

  // View session details
  const handleViewSession = async (sessionId: string) => {
    try {
      const response = await ViewPayoutSessionGQL({ id: sessionId });
      if (response.data?.payoutSession) {
        setSelectedSession(response.data.payoutSession);
        setShowSessionDialog(true);
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
      toast.error(t("payouts.errors.sessionDetailsFailed"));
    }
  };

  // Fetch session transactions
  const handleFetchTransactions = async (sessionId: string) => {
    try {
      const response = await PayooutSessionTransactionsGQL({
        id: sessionId,
        paging: {
          limit: 10,
          offset: 0,
        },
      });
      // Handle transactions data
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(t("payouts.errors.transactionsFetchFailed"));
    }
  };

  // Create payout method
  const handleCreatePayoutMethod = async (method: Partial<PayoutMethod>) => {
    try {
      if (!method.name || !method.type || !method.currency) {
        throw new Error("Required fields missing");
      }

      const response = await CreatePayoutMethodGQL({
        input: {
          name: method.name,
          type: method.type,
          currency: method.currency,
          description: method.description || "",
          merchantId: method.merchantId || "",
          privateKey: method.privateKey || "",
          publicKey: method.publicKey || "",
          saltKey: method.saltKey || "",
        },
      });

      if (response.data?.createPayoutMethod) {
        toast.success(t("payouts.success.methodCreated"));
        fetchPayoutMethods();
      }
    } catch (error) {
      console.error("Error creating payout method:", error);
      toast.error(t("payouts.errors.methodCreateFailed"));
    }
  };

  // Update payout method
  const handleUpdatePayoutMethod = async (
    id: string,
    updates: Partial<PayoutMethod>
  ) => {
    try {
      const response = await UpdatePayoutMethodGQL({
        id,
        update: {
          ...updates,
        },
      });

      if (response.data?.updatePayoutMethod) {
        toast.success(t("payouts.success.methodUpdated"));
        fetchPayoutMethods();
      }
    } catch (error) {
      console.error("Error updating payout method:", error);
      toast.error(t("payouts.errors.methodUpdateFailed"));
    }
  };

  // View payout method details
  const handleViewPayoutMethod = async (methodId: string) => {
    try {
      const response = await ViewPayoutMethodGQL({ id: methodId });
      if (response.data?.payoutMethod) {
        setSelectedMethod(response.data.payoutMethod);
        setShowMethodDialog(true);
      }
    } catch (error) {
      console.error("Error fetching method details:", error);
      toast.error(t("payouts.errors.methodDetailsFailed"));
    }
  };

  return (
    <div className="p-6">
      {/* Statistics Section */}
      {statistics && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-shape">
            <h3 className="text-lg font-medium mb-2">
              {t("payouts.stats.pending")}
            </h3>
            <p className="text-2xl">
              {statistics.pendingAmount} {statistics.currency}
            </p>
          </div>
          <div className="card-shape">
            <h3 className="text-lg font-medium mb-2">
              {t("payouts.stats.lastPayout")}
            </h3>
            <p className="text-2xl">
              {statistics.lastPayoutAmount} {statistics.currency}
            </p>
          </div>
        </div>
      )}

      {/* Actions Section */}
      <div className="flex gap-4 mb-6">
        <Button onClick={handleCreateSession} className="custom-input">
          {t("payouts.actions.createSession")}
        </Button>
        <Button onClick={handleAutoPayout} className="custom-input">
          {t("payouts.actions.runAutoPayout")}
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 mb-6">
        <Select
          value={filters.currency}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, currency: value }))
          }
        >
          <SelectTrigger className="custom-input w-[200px]">
            <SelectValue placeholder={t("payouts.filters.currency")} />
          </SelectTrigger>
          <SelectContent>
            {supportedCurrencies.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payout Sessions Table */}
      <div className="card-shape">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("payouts.table.date")}</TableHead>
              <TableHead>{t("payouts.table.amount")}</TableHead>
              <TableHead>{t("payouts.table.status")}</TableHead>
              <TableHead>{t("payouts.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : payoutSessions.length > 0 ? (
              payoutSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    {format(new Date(session.createdAt), "PPp")}
                  </TableCell>
                  <TableCell>
                    {session.totalAmount} {session.currency}
                  </TableCell>
                  <TableCell>{session.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSession(session.id)}
                      >
                        {t("common.view")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(session.id)}
                      >
                        {t("common.export")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  {t("payouts.noSessions")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Session Details Dialog */}
      <MyDialog
        title={t("payouts.sessionDetails.title")}
        isOpen={showSessionDialog}
        onOpenChange={setShowSessionDialog}
      >
        {selectedSession && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-400">
                  {t("payouts.sessionDetails.created")}
                </h4>
                <p>{format(new Date(selectedSession.createdAt), "PPp")}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-400">
                  {t("payouts.sessionDetails.amount")}
                </h4>
                <p>
                  {selectedSession.totalAmount} {selectedSession.currency}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-400">
                  {t("payouts.sessionDetails.status")}
                </h4>
                <p>{selectedSession.status}</p>
              </div>
              {selectedSession.processedAt && (
                <div>
                  <h4 className="font-medium text-gray-400">
                    {t("payouts.sessionDetails.processed")}
                  </h4>
                  <p>{format(new Date(selectedSession.processedAt), "PPp")}</p>
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
                  {selectedSession.driverTransactions.nodes.map(
                    (transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {transaction.driver.firstName}{" "}
                          {transaction.driver.lastName}
                        </TableCell>
                        <TableCell>
                          {transaction.amount} {transaction.currency}
                        </TableCell>
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell>
                          {format(new Date(transaction.createdAt), "PPp")}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </MyDialog>

      {/* Payout Method Dialog */}
      <MyDialog
        title={t("payouts.methodDialog.title")}
        isOpen={showMethodDialog}
        onOpenChange={setShowMethodDialog}
      >
        {selectedMethod && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-400">
                  {t("payouts.methodDialog.name")}
                </h4>
                <p>{selectedMethod.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-400">
                  {t("payouts.methodDialog.type")}
                </h4>
                <p>{selectedMethod.type}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-400">
                  {t("payouts.methodDialog.currency")}
                </h4>
                <p>{selectedMethod.currency}</p>
              </div>
              {selectedMethod.description && (
                <div>
                  <h4 className="font-medium text-gray-400">
                    {t("payouts.methodDialog.description")}
                  </h4>
                  <p>{selectedMethod.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </MyDialog>
    </div>
  );
}
