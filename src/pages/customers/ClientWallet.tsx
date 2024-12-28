import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  RiderWalletGQL,
  RiderWalletQuery,
  TransactionAction,
  CreateRiderTransactionGQL,
  RiderRechargeTransactionType,
  RiderDeductTransactionType,
} from "../../graphql/requests";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface ClientWalletProps {
  riderId: string;
}

export const ClientWallet = ({ riderId }: ClientWalletProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [rechargeType, setRechargeType] =
    useState<RiderRechargeTransactionType>();
  const [deductType, setDeductType] = useState<RiderDeductTransactionType>();
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState<"recharge" | "deduct">(
    "recharge"
  );

  const [wallets, setWallets] = useState<
    RiderWalletQuery["rider"]["wallets"]["nodes"]
  >([]);
  const [transactions, setTransactions] = useState<
    RiderWalletQuery["rider"]["transactions"]["nodes"]
  >([]);

  const fetchWallet = async () => {
    const response = await RiderWalletGQL({
      riderId,
      paging: { limit: 10 },
    });
    if (response.status) {
      setWallets(response.data.rider.wallets.nodes);
      setTransactions(response.data.rider.transactions.nodes);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [riderId]);

  const handleSubmit = async () => {
    const response = await CreateRiderTransactionGQL({
      input: {
        riderId,
        amount: parseFloat(amount),
        currency,
        action:
          transactionType === "recharge"
            ? TransactionAction.Recharge
            : TransactionAction.Deduct,
        rechargeType: transactionType === "recharge" ? rechargeType : undefined,
        deductType: transactionType === "deduct" ? deductType : undefined,
        description,
      },
    });

    if (response) {
      fetchWallet();
      setAmount("");
      setCurrency("USD");
      setRechargeType(undefined);
      setDeductType(undefined);
      setDescription("");
    }
  };

  if (!wallets) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-semibold text-gray-400">
            {t("clients.noWallets")}
          </h3>
          <p className="text-gray-500 max-w-md">
            {t("clients.noWalletsDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="card-shape text-gray-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-gray-100 text-3xl font-semibold">
            {t("clients.wallet")}
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="hover:bg-gray-700 hover:text-gray-300 bg-gray-700 border-transparent"
              >
                {t("clients.addTransaction")}
              </Button>
            </DialogTrigger>
            <DialogContent className="card-shape text-gray-100">
              <DialogHeader>
                <DialogTitle>{t("clients.addTransaction")}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label>{t("balance.action")}</label>
                  <Select
                    value={transactionType}
                    onValueChange={(value: "recharge" | "deduct") =>
                      setTransactionType(value)
                    }
                  >
                    <SelectTrigger className="custom-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recharge">
                        {t("balance.recharge")}
                      </SelectItem>
                      <SelectItem value="deduct">
                        {t("balance.deduct")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {transactionType === "recharge" && (
                  <div className="space-y-2">
                    <label>{t("balance.rechargeType")}</label>
                    <Select
                      value={rechargeType}
                      onValueChange={(value: RiderRechargeTransactionType) =>
                        setRechargeType(value)
                      }
                    >
                      <SelectTrigger className="custom-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={RiderRechargeTransactionType.Gift}>
                          {t("balance.manual")}
                        </SelectItem>
                        <SelectItem
                          value={RiderRechargeTransactionType.BankTransfer}
                        >
                          {t("balance.bankTransfer")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {transactionType === "deduct" && (
                  <div className="space-y-2">
                    <label>{t("balance.deductType")}</label>
                    <Select
                      value={deductType}
                      onValueChange={(value: RiderDeductTransactionType) =>
                        setDeductType(value)
                      }
                    >
                      <SelectTrigger className="custom-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={RiderDeductTransactionType.Withdraw}>
                          {t("balance.withdraw")}
                        </SelectItem>
                        <SelectItem
                          value={RiderDeductTransactionType.Correction}
                        >
                          {t("balance.correction")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <label>{t("balance.amount")}</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label>{t("balance.currency")}</label>
                  <Select
                    value={currency}
                    onValueChange={(value: string) => setCurrency(value)}
                  >
                    <SelectTrigger className="custom-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="RUB">RUB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label>{t("balance.description")}</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-700"
                  />
                </div>

                <Button className="ml-auto" onClick={handleSubmit}>
                  {t("submit")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {wallets.map((wallet, index) => (
          <div key={index} className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium">{t("balance")}</span>
            <span className="text-lg">
              {wallet.balance.toFixed(2)} {wallet.currency}
            </span>
          </div>
        ))}

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">{t("transactions")}</h3>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-gray-500 py-10 text-center">
                {t("clients.noTransactions")}
              </p>
            ) : (
              transactions.map((transaction, index) => (
                <div key={index} className="border-b pb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{transaction.action}</span>
                    <span
                      className={
                        transaction.action === TransactionAction.Deduct
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {transaction.action === TransactionAction.Deduct
                        ? "-"
                        : "+"}
                      {transaction.amount} {transaction.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                    <span>{transaction.status}</span>
                  </div>
                  {transaction.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {transaction.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {transaction.refrenceNumber && (
                      <span>Ref: {transaction.refrenceNumber}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientWallet;
