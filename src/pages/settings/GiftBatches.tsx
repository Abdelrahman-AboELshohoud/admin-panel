import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  GiftBatchListGQL,
  CreateGiftBachGQL,
  ExportGiftBatchToCsvGQL,
  CreateGiftBachMutationVariables,
} from "../../graphql/requests";
import { MyDialog } from "../../components/common/MyDialog";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface GiftBatch {
  id: string;
  name: string;
  amount: number;
  currency: string;
  totalUsed: {
    count: {
      id: number;
    };
  };
  totalUnused: {
    count: {
      id: number;
    };
  };
}

export default function GiftBatches() {
  const { t } = useTranslation();
  const [giftBatches, setGiftBatches] = useState<GiftBatch[]>([]);
  const [loading, setLoading] = useState(false);

  const [showGiftBatchDialog, setShowGiftBatchDialog] = useState(false);

  const [giftBatchForm, setGiftBatchForm] = useState<
    CreateGiftBachMutationVariables["input"]
  >({
    name: "",
    amount: 0,
    currency: "USD",
    quantity: 1,
    availableFrom: "",
    expireAt: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [giftBatchData] = await Promise.all([GiftBatchListGQL({})]);

      setGiftBatches(giftBatchData.data.giftBatches.nodes);
    } catch (error) {
      toast.error(t("common.error"));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportGiftBatch = async (id: string) => {
    try {
      const response = await ExportGiftBatchToCsvGQL({ giftBatchId: id });
      // Handle CSV download
      if (response.statusCode === 200) {
        const blob = new Blob([response.data.exportGiftBatchToCsv], {
          type: "text/csv",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gift-batch-${id}.csv`;
        a.click();
        return;
      }
      toast.error(t("common.permissionNotGranted"));
    } catch (error) {
      toast.error(t("common.permissionNotGranted"));
    }
  };

  const handleCreateGiftBatch = async () => {
    try {
      await CreateGiftBachGQL({
        input: {
          ...giftBatchForm,
          amount: Number(giftBatchForm.amount),
          quantity: Number(giftBatchForm.quantity),
        },
      });
      await fetchData();
      setShowGiftBatchDialog(false);
      setGiftBatchForm({
        name: "",
        amount: 0,
        currency: "USD",
        quantity: 1,
        availableFrom: "",
        expireAt: "",
      });
      toast.success(t("common.created"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  return (
    <div className="card-shape ">
      <Card className="bg-transparent border-transparent shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-200 text-xl">
            {t("promotions.giftCards")}
          </CardTitle>
          <Button onClick={() => setShowGiftBatchDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t("common.create")}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-transparent">
                <TableHead>{t("promotions.name")}</TableHead>
                <TableHead>{t("promotions.amount")}</TableHead>
                <TableHead>{t("promotions.used")}</TableHead>
                <TableHead>{t("promotions.unused")}</TableHead>
                <TableHead>{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-200 py-14 hover:bg-transparent border-transparent"
                  >
                    {t("common.loading")}
                  </TableCell>
                </TableRow>
              ) : giftBatches.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-200 py-14 hover:bg-transparent border-transparent"
                  >
                    {t("common.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                giftBatches.map((batch) => (
                  <TableRow
                    key={batch.id}
                    className="hover:bg-[#262626] border-transparent text-gray-200"
                  >
                    <TableCell>{batch.name}</TableCell>
                    <TableCell>{`${batch.amount} ${batch.currency}`}</TableCell>
                    <TableCell>{batch.totalUsed.count.id}</TableCell>
                    <TableCell>{batch.totalUnused.count.id}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700"
                        onClick={() => handleExportGiftBatch(batch.id)}
                      >
                        {t("common.export")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MyDialog
        isOpen={showGiftBatchDialog}
        onOpenChange={setShowGiftBatchDialog}
        title={t("promotions.createGiftBatch")}
        showCloseButton={false}
      >
        <div className="space-y-4">
          <div>
            <label className="text-gray-400">{t("promotions.name")}</label>
            <Input
              placeholder={t("promotions.name")}
              value={giftBatchForm.name}
              onChange={(e) =>
                setGiftBatchForm({ ...giftBatchForm, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-gray-400">{t("promotions.amount")}</label>
            <Input
              type="number"
              placeholder={t("promotions.amount")}
              value={giftBatchForm.amount}
              onChange={(e) =>
                setGiftBatchForm({
                  ...giftBatchForm,
                  amount: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="text-gray-400">{t("promotions.currency")}</label>
            <Select
              value={giftBatchForm.currency}
              onValueChange={(value) =>
                setGiftBatchForm({ ...giftBatchForm, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("promotions.currency")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="RUB">RUB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-gray-400">{t("promotions.quantity")}</label>
            <Input
              type="number"
              placeholder={t("promotions.quantity")}
              value={giftBatchForm.quantity}
              onChange={(e) =>
                setGiftBatchForm({
                  ...giftBatchForm,
                  quantity: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="text-gray-400">
              {t("promotions.availableFrom")}
            </label>
            <Input
              type="date"
              placeholder={t("promotions.availableFrom")}
              value={giftBatchForm.availableFrom}
              onChange={(e) =>
                setGiftBatchForm({
                  ...giftBatchForm,
                  availableFrom: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="text-gray-400">{t("promotions.expireAt")}</label>
            <Input
              type="date"
              placeholder={t("promotions.expireAt")}
              value={giftBatchForm.expireAt}
              onChange={(e) =>
                setGiftBatchForm({ ...giftBatchForm, expireAt: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowGiftBatchDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreateGiftBatch}>
              {t("common.create")}
            </Button>
          </div>
        </div>
      </MyDialog>
    </div>
  );
}
