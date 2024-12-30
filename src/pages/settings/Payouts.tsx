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
  // SaveManualPayoutItemGQL,
  UpdatePayoutSessionGQL,
  CreatePayoutSessionGQL,
  CreatePayoutSessionFieldsGQL,
  PayoutMethod,
} from "../../graphql/requests";
import Pagination from "../../components/common/Pagination";

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

interface PayoutFilters {
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  currency?: string;
}

interface CreateSessionFields {
  currencies: string[];
  minimumAmount: number;
  payoutMethods: PayoutMethod[];
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
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false);
  const [showAutoPayoutDialog, setShowAutoPayoutDialog] = useState(false);
  const [filters, setFilters] = useState<PayoutFilters>({});
  const [currentPage, _setCurrentPage] = useState(1);
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);
  const [statistics, setStatistics] = useState<{
    pendingAmount: number;
    lastPayoutAmount: number;
    currency: string;
  } | null>(null);
  const [createSessionFields, setCreateSessionFields] =
    useState<CreateSessionFields | null>(null);
  const [newSession, setNewSession] = useState({
    currency: "",
    minimumAmount: 0,
    description: "",
    payoutMethodIds: [] as string[],
  });
  const [autoPayoutData, setAutoPayoutData] = useState({
    payoutMethodId: "",
    payoutSessionId: "",
  });
  const [showTransactionsDialog, setShowTransactionsDialog] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch payout data
  const fetchPayoutData = async () => {
    try {
      setIsLoading(true);
      const response = await PayoutsGQL({
        sessionsPaging: {
          offset: (currentPage - 1) * 10,
          limit: 10,
        },
      });
      if (response.data?.payoutSessions) {
        setPayoutSessions(response.data.payoutSessions.nodes);
        setTotalCount(response.data.payoutSessions.totalCount);
        setSupportedCurrencies(response.data.supportedCurrencies);
        setStatistics({
          pendingAmount: response.data.statistics.pendingAmount,
          lastPayoutAmount: response.data.statistics.lastPayoutAmount,
          currency: response.data.statistics.currency,
        });
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

  // Fetch create session fields
  const fetchCreateSessionFields = async () => {
    try {
      const response = await CreatePayoutSessionFieldsGQL({});
      if (response.data?.createPayoutSessionFields) {
        setCreateSessionFields(response.data.createPayoutSessionFields);
      }
    } catch (error) {
      console.error("Error fetching create session fields:", error);
      toast.error(t("payouts.errors.sessionFieldsFetchFailed"));
    }
  };

  // Create new payout session
  const handleCreateSession = async () => {
    try {
      if (
        !newSession.currency ||
        !newSession.minimumAmount ||
        newSession.payoutMethodIds.length === 0
      ) {
        toast.error(t("payouts.errors.requiredFields"));
        return;
      }

      const sessionResponse = await CreatePayoutSessionGQL({
        input: {
          currency: newSession.currency,
          minimumAmount: newSession.minimumAmount,
          description: newSession.description,
          payoutMethodIds: newSession.payoutMethodIds,
        },
      });

      if (sessionResponse.data?.createPayoutSession) {
        toast.success(t("payouts.success.sessionCreated"));
        setShowCreateSessionDialog(false);
        setNewSession({
          currency: "",
          minimumAmount: 0,
          description: "",
          payoutMethodIds: [],
        });
        fetchPayoutData();
      }
    } catch (error) {
      console.error("Error creating payout session:", error);
      toast.error(t("payouts.errors.sessionCreateFailed"));
    }
  };

  // Open create session dialog
  const openCreateSessionDialog = async () => {
    await fetchCreateSessionFields();
    setShowCreateSessionDialog(true);
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

  const handleAutoPayout = async () => {
    try {
      if (!autoPayoutData.payoutMethodId || !autoPayoutData.payoutSessionId) {
        toast.error(t("payouts.errors.requiredFields"));
        return;
      }

      await RunAutoPayoutGQL({
        input: {
          payoutMethodId: autoPayoutData.payoutMethodId,
          payoutSessionId: autoPayoutData.payoutSessionId,
        },
      });
      toast.success(t("payouts.success.autoPayoutStarted"));
      setShowAutoPayoutDialog(false);
      setAutoPayoutData({
        payoutMethodId: "",
        payoutSessionId: "",
      });
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
  const handleFetchTransactions = async (methodId: string) => {
    try {
      const response = await PayooutSessionTransactionsGQL({
        id: methodId,
        paging: {
          limit: 10,
          offset: 0,
        },
      });
      if (response.data?.transactions) {
        setTransactions(response.data.transactions);
        setShowTransactionsDialog(true);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(t("payouts.errors.transactionsFetchFailed"));
    }
  };

  // Create payout method
  const handleCreatePayoutMethod = async () => {
    try {
      const response = await CreatePayoutMethodGQL({
        input: {
          name: selectedMethod?.name || "",
          type: selectedMethod?.type || PayoutMethodType.BankTransfer,
          currency: selectedMethod?.currency || "",
          description: selectedMethod?.description || "",
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

  const handleUpdatePayoutMethod = async (id: string, updates: any) => {
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
      <div className="flex gap-4 mb-2 justify-start">
        <Button onClick={openCreateSessionDialog} className="custom-input">
          {t("payouts.actions.createSession")}
        </Button>
        <Button
          onClick={() => setShowAutoPayoutDialog(true)}
          className="custom-input"
        >
          {t("payouts.actions.runAutoPayout")}
        </Button>

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
              {supportedCurrencies &&
                supportedCurrencies.length > 0 &&
                supportedCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add Payout Methods Section */}
      <div className="card-shape mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {t("payouts.methods.title")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedMethod(null);
              setShowMethodDialog(true);
            }}
          >
            {t("payouts.methods.create")}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-transparent">
              <TableHead>{t("payouts.methods.name")}</TableHead>
              <TableHead>{t("payouts.methods.type")}</TableHead>
              <TableHead>{t("payouts.methods.currency")}</TableHead>
              <TableHead>{t("payouts.methods.balance")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payoutMethods && payoutMethods.length > 0 ? (
              payoutMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.type}</TableCell>
                  <TableCell>{method.currency}</TableCell>
                  <TableCell>{method.balance}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPayoutMethod(method.id)}
                      >
                        {t("common.view")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMethod(method);
                          setShowMethodDialog(true);
                        }}
                      >
                        {t("common.edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFetchTransactions(method.id)}
                      >
                        {t("payouts.methods.transactions")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-14">
                  {t("payouts.methods.noMethods")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Payout Sessions Table with Pagination */}
      <div className="card-shape">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-transparent">
              <TableHead>{t("payouts.table.date")}</TableHead>
              <TableHead>{t("payouts.table.amount")}</TableHead>
              <TableHead>{t("payouts.table.status")}</TableHead>
              <TableHead>{t("payouts.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent border-transparent">
                <TableCell colSpan={4} className="text-center">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : payoutSessions && payoutSessions.length > 0 ? (
              payoutSessions.map((session) => (
                <TableRow
                  key={session.id}
                  className="hover:bg-[#262626] border-transparent text-gray-200"
                >
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
                      {/* Add Update Status Button */}
                      {session.status === PayoutSessionStatus.Pending && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateSession(
                              session.id,
                              PayoutSessionStatus.Paid
                            )
                          }
                        >
                          {t("payouts.complete")}
                        </Button>
                      )}
                      {session.status === PayoutSessionStatus.Paid && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateSession(
                              session.id,
                              PayoutSessionStatus.Pending
                            )
                          }
                        >
                          {t("payouts.reopen")}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-14">
                  {t("payouts.noSessions")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Add Pagination Component */}
        {payoutSessions.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Pagination
              totalCount={totalCount}
              filters={filters}
              setFilters={setFilters}
              t={t}
              loading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Session Details Dialog */}
      <MyDialog
        title={t("payouts.sessionDetails.title")}
        isOpen={showSessionDialog}
        onOpenChange={setShowSessionDialog}
        showCloseButton={false}
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

      {/* Create Session Dialog */}
      <MyDialog
        title={t("payouts.createSession.title")}
        isOpen={showCreateSessionDialog}
        onOpenChange={setShowCreateSessionDialog}
        showCloseButton={false}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("payouts.createSession.currency")}
            </label>
            <Select
              value={newSession.currency}
              onValueChange={(value) =>
                setNewSession((prev) => ({ ...prev, currency: value }))
              }
            >
              <SelectTrigger className="w-full custom-input">
                <SelectValue
                  placeholder={t("payouts.createSession.selectCurrency")}
                />
              </SelectTrigger>
              <SelectContent>
                {createSessionFields?.currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("payouts.createSession.minimumAmount")}
            </label>
            <Input
              type="number"
              value={newSession.minimumAmount}
              onChange={(e) =>
                setNewSession((prev) => ({
                  ...prev,
                  minimumAmount: parseFloat(e.target.value),
                }))
              }
              className="w-full custom-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("payouts.createSession.description")}
            </label>
            <Input
              value={newSession.description}
              onChange={(e) =>
                setNewSession((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full custom-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("payouts.createSession.payoutMethods")}
            </label>
            <Select
              value={newSession.payoutMethodIds.join(",")}
              onValueChange={(value) =>
                setNewSession((prev) => ({
                  ...prev,
                  payoutMethodIds: value.split(",").filter(Boolean),
                }))
              }
            >
              <SelectTrigger className="w-full custom-input">
                <SelectValue
                  placeholder={t("payouts.createSession.selectMethods")}
                />
              </SelectTrigger>
              <SelectContent>
                {createSessionFields?.payoutMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name} ({method.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              className="text-gray-600"
              onClick={() => setShowCreateSessionDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreateSession}>{t("common.create")}</Button>
          </div>
        </div>
      </MyDialog>

      {/* Auto Payout Dialog */}
      <MyDialog
        title={t("payouts.autoPayout.title")}
        isOpen={showAutoPayoutDialog}
        onOpenChange={setShowAutoPayoutDialog}
        showCloseButton={false}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("payouts.autoPayout.session")}
            </label>
            <Select
              value={autoPayoutData.payoutSessionId}
              onValueChange={(value) =>
                setAutoPayoutData((prev) => ({
                  ...prev,
                  payoutSessionId: value,
                }))
              }
            >
              <SelectTrigger className="w-full custom-input">
                <SelectValue
                  placeholder={t("payouts.autoPayout.selectSession")}
                />
              </SelectTrigger>
              <SelectContent>
                {payoutSessions
                  .filter((session) => session.status === "PENDING")
                  .map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.totalAmount} {session.currency} -{" "}
                      {format(new Date(session.createdAt), "PPp")}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("payouts.autoPayout.method")}
            </label>
            <Select
              value={autoPayoutData.payoutMethodId}
              onValueChange={(value) =>
                setAutoPayoutData((prev) => ({
                  ...prev,
                  payoutMethodId: value,
                }))
              }
            >
              <SelectTrigger className="w-full custom-input">
                <SelectValue
                  placeholder={t("payouts.autoPayout.selectMethod")}
                />
              </SelectTrigger>
              <SelectContent>
                {payoutMethods
                  .filter(
                    (method) =>
                      method.currency ===
                      payoutSessions.find(
                        (s) => s.id === autoPayoutData.payoutSessionId
                      )?.currency
                  )
                  .map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} ({method.currency})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              className="text-gray-600"
              onClick={() => setShowAutoPayoutDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleAutoPayout}>{t("common.start")}</Button>
          </div>
        </div>
      </MyDialog>

      {/* Payout Method Dialog */}
      <MyDialog
        title={
          !selectedMethod
            ? t("payouts.methods.create")
            : selectedMethod
            ? t("payouts.methods.edit")
            : t("payouts.methods.view")
        }
        isOpen={showMethodDialog}
        onOpenChange={setShowMethodDialog}
        showCloseButton={false}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {t("payouts.methods.name")}
              </label>
              <Input
                value={selectedMethod?.name || ""}
                onChange={(e) =>
                  setSelectedMethod((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
                className="w-full custom-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {t("payouts.methods.type")}
              </label>
              <Select
                value={selectedMethod?.type || PayoutMethodType.BankTransfer}
                onValueChange={(value: PayoutMethodType) =>
                  setSelectedMethod((prev) => ({
                    ...prev!,
                    type: value,
                  }))
                }
              >
                <SelectTrigger className="w-full custom-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PayoutMethodType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {t("payouts.methods.currency")}
              </label>
              <Select
                value={selectedMethod?.currency || ""}
                onValueChange={(value) =>
                  setSelectedMethod((prev) => ({
                    ...prev!,
                    currency: value,
                  }))
                }
              >
                <SelectTrigger className="w-full custom-input">
                  <SelectValue />
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {t("payouts.methods.description")}
              </label>
              <Input
                value={selectedMethod?.description || ""}
                onChange={(e) =>
                  setSelectedMethod((prev) => ({
                    ...prev!,
                    description: e.target.value,
                  }))
                }
                className="w-full custom-input"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowMethodDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => {
                if (!selectedMethod) {
                  handleCreatePayoutMethod();
                } else {
                  handleUpdatePayoutMethod(selectedMethod.id, selectedMethod);
                }
                setShowMethodDialog(false);
              }}
            >
              {!selectedMethod ? t("common.create") : t("common.save")}
            </Button>
          </div>
        </div>
      </MyDialog>

      {/* Add Transactions Dialog */}
      <MyDialog
        title={t("payouts.methods.transactions")}
        isOpen={showTransactionsDialog}
        onOpenChange={setShowTransactionsDialog}
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
                {transactions &&
                  transactions.length > 0 &&
                  transactions.map((transaction) => (
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
            <Button onClick={() => setShowTransactionsDialog(false)}>
              {t("common.close")}
            </Button>
          </div>
        </div>
      </MyDialog>
    </div>
  );
}
