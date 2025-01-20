import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DriverFinancialsGQL,
  CreateDriverTransactionGQL,
} from "../../graphql/requests";
import { Driver as DriverType } from "../../graphql/requests";
import { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  DriverRechargeTransactionType,
  DriverDeductTransactionType,
  TransactionAction,
} from "../../graphql/requests";
import MyTable from "../../components/common/table-components/MyTable";
import { MyDialog } from "../../components/common/dialogs/MyDialog";

interface TransactionFormData {
  amount: string;
  currency: string;
  action: TransactionAction;
  rechargeType?: DriverRechargeTransactionType;
  deductType?: DriverDeductTransactionType;
  description?: string;
}

const Balance = ({ profile }: { profile: DriverType }) => {
  const { t } = useTranslation();
  const [financialData, setFinancialData] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: "",
    currency: "USD",
    action: TransactionAction.Recharge,
  });

  const getUserFinancialData = async () => {
    const res = await DriverFinancialsGQL({
      id: profile.id,
      paging: {
        offset: 0,
        limit: 10,
      },
    });
    setFinancialData(res.data);
  };

  useEffect(() => {
    getUserFinancialData();
  }, []);

  const handleCreateTransaction = async () => {
    try {
      setIsSubmitting(true);
      await CreateDriverTransactionGQL({
        input: {
          driverId: profile.id,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          action: formData.action,
          rechargeType:
            formData.action === TransactionAction.Recharge
              ? formData.rechargeType
              : undefined,
          deductType:
            formData.action === TransactionAction.Deduct
              ? formData.deductType
              : undefined,
          description: formData.description,
        },
      });

      setIsDialogOpen(false);
      getUserFinancialData();
      setFormData({
        amount: "",
        currency: "USD",
        action: TransactionAction.Recharge,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTransactionDialog = () => (
    <MyDialog
      isOpen={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      title={t("balance.createTransaction")}
      showCloseButton={false}
      className="bg-gray-800 text-gray-100"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label>{t("balance.action")}</label>
          <Select
            value={formData.action}
            onValueChange={(value: TransactionAction) =>
              setFormData((prev) => ({ ...prev, action: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TransactionAction.Recharge}>
                {t("balance.recharge")}
              </SelectItem>
              <SelectItem value={TransactionAction.Deduct}>
                {t("balance.deduct")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.action === TransactionAction.Recharge && (
          <div className="space-y-2">
            <label>{t("balance.rechargeType")}</label>
            <Select
              value={formData.rechargeType}
              onValueChange={(value: DriverRechargeTransactionType) =>
                setFormData((prev) => ({ ...prev, rechargeType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DriverRechargeTransactionType.Gift}>
                  {t("balance.manual")}
                </SelectItem>
                <SelectItem value={DriverRechargeTransactionType.BankTransfer}>
                  {t("balance.bankTransfer")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.action === TransactionAction.Deduct && (
          <div className="space-y-2">
            <label>{t("balance.deductType")}</label>
            <Select
              value={formData.deductType}
              onValueChange={(value: DriverDeductTransactionType) =>
                setFormData((prev) => ({ ...prev, deductType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DriverDeductTransactionType.Withdraw}>
                  {t("balance.withdraw")}
                </SelectItem>
                <SelectItem value={DriverDeductTransactionType.Correction}>
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
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            className="bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label>{t("balance.currency")}</label>
          <Select
            value={formData.currency}
            onValueChange={(value: string) =>
              setFormData((prev) => ({ ...prev, currency: value }))
            }
          >
            <SelectTrigger>
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
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="bg-gray-700"
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleCreateTransaction}
            disabled={isSubmitting || !formData.amount}
          >
            {isSubmitting ? t("common.processing") : t("common.create")}
          </Button>
        </div>
      </div>
    </MyDialog>
  );

  const headers = ["Date of the event", "Deducted", "Amount", "Currency"];

  const rows =
    financialData?.driver?.transactions?.nodes?.map((transaction: any) => ({
      id: transaction.id,
      data: [
        {
          data: (
            <>
              {moment(transaction.createdAt).format("DD.MM.YYYY")}
              <br />
              {moment(transaction.createdAt).format("HH:mm A")}
            </>
          ),
        },
        {
          data: (
            <span className="block truncate w-2/3">
              {transaction.deductType}
            </span>
          ),
        },
        { data: transaction.amount },
        { data: transaction.currency },
      ],
    })) || [];

  return (
    <div className="space-y-6 p-6 ">
      <Card className="p-6 bg-neutral-800/50 border-none w-1/3 card-shape">
        <h3 className="text-slate-400 mb-4">Current balance</h3>
        <p className="text-4xl font-semibold text-white">
          {financialData?.driver?.wallets?.balance || 0}
        </p>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl text-slate-200">History</h3>

        <div className="flex gap-4 items-center">
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="timeframe"
                value="week"
                className="text-primary accent-primary bg-gray-800 border-neutral-600"
              />
              <span className="text-slate-200">in a week</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="timeframe"
                value="period"
                className="text-primary accent-primary bg-gray-800 border-neutral-600"
              />
              <span className="text-slate-200">period</span>
            </label>
          </div>
          <Input
            type="date"
            className="w-40 bg-neutral-800/50"
            defaultValue="2023-07-05"
          />
          <Input
            type="date"
            className="w-40 bg-neutral-800/50"
            defaultValue="2023-07-07"
          />
          <div className="ml-auto space-x-2">
            <Button>Show</Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Create Transaction
            </Button>
          </div>
        </div>

        <MyTable headers={headers} rows={rows} />
        {renderTransactionDialog()}
      </div>
    </div>
  );
};

export default Balance;
